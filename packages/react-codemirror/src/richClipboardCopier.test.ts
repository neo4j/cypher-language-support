// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditorView } from '@codemirror/view';
import { getHTML, getCSSStyleForClass } from './richClipboardCopier';

function createStyleSheet(rules: string): CSSStyleSheet {
  const styleEl = document.createElement('style');
  styleEl.textContent = rules;
  document.head.appendChild(styleEl);
  return styleEl.sheet;
}

describe('getCSSStyleForClass', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('returns cssText for a given class', () => {
    createStyleSheet('.foo { color: red; font-weight: bold; }');
    const css = getCSSStyleForClass('foo');
    expect(css).toContain('color: red');
    expect(css).toContain('font-weight: bold');
  });

  it('returns empty string if no matching class exists', () => {
    createStyleSheet('.bar { color: blue; }');
    const css = getCSSStyleForClass('nonexistent');
    expect(css).toBe('');
  });
});

describe('getHTML', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('wraps selected DOM content with monospace wrapper and inlines class styles', () => {
    createStyleSheet(
      '.foo { color: red; font-weight: bold; } .bar { background: yellow; }',
    );

    const div = document.createElement('div');
    div.className = 'foo bar';
    div.textContent = 'Hello';
    const wrapper = document.createElement('div');
    wrapper.appendChild(div);
    document.body.appendChild(wrapper);

    const mockView = {
      domAtPos: vi.fn((pos: number) => ({
        node: wrapper,
        offset: pos === 0 ? 0 : 1,
      })),
    } as unknown as EditorView;

    const html = getHTML(mockView, 0, 1);

    expect(html).toContain('font-family: monospace;');
    expect(html).toContain('color: red');
    expect(html).toContain('font-weight: bold');
    expect(html).toContain('background: yellow');
    expect(html).not.toContain('class=');
    expect(html).toContain('Hello');
  });
});
