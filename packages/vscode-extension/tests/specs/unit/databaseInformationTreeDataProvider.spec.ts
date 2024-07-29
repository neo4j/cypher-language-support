import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as connectionService from '../../../src/connectionService';
import { databaseInformationTreeDataProvider } from '../../../src/treeviews/databaseInformationTreeDataProvider';
import { getMockConnection } from '../../helpers';
import { MockSchemaPoller } from '../../mocks/mockSchemaPoller';
import { setupMockContextStubs } from '../../mocks/setupMockContextStubs';

suite('Database information tree data provider spec', () => {
  let sandbox: sinon.SinonSandbox;
  let mockSchemaPoller: MockSchemaPoller;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox
      .stub(connectionService, 'getActiveConnection')
      .returns(getMockConnection(true));

    const stubs = setupMockContextStubs(sandbox);

    mockSchemaPoller = stubs.mockSchemaPoller;

    sandbox.stub(mockSchemaPoller, 'metadata').value({
      dbSchema: {
        labels: ['Movie', 'Person'],
        relationshipTypes: ['ACTED_IN', 'DIRECTED'],
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('Labels and Relationships returned from the schema poller should be mapped in the tree view', () => {
    const labels = databaseInformationTreeDataProvider.getChildren({
      type: 'label',
      collapsibleState: 1,
      label: 'Labels',
    });
    const relationshipTypes = databaseInformationTreeDataProvider.getChildren({
      type: 'relationship',
      collapsibleState: 1,
      label: 'Relationships',
    });

    const expectedLabels = ['Movie', 'Person'];
    const expectedRelationshipTypes = ['ACTED_IN', 'DIRECTED'];

    const actualLabels = labels.map((label) => label.label);
    const actualRelationshipTypes = relationshipTypes.map(
      (relationship) => relationship.label,
    );

    assert.equal(labels.length, 2);
    assert.equal(relationshipTypes.length, 2);

    assert.deepStrictEqual(actualLabels, expectedLabels);
    assert.deepStrictEqual(actualRelationshipTypes, expectedRelationshipTypes);
  });
});
