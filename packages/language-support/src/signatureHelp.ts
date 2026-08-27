import {
  SignatureHelp,
  SignatureInformation,
} from 'vscode-languageserver-types';

import { ParseTreeWalker } from 'antlr4ng';
import {
  CypherCmdParser as CypherParser,
  AllReduceExpressionInvalidArgumentsContext,
  AllReduceExpressionValidArgumentsContext,
  CallClauseContext,
  ExistsExpressionContext,
  ExpressionContext,
  FunctionInvocationContext,
  ListItemsPredicateContext,
  PropertyExistsPredicateContext,
  ReduceExpressionContext,
} from './generated-parser/CypherCmdParser.js';

import { Token } from 'antlr4ng';
import { DbSchema } from './dbSchema.js';
import { CypherCmdParserListener } from './generated-parser/CypherCmdParserListener.js';
import { findCaret, isDefined, resolveCypherVersion } from './helpers.js';
import { createParsingResult, ParsingResult } from './cypherLanguageService.js';
import { Neo4jFunction, Neo4jProcedure } from './types.js';

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
  const { name, argumentDescription, description } = curr;
  const argDescriptions = argumentDescription.map((arg) => {
    let label = '';

    // If there's a default value, it has the shape
    // DefaultParameterValue{value=[0.5, 0.75, 0.9, 0.95, 0.99], type=LIST<FLOAT>}
    if (arg.default) {
      const startIndex = arg.default.indexOf('value=') + 'value='.length;
      const endIndex = arg.default.indexOf(', type=', startIndex);
      const defaultArg = arg.default.substring(startIndex, endIndex);

      label = `${arg.name} = ${defaultArg} :: ${arg.type}`;
    } else {
      label = `${arg.name} :: ${arg.type}`;
    }

    return {
      label: label,
      documentation: arg.description,
    };
  });

  const argsString = argDescriptions.map((arg) => arg.label).join(', ');
  const signature = `${name}(${argsString})`;

  return SignatureInformation.create(
    signature,
    description,
    ...argDescriptions,
  );
}

function toSignatureHelp(
  method: Neo4jFunction | Neo4jProcedure | undefined,
  parsedMethod: ParsedMethod,
): SignatureHelp {
  const signatures = method ? [toSignatureInformation(method)] : [];

  const signatureHelp: SignatureHelp = {
    signatures: signatures,
    activeSignature: method ? 0 : undefined,
    activeParameter: parsedMethod.activeParameter,
  };
  return signatureHelp;
}

class SignatureHelper extends CypherCmdParserListener {
  result?: ParsedMethod;
  constructor(
    private tokens: Token[],
    private caretToken: Token,
  ) {
    super();
  }

