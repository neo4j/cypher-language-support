import {
  SignatureHelp,
  SignatureInformation,
} from 'vscode-languageserver-types';

import { CharStreams, CommonTokenStream, ParserRuleContext } from 'antlr4';
import CypherLexer from './generated-parser/CypherLexer';
import CypherParser, {
  CallClauseContext,
  FunctionInvocationContext,
} from './generated-parser/CypherParser';

import { DbInfo } from './dbInfo';
import { findParent, findStopNode } from './helpers';

export const emptyResult: SignatureHelp = {
  signatures: [],
  activeSignature: undefined,
  activeParameter: undefined,
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

    const methodName = ctx.procedureName().getText();
    const numProcedureArgs = ctx.procedureArgument_list().length;
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
    const methodName = ctx.functionName().getText();
    const numMethodArgs = ctx.functionArgument_list().length;

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
    numMethodArgs !== undefined ? Math.max(numMethodArgs - 1, 0) : undefined;

  const signatureHelp: SignatureHelp = {
    signatures: signatures,
    activeSignature: method ? 0 : undefined,
    activeParameter: argPosition,
  };
  return signatureHelp;
}

export function signatureHelp(
  textUntilPosition: string,
  dbInfo: DbInfo,
): SignatureHelp {
  const inputStream = CharStreams.fromString(textUntilPosition);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  wholeFileParser.removeErrorListeners();
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
