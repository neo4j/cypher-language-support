import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { Position, Selection, window } from 'vscode';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  getCurrentStatement,
  getSelectedText,
  getStatementAtCaret,
  runCypher,
} from '../../../src/commandHandlers/connection';
import * as connectionService from '../../../src/connectionService';
import * as contextService from '../../../src/contextService';
import CypherRunner from '../../../src/cypherRunner';
import { getMockConnection } from '../../helpers';

suite('Cypher runner spec', () => {
  let sandbox: sinon.SinonSandbox;
  let runMethod: sinon.SinonStub;
  const cypherRunner = new CypherRunner();
  const document = TextDocument.create(
    'multiline.cypher',
    'cypher',
    1,
    `
CREATE (n:Person) RETURN 15;
CREATE (n:Person), (m:Movie);
MATCH (n) RETURN n`,
  );

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    runMethod = sandbox.stub(cypherRunner, 'run').returns(Promise.resolve());
    sandbox.stub(contextService, 'getQueryRunner').returns(cypherRunner);
  });

  afterEach(() => {
    sandbox.restore();
  });

  const setupStubs = (
    textEditorArgs:
      | { selection: Selection; document: TextDocument }
      | { selections: Selection[]; document: TextDocument },
  ) => {
    sandbox.stub(window, 'activeTextEditor').value({
      ...textEditorArgs,
    });
    sandbox
      .stub(connectionService, 'getActiveConnection')
      .returns(getMockConnection());
  };

  test('Should reorder and concatenate statements correctly when selecting from different parts of the file', async () => {
    const firstLineSelection = new Selection(
      new Position(1, 0),
      new Position(1, 17),
    );
    const thirdLineSelection = new Selection(
      new Position(3, 10),
      new Position(3, 19),
    );
    // We pick the `CREATE (n:Person)` from the first line of the document and the `RETURN n` from the last one
    const selections = [thirdLineSelection, firstLineSelection];

    setupStubs({
      selections: selections,
      document: document,
    });
    await runCypher(async () => {}, getSelectedText());

    const arg = runMethod.firstCall.args.at(0) as string;

    // We check that the first line and the RETURN n from the last one have been concatenated correctly
    assert.equal(arg, 'CREATE (n:Person) RETURN n');
  });

  test('Running single query should work', async () => {
    const currentSelection = new Selection(
      new Position(3, 10),
      new Position(3, 10),
    );
    setupStubs({
      selection: currentSelection,
      document: document,
    });
    await runCypher(async () => {}, getCurrentStatement());
    const arg = runMethod.firstCall.args.at(0) as string;
    assert.equal(arg, 'MATCH (n) RETURN n');
  });

  test('Should find correct statements for executing single query', () => {
    const cases = [
      {
        name: 'single statement, caret before parsed statement',
        query: '  MATCH (n) RETURN n',
        caret: 0,
        expected: 'MATCH (n) RETURN n',
      },
      {
        name: 'second statement',
        query: ' MATCH (n) RETURN n; \n RETURN 50',
        caret: ' MATCH (n) RETURN n; \nRETURN'.length,
        expected: 'RETURN 50',
      },
      {
        name: 'multi-lined statement',
        query:
          ' MATCH (n) RETURN n; \n RETURN 50;  \n MATCH (x:Person)\n RETURN y  ',
        caret:
          ' MATCH (n) RETURN n; \n RETURN 50;  \n MATCH (x:Person)\n RETURN y  '
            .length,
        expected: 'MATCH (x:Person)\n RETURN y',
      },
      {
        name: 'middle statement of three',
        query:
          ' MATCH (n) RETURN n; \n RETURN 50;  \n MATCH (x:Person)\n RETURN y ',
        caret: ' MATCH (n) RETURN n; \n RETURN '.length,
        expected: 'RETURN 50',
      },
      {
        name: 'After semicolon, but before first token of next statement',
        query: ' MATCH (n) RETURN n; \n RETURN 50; ',
        caret: ' MATCH (n) RETURN n; '.length,
        expected: 'RETURN 50',
      },
      {
        name: 'After semicolon, on newline before first token of next statement',
        query: ' MATCH (n) RETURN n; \n\n\n RETURN 50; ',
        caret: ' MATCH (n) RETURN n; \n\n'.length,
        expected: 'RETURN 50',
      },
      {
        name: 'Empty statement at the end of a query',
        query: ' MATCH (n) RETURN n; \n RETURN 50; ',
        caret: ' MATCH (n) RETURN n; \n RETURN 50; '.length,
        expected: '',
      },
      {
        name: 'Empty statement between 2 queries',
        query: ' MATCH (n) RETURN n; \n ;',
        caret: ' MATCH (n) RETURN n; \n '.length,
        expected: '',
      },
    ];
    cases.forEach((c) => {
      const statement = getStatementAtCaret(c.query, c.caret);
      assert.strictEqual(
        statement,
        c.expected,
        "Failed on case '" + c.name + "'",
      );
    });
  });
});
