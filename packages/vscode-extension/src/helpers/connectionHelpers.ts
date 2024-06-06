import { Connection } from '../types';

export function getConnectionString(connection: Connection): string {
  return `${connection.scheme}${connection.host}:${connection.port}`;
}

export function getCredentials(connection: Connection): {
  username: string;
  password: string;
} {
  return {
    username: connection.user,
    password: connection.password,
  };
}
