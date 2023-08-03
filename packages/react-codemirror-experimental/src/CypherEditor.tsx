import { Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import CodeEditor, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from '@uiw/react-codemirror';
import React from 'react';
import { cypher } from './lang-cypher/lang-cypher';
import { basicNeo4jSetup } from './neo4j-setup';
import { ayuLightTheme } from './themes';

export const replBindings = (): Extension[] => {
  const keymaps = [keymap.of([{ key: 'up' }])];

  return keymaps;
};
/* 
todo fontLigatures -> off
// some way to do get and store history
// some way to navigate history
  onExecute?: (value: string) => void;

  extra keybindings

  useDb

  kan man ge den focus

  slå på och av word-wrap



  hantera att kunna gå till storskärm

  senare vim keybindings settings
*/

function getThemeExtension(
  theme: 'light' | 'dark' | 'none' | Extension,
): Extension | Extension[] {
  switch (theme) {
    case 'light':
      return ayuLightTheme();
    case 'dark':
      // TODO implement dark theme
      return ayuLightTheme();
    case 'none':
      return [];
    default:
      return theme;
  }
}

type CypherEditorOwnProps = { prompt?: string };
type CypherEditor = React.ForwardRefExoticComponent<
  CypherEditorOwnProps &
    ReactCodeMirrorProps &
    React.RefAttributes<ReactCodeMirrorRef>
>;
export const CypherEditor: CypherEditor = React.forwardRef((props, ref) => {
  const { theme = 'light', extensions = [], ...rest } = props;
  return (
    <CodeEditor
      ref={ref}
      theme={getThemeExtension(theme)}
      extensions={[
        basicNeo4jSetup(props.prompt),
        cypher(),
        replBindings(),
        ...extensions,
      ]}
      basicSetup={false}
      {...rest}
    />
  );
});
