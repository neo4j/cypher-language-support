// @vitest-environment jsdom

import { EditorView } from '@codemirror/view';
import { createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { DEBOUNCE_TIME } from './constants';
import { CypherEditor } from './CypherEditor';

const container = document.createElement('div');
let root: ReturnType<typeof createRoot>;

const ref = createRef<CypherEditor>();
let value = '';
const onChange = vi.fn((v: string) => {
  value = v;
  rerender();
});

global.IS_REACT_ACT_ENVIRONMENT = true;
const DEBOUNCE_TIME_WITH_MARGIN = DEBOUNCE_TIME + 100;

/** Avoids crash in test environment */
function mockEditorView(editorView: EditorView) {
  editorView.coordsAtPos = vi.fn().mockReturnValue({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });
}

async function debounce() {
  await new Promise((resolve) =>
    setTimeout(resolve, DEBOUNCE_TIME_WITH_MARGIN),
  );
}

function getEditorValue() {
  return ref.current.editorView.current.state.doc.toString();
}

function rerender() {
  act(() => {
    root.render(<CypherEditor value={value} onChange={onChange} ref={ref} />);
  });
}

beforeEach(() => {
  root = createRoot(container);
  act(() => {
    root.render(<CypherEditor value={value} onChange={onChange} ref={ref} />);
  });
  mockEditorView(ref.current.editorView.current);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  value = '';
  vi.clearAllMocks();
});

test('editorValue updates props.value after debounce', async () => {
  ref.current.setValueAndFocus('new value');
  expect(onChange).not.toHaveBeenCalled();
  expect(getEditorValue()).toBe('new value');
  expect(value).toBe('');
  await debounce();

  expect(onChange).toHaveBeenCalledOnce();
  expect(getEditorValue()).toBe('new value');
  expect(value).toBe('new value');
});

test('editorValue updates should not be applied twice', async () => {
  const dispatch = vi.spyOn(ref.current.editorView.current, 'dispatch');

  ref.current.setValueAndFocus('new value');
  await debounce();

  expect(onChange).toHaveBeenCalledOnce();
  expect(dispatch).toHaveBeenCalledOnce(); // it gets called once for the initial setValueAndFocus
});

test('props.value updates editorValue', () => {
  value = 'external value';
  rerender();

  expect(getEditorValue()).toBe('external value');
  expect(value).toBe('external value');
});

test('props.value set to undefined preserves editorValue', () => {
  // 1. value is set initially
  value = 'initial';
  rerender();

  // 2. value is set to undefined
  value = undefined;
  rerender();

  expect(onChange).not.toHaveBeenCalled();
  expect(value).toBeUndefined();
  expect(getEditorValue()).toBe('initial');
});

// value updates from outside onExecute are overwritten by pending updates
test.fails('new props.value should cancel onChange', async () => {
  // 1. value is updated internally
  ref.current.setValueAndFocus('update');

  // 2. editor is rerendered with a new value while a value update is still pending
  value = 'new external value';
  rerender();

  await debounce();

  // expect(onChange).not.toHaveBeenCalled();
  expect(getEditorValue()).toBe('new external value');
  expect(value).toBe('new external value');
});

// value updates from outside onExecute are overwritten by pending updates
test.fails(
  'new props.value set to same value should cancel onChange',
  async () => {
    // 1. value is set initially
    value = 'same value';
    rerender();

    // 2. value is updated internally
    ref.current.setValueAndFocus('update');

    // 3. editor is rerendered with a new value while a value update is still pending
    value = 'same value';
    rerender();

    await debounce();

    // expect(onChange).not.toHaveBeenCalled();
    expect(getEditorValue()).toBe('same value');
    expect(value).toBe('same value');
  },
);

test('rerender should not cancel onChange', async () => {
  // 1. value is updated internally
  ref.current.setValueAndFocus('changed');

  // 2. editor is rerendered while a value update is still pending
  rerender();

  await debounce();

  expect(onChange).toHaveBeenCalledOnce();
  expect(getEditorValue()).toBe('changed');
  expect(value).toBe('changed');
});

test('rerender with a previous update should not cancel onChange', async () => {
  // 1. value is updated internally
  ref.current.setValueAndFocus('changed');
  await debounce();

  // 2. value is updated internally again
  ref.current.setValueAndFocus('new change');

  // 3. editor is rerendered while a value update is still pending
  rerender();

  await debounce();

  expect(onChange).toHaveBeenCalledTimes(2);
  expect(getEditorValue()).toBe('new change');
  expect(value).toBe('new change');
});

test('rerender with prior external update should not cancel onChange', async () => {
  // 1. value is set initially
  ref.current.setValueAndFocus('initial');
  await debounce();

  // 2. value is updated externally
  value = 'external update';
  rerender();

  // 3. value is updated internally
  ref.current.setValueAndFocus('internal update');

  // 4. editor is rerendered while a value update is still pending
  rerender();

  await debounce();

  expect(getEditorValue()).toBe('internal update');
  expect(value).toBe('internal update');
});
