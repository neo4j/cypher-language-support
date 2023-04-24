import { useState } from 'react';
import { Editor } from './language/Editor';
import { TokenTable } from './language/TokenTable';
import './style.css';

export function App() {
  const [value, setValue] = useState('abc');

  return (
    <div className="App">
      <h1>Editor</h1>
      <div style={{ display: 'flex' }}>
        <Editor value={value} setValue={setValue} />
        <TokenTable document={value} />
      </div>
    </div>
  );
}
