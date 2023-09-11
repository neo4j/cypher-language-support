import { SignatureInformation } from 'vscode-languageserver-types';

export interface DbInfo {
  procedureSignatures: Record<string, SignatureInformation>;
  functionSignatures: Record<string, SignatureInformation>;
  labels: string[];
  relationshipTypes: string[];
  databaseNames: string[];
  aliasNames: string[];
  parameterValues: Record<string, unknown>;
  propertyKeys: string[];
}
