import { before } from 'mocha';
import { createConnection, createTestDatabase } from '../suiteSetup';

before(async () => {
  await createConnection();
  await createTestDatabase();
});
