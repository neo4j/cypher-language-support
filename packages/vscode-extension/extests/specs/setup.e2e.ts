import { before } from 'mocha';
import { createAndStartTestContainer } from '../../e2e_tests/setupTestContainer';
import { saveDefaultConnection } from '../suiteSetup';

before(async function () {
  this.timeout(120000);
  const container = await createAndStartTestContainer('../../extests');
  const port = container.getMappedPort(7687);
  await saveDefaultConnection(port);
});
