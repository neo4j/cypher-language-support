import {
  SignatureHelp,
  SignatureInformation,
} from 'vscode-languageserver-types';

import { ParserRuleContext, ParseTree } from 'antlr4';
import {
  CallClauseContext,
  ExpressionContext,
  FunctionInvocationContext,
  StatementsContext,
} from './generated-parser/CypherParser';

import { DbSchema } from './dbSchema';
import { findMostSpecificNode, findParent } from './helpers';
import { parserWrapper } from './parserWrapper';

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
  caretPosition: number,
): ParsedMethod | undefined {
  const callClause = findParent(
    currentNode,
    (node) => node instanceof CallClauseContext,
  );

  if (callClause) {
    const ctx = callClause as CallClauseContext;
    const methodName = ctx.procedureName().getText();
    const previousArguments = ctx.COMMA_list().filter((arg) => {
      return arg.symbol.stop < caretPosition;
    });
    const numProcedureArgs = previousArguments.length;
    return {
      methodName: methodName,
      numProcedureArgs: numProcedureArgs + 1,
    };
  } else {
    return undefined;
  }
}

/* 
RETURN apoc.do.when( gets parsed as:

      statements
     /    |    \     
statement (    EOF
    /  \
RETURN  expression



rather than:


        statements
      /            \     
statement          EOF
    /  \ 
RETURN  functionInvocation
             /         \ 
        functionName    (


so we need to treat that case differently because we cannot modify the 
relative priority of functionInvocation vs expression

RETURN apoc.do.when(x gets parsed correctly (when we've started the first argument),
because the parser has enough information to recognize that case

*/
function findRightmostPreviousExpression(
  currentNode: ParserRuleContext,
): ParserRuleContext | undefined {
  const parentChildren = currentNode.parentCtx.children;
  let result: ParserRuleContext | undefined = undefined;

  if (parentChildren && parentChildren.length > 2) {
    let current: ParseTree | undefined =
      parentChildren[parentChildren.length - 3];
    let expressionFound = false;

    while (
      current instanceof ParserRuleContext &&
      current.children &&
      current.children.length > 0 &&
      !expressionFound
    ) {
      const children = current.children;
      current = children[children.length - 1];
      expressionFound = current instanceof ExpressionContext;
    }

    result = expressionFound ? (current as ParserRuleContext) : undefined;
  }

  return result;
}

function tryParseFunction(
  currentNode: ParserRuleContext,
  caretPosition: number,
): ParsedMethod | undefined {
  let result: ParsedMethod | undefined = undefined;
  const functionInvocation = findParent(
    currentNode,
    (node) => node instanceof FunctionInvocationContext,
  );

  if (functionInvocation) {
    const ctx = functionInvocation as FunctionInvocationContext;
    const methodName = ctx.functionName().getText();
    const previousArguments = ctx.COMMA_list().filter((arg) => {
      return arg.symbol.stop < caretPosition;
    });
    const numMethodArgs = previousArguments.length + 1;
    result = {
      methodName: methodName,
      numProcedureArgs: numMethodArgs,
    };
  } else if (
    currentNode.getText() === '(' &&
    currentNode.parentCtx instanceof StatementsContext
  ) {
    // If we finish in an expression followed by (,
    // take the expression text as method name
    const prevExpresion = findRightmostPreviousExpression(currentNode);

    if (prevExpresion) {
      result = {
        methodName: prevExpresion.getText(),
        numProcedureArgs: 0,
      };
    }
  }

  return result;
}

function toSignatureHelp(
  methodSignatures: Record<string, SignatureInformation>,
  parsedMethod: ParsedMethod,
) {
  const methodName = parsedMethod.methodName;
  const numMethodArgs = parsedMethod.numProcedureArgs;
  const method = methodSignatures[methodName];
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
  fullQuery: string,
  dbSchema: DbSchema,
  caretPosition: number,
): SignatureHelp {
  let result: SignatureHelp = emptyResult;

  if (caretPosition > 0) {
    const parserResult = parserWrapper.parse(fullQuery);
    const stopNode = findMostSpecificNode(
      parserResult.result,
      caretPosition - 1,
    );

    if (stopNode) {
      const parsedProc = tryParseProcedure(stopNode, caretPosition);
      if (parsedProc && dbSchema.procedureSignatures) {
        result = toSignatureHelp(dbSchema.procedureSignatures, parsedProc);
      } else {
        const parsedFunc = tryParseFunction(stopNode, caretPosition);

        if (parsedFunc && dbSchema.functionSignatures) {
          result = toSignatureHelp(dbSchema.functionSignatures, parsedFunc);
        }
      }
    }
  }
  return result;
}
