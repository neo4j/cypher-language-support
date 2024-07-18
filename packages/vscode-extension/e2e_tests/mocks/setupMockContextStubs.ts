import * as sinon from 'sinon';
import * as contextService from '../../src/contextService';
import { MockExtensionContext } from './mockExtensionContext';
import { MockLanguageClient } from './mockLanguageClient';
import { MockSchemaPoller } from './mockSchemaPoller';

export const setupMockContextStubs = (
  sandbox: sinon.SinonSandbox,
): {
  mockContext: MockExtensionContext;
  mockLanguageClient: MockLanguageClient;
  mockSchemaPoller: MockSchemaPoller;
} => {
  const mockContext = new MockExtensionContext();
  const mockLanguageClient = new MockLanguageClient();
  const mockSchemaPoller = new MockSchemaPoller();

  sandbox.stub(contextService, 'getExtensionContext').returns(mockContext);
  sandbox.stub(contextService, 'getLanguageClient').returns(mockLanguageClient);
  sandbox.stub(contextService, 'getSchemaPoller').returns(mockSchemaPoller);

  const setContextStub = sandbox.stub(contextService, 'setContext');

  setContextStub(mockContext, mockLanguageClient);

  return { mockContext, mockLanguageClient, mockSchemaPoller };
};
