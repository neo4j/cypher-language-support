import { before } from 'mocha';
import { createTestDatabase, saveDefaultConnection } from '../../suiteSetup';

before(async () => {
  await saveDefaultConnection();
  await createTestDatabase();
});
