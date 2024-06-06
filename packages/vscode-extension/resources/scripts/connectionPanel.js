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
      database: document.getElementById('database').value,
      connected: document.getElementById('connected').value === 'true',
    };
  };

  getPassword = () => {
    return document.getElementById('password').value;
  };
})();
