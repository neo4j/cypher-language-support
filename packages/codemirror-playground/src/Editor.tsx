import CodeEditor, { basicSetup } from '@uiw/react-codemirror';
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
      extensions={[basicSetup(), cypher()]}
      onChange={handleOnChange}
      indentWithTab={true}
    />
  );
}
