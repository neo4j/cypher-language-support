import { auth, Driver, driver, Session } from 'neo4j-driver';
import { createAndStartTestContainer } from './setupTestContainer';
import { StartedNeo4jContainer } from '@testcontainers/neo4j';
import {
  extractRelationshipsWithNamedNodes,
  GraphSchema,
  validateGraphSchema,
} from '../queries/graphSchema';

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
    expect(validateGraphSchema(result.records[0].toObject()));
  });

  test('Polled graph schema is correctly retrieved from polling query result', async () => {
    const query = 'CALL db.schema.visualization() YIELD *';
    const result = await session.run(query);
    const actualResult = [result.records[0].toObject()] as GraphSchema[];
    validateGraphSchema(actualResult[0]);
    const graphSchema = extractRelationshipsWithNamedNodes(actualResult);
    expect(JSON.stringify(graphSchema[0])).toBe(
      JSON.stringify({ from: 'Teacher', to: 'Nurse', relType: 'LIVES_WITH' }),
    );
  });
});
