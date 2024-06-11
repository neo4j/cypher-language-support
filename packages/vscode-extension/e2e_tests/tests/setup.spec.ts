import { before } from 'mocha';
import { activateExtension, createConnection } from '../suiteSetup';

before(async () => {
  await activateExtension();
  await createConnection();
});
