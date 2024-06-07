(() => {
  document.getElementById('test-connection').addEventListener('click', () => {
    vscode.postMessage({
      command: 'onTestConnection',
      connection: this.getConnection(),
      password: this.getPassword(),
    });
  });

  document.getElementById('add-connection').addEventListener('click', () => {
    vscode.postMessage({
      command: 'onAddConnection',
      connection: this.getConnection(),
      password: this.getPassword(),
    });
  });

  getConnection = () => {
    return {
      key: document.getElementById('key').value,
      name: document.getElementById('name').value,
      scheme: document.getElementById('scheme').value,
      host: document.getElementById('host').value,
      port: document.getElementById('port').value,
      user: document.getElementById('user').value,
      database: document.getElementById('database').value,
      connect: document.getElementById('connect').value === 'true',
    };
  };

  getPassword = () => {
    return document.getElementById('password').value;
  };
})();
