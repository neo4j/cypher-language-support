import { createRoot } from 'react-dom/client';
import { CypherEditor, CypherEditorProps } from './CypherEditor';

declare global {
  interface Window {
    renderCodemirror: (props: CypherEditorProps) => void;
  }
}

/**
 * Ideally we'd just mount the component directly in playwright
 * without having to create a an extra entry point like this
 * but the component testing is still in experimental phase
 * and I didn't get it to work
 *
 * We can't serlize the onExecute function to the browser so
 * we use this dummy function to know if it ran
 */
window.renderCodemirror = (props: CypherEditorProps) =>
  createRoot(document.getElementById('root')).render(
    <CypherEditor
      {...props}
      onExecute={() => {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode('query-executed'));
        document.getElementById('queryExecuted').appendChild(div);
      }}
    />,
  );
