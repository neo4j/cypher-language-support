import {
  ActivityBar,
  TreeSection,
  ViewSection,
  VSBrowser,
  WebDriver,
} from 'vscode-extension-tester';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Create a Mocha suite
describe('My Test Suite', () => {
  let browser: VSBrowser;
  let driver: WebDriver;
  let connectionSection: ViewSection;

  // initialize the browser and webdriver
  before(async function () {
    browser = VSBrowser.instance;
    driver = browser.driver;
    const activityBar = new ActivityBar();

    const neo4jTile = await activityBar.getViewControl('Neo4j');
    const connectionPannel = await neo4jTile.openView();
    const content = connectionPannel.getContent();
    const sections = await content.getSections();
    connectionSection = sections.at(0) as TreeSection;
  });

  // test whatever we want using webdriver, here we are just checking the page title
  it('Can disconnect from neo4j gracefully', async () => {
    const visibleItems = await connectionSection.getVisibleItems();
    const contextMenu = await visibleItems.at(0).openContextMenu();
    const menuOptions = await contextMenu.getItems();
    await sleep(50000);
  });
});
