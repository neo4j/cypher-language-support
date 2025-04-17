import { Neo4jError } from 'neo4j-driver';

export const FRIENDLY_ERROR_MESSAGES: { [key: string]: string } = {
  'Neo.ClientError.Security.AuthenticationRateLimit':
    'Double check your username and password',
  'Neo.ClientError.Security.CredentialsExpired':
    'Double check your username and password',
  'Neo.ClientError.Security.Unauthorized':
    'Double check your username and password',
  'Neo.ClientError.Security.TokenExpired':
    'Double check your username and password',
  'Neo.ClientError.Database.DatabaseNotFound':
    'Double check that the database exists',
  ServiceUnavailable:
    'Double check the scheme, host and port are correct, make sure Neo4j is running and that you have a network connection if needed',
  Default: 'An error occurred while connecting to Neo4j',
};

export type ConnectionError = {
  message: string;
  friendlyMessage: string;
  code: string;
};

export function isRetriableNeo4jError(error: unknown): boolean {
  return isNeo4jError(error) ? error.retriable : true;
}

export function isNeo4jError(error: unknown): error is Neo4jError {
  return (
    error instanceof Error &&
    (error as Neo4jError).code !== undefined &&
    (error as Neo4jError).message !== undefined
  );
}

export function getConnectionError(error: unknown): ConnectionError {
  if (isNeo4jError(error)) {
    return {
      message: stripTrailingPeriod(error.message),
      code: error.code,
      friendlyMessage:
        FRIENDLY_ERROR_MESSAGES[error.code] ?? FRIENDLY_ERROR_MESSAGES.Default,
    };
  }

  return {
    message: '',
    code: '',
    friendlyMessage: FRIENDLY_ERROR_MESSAGES.Default,
  };
}

function stripTrailingPeriod(message: string): string {
  return message.endsWith('.') ? message.slice(0, -1) : message;
}
