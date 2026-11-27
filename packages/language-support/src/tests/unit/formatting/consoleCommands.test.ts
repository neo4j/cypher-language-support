import { verifyFormatting } from './testutil.js';

describe('formatting of console commands', () => {
  test('does not put a space between the colon and a simple command', () => {
    verifyFormatting(`:welcome`, ':welcome');
  });

  test('lowercases a command with an argument', () => {
    verifyFormatting(':SERVER    CONNECT', ':server connect');
  });

  test('keeps the arrow of a parameter lambda together', () => {
    verifyFormatting(':PARAM x=>1', ':param x => 1');
  });

  test('formats the statement of an auto command like a regular query', () => {
    const query = `:AUTO match (n) where n.age > 10 call (n) { set n.x = 1 } in transactions return n`;
    const expected = `:auto
MATCH (n)
WHERE n.age > 10
CALL (n) {
  SET n.x = 1
} IN TRANSACTIONS
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('puts a command between statements on its own line', () => {
    const query = `match (n) return n; :welcome; match (m) return m`;
    const expected = `MATCH (n)
RETURN n;
:welcome;
MATCH (m)
RETURN m`;
    verifyFormatting(query, expected);
  });

  test('puts consecutive commands on separate lines', () => {
    verifyFormatting(':welcome; :server connect', `:welcome;\n:server connect`);
  });

  test('handles an auto command without a statement', () => {
    verifyFormatting(':auto', ':auto');
  });

  test('handles a server command without an argument', () => {
    verifyFormatting(':server', ':server');
  });

  test('leaves a lone colon unchanged', () => {
    verifyFormatting(':', ':');
  });

  test('leaves a non-existent command unchanged', () => {
    verifyFormatting(':notacommand bar', ':notacommand bar');
  });
});
