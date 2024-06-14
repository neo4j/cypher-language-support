export const constants = {
  COMMANDS: {
    SAVE_CONNECTION_COMMAND: 'neo4j.saveConnection',
    TEST_CONNECTION_COMMAND: 'neo4j.testConnection',
    MANAGE_CONNECTION_COMMAND: 'neo4j.manageConnection',
    DELETE_CONNECTION_COMMAND: 'neo4j.deleteConnection',
    REFRESH_CONNECTIONS_COMMAND: 'neo4j.refreshConnections',
    CONNECT_COMMAND: 'neo4j.connect',
    DISCONNECT_COMMAND: 'neo4j.disconnect',
  },
  MESSAGES: {
    TEST_CONNECTION_SUCCESFUL_MESSAGE: 'Connection successful',
    CONNECTED_MESSAGE: 'Connected to Neo4j',
    DISCONNECTED_MESSAGE: 'Disconnected from Neo4j',
    CONNECTION_SAVED_SUCCESSFULLY_MESSAGE: 'Connection saved successfully',
    CONNECTION_DELETED_SUCCESSFULLY_MESSAGE: 'Connection deleted successfully',
    CONNECTION_VALIDATION_MESSAGE: 'Please fill in all required fields',
  },
};
