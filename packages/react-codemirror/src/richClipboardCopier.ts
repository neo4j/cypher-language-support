import { EditorView } from '@codemirror/view';

export function getCSSStyleForClass(className: string): string {
  let cssText = '';
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = sheet.cssRules;
      if (!rules) continue;
      for (const rule of Array.from(rules)) {
        if (
          rule instanceof CSSStyleRule &&
          rule.selectorText
            .split(',')
            .some((sel) => sel.trim() === `.${className}`)
        ) {
          cssText += rule.style.cssText + ';';
        }
      }
    } catch {
      // no-op, some stylesheets may not be accessible due to CORS
    }
  }
  return cssText;
}

export function getHTML(view: EditorView, from: number, to: number) {
  const range = document.createRange();

  const fromInfo = view.domAtPos(from);
  const toInfo = view.domAtPos(to);

  range.setStart(fromInfo.node, fromInfo.offset);
  range.setEnd(toInfo.node, toInfo.offset);

  const fragment = range.cloneContents();

  const wrapper = document.createElement('div');
  wrapper.setAttribute('style', 'font-family: monospace;');
  wrapper.appendChild(fragment);

  wrapper.querySelectorAll<HTMLElement>('[class]').forEach((el) => {
    const classNames = el.className.split(/\s+/).filter(Boolean);
    let styleText = el.getAttribute('style') || '';
    for (const cls of classNames) {
      styleText += getCSSStyleForClass(cls);
    }
    if (styleText) {
      el.setAttribute('style', styleText);
    }
    el.removeAttribute('class');
  });

  return `<div style="font-family: monospace;">${wrapper.innerHTML}</div>`;
}

export const richClipboardCopier = EditorView.domEventHandlers({
  copy: (event, view) => {
    event.preventDefault();

    const { from, to } = view.state.selection.main;
    const selectedText = view.state.doc.sliceString(from, to);

    if (!selectedText) {
      return;
    }

    const richHtml = getHTML(view, from, to);

    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', selectedText);
      event.clipboardData.setData('text/html', richHtml);
    }
  },
});
