// see https://github.com/microsoft/vscode-test/issues/37#issuecomment-700167820
const { TestEnvironment } = require('jest-environment-node');

class VsCodeEnvironment extends TestEnvironment {
  async setup() {
    const vscode = require('vscode');
    await super.setup();
    this.global.vscode = vscode;
  }

  async teardown() {
    this.global.vscode = {};
    await super.teardown();
  }
}

module.exports = VsCodeEnvironment;
