// These settings are defined in the package.json
export type Neo4jConnectionSettings = {
  connect?: boolean;
  user?: string;
  password?: string;
  connectURL?: string;
  database?: string;
};

export type LintWorkerSettings = {
  lintWorkerPath: string;
  linterVersion: string;
};

export type Neo4jSettings = {
  trace: {
    server: 'off' | 'messages' | 'verbose';
  };
  features: { linting: boolean };
};

export type Neo4jParameters = Record<string, unknown>;
