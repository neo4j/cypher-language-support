import {
  Position,
  Range,
  SignatureHelp,
  SignatureHelpParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { CypherLexer } from './antlr/CypherLexer';

import {
  CypherParser,
  OC_CypherContext,
  OC_InQueryCallContext,
  OC_StandaloneCallContext,
} from './antlr/CypherParser';

import { DbInfo } from './dbInfo';
import { findParent, findStopNode } from './helpers';

export const emptyResult: SignatureHelp = {
  signatures: [],
  activeSignature: null,
  activeParameter: null,
};

interface ParsedProcedure {
  methodName: string;
  numProcedureArgs: number;
}

function parseStandaloneProcedure(ctx: OC_StandaloneCallContext) {
  const methodName = ctx.oC_ProcedureName()?.text;
  const numProcedureArgs =
    ctx?.oC_ExplicitProcedureInvocation()?.oc_ProcedureNameArg().length ?? 0;

  if (methodName) {
    return {
      methodName: methodName,
      numProcedureArgs: numProcedureArgs,
    };
  } else {
    return undefined;
  }
}

function parseInQueryProcedure(
  ctx: OC_InQueryCallContext,
): ParsedProcedure | undefined {
  const procName = ctx.oC_ProcedureName().text;
  const numProcedureArgs = ctx
    .oC_ExplicitProcedureInvocation()
    .oc_ProcedureNameArg().length;

  return {
    methodName: procName,
    numProcedureArgs: numProcedureArgs,
  };
}

function tryParseProcedure(
  root: OC_CypherContext,
): ParsedProcedure | undefined {
  let parsedProc: ParsedProcedure | undefined = undefined;
  const currentNode = findStopNode(root);

  const standaloneCall = findParent(
    currentNode,
    (node) => node instanceof OC_StandaloneCallContext,
  );
  if (standaloneCall) {
    parsedProc = parseStandaloneProcedure(
      standaloneCall as OC_StandaloneCallContext,
    );
  }

  if (!parsedProc) {
    const inqueryCall = findParent(
      currentNode,
      (node) => node instanceof OC_InQueryCallContext,
    );
    if (inqueryCall) {
      parsedProc = parseInQueryProcedure(inqueryCall as OC_InQueryCallContext);
    }
  }

  return parsedProc;
}

function toSignatureHelp(
  dbInfo: DbInfo,
  parsedProc: ParsedProcedure | undefined,
) {
  if (parsedProc) {
    const methodName = parsedProc.methodName;
    const numProcedureArgs = parsedProc.numProcedureArgs;
    const procedure = dbInfo.procedureSignatures.get(methodName);
    const signatures = procedure ? [procedure] : [];
    const argPosition =
      numProcedureArgs != undefined ? Math.max(numProcedureArgs - 1, 0) : null;

    const signatureHelp: SignatureHelp = {
      signatures: signatures,
      activeSignature: procedure ? 0 : null,
      activeParameter: argPosition,
    };
    return signatureHelp;
  } else {
    return emptyResult;
  }
}

export function doSignatureHelpForQuery(
  wholeFileText: string,
  dbInfo: DbInfo,
): SignatureHelp {
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  const root = wholeFileParser.oC_Cypher();
  const parsedProc = tryParseProcedure(root);

  return toSignatureHelp(dbInfo, parsedProc);
}

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doSignatureHelp(
  documents: TextDocuments<TextDocument>,
  dbInfo: DbInfo,
) {
  return (params: SignatureHelpParams) => {
    const endOfTriggerHelp = params.context?.triggerCharacter == ')';

    if (endOfTriggerHelp) {
      return emptyResult;
    } else {
      const d = documents.get(params.textDocument.uri);
      const position = params.position;
      const range: Range = {
        // TODO Nacho: We are parsing from the begining of the file.
        // Do we need to parse from the begining of the current query?
        start: Position.create(0, 0),
        end: position,
      };
      const wholeFileText: string = d?.getText(range).trim() ?? '';

      return doSignatureHelpForQuery(wholeFileText, dbInfo);
    }
  };
}
