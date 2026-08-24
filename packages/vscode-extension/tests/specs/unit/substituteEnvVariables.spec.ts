import * as assert from 'assert';
import { afterEach } from 'mocha';
import { substituteEnvVariables } from '../../../src/connectionService';

const TEST_VARIABLES = [
  'NEO4J_TEST_HOST',
  'NEO4J_TEST_USER',
  'NEO4J_TEST_EMPTY',
];

suite('substituteEnvVariables spec', () => {
  afterEach(() => {
    for (const variable of TEST_VARIABLES) {
      delete process.env[variable];
    }
  });

  test('Should replace a reference with the value of the environment variable', () => {
    process.env.NEO4J_TEST_HOST = 'myhost.example.com';

    assert.strictEqual(
      substituteEnvVariables('${env:NEO4J_TEST_HOST}'),
      'myhost.example.com',
    );
  });

  test('Should replace a reference embedded in surrounding text', () => {
    process.env.NEO4J_TEST_HOST = 'myhost.example.com';

    assert.strictEqual(
      substituteEnvVariables('lb-${env:NEO4J_TEST_HOST}-internal'),
      'lb-myhost.example.com-internal',
    );
  });

  test('Should replace multiple references in the same string', () => {
    process.env.NEO4J_TEST_HOST = 'myhost.example.com';
    process.env.NEO4J_TEST_USER = 'neo4j';

    assert.strictEqual(
      substituteEnvVariables('${env:NEO4J_TEST_USER}@${env:NEO4J_TEST_HOST}'),
      'neo4j@myhost.example.com',
    );
  });

  test('Should replace repeated references to the same variable', () => {
    process.env.NEO4J_TEST_USER = 'neo4j';

    assert.strictEqual(
      substituteEnvVariables('${env:NEO4J_TEST_USER}-${env:NEO4J_TEST_USER}'),
      'neo4j-neo4j',
    );
  });

  test('Should leave references to unset variables as-is', () => {
    assert.strictEqual(
      substituteEnvVariables('${env:NEO4J_TEST_HOST}'),
      '${env:NEO4J_TEST_HOST}',
    );
  });

  test('Should replace set variables and keep unset references in the same string', () => {
    process.env.NEO4J_TEST_USER = 'neo4j';

    assert.strictEqual(
      substituteEnvVariables('${env:NEO4J_TEST_USER}@${env:NEO4J_TEST_HOST}'),
      'neo4j@${env:NEO4J_TEST_HOST}',
    );
  });

  test('Should replace a reference to a variable set to the empty string with the empty string', () => {
    process.env.NEO4J_TEST_EMPTY = '';

    assert.strictEqual(
      substituteEnvVariables('a${env:NEO4J_TEST_EMPTY}b'),
      'ab',
    );
  });

  test('Should return strings without references unchanged', () => {
    const noEnvVarString = 'bolt://localhost:7687';
    assert.strictEqual(substituteEnvVariables(noEnvVarString), noEnvVarString);
    assert.strictEqual(substituteEnvVariables(''), '');
  });

  test('Should not treat a reference with an empty variable name as a reference', () => {
    assert.strictEqual(substituteEnvVariables('${env:}'), '${env:}');
  });

  test('Should not replace other variable reference styles', () => {
    process.env.NEO4J_TEST_HOST = 'myhost.example.com';

    assert.strictEqual(
      substituteEnvVariables('$env:NEO4J_TEST_HOST'),
      '$env:NEO4J_TEST_HOST',
    );
    assert.strictEqual(
      substituteEnvVariables('${NEO4J_TEST_HOST}'),
      '${NEO4J_TEST_HOST}',
    );
    assert.strictEqual(
      substituteEnvVariables('${workspaceFolder}'),
      '${workspaceFolder}',
    );
  });
});
