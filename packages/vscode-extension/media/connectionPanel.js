(() => {
  document.getElementById('test-connection').addEventListener('click', () => {
    vscode.postMessage({
      command: 'onTestConnection',
      settings: this.getConnectionSettings(),
    });
  });

  document.getElementById('add-connection').addEventListener('click', () => {
    vscode.postMessage({
      command: 'onAddConnection',
      settings: this.getConnectionSettings(),
    });
  });

  getConnectionSettings = () => {
    return {
      connectionName: document.getElementById('connection-name').value,
      scheme: document.getElementById('scheme').value,
      host: document.getElementById('host').value,
      port: document.getElementById('port').value,
      user: document.getElementById('user').value,
      password: document.getElementById('password').value,
      database: document.getElementById('database').value,
    };
  };
})();
