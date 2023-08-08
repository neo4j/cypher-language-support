import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import CodeEditor, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from '@uiw/react-codemirror';
import React, { useEffect, useRef } from 'react';
import { DbInfo } from '../../language-support/src/dbInfo';
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
  schema?: DbInfo;
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
    schema,
    ...rest
  } = props;

  const maybeReplMode = onExecute
    ? replMode({
        onExecute,
        initialHistory,
        onNewHistoryEntry,
      })
    : [];

  const cmRef = useRef<ReactCodeMirrorRef>(null);
  useEffect(() => {
    /*cmRef?.current?.view?.dispatch({
      effects: updateSchema.of(schema),
    });*/
  }, [schema]);

  return (
    <CodeEditor
      ref={(r) => {
        cmRef.current = r;
        if (ref) {
          if (typeof ref === 'function') {
            ref(r);
          } else {
            ref.current = r;
          }
        }
      }}
      theme={getThemeExtension(theme)}
      extensions={[
        // schemaState.init(() => schema),
        cypher(schema),
        keymap.of(extraKeybindings),
        maybeReplMode,
        basicNeo4jSetup(prompt),
        lineWrap ? EditorView.lineWrapping : [],
        ...extensions,
      ]}
      basicSetup={false}
      // we set this via completionKeymap
      indentWithTab={false}
      {...rest}
    />
  );
});
