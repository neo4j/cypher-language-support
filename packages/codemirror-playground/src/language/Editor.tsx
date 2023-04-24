import CodeEditor from '@uiw/react-codemirror';
import { useCallback } from 'react';
import { ayuLight } from 'thememirror';
import { cypher } from '../lang-cypher/lang-cypher';

interface Props {
  value: string;
  setValue(value: string): void;
}

export function Editor({ value, setValue }: Props) {
  const handleOnChange = useCallback((value: string) => setValue(value), []);

  return (
    <CodeEditor
      value={value}
      extensions={[cypher, ayuLight]}
      onChange={handleOnChange}
      style={{ width: '500px', marginRight: '20px' }}
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
