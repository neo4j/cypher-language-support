import { render, screen } from '@testing-library/react';
import { CypherEditor } from './CypherEditor';

// This test file runs in node with a mock DOM
// It allows us to control how the react component is rendered
test('hello world unit test', async () => {
  render(<CypherEditor value="hello world" />);

  // Wait for page to update with query text
  expect(await screen.findByText('hello world')).toBeDefined();
});

test('component value can be controlled externally ', async () => {
  const { rerender } = render(<CypherEditor value="RETURN 123" />);

  expect(await screen.findByText('RETURN 123')).toBeDefined();

  rerender(<CypherEditor value="MATCH ()" />);

  expect(await screen.findByText('MATCH ()')).toBeDefined();
});

test('component value can be controlled externally ', async () => {
  const { rerender } = render(<CypherEditor value="RETURN 123" />);

  expect(await screen.findByText('RETURN 123')).toBeDefined();

  rerender(<CypherEditor value="MATCH ()" />);

  expect(await screen.findByText('MATCH ()')).toBeDefined();
});

export interface CypherEditorProps {
  prompt?: string;
  // extraKeybindings?: KeyBinding[];
  onExecute?: (cmd: string) => void;
  initialHistory?: string[];
  onNewHistoryEntry?: (historyEntry: string) => void;
  overrideThemeBackgroundColor?: boolean;
  autofocus?: boolean;
  lineWrap?: boolean;
  lint?: boolean;
  readOnly?: boolean;
  // schema?: DbSchema;
  value?: string;
  className?: string;
  /**
   * `light` / `dark` / `Extension` Defaults to `light`.
   * @default light
   */
  // theme?: 'light' | 'dark' | 'none' | Extension;
  // onChange?(value: string, viewUpdate: ViewUpdate): void;
}

// TODO read only
// TODO line wrap
/*
testa mera
  prompt?: string;
  extraKeybindings?: KeyBinding[];
  onExecute?: (cmd: string) => void;
  initialHistory?: string[];

*/
