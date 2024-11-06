import { browser } from '@wdio/globals';
import { before } from 'mocha';
import { createAndStartTestContainer } from '../../setupTestContainer';
import { waitUntilNotification } from '../../webviewUtils';

before(async () => {
  const container = await createAndStartTestContainer({
    writeEnvFile: false,
  });
  const port = container.getMappedPort(7687);
  const workbench = await browser.getWorkbench();
  const activityBar = workbench.getActivityBar();
  const neo4jTile = await activityBar.getViewControl('Neo4j');
  const connectionPannel = await neo4jTile.openView();
  const content = connectionPannel.getContent();
  const sections = await content.getSections();
  const section = sections.at(0);
  if (section) {
    const newConnectionButton = await section.button$;
    await newConnectionButton.click();
  }

  const connectionWebview = (await workbench.getAllWebviews()).at(0);

  if (connectionWebview) {
    await connectionWebview.open();

    const schemeInput = await $('#scheme');
    const hostInput = await $('#host');
    const portInput = await $('#port');
    const userInput = await $('#user');
    const passwordInput = await $('#password');
    await schemeInput.selectByVisibleText('neo4j://');
    await hostInput.setValue('localhost');
    await portInput.setValue(port);
    await userInput.setValue('neo4j');
    await passwordInput.setValue('password');

    const saveConnectionButton = await $('#save-connection');
    await saveConnectionButton.click();

    await connectionWebview.close();
  }

  await waitUntilNotification(browser, 'Connected to Neo4j.');
});
