export const constants = {
  COMMANDS: {
    SAVE_CONNECTION_COMMAND: 'neo4j.saveConnection',
    MANAGE_CONNECTION_COMMAND: 'neo4j.manageConnection',
    DELETE_CONNECTION_COMMAND: 'neo4j.deleteConnection',
    REFRESH_CONNECTIONS_COMMAND: 'neo4j.refreshConnections',
    CONNECT_COMMAND: 'neo4j.connect',
    DISCONNECT_COMMAND: 'neo4j.disconnect',
  },
  MESSAGES: {
    CONNECTED_MESSAGE: 'Connected to Neo4j.',
    DISCONNECTED_MESSAGE: 'Disconnected from Neo4j.',
    CONNECTION_DELETED_SUCCESSFULLY_MESSAGE: 'Neo4j connection deleted.',
    CONNECTION_VALIDATION_MESSAGE: 'Please fill in all required fields.',
  },
};
