import { SignatureInformation } from 'vscode-languageserver-types';

export enum ParameterType {
  String,
  Map,
  Integer,
}

export const parameterTypeIsStorable = (type: ParameterType): boolean => {
  switch (type) {
    case ParameterType.String | ParameterType.Integer:
      return true;
    default:
      return false;
  }
};

export interface DbInfo {
  procedureSignatures: Record<string, SignatureInformation>;
  functionSignatures: Record<string, SignatureInformation>;
  labels: string[];
  relationshipTypes: string[];
  databaseNames: string[];
  aliasNames: string[];
  parameterTypes: Record<string, ParameterType>;
  propertyKeys: string[];
}
