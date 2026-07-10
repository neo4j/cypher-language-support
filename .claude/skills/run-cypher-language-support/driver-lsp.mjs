// Drives the bundled Cypher language server over LSP stdio. No dependencies.
//
//   node .claude/skills/run-cypher-language-support/driver-lsp.mjs [query]
//
// Spawns packages/language-server/dist/cypher-language-server.js, opens the
// query (default: one with a typo), prints the diagnostics the server pushes
// and the completions at the end of the document, then exits. Exit code 0 =
// server answered both; nonzero = something hung or crashed (10s timeout).
import { spawn } from 'node:child_process';

const SERVER = 'packages/language-server/dist/cypher-language-server.js';
const query = process.argv[2] ?? 'MATCH (n:Person) RETRN n.name';

const proc = spawn(process.execPath, [SERVER, '--stdio'], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

let nextId = 1;
const pending = new Map();
function send(method, params, isNotification = false) {
  const msg = { jsonrpc: '2.0', method, params };
  let resolve;
  if (!isNotification) {
    msg.id = nextId++;
    var promise = new Promise((r) => (resolve = r));
    pending.set(msg.id, resolve);
  }
  const body = JSON.stringify(msg);
  proc.stdin.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
  return promise;
}

const notifications = [];
let waitingFor = null;
let buffer = Buffer.alloc(0);
proc.stdout.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  for (;;) {
    const headerEnd = buffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) return;
    const header = buffer.subarray(0, headerEnd).toString();
    const length = Number(/Content-Length: (\d+)/i.exec(header)?.[1]);
    if (buffer.length < headerEnd + 4 + length) return;
    const msg = JSON.parse(buffer.subarray(headerEnd + 4, headerEnd + 4 + length).toString());
    buffer = buffer.subarray(headerEnd + 4 + length);
    if (msg.id !== undefined && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    } else if (msg.method) {
      notifications.push(msg);
      if (waitingFor && msg.method === waitingFor.method) waitingFor.resolve(msg.params);
    }
  }
});

function waitForNotification(method) {
  const hit = notifications.find((n) => n.method === method);
  if (hit) return Promise.resolve(hit.params);
  return new Promise((resolve) => (waitingFor = { method, resolve }));
}

const timeout = setTimeout(() => {
  console.error('TIMEOUT: no response from language server within 10s');
  proc.kill();
  process.exit(1);
}, 10_000);

const uri = 'file:///driver.cypher';
await send('initialize', {
  processId: process.pid,
  rootUri: null,
  capabilities: { textDocument: { publishDiagnostics: {} } },
});
send('initialized', {}, true);
// Linting is gated on settings.features.linting (see language-server/src/server.ts);
// without this notification the server never publishes real diagnostics.
send(
  'workspace/didChangeConfiguration',
  { settings: { neo4j: { features: { linting: true } } } },
  true,
);
send(
  'textDocument/didOpen',
  { textDocument: { uri, languageId: 'cypher', version: 1, text: query } },
  true,
);

// Linting is debounced 600ms and runs in a cold worker pool; skip empty
// initial pushes and wait for the first nonempty one (or accept empty at timeout).
async function waitForDiagnostics() {
  for (;;) {
    const idx = notifications.findIndex(
      (n) => n.method === 'textDocument/publishDiagnostics',
    );
    if (idx !== -1) {
      const [n] = notifications.splice(idx, 1);
      if (n.params.diagnostics.length > 0) return n.params;
    } else {
      await waitForNotification('textDocument/publishDiagnostics');
    }
  }
}
const diagnostics = await waitForDiagnostics();
console.log('--- diagnostics ---');
for (const d of diagnostics.diagnostics) {
  console.log(
    `[${d.severity === 1 ? 'error' : 'warn'}] ${d.range.start.line}:${d.range.start.character} ${d.message}`,
  );
}

// Completions on a separate document with a completion-friendly cursor position
// (at the end of the broken query above the parser has nothing to offer).
const completionUri = 'file:///completion.cypher';
const completionQuery = 'MATCH (n) RETURN ';
send(
  'textDocument/didOpen',
  {
    textDocument: {
      uri: completionUri,
      languageId: 'cypher',
      version: 1,
      text: completionQuery,
    },
  },
  true,
);
const completions = await send('textDocument/completion', {
  textDocument: { uri: completionUri },
  position: { line: 0, character: completionQuery.length },
  // The server dereferences context.triggerKind; omitting it crashes the request.
  context: { triggerKind: 1 },
});
const items = completions?.items ?? completions ?? [];
console.log('--- completions (first 10) ---');
console.log(items.slice(0, 10).map((i) => i.label).join(', '));

clearTimeout(timeout);
proc.kill();
process.exit(items.length > 0 ? 0 : 1);
