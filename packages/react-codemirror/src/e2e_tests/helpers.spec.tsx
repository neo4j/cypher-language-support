import { test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';
import { CypherEditorPage } from './e2eUtils';

test.use({ viewport: { width: 1000, height: 500 } });

test.fail(
  'checkNoNotification fails on query with error',
  async ({ page, mount }) => {
    const editorPage = new CypherEditorPage(page);

    const query = 'METCH (n) RETURN n';
    await mount(<CypherEditor value={query} />);

    await editorPage.checkNoNotificationMessage('error');
  },
);
