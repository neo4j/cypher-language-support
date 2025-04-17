import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import { Integer, Record } from 'neo4j-driver';
import * as sinon from 'sinon';
import { window } from 'vscode';
import { evaluateParam } from '../../../src/commandHandlers/params';
import { CONSTANTS } from '../../../src/constants';
import * as parameters from '../../../src/parameterService';
import { MockLanguageClient } from '../../mocks/mockLanguageClient';
import { MockSchemaPoller } from '../../mocks/mockSchemaPoller';
import { setupMockContextStubs } from '../../mocks/setupMockContextStubs';

suite('Parameter service spec', () => {
  let sandbox: sinon.SinonSandbox;
  let mockLanguageClient: MockLanguageClient;
  let mockSchemaPoller: MockSchemaPoller;
  let sendNotificationSpy: sinon.SinonSpy;
  let showInformationMessageStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    const stubs = setupMockContextStubs(sandbox);
    const runCypherQueryStub = sandbox.stub();
    runCypherQueryStub
      .withArgs({ query: 'RETURN "charmander" AS param', parameters: {} })
      .resolves({
        records: [new Record(['param'], ['charmander'])],
        summary: undefined,
        recordLimitHit: false,
      });

    runCypherQueryStub
      .withArgs({ query: 'RETURN "pikachu" AS param', parameters: {} })
      .resolves({
        records: [new Record(['param'], ['pikachu'])],
        summary: undefined,
        recordLimitHit: false,
      });

    runCypherQueryStub
      .withArgs({ query: 'RETURN 1234 AS param', parameters: {} })
      .resolves({
        records: [new Record(['param'], [Integer.fromInt(1234)])],
        summary: undefined,
        recordLimitHit: false,
      });

    mockLanguageClient = stubs.mockLanguageClient;
    mockSchemaPoller = stubs.mockSchemaPoller;
    sandbox.stub(mockSchemaPoller, 'connection').value({
      databases: [{ name: 'neo4j', type: 'standard' }],
      currentDb: 'neo4j',
      runCypherQuery: runCypherQueryStub,
    });

    sendNotificationSpy = sandbox.spy(mockLanguageClient, 'sendNotification');
    showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');
  });

  afterEach(() => {
    sandbox.restore();
  });

  suite('getParameters', () => {
    test('Should return an empty result if there are no parameters', () => {
      const params = Object.keys(parameters.getParameters());

      assert.deepStrictEqual(params, []);
    });

    test('Should return some parameters if they have been set', async () => {
      await evaluateParam('a', '"charmander"');
      await evaluateParam('b', '"pikachu"');

      const params = new Set(Object.keys(parameters.getParameters()));

      assert.deepStrictEqual(params, new Set(['a', 'b']));
    });
  });

  suite('clearParameters', () => {
    test('Should correctly clear parameters', async () => {
      await evaluateParam('a', '"charmander"');
      const paramsBefore = Object.keys(parameters.getParameters());

      assert.deepStrictEqual(
        paramsBefore.find((e) => e === 'a'),
        'a',
      );
      await parameters.clearParameters();
      const paramsAfter = Object.keys(parameters.getParameters());
      assert.deepStrictEqual(paramsAfter, []);
    });

    test('Should be idempotent', async () => {
      await parameters.clearParameters();
      const paramsBefore = Object.keys(parameters.getParameters());

      assert.deepStrictEqual(paramsBefore, []);
      await parameters.clearParameters();
      const paramsAfter = Object.keys(parameters.getParameters());
      assert.deepStrictEqual(paramsAfter, []);
    });

    test('Should update the parameters in the language server', async () => {
      await evaluateParam('a', '"charmander"');
      const paramsBefore = Object.keys(parameters.getParameters());

      assert.deepStrictEqual(
        paramsBefore.find((e) => e === 'a'),
        'a',
      );
      await parameters.clearParameters();

      sandbox.assert.calledWith(sendNotificationSpy, 'updateParameters');
    });
  });

  suite('getDeserializedParameters', () => {
    test('Should correctly return the deserialized params', async () => {
      await evaluateParam('a', '"charmander"');
      await evaluateParam('b', '1234');
      const params = parameters.getDeserializedParams();
      assert.deepStrictEqual(params, {
        a: 'charmander',
        b: Integer.fromInt(1234),
      });
    });
  });

  suite('deleteParameters', () => {
    test('Should correctly delete an existing parameter', async () => {
      await evaluateParam('a', '"charmander"');
      await evaluateParam('b', '"pikachu"');
      const paramsBefore = new Set(Object.keys(parameters.getParameters()));

      assert.deepStrictEqual(paramsBefore, new Set(['a', 'b']));

      showInformationMessageStub.resetHistory();
      await parameters.deleteParameter('a');
      const paramsAfter = new Set(Object.keys(parameters.getParameters()));
      assert.deepStrictEqual(paramsAfter, new Set(['b']));
      sandbox.assert.calledOnceWithExactly(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.PARAMETER_DELETED('a'),
      );
    });

    test('Should be idempotent', async () => {
      await evaluateParam('a', '"charmander"');
      await evaluateParam('b', '"pikachu"');
      const paramsBefore = new Set(Object.keys(parameters.getParameters()));

      assert.deepStrictEqual(paramsBefore, new Set(['a', 'b']));

      await parameters.deleteParameter('a');

      const paramsAfterFirstDelete = new Set(
        Object.keys(parameters.getParameters()),
      );
      assert.deepStrictEqual(paramsAfterFirstDelete, new Set(['b']));

      await parameters.deleteParameter('a');
      const paramsAfterSecondDelete = new Set(
        Object.keys(parameters.getParameters()),
      );
      assert.deepStrictEqual(paramsAfterSecondDelete, new Set(['b']));
    });

    test('Should update the parameters in the language server', async () => {
      await evaluateParam('a', '"charmander"');
      await evaluateParam('b', '"pikachu"');
      const paramsBefore = new Set(Object.keys(parameters.getParameters()));

      assert.deepStrictEqual(paramsBefore, new Set(['a', 'b']));

      await parameters.deleteParameter('a');

      sendNotificationSpy.calledWith('updateParameters');
    });
  });

  suite('setParameter', () => {
    test('Should correctly set a parameter', async () => {
      await parameters.setParameter({
        key: 'a',
        serializedValue: 'charmander',
        stringValue: '"charmander"',
        type: 'String',
        evaluatedStatement: '"charmander"',
      });
      const a = parameters.getParameterByKey('a');
      assert.deepStrictEqual(a, {
        key: 'a',
        serializedValue: 'charmander',
        stringValue: '"charmander"',
        type: 'String',
        evaluatedStatement: '"charmander"',
      });
      sandbox.assert.calledOnceWithExactly(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.PARAMETER_SET('a'),
      );
    });

    test('Should update the parameters in the language server', async () => {
      await parameters.setParameter({
        key: 'a',
        serializedValue: 'charmander',
        stringValue: '"charmander"',
        type: 'String',
        evaluatedStatement: '"charmander"',
      });

      sandbox.assert.calledWith(sendNotificationSpy, 'updateParameters');
    });
  });

  suite('getParameter', () => {
    test('Should correctly return the parameter when it exists', async () => {
      await evaluateParam('a', '"charmander"');
      await evaluateParam('b', '1234');

      const a = parameters.getParameterByKey('a');
      assert.deepStrictEqual(a, {
        key: 'a',
        serializedValue: 'charmander',
        stringValue: '"charmander"',
        type: 'String',
        evaluatedStatement: '"charmander"',
      });
      const b = parameters.getParameterByKey('b');
      assert.deepStrictEqual(b, {
        key: 'b',
        serializedValue: {
          low: 1234,
          high: 0,
          'transport-class': 'Integer',
        },
        stringValue: '1234',
        type: 'Integer',
        evaluatedStatement: '1234',
      });
    });

    test('Should return undefined when the parameter does not exist', () => {
      const param = parameters.getParameterByKey('does-not-exist');
      assert.deepStrictEqual(param, undefined);
    });
  });

  suite('sendParametersToLanguageServer', () => {
    test('Should send notification to the language server to update the parameters', async () => {
      await parameters.sendParametersToLanguageServer();
      sandbox.assert.calledWith(sendNotificationSpy, 'updateParameters');
    });
  });
});
