import { CompletionSource } from '@codemirror/autocomplete';
import { StateEffect, StateField } from '@codemirror/state';
import { autocomplete, DbInfo } from 'language-support';
import { CompletionItemKind } from 'vscode-languageserver-types';

// From codemirror docs, the base built in icons in autocomplete list are:
type CodemirrorBuiltinIcons =
  | `class`
  | `constant`
  | `enum`
  | `function`
  | `interface`
  | `keyword`
  | `method`
  | `namespace`
  | `property`
  | `text`
  | `type`
  | `variable`;

const completionKindToCodemirrorIcon = (c: CompletionItemKind) => {
  const map: Partial<Record<CompletionItemKind, CodemirrorBuiltinIcons>> = {
    [CompletionItemKind.Constant]: 'constant',
    [CompletionItemKind.Function]: 'function',
    [CompletionItemKind.Keyword]: 'keyword',
    [CompletionItemKind.Method]: 'method',
    [CompletionItemKind.Property]: 'property',
    [CompletionItemKind.Text]: 'text',
    [CompletionItemKind.TypeParameter]: 'type',
    [CompletionItemKind.Variable]: 'variable',
  };

  return map[c] ?? 'text';
};

// @uiw/react-codemirror reconfigures/restarts the extension every time they mount
// Our Schema state is stateful, so it's "init" code doesn't re-run when reconfigured
// I've fond an example in the codemirror repo on how a state field can update itself when reconfigured
// https://github.com/codemirror/language/blob/432b09a68c2ea72c35b8c7e9e8b41cc92eaa5fe5/src/language.ts#L521C7-L521C20

export class SchemaState {
  static emptySchema: DbInfo = {
    functionSignatures: {},
    labels: [],
    procedureSignatures: {},
    relationshipTypes: [],
  };

  constructor(public dbInfo: DbInfo = SchemaState.emptySchema) {}

  updateSchema(dbInfo: DbInfo) {
    this.dbInfo = dbInfo;
  }
}

export const schemaState = StateField.define<SchemaState>({
  create() {
    return new SchemaState();
  },

  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(updateSchema)) {
        value.updateSchema(effect.value);
        return value;
      }
    }

    if (tr.reconfigured) {
      const schema = tr.state.facet(language);
      if (schema) {
        value.updateSchema(schema.dbInfo);
      }
    }
    return value;
  },
});

/// The facet used to associate a language with an editor state. Used
/// by `Language` object's `extension` property (so you don't need to
/// manually wrap your languages in this). Can be used to access the
/// current language on a state.
export const language = Facet.define<Language, Language | null>({
  combine(languages) {
    return languages.length ? languages[0] : null;
  },
  enables: (language) => [
    Language.state,
    parseWorker,
    EditorView.contentAttributes.compute([language], (state) => {
      const lang = state.facet(language);
      return lang && lang.name ? { 'data-language': lang.name } : ({} as {});
    }),
  ],
});

export const updateSchema = StateEffect.define<DbInfo>();

export const cypherAutocomplete: CompletionSource = (context) => {
  const textUntilCursor = context.state.doc.toString().slice(0, context.pos);
  const schema = context.state.field<SchemaState>(schemaState, false);

  const options = autocomplete(
    textUntilCursor,
    schema.dbInfo ?? SchemaState.emptySchema,
  );

  return {
    from: context.matchBefore(/\w*$/).from,
    options: options.map((o) => ({
      label: o.label,
      type: completionKindToCodemirrorIcon(o.kind),
    })),
  };
};
