import { SignatureInformation } from 'vscode-languageserver-types';
import { DbInfo } from '../dbInfo';

export class MockDbInfo implements DbInfo {
  constructor(
    public labels: string[] = [],
    public relationshipTypes: string[] = [],
    public procedureSignatures: Record<string, SignatureInformation> = {},
    public functionSignatures: Record<string, SignatureInformation> = {},
    public databaseNames: string[] = [],
    public aliasNames: string[] = [],
    public parameters: Record<string, unknown> = {},
    public propertyKeys: string[] = [],
  ) {}
}
