import { SignatureInformation } from 'vscode-languageserver/node';
import { DbInfo } from '../dbInfo';

export class MockDbInfo implements DbInfo {
  procedureSignatures: Map<string, SignatureInformation>;
  functionSignatures: Map<string, SignatureInformation>;
  labels: string[];
  relationshipTypes: string[];

  constructor(
    labels: string[] = [],
    relationshipTypes: string[] = [],
    procedureSignatures: Map<string, SignatureInformation> = new Map(),
    functionSignatures: Map<string, SignatureInformation> = new Map(),
  ) {
    this.labels = labels;
    this.relationshipTypes = relationshipTypes;
    this.procedureSignatures = procedureSignatures;
    this.functionSignatures = functionSignatures;
  }
}
