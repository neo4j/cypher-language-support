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

export type SymbolTable = {
  variable: string;
  // Where the variable is initially defined
  definitionPosition: number;
  // A variable could have more than an inferred type (for example union types)
  types: string[];
  // Offsets of each one of the references to that variable
  references: number[];

  labels: LabelOrCondition;
}[];

export type LabelOrCondition = LabelLeaf | ConditionNode;

//We've decided to use the name "Label" for relationship types too, since these are the labels of relationships
//This is how the naming works in GQL as well
export type LabelLeaf = {
  value: string;
  validFrom: number;
};

export type ConditionNode = {
  andOr: string;
  children: LabelOrCondition[];
};

export type SymbolsInfo = {
  query: string;
  symbolTables: SymbolTable[];
};
