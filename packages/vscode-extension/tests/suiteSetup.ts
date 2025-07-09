import neo4j from 'neo4j-driver';
import * as vscode from 'vscode';
import { CONSTANTS } from '../src/constants';
import { getNeo4j2025Configuration, getNeo4j5Configuration } from './helpers';

export const testDatabaseKey = 'default-test-connection';

export const neo4j2025ConnectionKey = 'neo4j-2025-connection-key';
export const neo4j5ConnectionKey = 'neo4j-5-connection-key';

type Neo4jVersion = 'neo4j 5' | 'neo4j 2025';

export async function saveDefaultConnection(
  opts: { version: Neo4jVersion } = { version: 'neo4j 2025' },
): Promise<void> {
  const { scheme, host, port, user, database, password } =
    opts.version === 'neo4j 2025'
      ? getNeo4j2025Configuration()
      : getNeo4j5Configuration();
  const key =
    opts.version === 'neo4j 2025'
      ? neo4j2025ConnectionKey
      : neo4j5ConnectionKey;

  await vscode.commands.executeCommand(
    CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
    {
      key: key,
      name: opts.version,
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

export async function connectDefault(
  opts: { version: Neo4jVersion } = { version: 'neo4j 2025' },
): Promise<void> {
  const key =
    opts.version === 'neo4j 2025'
      ? neo4j2025ConnectionKey
      : neo4j5ConnectionKey;

  await vscode.commands.executeCommand(CONSTANTS.COMMANDS.CONNECT_COMMAND, {
    key: key,
  });
}

export async function disconnectDefault(
  opts: { version: Neo4jVersion } = { version: 'neo4j 2025' },
): Promise<void> {
  const key =
    opts.version === 'neo4j 2025'
      ? neo4j2025ConnectionKey
      : neo4j5ConnectionKey;

  await vscode.commands.executeCommand(CONSTANTS.COMMANDS.DISCONNECT_COMMAND, {
    key: key,
  });
}

export async function createTestDatabase(
  opts: { version: Neo4jVersion } = { version: 'neo4j 2025' },
): Promise<void> {
  const { scheme, host, port, user, password } =
    opts.version === 'neo4j 2025'
      ? getNeo4j2025Configuration()
      : getNeo4j5Configuration();

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
