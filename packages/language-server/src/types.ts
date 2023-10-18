// These settings are defined in the package.json
export type CypherLSPSettings = {
  trace: {
    server: 'off' | 'messages' | 'verbose';
  };
  neo4j: {
    connect?: boolean;
    password?: string;
    URL?: string;
    user?: string;
  };
};
