# Language Server

A language server wrapper for the `@neo4j-cypher/language-support` package.

## Installation

You can install the language server using npm:

```
npm i -g @neo4j-cypher/language-server
```

### Usage

Once installed, you can run the language server using `cypher-language-server --stdio`.

Below you can find a few examples in Typescript on how to send messages to that server.

For integrations with other editors, see [Integrating with other editors](#integrating-with-other-editors).

### Using ipc

```typescript
import * as child_process from 'child_process';

let lspProcess = child_process.spawn('cypher-language-server', ['--ipc']);
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
  child_process.spawn('cypher-language-server', ['--socket=3000']);
});
```

### Using stdio

```typescript
import * as child_process from 'child_process';
import * as rpc from 'vscode-jsonrpc/node';

let lspProcess = child_process.spawn('cypher-language-server', ['--stdio']);
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

### Integrating with other editors

#### Emacs

##### With [lsp-mode](https://github.com/emacs-lsp/lsp-mode)

As of version 8.0.1, `lsp-mode` provides built in support for the `cypher-language-server`. `lsp-mode` will connect to a `cypher-language-server` for any file ending with `.cypher`, or if you're currently in a `cypher-mode`. 

If the `cypher-language-server` is not already installed, you can install the server by running `M-x lsp-install-server RET` and then selecting `cypher-ls` from the list.

##### With [lsp-mode](https://github.com/emacs-lsp/lsp-mode) < 8.0.1

```elisp
(with-eval-after-load 'lsp-mode
  (add-to-list 'lsp-language-id-configuration
  ;; '(cypher-mode . "cypher")) ;; use this if you have a cypher-mode installed
  '(".*cypher" . "cypher")) ;; otherwise, you can simply match on file ending with a regex

(lsp-register-client
(make-lsp-client :new-connection (lsp-stdio-connection '("cypher-language-server" "--stdio"))
  :activation-fn (lsp-activate-on "cypher")
  :server-id 'cypher)))
```

If you want semantic highlighting, remember to set 

```elisp
(setq lsp-semantic-tokens-enable t)
```

##### With [eglot](https://joaotavora.github.io/eglot/)

As of Emacs 29, `eglot` is built in. In `eglot`, a language server needs to be associate with a specific major mode. Install any available `cypher-mode` in order to get the server running with `eglot`. Note also that `eglot` does not support semantic highlighting.

```elisp
(add-to-list 'Eglot-server-programs '((cypher-mode) "cypher-language-server" "--stdio")))
```

#### Neovim

##### With [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig)

There is built-in support for the `cypher-language-server` in the plugin ([cypher_ls](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#cypher_ls)).

Activate the language server support in your config file.
```lua
require('lspconfig').cypher_ls.setup{}
```

The language server is registered for _cypher_ files.
To make neovim aware of this type, add a file to your _neovim-configuration-path/ftdetect_ (if it does not exist, create one) folder, e.g. _cypher.vim_, defining the file suffix and file type.

```vim
au BufRead,BufNewFile *.cypher                set filetype=cypher
```

