import { before } from 'mocha';
import { createConnection } from '../suiteSetup';

before(async () => {
  await createConnection();
});
