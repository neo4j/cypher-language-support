import { Database } from '@neo4j-cypher/schema-poller/dist/cjs/src/queries/databases';
import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { TreeItemCollapsibleState } from 'vscode';
import * as connectionService from '../../src/connectionService';
import { Connection } from '../../src/connectionService';
import {
  ConnectionItem,
  ConnectionTreeDataProvider,
} from '../../src/connectionTreeDataProvider';

suite('Connection tree data provider spec', () => {
  const mockConnections: Connection[] = [
    {
      key: 'test-connection',
      state: 'active',
      host: 'localhost',
      scheme: 'neo4j',
      user: 'neo4j',
    },
    {
      key: 'test-connection-2',
      state: 'active',
      host: 'localhost',
      scheme: 'neo4j',
      user: 'neo4j',
      database: 'schemas',
    },
    {
      key: 'test-connection-3',
      state: 'inactive',
      host: 'localhost',
      scheme: 'neo4j',
      user: 'neo4j',
      port: '7687',
    },
    {
      key: 'test-connection-4',
      state: 'activating',
      host: 'localhost',
      scheme: 'neo4j',
      user: 'neo4j',
    },
    {
      key: 'test-connection-5',
      state: 'error',
      host: 'localhost',
      scheme: 'neo4j',
      user: 'neo4j',
    },
  ];

  const mockDatabases: Partial<Database>[] = [
    { name: 'neo4j', home: true, default: true },
    { name: 'schemas', home: false },
  ];

  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox
      .stub(connectionService, 'getAllConnections')
      .returns(mockConnections);

    sandbox
      .stub(connectionService, 'getConnectionByKey')
      .callsFake((key: string) => {
        return mockConnections.find((connection) => connection.key === key);
      });

    sandbox
      .stub(connectionService, 'getConnectionDatabases')
      .returns(mockDatabases as Database[]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('An active Connection should show as connected', () => {
    const testConnectionItem = new ConnectionTreeDataProvider();
    const children = testConnectionItem.getChildren();

    const actual = children.find((child) => child.key === 'test-connection');
    const expected: ConnectionItem = {
      collapsibleState: TreeItemCollapsibleState.Collapsed,
      contextValue: 'activeConnection',
      description: 'connected',
      id: 'test-connection',
      key: 'test-connection',
      label: 'neo4j@neo4j://localhost',
      tooltip: 'neo4j@neo4j://localhost',
      type: 'activeConnection',
    };

    assert.deepStrictEqual({ ...actual }, expected);
  });

  test('An active Connection should have a list of child databases', () => {
    const testConnectionItem = new ConnectionTreeDataProvider();
    const children = testConnectionItem.getChildren();
    const connection = children.find(
      (child) => child.key === 'test-connection',
    );

    const databases = testConnectionItem.getChildren({ ...connection });

    assert.equal(databases.length, 2);
  });

  test('An active Connection should show the default database as active if no database is specified', () => {
    const testConnectionItem = new ConnectionTreeDataProvider();
    const children = testConnectionItem.getChildren();
    const connection = children.find(
      (child) => child.key === 'test-connection',
    );
    const databases = testConnectionItem.getChildren({ ...connection });

    const database = { ...databases.find((child) => child.key === 'neo4j') };
    const actual = {
      ...database,
      resourceUri: { ...database.resourceUri },
    };
    const expected = {
      collapsibleState: 0,
      contextValue: 'activeDatabase',
      description: 'active',
      iconPath: '.',
      key: 'neo4j',
      label: 'neo4j 🏠',
      resourceUri: {
        _formatted: null,
        _fsPath: null,
        authority: '',
        fragment: '',
        path: '/',
        query: 'type=activeDatabase',
        scheme: 'file',
      },
      tooltip: 'neo4j 🏠',
      type: 'activeDatabase',
    };

    assert.deepStrictEqual(actual, expected);
  });

  test('An active Connection should show the specified database as active', () => {
    const testConnectionItem = new ConnectionTreeDataProvider();
    const children = testConnectionItem.getChildren();
    const connection = children.find(
      (child) => child.key === 'test-connection-2',
    );
    const databases = testConnectionItem.getChildren({ ...connection });

    const database = { ...databases.find((child) => child.key === 'schemas') };
    const actual = {
      ...database,
      resourceUri: { ...database.resourceUri },
    };
    const expected = {
      collapsibleState: 0,
      contextValue: 'activeDatabase',
      description: 'active',
      iconPath: '.',
      key: 'schemas',
      label: 'schemas',
      resourceUri: {
        _formatted: null,
        _fsPath: null,
        authority: '',
        fragment: '',
        path: '/',
        query: 'type=activeDatabase',
        scheme: 'file',
      },
      tooltip: 'schemas',
      type: 'activeDatabase',
    };

    assert.deepStrictEqual(actual, expected);
  });

  test('An activating Connection should show as connecting', () => {
    const testConnectionItem = new ConnectionTreeDataProvider();
    const children = testConnectionItem.getChildren();

    const actual = {
      ...children.find((child) => child.key === 'test-connection-4'),
    };
    const expected: ConnectionItem = {
      collapsibleState: TreeItemCollapsibleState.None,
      contextValue: 'connection',
      description: 'connecting...',
      id: 'test-connection-4',
      key: 'test-connection-4',
      label: 'neo4j@neo4j://localhost',
      tooltip: 'neo4j@neo4j://localhost',
      type: 'connection',
    };

    assert.deepStrictEqual(actual, expected);
  });

  test('An errored Connection should show as connecting', () => {
    const testConnectionItem = new ConnectionTreeDataProvider();
    const children = testConnectionItem.getChildren();

    const actual = {
      ...children.find((child) => child.key === 'test-connection-5'),
    };
    const expected: ConnectionItem = {
      collapsibleState: TreeItemCollapsibleState.None,
      contextValue: 'connection',
      description: 'connecting...',
      id: 'test-connection-5',
      key: 'test-connection-5',
      label: 'neo4j@neo4j://localhost',
      tooltip: 'neo4j@neo4j://localhost',
      type: 'connection',
    };

    assert.deepStrictEqual(actual, expected);
  });

  test('An inactive Connection should not show as connected or connecting', () => {
    const testConnectionItem = new ConnectionTreeDataProvider();
    const children = testConnectionItem.getChildren();

    const actual = {
      ...children.find((child) => child.key === 'test-connection-3'),
    };
    const expected: ConnectionItem = {
      collapsibleState: TreeItemCollapsibleState.None,
      contextValue: 'connection',
      description: '',
      id: 'test-connection-3',
      key: 'test-connection-3',
      label: 'neo4j@neo4j://localhost:7687',
      tooltip: 'neo4j@neo4j://localhost:7687',
      type: 'connection',
    };

    assert.deepStrictEqual(actual, expected);
  });
});
