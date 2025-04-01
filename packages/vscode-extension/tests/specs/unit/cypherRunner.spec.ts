import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { Position, Selection, window } from 'vscode';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { runCypher } from '../../../src/commandHandlers/connection';
import * as connectionService from '../../../src/connectionService';
import * as contextService from '../../../src/contextService';
import CypherRunner, { extractParameters } from '../../../src/cypherRunner';
import { getMockConnection } from '../../helpers';

suite('Cypher runner spec', () => {
  let sandbox: sinon.SinonSandbox;
  let runMethod: sinon.SinonStub;
  const cypherRunner = new CypherRunner();

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    runMethod = sandbox.stub(cypherRunner, 'run').returns(Promise.resolve());
    sandbox.stub(contextService, 'getQueryRunner').returns(cypherRunner);
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('Should reorder and concatenate statements correctly when selecting from different parts of the file', async () => {
    const document = TextDocument.create(
      'multiline.cypher',
      'cypher',
      1,
      `
CREATE (n:Person) RETURN 15;
CREATE (n:Person), (m:Movie);
MATCH (n) RETURN n`,
    );
    const firstLineSelection = new Selection(
      new Position(1, 0),
      new Position(1, 17),
    );
    const thirdLineSelection = new Selection(
      new Position(3, 10),
      new Position(3, 19),
    );
    // We pick the `CREATE (n:Person)` from the first line and the `RETURN n` from the last one
    const selections = [thirdLineSelection, firstLineSelection];

    sandbox.stub(window, 'activeTextEditor').value({
      selections: selections,
      document: document,
    });
    sandbox
      .stub(connectionService, 'getActiveConnection')
      .returns(getMockConnection());
    await runCypher();

    const arg = runMethod.firstCall.args.at(2) as string;

    // We check that the first line and the RETURN n from the last one have been concatenated correctly
    assert.equal(arg, 'CREATE (n:Person) RETURN n');
  });
});

suite('Parameters extraction spec', () => {
  test('extracts unique parameters from strings', () => {
    const input = ['Hello $name, welcome to $place!'];
    const output = extractParameters(input);
    assert.deepEqual(output, ['name', 'place']);
  });

  test('extracts parameters enclosed in backticks', () => {
    const input = ['RETURN $`ja-123`, $notXoxo;'];
    const output = extractParameters(input);
    assert.deepEqual(output, ['ja-123', 'notXoxo']);
  });

  test('ignores duplicate parameters', () => {
    const input = ['$user logged in', '$user logged out'];
    const output = extractParameters(input);
    assert.deepEqual(output, ['user']);
  });

  test('handles empty input', () => {
    const input: string[] = [];
    const output = extractParameters(input);
    assert.deepEqual(output, []);
  });

  test('handles strings without parameters', () => {
    const input = ['Just a normal string', 'Nothing to extract here'];
    const output = extractParameters(input);
    assert.deepEqual(output, []);
  });

  test('extracts parameters from multiple strings', () => {
    const input = ['Welcome $user', '$user is in $location', '$time is now'];
    const output = extractParameters(input);
    assert.deepEqual(output, ['user', 'location', 'time']);
  });

  test('does not include special characters in extracted parameters', () => {
    const input = ['$valid $!invalid $%wrong $correct'];
    const output = extractParameters(input);
    assert.deepEqual(output, ['valid', 'correct']);
  });
});
