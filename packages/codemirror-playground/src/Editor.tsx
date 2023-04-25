import CodeEditor from '@uiw/react-codemirror';
import { useCallback } from 'react';
import { cypher } from './lang-cypher/lang-cypher';

type EditorProps = {
  value: string;
  setValue(value: string): void;
};

export function Editor({ value, setValue }: EditorProps) {
  const handleOnChange = useCallback((value: string) => setValue(value), []);

  return (
    <CodeEditor
      value={value}
      extensions={[cypher]}
      onChange={handleOnChange}
      indentWithTab={false}
      basicSetup={{
        foldGutter: false,
        lineNumbers: true,
        highlightActiveLineGutter: true,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
        bracketMatching: false,
        closeBrackets: false,
        autocompletion: false,
        rectangularSelection: false,
        crosshairCursor: false,
        highlightActiveLine: true,
        highlightSelectionMatches: false,
        closeBracketsKeymap: false,
        searchKeymap: false,
        foldKeymap: false,
        completionKeymap: false,
        lintKeymap: false,
      }}
    />
  );
}
