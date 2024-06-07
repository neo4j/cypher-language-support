export type Connection = {
  key: string;
  name: string;
  scheme: string;
  host: string;
  port: string;
  user: string;
  database: string;
  connect: boolean;
};

export function getConnectionString(connection: Connection): string {
  return `${connection.scheme}${connection.host}:${connection.port}`;
}
