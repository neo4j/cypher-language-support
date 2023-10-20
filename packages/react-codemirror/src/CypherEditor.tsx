import {
  Annotation,
  Compartment,
  EditorState,
  Extension,
} from '@codemirror/state';
import { EditorView, KeyBinding, keymap, ViewUpdate } from '@codemirror/view';
import type { DbSchema } from '@neo4j-cypher/language-support';
import React from 'react';
import { cypher, CypherConfig } from './lang-cypher/lang-cypher';
import { basicNeo4jSetup } from './neo4j-setup';
import { replMode } from './repl-mode';
import { getThemeExtension } from './themes';

// TODO Exportera så man kan sätta ihop den själv om man vill ha annorlunda
export interface CypherEditorProps {
  prompt?: string;
  extraKeybindings?: KeyBinding[];
  onExecute?: (cmd: string) => void;
  initialHistory?: string[];
  onNewHistoryEntry?: (historyEntry: string) => void;
  overrideThemeBackgroundColor?: boolean;
  autofocus?: boolean;
  lineWrap?: boolean;
  lint?: boolean;
  readOnly?: boolean;
  schema?: DbSchema;
  value?: string;
  className?: string;
  /**
   * `light` / `dark` / `Extension` Defaults to `light`.
   * @default light
   */
  theme?: 'light' | 'dark' | Extension;
  onChange?(value: string, viewUpdate: ViewUpdate): void;
}

// TODO read only
// TODO line wrap

/*
testa mera
  extraKeybindings?: KeyBinding[];
*/

const themeCompartment = new Compartment();
const keyBindingCompartment = new Compartment();

const ExternalEdit = Annotation.define<boolean>();
export class CypherEditor extends React.Component<CypherEditorProps> {
  editorContainer: React.RefObject<HTMLDivElement> = React.createRef();
  editorState: React.MutableRefObject<EditorState> = React.createRef();
  editorView: React.MutableRefObject<EditorView> = React.createRef();
  schemaRef: React.MutableRefObject<CypherConfig> = React.createRef();

  componentDidMount(): void {
    const {
      theme = 'light',
      prompt,
      onExecute,
      initialHistory = [],
      onNewHistoryEntry,
      extraKeybindings = [],
      lineWrap = false,
      overrideThemeBackgroundColor = false,
      schema = {},
      lint = true,
      onChange,
    } = this.props;

    this.schemaRef.current = { schema, lint };

    const maybeReplMode = onExecute
      ? replMode({
          onExecute,
          initialHistory,
          onNewHistoryEntry,
        })
      : [];

    const themeExtension = getThemeExtension(
      theme,
      overrideThemeBackgroundColor,
    );

    const changeListener = onChange
      ? [
          EditorView.updateListener.of((upt: ViewUpdate) => {
            const wasUserEdit = !upt.transactions.some((tr) =>
              tr.annotation(ExternalEdit),
            );

            if (upt.docChanged && wasUserEdit) {
              const doc = upt.state.doc;
              const value = doc.toString();
              onChange(value, upt);
            }
          }),
        ]
      : [];

    this.editorState.current = EditorState.create({
      extensions: [
        maybeReplMode,
        basicNeo4jSetup(prompt),
        themeCompartment.of(themeExtension),
        changeListener,
        cypher(this.schemaRef.current),
        keyBindingCompartment.of(keymap.of(extraKeybindings)),
        lineWrap ? EditorView.lineWrapping : [],
      ],
      doc: this.props.value,
    });

    this.editorView.current = new EditorView({
      state: this.editorState.current,
      parent: this.editorContainer.current,
    });

    if (this.props.autofocus) {
      this.editorView.current.focus();
    }
  }

  componentDidUpdate(prevProps: CypherEditorProps): void {
    // TODO default extensions
    // look at which props should be reactive here.

    if (!this.editorView.current) {
      return;
    }

    // Handle externally set value
    const currentCmValue = this.editorView.current.state?.doc.toString() ?? '';

    if (this.props.value !== undefined && currentCmValue !== this.props.value) {
      this.editorView.current.dispatch({
        changes: {
          from: 0,
          to: currentCmValue.length,
          insert: this.props.value ?? '',
        },
        annotations: [ExternalEdit.of(true)],
      });
    }

    // Handle theme change
    const didChangeTheme =
      prevProps.theme !== this.props.theme ||
      prevProps.overrideThemeBackgroundColor !==
        this.props.overrideThemeBackgroundColor;

    if (didChangeTheme) {
      this.editorView.current.dispatch({
        effects: themeCompartment.reconfigure(
          getThemeExtension(
            this.props.theme,
            this.props.overrideThemeBackgroundColor,
          ),
        ),
      });
    }

    if (prevProps.extraKeybindings !== this.props.extraKeybindings) {
      this.editorView.current.dispatch({
        effects: keyBindingCompartment.reconfigure(
          keymap.of(this.props.extraKeybindings),
        ),
      });
    }

    /*
    The cypher configuration is a mutable object that is passed to the cypher language extension.
    Much like how the schema based completions work in the official sql language extension.
    https://github.com/codemirror/lang-sql/blob/4b7b2564dff7cdb1a15f8ccd08142f2cc8a0006f/src/sql.ts#L178C17-L178C18
    */
    this.schemaRef.current.schema = this.props.schema;
    this.schemaRef.current.lint = this.props.lint;
  }

  componentWillUnmount(): void {
    this.editorView.current?.destroy();
  }

  render(): React.ReactNode {
    const { className, theme } = this.props;

    const themeClass =
      typeof theme === 'string' ? `cm-theme-${theme}` : 'cm-theme';

    return (
      <div
        ref={this.editorContainer}
        className={`${themeClass}${className ? ` ${className}` : ''}`}
      />
    );
  }
}
