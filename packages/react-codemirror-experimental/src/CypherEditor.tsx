import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import CodeEditor, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from '@uiw/react-codemirror';
import React from 'react';
import { cypher } from './lang-cypher/lang-cypher';
import { basicNeo4jSetup } from './neo4j-setup';
import { replMode } from './repl-mode';
import { getThemeExtension } from './themes';

type CypherEditorOwnProps = {
  prompt?: string;
  extraKeybindings?: KeyBinding[];
  onExecute?: (cmd: string) => void;
  initialHistory?: string[];
  onNewHistoryEntry?: (historyEntry: string) => void;
  lineWrap?: boolean;
};

export type CypherEditorProps = CypherEditorOwnProps &
  ReactCodeMirrorProps &
  React.RefAttributes<ReactCodeMirrorRef>;
type CypherEditor = React.ForwardRefExoticComponent<CypherEditorProps>;
export const CypherEditor: CypherEditor = React.forwardRef((props, ref) => {
  const {
    theme = 'light',
    extensions = [],
    prompt,
    onExecute,
    initialHistory = [],
    onNewHistoryEntry,
    extraKeybindings = [],
    lineWrap = false,
    ...rest
  } = props;

  const maybeReplMode = onExecute
    ? replMode({
        onExecute,
        initialHistory,
        onNewHistoryEntry,
      })
    : [];

  return (
    <CodeEditor
      ref={ref}
      theme={getThemeExtension(theme)}
      extensions={[
        cypher(),
        keymap.of(extraKeybindings),
        maybeReplMode,
        basicNeo4jSetup(prompt),
        lineWrap ? EditorView.lineWrapping : [],
        ...extensions,
      ]}
      basicSetup={false}
      {...rest}
    />
  );
});