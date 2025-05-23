import { Database } from '@neo4j-cypher/query-tools';
import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as connectionService from '../../../src/connectionService';
import { Connection } from '../../../src/connectionService';
import { connectionTreeDataProvider } from '../../../src/treeviews/connectionTreeDataProvider';

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
    const children = connectionTreeDataProvider.getChildren();

    const actual = children.find((child) => child.key === 'test-connection');

    assert.equal(actual.description, 'connected');
    assert.equal(actual.contextValue, 'activeConnection');
  });

  test('An active Connection should have a list of child databases', () => {
    const children = connectionTreeDataProvider.getChildren();
    const connection = children.find(
      (child) => child.key === 'test-connection',
    );

    const databases = connectionTreeDataProvider.getChildren({ ...connection });

    assert.equal(databases.length, 2);
  });

  test('An active Connection should show the default database as active if no database is specified', () => {
    const children = connectionTreeDataProvider.getChildren();
    const connection = children.find(
      (child) => child.key === 'test-connection',
    );
    const databases = connectionTreeDataProvider.getChildren({ ...connection });

    const database = { ...databases.find((child) => child.key === 'neo4j') };
    const actual = {
      ...database,
      resourceUri: { ...database.resourceUri },
    };

    assert.equal(actual.description, 'active');
    assert.equal(actual.contextValue, 'activeDatabase');
  });

  test('An active Connection should show the specified database as active', () => {
    const children = connectionTreeDataProvider.getChildren();
    const connection = children.find(
      (child) => child.key === 'test-connection-2',
    );
    const databases = connectionTreeDataProvider.getChildren({ ...connection });

    const database = { ...databases.find((child) => child.key === 'schemas') };
    const actual = {
      ...database,
      resourceUri: { ...database.resourceUri },
    };

    assert.equal(actual.description, 'active');
    assert.equal(actual.contextValue, 'activeDatabase');
  });

  test('An activating Connection should show as connecting', () => {
    const children = connectionTreeDataProvider.getChildren();

    const actual = {
      ...children.find((child) => child.key === 'test-connection-4'),
    };

    assert.equal(actual.description, 'connecting...');
  });

  test('An errored Connection should show as connecting', () => {
    const children = connectionTreeDataProvider.getChildren();

    const actual = {
      ...children.find((child) => child.key === 'test-connection-5'),
    };

    assert.equal(actual.description, 'connecting...');
  });

  test('An inactive Connection should not show as connected or connecting', () => {
    const children = connectionTreeDataProvider.getChildren();

    const actual = {
      ...children.find((child) => child.key === 'test-connection-3'),
    };

    assert.equal(actual.description, '');
  });
});
