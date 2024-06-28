import { Neo4jContainer, StartedNeo4jContainer } from '@testcontainers/neo4j';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export async function createAndStartTestContainer(): Promise<StartedNeo4jContainer> {
  const password = 'password';
  const container = await new Neo4jContainer('neo4j:5-enterprise')
    .withExposedPorts(7474, 7687)
    .withApoc()
    .withPassword(password)
    .withEnvironment({ NEO4J_ACCEPT_LICENSE_AGREEMENT: 'yes' })
    // Giving it a name prevents us from spinning up a different
    // container every time we run the tests and allows us
    // closing a lingering one when the tests finish
    .withName('vscode-integration-tests')
    .start();

  const port = container.getMappedPort(7687);
  // This sets up a settings.json file based on the settings-template.json
  // replacing the random port and password we have given the container
  updateDotenvFile(port, password);

  return container;
}

function setSetting(file: string, variable: RegExp, value: string) {
  const data = fs.readFileSync(file).toString();
  const result = data.replace(variable, value);
  fs.writeFileSync(file, result);
}

function updateDotenvFile(port: number, password: string) {
  const dotenvPath = path.join(__dirname, '../../e2e_tests/fixtures/');
  const dotenvTemplate = path.join(dotenvPath, '.env');
  const dotenvFile = path.join(dotenvPath, '.env.test');
  fs.copyFileSync(dotenvTemplate, dotenvFile);
  setSetting(dotenvFile, /\{PORT\}/g, port.toString());
  setSetting(dotenvFile, /\{PASSWORD\}/g, password);
  dotenv.config({ path: dotenvFile });
}
