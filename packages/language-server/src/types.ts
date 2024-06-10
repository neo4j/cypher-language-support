// These settings are defined in the package.json
export type Neo4jSettings = {
  connectionKey: string;
  trace: {
    server: 'off' | 'messages' | 'verbose';
  };
  connect?: boolean;
  user?: string;
  password?: string;
  connectURL?: string;
  database?: string;
};
