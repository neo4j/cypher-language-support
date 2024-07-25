import {
  ActivityBar,
  By,
  Notification,
  TextEditor,
  VSBrowser,
  WebView,
  Workbench,
} from 'vscode-extension-tester';

export const testDatabaseKey = 'default-test-connection';

export const defaultConnectionKey = 'default-connection-key';

async function notificationExists(
  text: string,
): Promise<Notification | undefined> {
  const workbench = new Workbench();
  const notifications = await workbench.getNotifications();
  for (const notification of notifications) {
    const message = await notification.getMessage();
    if (message.indexOf(text) >= 0) {
      return notification;
    }
  }
}

export async function saveDefaultConnection(port: number): Promise<void> {
  const activityBar = new ActivityBar();

  const neo4jTile = await activityBar.getViewControl('Neo4j');
  const connectionPannel = await neo4jTile.openView();

  const content = connectionPannel.getContent();
  const sections = await content.getSections();
  const section = sections.at(0);

  if (section) {
    const welcomeContent = await section.findWelcomeContent();
    const buttons = await welcomeContent.getButtons();
    const newConnectionButton = buttons.at(0);
    await newConnectionButton.click();
    await new Promise((res) => {
      setTimeout(res, 10000);
    });
  }
  const textEditor = new TextEditor();
  const connectionWebview = new WebView();

  await connectionWebview.switchToFrame(10_000);
  const schemeInput = await connectionWebview.findWebElement(By.id('scheme'));
  const hostInput = await connectionWebview.findWebElement(By.id('host'));
  const portInput = await connectionWebview.findWebElement(By.id('port'));
  const userInput = await connectionWebview.findWebElement(By.id('user'));
  const passwordInput = await connectionWebview.findWebElement(
    By.id('password'),
  );
  const saveConnectionButton = await connectionWebview.findWebElement(
    By.id('save-connection'),
  );

  await schemeInput.sendKeys('bolt://');
  await hostInput.clear();
  await hostInput.sendKeys('localhost');
  await portInput.clear();
  await portInput.sendKeys(port);
  await userInput.clear();
  await userInput.sendKeys('neo4j');
  await passwordInput.clear();
  await passwordInput.sendKeys('password');

  await saveConnectionButton.click();
  await connectionWebview.switchBack();

  await VSBrowser.instance.driver.wait(() => {
    return notificationExists('Connected to Neo4j.');
  }, 5000);
}
