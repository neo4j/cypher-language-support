import {
  SignatureHelp,
  SignatureInformation,
} from 'vscode-languageserver-types';

import { ParserRuleContext, ParseTreeWalker, TerminalNode } from 'antlr4ng';
import {
  CypherCmdParser as CypherParser,
  AllReduceExpressionInvalidArgumentsContext,
  AllReduceExpressionValidArgumentsContext,
  CallClauseContext,
  ExistsExpressionContext,
  ExpressionContext,
  FunctionInvocationContext,
  ListItemsPredicateContext,
  NormalizeFunctionContext,
  PropertyExistsPredicateContext,
  ReduceExpressionContext,
  ShortestPathPatternContext,
  TrimFunctionContext,
  VectorDistanceFunctionContext,
  VectorFunctionContext,
  VectorNormFunctionContext,
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
/* The contexts we give signature help for open their argument list with either
   ( or {. antlr4ng only generates an accessor for the tokens the rule actually
   mentions, so both are optional here: any generated context is structurally
   assignable, and the accessors are looked up with ?. at runtime. */
type MethodContext = ParserRuleContext & {
  LPAREN?: () => TerminalNode | null;
  LCURLY?: () => TerminalNode | null;
};

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

  shouldGiveSignatureHelp(ctx: MethodContext): boolean {
    // We need to check we have opened the left parenthesis (or curly brace)
    // and we won't offer the signature help on just the name
    const openingToken = ctx.LPAREN?.() ?? ctx.LCURLY?.();

    return (
      isDefined(ctx.start) &&
      isDefined(ctx.stop) &&
      ctx.start.start <= this.caretToken.start &&
      this.caretToken.stop <= ctx.stop.stop &&
      isDefined(openingToken)
    );
  }

  handleAllReduce = (
    ctx:
      | AllReduceExpressionInvalidArgumentsContext
      | AllReduceExpressionValidArgumentsContext,
  ) => {
    if (this.shouldGiveSignatureHelp(ctx)) {
      const methodName = ctx.ALLREDUCE().getText();
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

  enterShortestPathPattern = (ctx: ShortestPathPatternContext) => {
    if (this.shouldGiveSignatureHelp(ctx)) {
      const methodName = ctx.SHORTEST_PATH()
        ? ctx.SHORTEST_PATH()?.getText()
        : ctx.ALL_SHORTEST_PATHS()?.getText();
      const activeParameter = 0;
      if (!methodName) return;
      this.result = {
        methodName,
        activeParameter,
        methodType: MethodType.function,
      };
    }
  };

  enterVectorNormFunction = (ctx: VectorNormFunctionContext) => {
    if (this.shouldGiveSignatureHelp(ctx)) {
      const methodName = ctx.VECTOR_NORM().getText();
      const activeParameter =
        ctx.COMMA().symbol.stop < this.caretToken.stop ? 1 : 0;
      this.result = {
        methodName,
        activeParameter,
        methodType: MethodType.function,
      };
    }
  };

  enterVectorDistanceFunction = (ctx: VectorDistanceFunctionContext) => {
    if (this.shouldGiveSignatureHelp(ctx)) {
      const methodName = ctx.VECTOR_DISTANCE().getText();
      const previousArguments = ctx.COMMA().filter((arg) => {
        return arg.symbol.stop <= this.caretToken.start;
      });
      this.result = {
        methodName,
        activeParameter: previousArguments.length,
        methodType: MethodType.function,
      };
    }
  };

  enterVectorFunction = (ctx: VectorFunctionContext) => {
    if (this.shouldGiveSignatureHelp(ctx)) {
      const methodName = ctx.VECTOR().getText();
      const previousArguments = ctx.COMMA().filter((arg) => {
        return arg.symbol.stop <= this.caretToken.start;
      });
      this.result = {
        methodName,
        activeParameter: previousArguments.length,
        methodType: MethodType.function,
      };
    }
  };

  enterNormalizeFunction = (ctx: NormalizeFunctionContext) => {
    if (this.shouldGiveSignatureHelp(ctx)) {
      const methodName = ctx.NORMALIZE().getText();
      const commaStop = ctx.COMMA()?.symbol.stop;
      if (!commaStop) return;
      const activeParameter = commaStop < this.caretToken.stop ? 1 : 0;
      this.result = {
        methodName,
        activeParameter,
        methodType: MethodType.function,
      };
    }
  };

  enterTrimFunction = (ctx: TrimFunctionContext) => {
    if (this.shouldGiveSignatureHelp(ctx)) {
      const methodName = ctx.TRIM().getText();
      let activeParameter = 0;
      if (ctx.expression().length === 2) {
        const trimSource = ctx.expression(1);
        const trimCharacterString = ctx.expression(0);
        if (
          trimSource &&
          trimSource.start?.start &&
          trimSource.start?.start <= this.caretToken.stop
        ) {
          activeParameter = 2;
        } else if (
          trimCharacterString &&
          trimCharacterString.start?.stop &&
          trimCharacterString.start?.start <= this.caretToken.stop
        ) {
          activeParameter = 1;
        } else {
          activeParameter = 0;
        }
      } else {
        activeParameter = 2;
      }
      this.result = {
        methodName,
        activeParameter,
        methodType: MethodType.function,
      };
    }
  };

  enterPropertyExistsPredicate = (ctx: PropertyExistsPredicateContext) => {
    if (this.shouldGiveSignatureHelp(ctx)) {
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
    if (this.shouldGiveSignatureHelp(ctx)) {
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
    if (this.shouldGiveSignatureHelp(ctx)) {
      const methodName = ctx.REDUCE().getText();

      const activeParameter =
        ctx.COMMA().symbol.stop <= this.caretToken.start ? 1 : 0;

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
    if (this.shouldGiveSignatureHelp(ctx)) {
      const methodName = ctx?.start?.text;
      if (!methodName) return;

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
      const stopTokenIdx = ctx?.stop?.tokenIndex;
      if (!stopTokenIdx) return;
      let index = stopTokenIdx + 1;
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
    if (this.shouldGiveSignatureHelp(ctx)) {
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
    if (this.shouldGiveSignatureHelp(ctx)) {
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
