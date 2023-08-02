import { SignatureInformation } from 'vscode-languageserver-types';
import { DbInfo } from '../dbInfo';

export class MockDbInfo implements DbInfo {
  constructor(
    public labels: string[] = [],
    public relationshipTypes: string[] = [],
    public procedureSignatures: Map<string, SignatureInformation> = new Map(),
    public functionSignatures: Map<string, SignatureInformation> = new Map(),
    public databaseNames: string[] = [],
  ) {}
}
