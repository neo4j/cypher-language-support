import neo4j from 'neo4j-driver';
import * as vscode from 'vscode';
import { CONSTANTS } from '../src/constants';
import { getNeo4jConfiguration } from './helpers';

export const testDatabaseKey = 'default-test-connection';

export const defaultConnectionKey = 'default-connection-key';

export async function saveDefaultConnection(): Promise<void> {
  const { scheme, host, port, user, database, password } =
    getNeo4jConfiguration();
  await vscode.commands.executeCommand(
    CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
    {
      key: defaultConnectionKey,
      scheme: scheme,
      host: host,
      port: port,
      user: user,
      database: database,
      state: 'active',
    },
    password,
  );
}

export async function createTestDatabase(): Promise<void> {
  const { scheme, host, port, user, password } = getNeo4jConfiguration();

  const driver = neo4j.driver(
    `${scheme}://${host}:${port}`,
    neo4j.auth.basic(user, password),
    {
      userAgent: 'vscode-e2e-tests',
    },
  );

  const systemSession = driver.session({ database: 'system' });
  await systemSession.run('CREATE DATABASE movies IF NOT EXISTS WAIT;');
  await systemSession.close();

  const session = driver.session({ database: 'movies' });
  await session.run(
    'CREATE (p:Person { name: "Keanu Reeves" })-[:ACTED_IN]->(m:Movie { title: "The Matrix" }) RETURN p;',
  );
  await session.close();

  await driver.close();
}
