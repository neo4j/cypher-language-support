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
import { Neo4jFunction, Neo4jProcedure } from './types';

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

export function toSignatureInformation(
  curr: Neo4jFunction | Neo4jProcedure,
): SignatureInformation {
  const { signature, argumentDescription, description } = curr;

  return SignatureInformation.create(
    signature,
    description,
    ...argumentDescription.map((arg) => ({
      label: `${arg.name} :: ${arg.type}`,
      documentation: arg.description,
    })),
  );
}

function toSignatureHelp(
  methodSignatures: Record<string, Neo4jFunction | Neo4jProcedure> = {},
  parsedMethod: ParsedMethod,
): SignatureHelp {
  const methodName = parsedMethod.methodName;
  const method = methodSignatures[methodName];
  const signatures = method ? [toSignatureInformation(method)] : [];

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

  enterExpression = (ctx: ExpressionContext) => {
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

  enterFunctionInvocation = (ctx: FunctionInvocationContext) => {
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

  enterCallClause = (ctx: CallClauseContext) => {
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
  query: string,
  dbSchema: DbSchema,
  caretPosition: number = query.length,
): SignatureHelp {
  let result: SignatureHelp = emptyResult;
  /* We need the token immediately before the caret
  
      CALL something(
                     ^
     because in this case what gives us information on where we are 
     in the procedure is not the space at the caret, but the opening (                
  */
  const prevCaretPosition = caretPosition - 1;

  if (prevCaretPosition > 0) {
    const parserResult = parserWrapper.parse(query);
    const caret = findCaret(parserResult, prevCaretPosition);

    if (caret) {
      const statement = caret.statement;

      const signatureHelper = new SignatureHelper(
        statement.tokens,
        caret.token,
      );

      ParseTreeWalker.DEFAULT.walk(signatureHelper, statement.ctx);
      const method = signatureHelper.result;

      if (method !== undefined) {
        if (method.methodType === MethodType.function) {
          result = toSignatureHelp(dbSchema.functions, method);
        } else {
          result = toSignatureHelp(dbSchema.procedures, method);
        }
      }
    }
  }
  return result;
}
