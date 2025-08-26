import { EditorView } from '@codemirror/view';

export function getCSSStyleForClass(className: string): string {
  return Array.from(document.styleSheets).reduce((cssText, sheet) => {
    try {
      const rules = sheet.cssRules ?? [];
      for (const rule of Array.from(rules)) {
        if (
          rule instanceof CSSStyleRule &&
          rule.selectorText
            .split(',')
            .some((sel) => sel.trim() === `.${className}`)
        ) {
          cssText += rule.style.cssText;
        }
      }
    } catch {
      // Ignore CORS-protected stylesheets
    }
    return cssText;
  }, '');
}

function replaceClassWithStyle(element: HTMLElement): void {
  const classNames = element.className.split(/\s+/).filter(Boolean);
  const computed = getComputedStyle(element);

  // Always keep text color if present
  let styleText = computed.color ? `color: ${computed.color};` : '';

  for (const cls of classNames) {
    styleText += getCSSStyleForClass(cls);
  }

  if (styleText) {
    element.setAttribute('style', styleText);
  }

  element.removeAttribute('class');
}

export function getHTML(view: EditorView, from: number, to: number): string {
  const range = document.createRange();
  const fromInfo = view.domAtPos(from);
  const toInfo = view.domAtPos(to);

  range.setStart(fromInfo.node, fromInfo.offset);
  range.setEnd(toInfo.node, toInfo.offset);

  const commonAncestor = range.commonAncestorContainer;
  const wrapperElement =
    commonAncestor instanceof Text
      ? commonAncestor.parentElement
      : (commonAncestor as HTMLElement);

  const wrapper = document.createElement('div');

  if (wrapperElement) {
    const style = wrapperElement.getAttribute('style');
    const cls = wrapperElement.getAttribute('class');
    if (style) wrapper.setAttribute('style', style);
    if (cls) wrapper.setAttribute('class', cls);
  }

  wrapper.appendChild(range.cloneContents());

  replaceClassWithStyle(wrapper);
  wrapper
    .querySelectorAll<HTMLElement>('[class]')
    .forEach(replaceClassWithStyle);

  const editorElement = document.querySelector('.cm-editor');
  const editorColor = editorElement
    ? getComputedStyle(editorElement).color
    : '';

  return `<div style="font-family: monospace; ${
    editorColor ? `color: ${editorColor};` : ''
  }">${wrapper.outerHTML}</div>`;
}

export const richClipboardCopier = EditorView.domEventHandlers({
  copy: (event, view) => {
    event.preventDefault();

    const { from, to } = view.state.selection.main;
    const selectedText = view.state.doc.sliceString(from, to);

    if (!selectedText) return;

    const richHtml = getHTML(view, from, to);

    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', selectedText);
      event.clipboardData.setData('text/html', richHtml);
    }
  },
});
