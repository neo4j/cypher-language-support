# Language Server

A language server wrapper for the `@neo4j-cypher/language-support` package.

## Bundle the server and run with node

To package the language server into a single javascript bundle, go to the root of the project and
do `npm run assemble` or `npm run assemble -- -- --minify` if you'd rather have the code minified.
After that a file `./packages/server/dist/cypher-language-server.js` will be generated.

You can run the language server with `node ./cypher-language-server.js --stdio`.

Below you can find a few examples in Typescript on how to send messages to that server.

### Using ipc

```typescript
import * as child_process from 'child_process';

let lspProcess = child_process.fork('cypher-language-server.js', [
  '--node-ipc',
]);
let messageId = 1;

function send(method: string, params: object) {
  let message = {
    jsonrpc: '2.0',
    id: messageId++,
    method: method,
    params: params,
  };
  lspProcess.send(message);
}

function initialize() {
  send('initialize', {
    rootPath: process.cwd(),
    processId: process.pid,
    capabilities: {
      /* ... */
    },
  });
}

lspProcess.on('message', function (json) {
  console.log(json);
});
initialize();
```

### Using sockets

```typescript
import * as net from 'net';
import * as child_process from 'child_process';
import * as rpc from 'vscode-jsonrpc/node';

let messageId = 1;
let reader: rpc.SocketMessageReader = null;
let writer: rpc.SocketMessageWriter = null;

function send(method: string, params: object) {
  let message = {
    jsonrpc: '2.0',
    id: messageId++,
    method: method,
    params: params,
  };
  writer.write(message);
}

function initialize() {
  send('initialize', {
    rootPath: process.cwd(),
    processId: process.pid,
    capabilities: {
      textDocument: {
        /* ... */
      },
      workspace: {
        /* ... */
      },
    },
  });
}

const server = net.createServer((socket: net.Socket) => {
  server.close();
  reader = new rpc.SocketMessageReader(socket);
  reader.listen((data) => {
    console.log(data);
  });
  writer = new rpc.SocketMessageWriter(socket);
  initialize();
});

server.listen(3000, () => {
  child_process.spawn('node', ['cypher-language-server.js', '--socket=3000']);
});
```

### Using stdio

```typescript
import * as child_process from 'child_process';
import * as rpc from 'vscode-jsonrpc/node';

let lspProcess = child_process.spawn('node', [
  'cypher-language-server.js',
  '--stdio',
]);
let messageId = 1;

const reader = new rpc.StreamMessageReader(lspProcess.stdout);
const writer = new rpc.StreamMessageWriter(lspProcess.stdin);

function send(method: string, params: object) {
  let message = {
    jsonrpc: '2.0',
    id: messageId++,
    method: method,
    params: params,
  };
  writer.write(message);
}

function initialize() {
  send('initialize', {
    rootPath: process.cwd(),
    processId: process.pid,
    capabilities: {
      /* ... */
    },
  });
}

reader.listen((data) => {
  console.log(data);
});

initialize();
```
