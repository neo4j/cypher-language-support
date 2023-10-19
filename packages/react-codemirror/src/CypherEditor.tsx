import {
  Annotation,
  Compartment,
  EditorState,
  Extension,
} from '@codemirror/state';
import { EditorView, KeyBinding, keymap, ViewUpdate } from '@codemirror/view';
import type { DbSchema } from '@neo4j-cypher/language-support';
import React from 'react';
import { cypher } from './lang-cypher/lang-cypher';
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
  style?: React.CSSProperties;
  /**
   * `light` / `dark` / `Extension` Defaults to `light`.
   * @default light
   */
  theme?: 'light' | 'dark' | 'none' | Extension;
  onChange?(value: string, viewUpdate: ViewUpdate): void;
  /**
   * Extension values can be [provided](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions) when creating a state to attach various kinds of configuration and behavior information.
   * They can either be built-in extension-providing objects,
   * such as [state fields](https://codemirror.net/6/docs/ref/#state.StateField) or [facet providers](https://codemirror.net/6/docs/ref/#state.Facet.of),
   * or objects with an extension in its `extension` property. Extensions can be nested in arrays arbitrarily deep—they will be flattened when processed.
   */
  extensions?: Extension[];
}

const themeCompartment = new Compartment();

const ExternalEdit = Annotation.define<boolean>();
export class CypherEditor extends React.Component<CypherEditorProps> {
  editorContainer: React.RefObject<HTMLDivElement> = React.createRef();
  editorState: React.MutableRefObject<EditorState> = React.createRef();
  editorView: React.MutableRefObject<EditorView> = React.createRef();

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
        basicNeo4jSetup(prompt),
        themeCompartment.of(themeExtension),
        changeListener,
        cypher({ lint: lint, schema: schema }),
        keymap.of(extraKeybindings),
        maybeReplMode,
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

    // TODO dispatch new db schema when it changes

    // TODO default extensions
  }

  componentDidUpdate(prevProps: CypherEditorProps): void {
    // look at which props should be reactive here.
    // hahdle theme
    // theme compartment?

    if (!this.editorView.current) {
      return;
    }

    // Handle externally set value
    const currentCmValue = this.editorView.current.state?.doc.toString() ?? '';

    if (currentCmValue !== this.props.value) {
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
