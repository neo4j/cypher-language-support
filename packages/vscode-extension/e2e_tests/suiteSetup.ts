import neo4j from 'neo4j-driver';
import * as vscode from 'vscode';
import { SAVE_CONNECTION_COMMAND } from '../src/constants';

export async function createConnection(): Promise<void> {
  await vscode.commands.executeCommand(
    SAVE_CONNECTION_COMMAND,
    {
      name: 'test',
      key: 'test',
      scheme: process.env.NEO4J_SCHEME || 'neo4j',
      host: process.env.NEO4J_HOST || 'localhost',
      port: process.env.NEO4J_PORT || '7687',
      user: process.env.NEO4J_USER || 'neo4j',
      database: process.env.NEO4J_DATABASE || 'neo4j',
      connect: true,
    },
    process.env.NEO4J_PASSWORD || 'password',
  );
}

export async function createTestDatabase(): Promise<void> {
  const url = `${process.env.NEO4J_SCHEME}://${process.env.NEO4J_HOST}:${process.env.NEO4J_PORT}`;

  const driver = neo4j.driver(
    url,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { userAgent: 'vscode-e2e-tests' },
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