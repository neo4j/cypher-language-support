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

export function getFriendlyErrorMessage(error: unknown): string {
  if (isNeo4jError(error)) {
    switch (error.code) {
      case 'Neo.ClientError.Security.AuthenticationRateLimit':
      case 'Neo.ClientError.Security.CredentialsExpired':
      case 'Neo.ClientError.Security.Unauthorized':
      case 'Neo.ClientError.Security.TokenExpired':
        return 'Unable to connect to Neo4j: Please check that your user and password are correct.';
      case 'Neo.ClientError.Database.DatabaseNotFound':
        return 'Unable to connect to Neo4j: Please check that your database is correct.';
      case 'ServiceUnavailable':
        return 'Unable to connect to Neo4j: Please check that your scheme, host and port are correct.';
    }
  }

  return 'Unable to connect to Neo4j: Please try again.';
}
