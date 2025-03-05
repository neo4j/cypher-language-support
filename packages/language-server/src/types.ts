// These settings are defined in the package.json
export type Neo4jConnectionSettings = {
  connect?: boolean;
  user?: string;
  password?: string;
  connectURL?: string;
  database?: string;
};

export type Neo4jSettings = {
  trace: {
    server: 'off' | 'messages' | 'verbose';
  };
  features: { linting: boolean };
};
