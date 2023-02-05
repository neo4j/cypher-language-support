import {
  Position,
  Range,
  SignatureHelp,
  SignatureHelpParams,
  SignatureInformation,
  TextDocuments,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CharStreams, CommonTokenStream, ParserRuleContext } from 'antlr4ts';

import { CypherLexer } from './antlr/CypherLexer';

import {
  CypherParser,
  FunctionInvocationContext,
  InQueryCallContext,
  StandaloneCallContext,
} from './antlr/CypherParser';

import { DbInfo } from './dbInfo';
import { findParent, findStopNode } from './helpers';

export const emptyResult: SignatureHelp = {
  signatures: [],
  activeSignature: null,
  activeParameter: null,
};

interface ParsedMethod {
  methodName: string;
  numProcedureArgs: number;
}

function parseStandaloneProcedure(ctx: StandaloneCallContext) {
  const methodName = ctx.procedureName()?.text;
  const numProcedureArgs =
    ctx?.explicitProcedureInvocation()?.procedureNameArg().length ?? 0;

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
  ctx: InQueryCallContext,
): ParsedMethod | undefined {
  const procName = ctx.procedureName().text;
  const numProcedureArgs = ctx
    .explicitProcedureInvocation()
    .procedureNameArg().length;

  return {
    methodName: procName,
    numProcedureArgs: numProcedureArgs,
  };
}

function tryParseProcedure(
  currentNode: ParserRuleContext,
): ParsedMethod | undefined {
  let parsedProc: ParsedMethod | undefined = undefined;

  const standaloneCall = findParent(
    currentNode,
    (node) => node instanceof StandaloneCallContext,
  );
  if (standaloneCall) {
    parsedProc = parseStandaloneProcedure(
      standaloneCall as StandaloneCallContext,
    );
  }

  if (!parsedProc) {
    const inqueryCall = findParent(
      currentNode,
      (node) => node instanceof InQueryCallContext,
    );
    if (inqueryCall) {
      parsedProc = parseInQueryProcedure(inqueryCall as InQueryCallContext);
    }
  }

  return parsedProc;
}

function tryParseFunction(
  currentNode: ParserRuleContext,
): ParsedMethod | undefined {
  const functionInvocation = findParent(
    currentNode,
    (node) => node instanceof FunctionInvocationContext,
  );

  if (functionInvocation) {
    const ctx = functionInvocation as FunctionInvocationContext;
    const methodName = ctx.functionName().text;
    const numMethodArgs = ctx.procedureNameArg().length ?? 0;

    return {
      methodName: methodName,
      numProcedureArgs: numMethodArgs,
    };
  } else {
    return undefined;
  }
}

function toSignatureHelp(
  methodSignatures: Map<string, SignatureInformation>,
  parsedMethod: ParsedMethod,
) {
  const methodName = parsedMethod.methodName;
  const numMethodArgs = parsedMethod.numProcedureArgs;
  const method = methodSignatures.get(methodName);
  const signatures = method ? [method] : [];
  const argPosition =
    numMethodArgs != undefined ? Math.max(numMethodArgs - 1, 0) : null;

  const signatureHelp: SignatureHelp = {
    signatures: signatures,
    activeSignature: method ? 0 : null,
    activeParameter: argPosition,
  };
  return signatureHelp;
}

export function doSignatureHelpForQuery(
  wholeFileText: string,
  dbInfo: DbInfo,
): SignatureHelp {
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  const root = wholeFileParser.cypher();

  const stopNode = findStopNode(root);
  let result: SignatureHelp = emptyResult;

  const parsedProc = tryParseProcedure(stopNode);
  if (parsedProc) {
    result = toSignatureHelp(dbInfo.procedureSignatures, parsedProc);
  } else {
    const parsedFunc = tryParseFunction(stopNode);

    if (parsedFunc) {
      result = toSignatureHelp(dbInfo.functionSignatures, parsedFunc);
    }
  }

  return result;
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
