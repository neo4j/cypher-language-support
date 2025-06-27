import neo4j from 'neo4j-driver';
import * as vscode from 'vscode';
import { CONSTANTS } from '../src/constants';
import { getNeo4jConfiguration } from './helpers';

export const defaultConnectionKey = 'default-connection-key';

export const defaultConnectionKey_old = 'default-connection-key-old';

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

export async function saveOldConnection(): Promise<void> {
  const { scheme, host, port, user, database, password } =
    getNeo4jConfiguration(true);
  await vscode.commands.executeCommand(
    CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
    {
      key: defaultConnectionKey_old,
      scheme: scheme,
      host: host,
      port: port,
      user: user,
      database: database,
      state: 'active',
    },
    password,
  );
} //TODO: make one unified saveconnection

export async function connectDefault(old: boolean = false): Promise<void> {
  await vscode.commands.executeCommand(CONSTANTS.COMMANDS.CONNECT_COMMAND, {
    key: old ? defaultConnectionKey_old : defaultConnectionKey,
  });
}

export async function disconnectDefault(old: boolean = false): Promise<void> {
  await vscode.commands.executeCommand(CONSTANTS.COMMANDS.DISCONNECT_COMMAND, {
    key: old ? defaultConnectionKey_old : defaultConnectionKey,
  });
}

export async function createTestDatabase(old: boolean = false): Promise<void> {
  const { scheme, host, port, user, password } = getNeo4jConfiguration(old);

  const driver = neo4j.driver(
    `${scheme}://${host}:${port}`,
    neo4j.auth.basic(user, password),
    {
      userAgent: 'vscode-e2e-tests',
    },
  );

  const neo4jSession = driver.session({ database: 'neo4j' });
  await neo4jSession.run('CREATE (n {`foo bar`: "something"})');
  await neo4jSession.close();

  const systemSession = driver.session({ database: 'system' });
  await systemSession.run('CREATE DATABASE movies IF NOT EXISTS WAIT;');
  await systemSession.close();

  const moviesSession = driver.session({ database: 'movies' });
  await moviesSession.run(
    'CREATE (p:Person { name: "Keanu Reeves" })-[:ACTED_IN]->(m:Movie { title: "The Matrix" }) RETURN p;',
  );
  await moviesSession.close();

  await driver.close();
}
