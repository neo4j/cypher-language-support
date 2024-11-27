import { CompletionItem as VSCodeCompletionItem } from 'vscode-languageserver-types';

export interface DbInfo {
  name: string;
  defaultLanguage?: CypherVersion;
}

export type CypherVersion = 'cypher 25' | 'cypher 5';

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
