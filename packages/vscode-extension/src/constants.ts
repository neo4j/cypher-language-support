export const CONSTANTS = {
  COMMANDS: {
    SWITCH_LINTWORKER_COMMAND: 'neo4j.switchLinter',
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
    ADD_PARAMETER: 'neo4j.addParameter',
    DELETE_PARAMETER: 'neo4j.deleteParameter',
    EDIT_PARAMETER: 'neo4j.editParameter',
    CLEAR_PARAMETERS: 'neo4j.clearParameters',
    INTERNAL: {
      EVAL_PARAMETER: 'neo4j.internal.evalParam',
      FORCE_DELETE_PARAMETER: 'neo4j.internal.forceDeleteParam',
      FORCE_DISCONNECT: 'neo4j.internal.forceDisconnect',
      FORCE_CONNECT: 'neo4j.internal.forceConnect',
      SWITCH_DATABASE: 'neo4j.internal.forceSwitchDatabase',
    },
  },
  MESSAGES: {
    GLOBALSTORAGE_READ_FAILED: 'Failed to read neo4j globalStorage directory.',
    LINTER_DOWNLOAD_FAILED:
      'Linter download failed, reverting to best match from currently downloaded linter versions.',
    LINTER_SERVER_NOT_RESOLVED:
      'Neo4j version could not be resolved, using default linting experience.',
    LINTER_SERVER_NOT_SUPPORTED:
      'Neo4j version is lower than 5.23, your will have a degraded linting experience.',
    CONNECTED_MESSAGE: 'Connected to Neo4j.',
    DISCONNECTED_MESSAGE: 'Disconnected from Neo4j.',
    RECONNECTED_MESSAGE: 'Reconnected to Neo4j.',
    CONNECTION_SAVED: 'Neo4j connection saved.',
    CONNECTION_DELETED: 'Neo4j connection deleted.',
    CONNECTION_VALIDATION_MESSAGE: 'Please fill in all required fields.',
    SUCCESSFULLY_SWITCHED_DATABASE_MESSAGE: 'Switched to database',
    ERROR_SWITCHING_DATABASE_MESSAGE: 'Error switching to database',
    ERROR_DISCONNECTED_SET_PARAMS:
      'You need to be connected to neo4j to set parameters.',
    ERROR_DISCONNECTED_EDIT_PARAMS:
      'You need to be connected to neo4j to edit parameters.',
    ERROR_EMPTY_PARAM_NAME: 'Parameter name cannot be empty.',
    ERROR_EMPTY_PARAM_VALUE: 'Parameter value cannot be empty.',
    ERROR_PARAM_EVALUATION: 'Parameter evaluation failed.',
    ERROR_PARAM_EVALUATION_SYSTEM_DB:
      'Parameters cannot be evaluated against a system database. Please connect to a user database.',
    ERROR_DISCONNECTED_EXECUTION:
      'You need to be connected to Neo4j to run queries',
    PARAMETER_SET: (key: string) => `Parameter '${key}' set.`,
    PARAMETER_DELETED: (key: string) => `Parameter \`${key}\` deleted.`,
  },
};
