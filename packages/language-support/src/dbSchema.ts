import { SignatureInformation } from 'vscode-languageserver-types';
import { Neo4jFunction, Neo4jProcedure } from './types';

export interface DbSchema {
  rawProcedures?: Neo4jProcedure[];
  rawFunctions?: Neo4jFunction[];
  procedureSignatures?: Record<string, SignatureInformation>;
  functionSignatures?: Record<string, SignatureInformation>;
  labels?: string[];
  relationshipTypes?: string[];
  databaseNames?: string[];
  aliasNames?: string[];
  parameters?: Record<string, unknown>;
  propertyKeys?: string[];
}
