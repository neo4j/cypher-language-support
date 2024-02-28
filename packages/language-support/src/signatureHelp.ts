import {
  SignatureHelp,
  SignatureInformation,
} from 'vscode-languageserver-types';

import { ParseTreeWalker } from 'antlr4';
import CypherParser, {
  CallClauseContext,
  ExpressionContext,
  FunctionInvocationContext,
} from './generated-parser/CypherCmdParser';

import { Token } from 'antlr4-c3';
import { DbSchema } from './dbSchema';
import CypherCmdParserListener from './generated-parser/CypherCmdParserListener';
import { findCaret, isDefined } from './helpers';
import { parserWrapper } from './parserWrapper';

export const emptyResult: SignatureHelp = {
  signatures: [],
  activeSignature: undefined,
  activeParameter: undefined,
};

export enum MethodType {
  function = 'function',
  procedure = 'procedure',
}
interface ParsedMethod {
  methodName: string;
  activeParameter: number;
  methodType: MethodType;
}

function toSignatureHelp(
  methodSignatures: Record<string, SignatureInformation>,
  parsedMethod: ParsedMethod,
) {
  const methodName = parsedMethod.methodName;
  const method = methodSignatures[methodName];
  const signatures = method ? [method] : [];

  const signatureHelp: SignatureHelp = {
    signatures: signatures,
    activeSignature: method ? 0 : undefined,
    activeParameter: parsedMethod.activeParameter,
  };
  return signatureHelp;
}

class SignatureHelper extends CypherCmdParserListener {
  result: ParsedMethod;
  constructor(private tokens: Token[], private caretToken: Token) {
    super();
  }

  exitExpression = (ctx: ExpressionContext) => {
    // If the caret is at (
    if (this.caretToken.type === CypherParser.LPAREN) {
      /* We need to compute the next token that is not 
         a space following the expression
      
        Example: in the case 'RETURN apoc.do.when     (' the 
        expression finishes before the ( and we would have a 
        collection of spaces between apoc.do.when and the left parenthesis
      */
      let index = ctx.stop.tokenIndex + 1;
      let nextToken = this.tokens[index];

      while (
        nextToken.type === CypherParser.SPACE &&
        index < this.tokens.length
      ) {
        index++;
        nextToken = this.tokens[index];
      }

      if (
        this.caretToken.start === nextToken?.start &&
        this.caretToken.stop === nextToken?.stop
      ) {
        const methodName = ctx.getText();
        const numMethodArgs = 0;
        this.result = {
          methodName: methodName,
          activeParameter: numMethodArgs,
          methodType: MethodType.function,
        };
      }
    }
  };

  exitFunctionInvocation = (ctx: FunctionInvocationContext) => {
    if (
      ctx.start.start <= this.caretToken.start &&
      this.caretToken.stop <= ctx.stop.stop &&
      // We need to check we have opened the left parenthesis
      // and we won't offer the signature help on just the name
      isDefined(ctx.LPAREN())
    ) {
      const methodName = ctx.functionName().getText();
      const previousArguments = ctx.COMMA_list().filter((arg) => {
        return arg.symbol.stop <= this.caretToken.start;
      });

      this.result = {
        methodName: methodName,
        activeParameter: previousArguments.length,
        methodType: MethodType.function,
      };
    }
  };

  exitCallClause = (ctx: CallClauseContext) => {
    if (
      ctx.start.start <= this.caretToken.start &&
      this.caretToken.stop <= ctx.stop.stop &&
      // We need to check we have opened the left parenthesis
      // and we won't offer the signature help on just the name
      isDefined(ctx.LPAREN())
    ) {
      const methodName = ctx.procedureName().getText();
      const previousArguments = ctx.COMMA_list().filter((arg) => {
        return arg.symbol.stop <= this.caretToken.start;
      });

      this.result = {
        methodName: methodName,
        activeParameter: previousArguments.length,
        methodType: MethodType.procedure,
      };
    }
  };
}

export function signatureHelp(
  fullQuery: string,
  dbSchema: DbSchema,
  caretPosition: number,
): SignatureHelp {
  let result: SignatureHelp = emptyResult;

  const parserResult = parserWrapper.parse(fullQuery);
  const caret = findCaret(parserResult, caretPosition);

  if (caret) {
    const statement = caret.statement;

    const signatureHelper = new SignatureHelper(statement.tokens, caret.token);

    ParseTreeWalker.DEFAULT.walk(signatureHelper, statement.ctx);
    const method = signatureHelper.result;

    if (method !== undefined) {
      if (method.methodType === MethodType.function) {
        result = toSignatureHelp(dbSchema.functionSignatures, method);
      } else {
        result = toSignatureHelp(dbSchema.procedureSignatures, method);
      }
    }
  }

  return result;
}
