export const CONSTANTS = {
  COMMANDS: {
    SAVE_CONNECTION_COMMAND: 'neo4j.saveConnection',
    MANAGE_CONNECTION_COMMAND: 'neo4j.manageConnection',
    DELETE_CONNECTION_COMMAND: 'neo4j.deleteConnection',
    REFRESH_CONNECTIONS_COMMAND: 'neo4j.refreshConnections',
    CONNECT_COMMAND: 'neo4j.connect',
    DISCONNECT_COMMAND: 'neo4j.disconnect',
    RUN_CYPHER_FILE: 'neo4j.runCypherFile',
  },
  MESSAGES: {
    CONNECTED_MESSAGE: 'Connected to Neo4j.',
    DISCONNECTED_MESSAGE: 'Disconnected from Neo4j.',
    RECONNECTED_MESSAGE: 'Reconnected to Neo4j.',
    CONNECTION_SAVED: 'Neo4j connection saved.',
    CONNECTION_DELETED: 'Neo4j connection deleted.',
    CONNECTION_VALIDATION_MESSAGE: 'Please fill in all required fields.',
  },
};
