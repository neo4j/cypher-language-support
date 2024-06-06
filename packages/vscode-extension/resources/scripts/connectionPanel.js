(() => {
  document.getElementById('test-connection').addEventListener('click', () => {
    vscode.postMessage({
      command: 'onTestConnection',
      connection: this.getConnection(),
    });
  });

  document.getElementById('add-connection').addEventListener('click', () => {
    vscode.postMessage({
      command: 'onAddConnection',
      connection: this.getConnection(),
    });
  });

  getConnection = () => {
    const name = document.getElementById('name').value;
    let key = document.getElementById('key').value;
    key = !key ? name.toLowerCase().replace(/\s/g, '-') : key;

    return {
      key: key,
      name: name,
      scheme: document.getElementById('scheme').value,
      host: document.getElementById('host').value,
      port: document.getElementById('port').value,
      user: document.getElementById('user').value,
      password: document.getElementById('password').value,
      database: document.getElementById('database').value,
      connected: document.getElementById('connected').value === 'true',
    };
  };
})();
