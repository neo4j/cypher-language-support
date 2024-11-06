import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { Position, Selection, window } from 'vscode';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { runCypher } from '../../../src/commandHandlers';
import * as connectionService from '../../../src/connectionService';
import * as contextService from '../../../src/contextService';
import CypherRunner from '../../../src/cypherRunner';
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