  handleAllReduce = (
    ctx:
      | AllReduceExpressionInvalidArgumentsContext
      | AllReduceExpressionValidArgumentsContext,
  ) => {
    if (
      ctx.start.start <= this.caretToken.start &&
      this.caretToken.stop <= ctx.stop.stop &&
      // We need to check we have opened the left parenthesis
      // and we won't offer the signature help on just the name
      ctx.LPAREN()
    ) {
      const methodName = ctx.ALLREDUCE().getText();
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

  enterPropertyExistsPredicate = (ctx: PropertyExistsPredicateContext) => {
    if (
      ctx.start.start <= this.caretToken.start &&
      this.caretToken.stop <= ctx.stop.stop &&
      // We need to check we have opened the left parenthesis
      // and we won't offer the signature help on just the name
      ctx.LPAREN()
    ) {
      const methodName = ctx.PROPERTY_EXISTS().getText();
      const activeParameter =
        ctx.COMMA().symbol.stop <= this.caretToken.start ? 1 : 0;
      this.result = {
        methodName,
        activeParameter,
        methodType: MethodType.function,
      };
    }
  };

  enterExistsExpression = (ctx: ExistsExpressionContext) => {
    if (
      ctx.start.start <= this.caretToken.start &&
      this.caretToken.stop <= ctx.stop.stop &&
      // We need to check we have opened the left curly bracer
      // and we won't offer the signature help on just the name
      ctx.LCURLY()
    ) {
      const methodName = ctx.EXISTS().getText();

      const activeParameter = 0;
      this.result = {
        methodName,
        activeParameter,
        methodType: MethodType.function,
      };
    }
  };

  enterReduceExpression = (ctx: ReduceExpressionContext) => {
    if (
      ctx.start.start <= this.caretToken.start &&
      this.caretToken.stop <= ctx.stop.stop &&
      // We need to check we have opened the left parenthesis
      // and we won't offer the signature help on just the name
      ctx.LPAREN()
    ) {
      const methodName = ctx.REDUCE().getText();

      let activeParameter = 0;
      if (ctx.COMMA() && ctx.COMMA().symbol.stop <= this.caretToken.start) {
        activeParameter = 1;
      }

      this.result = {
        methodName,
        activeParameter,
        methodType: MethodType.function,
      };
    }
  };

  enterAllReduceExpressionInvalidArguments = (
    ctx: AllReduceExpressionInvalidArgumentsContext,
  ) => {
    this.handleAllReduce(ctx);
  };

  enterAllReduceExpressionValidArguments = (
    ctx: AllReduceExpressionValidArgumentsContext,
  ) => {
    this.handleAllReduce(ctx);
  };

  enterListItemsPredicate = (ctx: ListItemsPredicateContext) => {
    if (
      ctx.start.start <= this.caretToken.start &&
      this.caretToken.stop <= ctx.stop.stop &&
      // We need to check we have opened the left parenthesis
      // and we won't offer the signature help on just the name
      ctx.LPAREN()
    ) {
      const methodName = ctx.start.text;
      let activeParameter = 0;
      if (ctx.IN() && ctx.IN().symbol.stop <= this.caretToken.start) {
        activeParameter = 1;
      }
      this.result = {
        methodName,
        activeParameter,
        methodType: MethodType.function,
      };
    }
  };

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
      const previousArguments = ctx.COMMA().filter((arg) => {
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
      const previousArguments = ctx.COMMA().filter((arg) => {
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

export function getMethodSignature({
  parsingResult,
  dbSchema,
  caretPosition,
}: {
  parsingResult: ParsingResult;
  dbSchema: DbSchema;
  caretPosition: number;
}):
  | {
      parsedMethod: ParsedMethod;
      schemaMethod: Neo4jFunction | Neo4jProcedure | undefined;
    }
  | undefined {
  /* We need the token immediately before the caret

      CALL something(
                     ^
     because in this case what gives us information on where we are
     in the procedure is not the space at the caret, but the opening (
  */
  const prevCaretPosition = caretPosition - 1;

  if (prevCaretPosition > 0) {
    const caret = findCaret(parsingResult, prevCaretPosition);

    if (caret) {
      const statement = caret.statement;

      const signatureHelper = new SignatureHelper(
        statement.tokens,
        caret.token,
      );

      ParseTreeWalker.DEFAULT.walk(signatureHelper, statement.ctx);
      const parsedMethod = signatureHelper.result;
      if (!parsedMethod) {
        return undefined;
      }
      const cypherVersion = resolveCypherVersion(
        statement.cypherVersion,
        dbSchema,
      );

      let schemaMethods: Record<string, Neo4jFunction | Neo4jProcedure> = {};
      if (parsedMethod.methodType === MethodType.function) {
        schemaMethods = dbSchema.functions?.[cypherVersion] ?? {};
      } else {
        schemaMethods = dbSchema.procedures?.[cypherVersion] ?? {};
      }
      const methodName = parsedMethod.methodName;

      return {
        parsedMethod,
        schemaMethod: schemaMethods[methodName],
      };
    }
  }
}

export function getSignatureInfo(
  query: string,
  dbSchema: DbSchema,
  {
    caretPosition = query.length,
    parsingResult,
    consoleCommandsEnabled = true,
  }: {
    caretPosition?: number;
    parsingResult?: ParsingResult;
    consoleCommandsEnabled?: boolean;
  } = {},
): SignatureHelp {
  const resolvedParsingResult = parsingResult
    ? parsingResult
    : createParsingResult(query, { consoleCommandsEnabled });

  // Always pass parsingResult
  const methodSignatureInfo = getMethodSignature({
    parsingResult: resolvedParsingResult,
    caretPosition,
    dbSchema,
  });

  if (!methodSignatureInfo) {
    return emptyResult;
  }

  return toSignatureHelp(
    methodSignatureInfo.schemaMethod,
    methodSignatureInfo.parsedMethod,
  );
}
