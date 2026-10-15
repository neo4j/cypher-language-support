import type { Driver, Session } from 'neo4j-driver';
import { auth, driver } from 'neo4j-driver';
import { createAndStartTestContainer } from './setupTestContainer.js';
import type { StartedNeo4jContainer } from '@testcontainers/neo4j';
import type { GraphSchema } from '../../queries/graphSchema.js';
import {
  extractRelationshipsWithNamedNodes,
  validateGraphSchema,
} from '../../queries/graphSchema.js';
import type { PollingPermissions } from '../../queries/privileges.js';
import {
  getPollingPermissions,
  listCurrentUserPrivileges,
} from '../../queries/privileges.js';

describe('Polling integration', () => {
  let session: Session;
  let neo4jInstance: StartedNeo4jContainer;
  let testDriver: Driver;
  beforeAll(async () => {
    neo4jInstance = await createAndStartTestContainer();
    const containerPort = neo4jInstance.getMappedPort(7687).toString();
    testDriver = driver(
      `neo4j://localhost:${containerPort}`,
      auth.basic('neo4j', 'password'),
    );
    session = testDriver.session();
    const createQuery =
      'CREATE (n:Teacher {Age: 44, Name: "Åke"})-[:LIVES_WITH]->(m:Nurse {Age: 47, Name: "Robin"})';
    await session.run(createQuery);
  });
  afterAll(async () => {
    await session.close();
    await testDriver.close();
    await neo4jInstance.stop();
  });

  test('Polling graph schema query gives results in correct shape', async () => {
    const query = 'CALL db.schema.visualization() YIELD *';
    const result = await session.run(query);
    validateGraphSchema(result.records[0]!.toObject());
    expect(validateGraphSchema.errors).toBe(null);
  });

  test('Polled graph schema is correctly retrieved from polling query result', async () => {
    const query = 'CALL db.schema.visualization() YIELD *';
    const result = await session.run(query);
    const actualResult = [result.records[0]!.toObject()] as GraphSchema[];
    validateGraphSchema(actualResult[0]);
    const graphSchema = extractRelationshipsWithNamedNodes(actualResult);
    expect(graphSchema).toContainEqual({
      from: 'Teacher',
      to: 'Nurse',
      relType: 'LIVES_WITH',
    });
  });

  describe('Polling permissions', () => {
    const containerPort = () => neo4jInstance.getMappedPort(7687).toString();

    async function permissionsFor(
      user: string,
      password: string,
    ): Promise<PollingPermissions> {
      const userDriver = driver(
        `neo4j://localhost:${containerPort()}`,
        auth.basic(user, password),
      );
      try {
        const { query, queryConfig } = listCurrentUserPrivileges();
        const { privileges } = await userDriver.executeQuery(
          query,
          {},
          queryConfig,
        );
        return getPollingPermissions(privileges);
      } finally {
        await userDriver.close();
      }
    }

    async function createUserWithPrivileges(name: string, grants: string[]) {
      const systemSession = testDriver.session({ database: 'system' });
      try {
        await systemSession.run(`CREATE ROLE ${name} IF NOT EXISTS`);
        for (const grant of grants) {
          await systemSession.run(`${grant} TO ${name}`);
        }
        await systemSession.run(
          `CREATE USER ${name} IF NOT EXISTS SET PASSWORD 'password' CHANGE NOT REQUIRED`,
        );
        await systemSession.run(`GRANT ROLE ${name} TO ${name}`);
      } finally {
        await systemSession.close();
      }
    }

    test('admin can poll users and roles', async () => {
      expect(await permissionsFor('neo4j', 'password')).toEqual({
        users: true,
        roles: true,
      });
    });

    test('user without admin privileges polls neither', async () => {
      await createUserWithPrivileges('plainuser', []);
      expect(await permissionsFor('plainuser', 'password')).toEqual({
        users: false,
        roles: false,
      });
    });

    test('individual show privileges', async () => {
      await createUserWithPrivileges('showuser', ['GRANT SHOW USER ON DBMS']);
      expect(await permissionsFor('showuser', 'password')).toEqual({
        users: true,
        roles: false,
      });
    });

    test('management privileges imply show privileges', async () => {
      await createUserWithPrivileges('manager', [
        'GRANT USER MANAGEMENT ON DBMS',
        'GRANT ROLE MANAGEMENT ON DBMS',
      ]);
      expect(await permissionsFor('manager', 'password')).toEqual({
        users: true,
        roles: true,
      });
    });

    test('deny overrides broader grant', async () => {
      await createUserWithPrivileges('denied', [
        'GRANT ALL DBMS PRIVILEGES ON DBMS',
        'DENY SHOW ROLE ON DBMS',
      ]);
      expect(await permissionsFor('denied', 'password')).toEqual({
        users: true,
        roles: false,
      });
    });
  });
});
