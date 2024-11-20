import {
  CompletionItem as VSCodeCompletionItem,
  Diagnostic,
  SemanticTokenTypes,
} from 'vscode-languageserver-types';

export type CypherVersion = 'cypher 5' | 'cypher 25';

export interface DbInfo {
  name: string;
  defaultLanguage?: CypherVersion;
}

export enum CypherTokenType {
  comment = 'comment',
  keyword = 'keyword',
  label = 'label',
  predicateFunction = 'predicateFunction',
  function = 'function',
  procedure = 'procedure',
  variable = 'variable',
  paramDollar = 'paramDollar',
  paramValue = 'paramValue',
  symbolicName = 'symbolicName',
  operator = 'operator',
  stringLiteral = 'stringLiteral',
  numberLiteral = 'numberLiteral',
  booleanLiteral = 'booleanLiteral',
  keywordLiteral = 'keywordLiteral',
  property = 'property',
  namespace = 'namespace',
  bracket = 'bracket',
  separator = 'separator',
  punctuation = 'punctuation',
  none = 'none',
  consoleCommand = 'consoleCommand',
}

export type SyntaxDiagnostic = Diagnostic & {
  offsets: { start: number; end: number };
};

export interface TokenPosition {
  line: number;
  startCharacter: number;
  startOffset: number;
}

export interface ParsedCypherToken {
  position: TokenPosition;
  length: number;
  tokenType: CypherTokenType;
  token: string;
  bracketInfo?: BracketInfo;
}

export interface BracketInfo {
  bracketType: BracketType;
  bracketLevel: number;
}

export enum BracketType {
  bracket = 'bracket',
  parenthesis = 'parenthesis',
  curly = 'curly',
}

export interface ColouredToken {
  position: TokenPosition;
  length: number;
  tokenColour: SemanticTokenTypes;
  token: string;
}

export type ReturnDescription = {
  name: string;
  description: string;
  type: Neo4jStringType;
  isDeprecated: boolean;
};

// we could parse this string for better types in the future
export type Neo4jStringType = string;
export type ArgumentDescription = ReturnDescription & { default?: string };

type ProcedureMode = 'READ' | 'DBMS' | 'SCHEMA' | 'WRITE' | 'DEFAULT';

export type Neo4jProcedure = {
  name: string;
  description: string;
  mode: ProcedureMode;
  // If it can run on the system database
  worksOnSystem: boolean;
  argumentDescription: ArgumentDescription[];
  returnDescription: ReturnDescription[];
  signature: string;
  admin: boolean;
  // Flexbible field, most hold if procedure is deprecated or not
  option: { deprecated: boolean } & Record<string, unknown>;
};

export type Neo4jFunction = {
  name: string;
  category: string;
  description: string;
  isBuiltIn: boolean;
  argumentDescription: ArgumentDescription[];
  returnDescription: string;
  signature: string;
  aggregating: boolean;
  isDeprecated: boolean;
};

export type CompletionItem = VSCodeCompletionItem & {
  signature?: string;
};
