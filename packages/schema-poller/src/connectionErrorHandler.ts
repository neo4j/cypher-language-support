import { Neo4jError } from 'neo4j-driver';

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

export function getFriendlyErrorMessage(error: unknown): {
  message: string;
  code: string;
} {
  if (isNeo4jError(error)) {
    switch (error.code) {
      case 'Neo.ClientError.Security.AuthenticationRateLimit':
      case 'Neo.ClientError.Security.CredentialsExpired':
      case 'Neo.ClientError.Security.Unauthorized':
      case 'Neo.ClientError.Security.TokenExpired':
        return {
          message:
            'Unable to connect to Neo4j: Please check that your user and password are correct.',
          code: error.code,
        };
      case 'Neo.ClientError.Database.DatabaseNotFound':
        return {
          message:
            'Unable to connect to Neo4j: Please check that your database is correct.',
          code: error.code,
        };
      case 'ServiceUnavailable':
        return {
          message:
            'Unable to connect to Neo4j: Please check that your scheme, host and port are correct.',
          code: error.code,
        };
    }
  }

  return { message: 'Unable to connect to Neo4j: Please try again.', code: '' };
}
