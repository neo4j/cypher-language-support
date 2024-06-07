import * as vscode from 'vscode';
import { CREATE_CONNECTION_COMMAND } from '../src/util/constants';

export async function activateExtension(): Promise<void> {
  await vscode.extensions
    .getExtension('neo4j-extensions.neo4j-for-vscode')
    .activate();
}

export async function createConnection(): Promise<void> {
  await vscode.commands.executeCommand(
    CREATE_CONNECTION_COMMAND,
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
