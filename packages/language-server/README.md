# Language Server

A language server wrapper for the `@neo4j-cypher/language-support` package.

## Installation

We will provide a quick way to install the serer via npm soon™️. For now you can build it yourself, see instructions below.

### Usage from typescript

You can run the language server with `npx @neo4j-cypher/language-server.js --stdio`.

Below you can find a few examples in Typescript on how to send messages to that server.

### Using ipc

```typescript
import * as child_process from 'child_process';

let lspProcess = child_process.spawn('npx', [
  '@neo4j-cypher/language-server',
  '--ipc',
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
  child_process.spawn('npx', [
    '@neo4j-cypher/language-server',
    '--socket=3000',
  ]);
});
```

### Using stdio

```typescript
import * as child_process from 'child_process';
import * as rpc from 'vscode-jsonrpc/node';

let lspProcess = child_process.spawn('npx', [
  '@neo4j-cypher/language-server',
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
