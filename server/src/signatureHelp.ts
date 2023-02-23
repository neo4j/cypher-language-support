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
  CallClauseContext,
  CypherParser,
  FunctionInvocationContext,
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

function tryParseProcedure(
  currentNode: ParserRuleContext,
): ParsedMethod | undefined {
  const callClause = findParent(
    currentNode,
    (node) => node instanceof CallClauseContext,
  );

  if (callClause) {
    const ctx = callClause as CallClauseContext;

    const methodName = ctx.procedureName().text;
    const numProcedureArgs = ctx.procedureArgument().length;
    return {
      methodName: methodName,
      numProcedureArgs: numProcedureArgs,
    };
  } else {
    return undefined;
  }
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
    const numMethodArgs = ctx.functionArgument().length ?? 0;

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
    numMethodArgs !== undefined ? Math.max(numMethodArgs - 1, 0) : null;

  const signatureHelp: SignatureHelp = {
    signatures: signatures,
    activeSignature: method ? 0 : null,
    activeParameter: argPosition,
  };
  return signatureHelp;
}

export function doSignatureHelpText(
  textUntilPosition: string,
  dbInfo: DbInfo,
): SignatureHelp {
  const inputStream = CharStreams.fromString(textUntilPosition);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  const root = wholeFileParser.statements();

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
    const textDocument = documents.get(params.textDocument.uri);
    const endOfTriggerHelp = params.context?.triggerCharacter === ')';
    if (textDocument === undefined || endOfTriggerHelp) return emptyResult;

    const position = params.position;
    const range: Range = {
      start: Position.create(0, 0),
      end: position,
    };

    return doSignatureHelpText(textDocument.getText(range), dbInfo);
  };
}
