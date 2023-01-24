import {
  Position,
  Range,
  SignatureHelp,
  SignatureHelpParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CharStreams, CommonTokenStream, ParserRuleContext } from 'antlr4ts';

import { CypherLexer } from './antlr/CypherLexer';

import { CypherParser, OC_InQueryCallContext } from './antlr/CypherParser';

import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { DbInfo } from './dbInfo';

export const emptyResult: SignatureHelp = {
  signatures: [],
  activeSignature: null,
  activeParameter: null,
};

interface ParsedProcedure {
  methodName: string;
  numProcedureArgs: number;
}

function findLastStandaloneCall(
  lastStatementStr: string,
): ParsedProcedure | undefined {
  const inputStream = CharStreams.fromString(lastStatementStr);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  const procedureCallTree = wholeFileParser
    .oC_StandaloneCall()
    ?.oC_ExplicitProcedureInvocation();

  const methodName = procedureCallTree?.oC_ProcedureName().text;
  const numProcedureArgs = procedureCallTree?.oc_ProcedureNameArg().length ?? 0;

  if (methodName) {
    return {
      methodName: methodName,
      numProcedureArgs: numProcedureArgs,
    };
  } else {
    return undefined;
  }
}

function findLastInQueryCall(
  lastStatementStr: string,
): ParsedProcedure | undefined {
  // Get last statement
  const inputStream = CharStreams.fromString(lastStatementStr);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  let current: ParserRuleContext | undefined =
    wholeFileParser.oC_Statement() as ParserRuleContext;

  while (current) {
    if (current instanceof OC_InQueryCallContext) {
      const proc = (
        current as OC_InQueryCallContext
      ).oC_ExplicitProcedureInvocation();
      const procName = proc.oC_ProcedureName().text;
      const numProcedureArgs = proc.oc_ProcedureNameArg().length;

      return {
        methodName: procName,
        numProcedureArgs: numProcedureArgs,
      };
    }

    const children = current.children;
    current = undefined;

    if (children && children.length > 0) {
      let index = children.length - 1;
      let child = children[index];

      while (
        index > 0 &&
        (child instanceof TerminalNode || child.text.length == 0)
      ) {
        index--;
        child = children[index];
      }
      current = child as ParserRuleContext;
    }
  }

  return undefined;
}

export function doSignatureHelpForQuery(
  wholeFileText: string,
  dbInfo: DbInfo,
): SignatureHelp {
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  const tree = wholeFileParser.oC_Cypher();
  const statements = tree.children;
  let lastStatementStr = '';
  let parsedProc: ParsedProcedure | undefined = undefined;

  if (statements) {
    const lastStatement = statements[statements.length - 1];
    const index = (lastStatement as ParserRuleContext).start.tokenIndex;
    const tokens = tokenStream.getRange(index, tokenStream.size);
    lastStatementStr = tokens.map((t) => t.text).join('');
  }

  parsedProc = findLastStandaloneCall(lastStatementStr);
  if (!parsedProc) {
    parsedProc = findLastInQueryCall(lastStatementStr);
  }

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
