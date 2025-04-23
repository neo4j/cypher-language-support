import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as parameterService from '../../../src/parameterService';
import { parametersTreeDataProvider } from '../../../src/treeviews/parametersTreeDataProvider';

suite('Parameters tree data provider spec', () => {
  const mockParameters: parameterService.Parameters = {
    a: {
      key: 'a',
      serializedValue: 'charmander',
      stringValue: '"charmander"',
      type: 'String',
      evaluatedStatement: '"charmander"',
    },
    b: {
      key: 'b',
      serializedValue: {
        low: 1234,
        high: 0,
        'transport-class': 'Integer',
      },
      stringValue: '1234',
      type: 'Integer',
      evaluatedStatement: '1234',
    },
  };

  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(parameterService, 'getParameters').returns(mockParameters);
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('Shows parameters correctly', () => {
    const children = parametersTreeDataProvider.getChildren();

    const params = children.map((value) => {
      return {
        label: value.label,
        id: value.id,
        contextValue: value.contextValue,
      };
    });

    assert.deepStrictEqual(params, [
      {
        label: 'a: "charmander" (String)',
        id: 'a',
        contextValue: 'parameter',
      },
      {
        label: 'b: 1234 (Integer)',
        id: 'b',
        contextValue: 'parameter',
      },
    ]);
  });
});
