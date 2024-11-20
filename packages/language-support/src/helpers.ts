import antlrDefaultExport, {
  CharStreams,
  CommonTokenStream,
  ParserRuleContext,
  Token,
} from 'antlr4';
import {
  SemanticTokensLegend,
  SemanticTokenTypes,
  SignatureInformation,
} from 'vscode-languageserver-types';
import CypherParser_v25 from './Cypher25/generated-parser/CypherCmdParser';
import CypherParser_v5 from './Cypher5/generated-parser/CypherCmdParser';
import { DbSchema } from './dbSchema';
import PreParserLexer from './PreParser/generated-preparser/PreParserLexer';
import PreParserParser from './PreParser/generated-preparser/PreParserParser';
import {
  CypherTokenType,
  CypherVersion,
  Neo4jFunction,
  Neo4jProcedure,
  TokenPosition,
} from './types';

type AntlrDefaultExport = {
  tree: {
    Trees: {
      getNodeText(
        node: ParserRuleContext,
        s: string[],
        c: typeof CypherParser_v5 | CypherParser_v25,
      ): string;
      getChildren(node: ParserRuleContext): ParserRuleContext[];
    };
  };
};
export const antlrUtils = antlrDefaultExport as unknown as AntlrDefaultExport;

export const syntaxColouringLegend: SemanticTokensLegend = {
  tokenModifiers: [],
  tokenTypes: Object.keys(SemanticTokenTypes),
};

const semanticTokenTypesNumber: Map<string, number> = new Map(
  syntaxColouringLegend.tokenTypes.map((tokenType, i) => [tokenType, i]),
);

export function mapCypherToSemanticTokenIndex(
  cypherTokenType: CypherTokenType,
): number | undefined {
  const tokenMappings: { [key in CypherTokenType]?: SemanticTokenTypes } = {
    [CypherTokenType.comment]: SemanticTokenTypes.comment,
    [CypherTokenType.predicateFunction]: SemanticTokenTypes.function,
    [CypherTokenType.keyword]: SemanticTokenTypes.keyword,
    [CypherTokenType.keywordLiteral]: SemanticTokenTypes.string,
    [CypherTokenType.stringLiteral]: SemanticTokenTypes.string,
    [CypherTokenType.numberLiteral]: SemanticTokenTypes.number,
    [CypherTokenType.booleanLiteral]: SemanticTokenTypes.number,
    [CypherTokenType.operator]: SemanticTokenTypes.operator,
    [CypherTokenType.separator]: SemanticTokenTypes.operator,
    [CypherTokenType.punctuation]: SemanticTokenTypes.operator,
    [CypherTokenType.paramDollar]: SemanticTokenTypes.namespace,
    [CypherTokenType.paramValue]: SemanticTokenTypes.parameter,
    [CypherTokenType.property]: SemanticTokenTypes.property,
    [CypherTokenType.label]: SemanticTokenTypes.type,
    [CypherTokenType.variable]: SemanticTokenTypes.variable,
    [CypherTokenType.symbolicName]: SemanticTokenTypes.variable,
    [CypherTokenType.consoleCommand]: SemanticTokenTypes.macro,
  };

  const semanticTokenType = tokenMappings[cypherTokenType];

  if (semanticTokenType) {
    return semanticTokenTypesNumber.get(semanticTokenType);
  }

  return undefined;
}

export function tokenPositionToString(tokenPosition: TokenPosition): string {
  return `${tokenPosition.line},${tokenPosition.startCharacter}`;
}

export function getTokenPosition(token: Token): TokenPosition {
  return {
    line: token.line - 1,
    startCharacter: token.column,
    startOffset: token.start,
  };
}

export function cypherVersionInQuery(query: string): CypherVersion | undefined {
  const inputStream = CharStreams.fromString(query);
  const lexer = new PreParserLexer(inputStream);
  lexer.removeErrorListeners();
  const tokenStream = new CommonTokenStream(lexer);
  const preparser = new PreParserParser(tokenStream);
  preparser.removeErrorListeners();
  const version = preparser.cypherVersion();
  if (version.cypherFive() != null) {
    return 'cypher 5';
  } else if (version.cypherTwentyFive != null) {
    return 'cypher 25';
  }

  return undefined;
}

export function currentDbCypherVersion(dbSchema: DbSchema) {
  const dbLanguageVersion: CypherVersion =
    dbSchema.dbInfos?.find((db) => db.name === dbSchema.currentDatabase)
      .defaultLanguage ?? 'cypher 25';

  return dbLanguageVersion;
}

export function cypherVersion(
  query: string,
  dbSchema: DbSchema,
): CypherVersion {
  const explicitCypyherVersion = cypherVersionInQuery(query);

  if (explicitCypyherVersion) {
    return explicitCypyherVersion;
  } else {
    return currentDbCypherVersion(dbSchema);
  }
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
