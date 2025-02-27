export const CONSTANTS = {
  COMMANDS: {
    SAVE_CONNECTION_COMMAND: 'neo4j.saveConnection',
    CREATE_CONNECTION_COMMAND: 'neo4j.createConnection',
    EDIT_CONNECTION_COMMAND: 'neo4j.editConnection',
    DELETE_CONNECTION_COMMAND: 'neo4j.deleteConnection',
    REFRESH_CONNECTIONS_COMMAND: 'neo4j.refreshConnections',
    CONNECT_COMMAND: 'neo4j.connect',
    DISCONNECT_COMMAND: 'neo4j.disconnect',
    SWITCH_DATABASE_COMMAND: 'neo4j.switchDatabase',
    RUN_CYPHER: 'neo4j.runCypher',
    CYPHER_FILE_FROM_SELECTION: 'neo4j.cypherFileFromSelection',
  },
  MESSAGES: {
    CONNECTED_MESSAGE: 'Connected to Neo4j.',
    DISCONNECTED_MESSAGE: 'Disconnected from Neo4j.',
    RECONNECTED_MESSAGE: 'Reconnected to Neo4j.',
    CONNECTION_SAVED: 'Neo4j connection saved.',
    CONNECTION_DELETED: 'Neo4j connection deleted.',
    CONNECTION_VALIDATION_MESSAGE: 'Please fill in all required fields.',
    SUCCESSFULLY_SWITCHED_DATABASE_MESSAGE: 'Switched to database',
    ERROR_SWITCHING_DATABASE_MESSAGE: 'Error switching to database',
  },
};
