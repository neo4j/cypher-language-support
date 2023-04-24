import driver from 'neo4j-driver';
import { SignatureInformation } from 'vscode-languageserver-types';

driver;

export interface DbInfo {
  procedureSignatures: Map<string, SignatureInformation>;
  functionSignatures: Map<string, SignatureInformation>;
  labels: string[];
  relationshipTypes: string[];
}
