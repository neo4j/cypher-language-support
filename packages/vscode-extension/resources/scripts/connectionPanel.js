(() => {
  validateConnection = (connection, password) => {
    return (
      connection.key &&
      connection.name &&
      connection.scheme &&
      connection.host &&
      connection.port &&
      connection.user &&
      connection.database &&
      password
    );
  };

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
      default: true,
    };
  };

  getPassword = () => {
    return document.getElementById('password').value;
  };

  onSubmit = (event) => {
    event.preventDefault();

    const connection = this.getConnection();
    const password = this.getPassword();

    if (!this.validateConnection(connection, password)) {
      vscode.postMessage({
        command: 'onValidationError',
      });
      return false;
    } else {
      vscode.postMessage({
        command: 'onSaveConnection',
        connection: connection,
        password: password,
      });
    }
  };

  addEventListener('submit', (event) => this.onSubmit(event));

  document.getElementById('test-connection').addEventListener('click', () => {
    const connection = this.getConnection();
    const password = this.getPassword();

    if (!this.validateConnection(connection, password)) {
      vscode.postMessage({
        command: 'onError',
      });
    } else {
      vscode.postMessage({
        command: 'onTestConnection',
        connection: connection,
        password: password,
      });
    }
  });
})();
