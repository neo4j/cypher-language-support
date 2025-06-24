import { CompletionItem as VSCodeCompletionItem } from 'vscode-languageserver-types';

export type ReturnDescription = {
  name: string;
  description: string;
  type: Neo4jStringType;
  isDeprecated: boolean;
};

export const allCypherVersions = ['CYPHER 5', 'CYPHER 25'];
export const cypherVersionNumbers: string[] = ['5', '25'];
export type CypherVersion = (typeof allCypherVersions)[number];

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
  deprecatedBy?: string;
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
  deprecatedBy?: string;
};

export type CompletionItem = VSCodeCompletionItem & {
  signature?: string;
};

export type Reference = {
  startOffset: number;
  endOffset: number;
};

export type SymbolTable = {
  key: string;
  startOffset: number;
  endOffset: number;
  types: string[];
  references: Reference[];
}[];
