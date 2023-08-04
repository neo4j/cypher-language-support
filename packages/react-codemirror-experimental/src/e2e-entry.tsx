import { createRoot } from 'react-dom/client';
import { CypherEditor, CypherEditorProps } from './CypherEditor';

declare global {
  interface Window {
    renderCodemirror: (props: CypherEditorProps) => void;
  }
}

window.renderCodemirror = (props: CypherEditorProps) =>
  createRoot(document.getElementById('root')).render(
    <CypherEditor {...props} />,
  );
