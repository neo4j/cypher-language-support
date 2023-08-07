import { SignatureInformation } from 'vscode-languageserver-types';
import { DbInfo } from '../dbInfo';

export class MockDbInfo implements DbInfo {
  public procedureSignatures: Record<string, SignatureInformation>;
  public functionSignatures: Record<string, SignatureInformation>;
  public labels: string[];
  public relationshipTypes: string[];

  constructor(
    labels: string[] = [],
    relationshipTypes: string[] = [],
    procedureSignatures: Record<string, SignatureInformation> = {},
    functionSignatures: Record<string, SignatureInformation> = {},
  ) {
    this.labels = labels;
    this.relationshipTypes = relationshipTypes;
    this.procedureSignatures = procedureSignatures;
    this.functionSignatures = functionSignatures;
  }
}
