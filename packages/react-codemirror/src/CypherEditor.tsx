import {
  Annotation,
  Compartment,
  EditorState,
  Extension,
} from '@codemirror/state';
import {
  EditorView,
  KeyBinding,
  keymap,
  lineNumbers,
  ViewUpdate,
} from '@codemirror/view';
import type { DbSchema } from '@neo4j-cypher/language-support';
import { Component, createRef } from 'react';
import { cypher, CypherConfig } from './lang-cypher/lang-cypher';
import { basicNeo4jSetup } from './neo4j-setup';
import { replMode } from './repl-mode';
import { getThemeExtension } from './themes';

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
  schema?: DbSchema;
  value?: string;
  className?: string;
  /**
   * `light` / `dark` / `Extension`
   *  @default light
   */
  theme?: 'light' | 'dark' | Extension;
  onChange?(value: string, viewUpdate: ViewUpdate): void;
}

const themeCompartment = new Compartment();
const keyBindingCompartment = new Compartment();

const ExternalEdit = Annotation.define<boolean>();
export class CypherEditor extends Component<CypherEditorProps> {
  editorContainer: React.RefObject<HTMLDivElement> = createRef();
  editorState: React.MutableRefObject<EditorState> = createRef();
  editorView: React.MutableRefObject<EditorView> = createRef();
  schemaRef: React.MutableRefObject<CypherConfig> = createRef();

  focus() {
    this.editorView.current?.focus();
  }

  updateCursorPosition(position: number) {
    this.editorView.current?.dispatch({
      selection: { anchor: position, head: position },
    });
  }

  setValueAndFocus(value = '') {
    const currentCmValue = this.editorView.current.state?.doc.toString() ?? '';
    this.editorView.current.dispatch({
      changes: {
        from: 0,
        to: currentCmValue.length,
        insert: value,
      },
      selection: { anchor: value.length, head: value.length },
    });
    this.editorView.current?.focus();
  }

  static defaultProps: CypherEditorProps = {
    lint: true,
    schema: {},
    overrideThemeBackgroundColor: false,
    lineWrap: false,
    extraKeybindings: [],
    initialHistory: [],
    theme: 'light',
  };

  componentDidMount(): void {
    const {
      theme,
      onExecute,
      initialHistory,
      onNewHistoryEntry,
      extraKeybindings,
      lineWrap,
      overrideThemeBackgroundColor,
      schema,
      lint,
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
        basicNeo4jSetup(),
        themeCompartment.of(themeExtension),
        changeListener,
        cypher(this.schemaRef.current),
        keyBindingCompartment.of(keymap.of(extraKeybindings)),
        lineWrap ? EditorView.lineWrapping : [],

        lineNumbers({
          formatNumber: (a, state) => {
            if (state.doc.lines === 1 && this.props.prompt !== undefined) {
              return this.props.prompt;
            }

            return a.toString();
          },
        }),
      ],
      doc: this.props.value,
    });

    this.editorView.current = new EditorView({
      state: this.editorState.current,
      parent: this.editorContainer.current,
    });

    if (this.props.autofocus) {
      this.focus();
      if (this.props.value) {
        this.updateCursorPosition(this.props.value.length);
      }
    }
  }

  componentDidUpdate(prevProps: CypherEditorProps): void {
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
