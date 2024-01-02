import { syntaxTree } from '@codemirror/language';
import { EditorState, StateField } from '@codemirror/state';
import { showTooltip, Tooltip } from '@codemirror/view';
import {
  CallClauseContext,
  findParent,
  FunctionInvocationContext,
  parserWrapper,
  signatureHelp,
} from '@neo4j-cypher/language-support';
import { CypherConfig } from './lang-cypher';

function getSignatureHelpTooltip(
  state: EditorState,
  config: CypherConfig,
): Tooltip[] {
  let result: Tooltip[] = [];
  const schema = config.schema;

  if (schema) {
    const pos = state.selection.main.head;
    const symbol = syntaxTree(state).resolveInner(pos, -1);
    const tree = parserWrapper.parsingResult;

    if (
      (symbol.name === 'bracket' || symbol.name === 'separator') &&
      tree &&
      findParent(
        tree.stopNode,
        (parent) =>
          parent instanceof FunctionInvocationContext ||
          parent instanceof CallClauseContext,
      )
    ) {
      const query = state.doc.toString();
      const signatureHelpInfo = signatureHelp(query, schema);
      const activeSignature = signatureHelpInfo.activeSignature;
      const signatures = signatureHelpInfo.signatures;
      const activeParameter = signatureHelpInfo.activeParameter;

      if (
        activeSignature !== undefined &&
        activeSignature >= 0 &&
        activeSignature < signatures.length &&
        signatures[activeSignature].documentation !== undefined
      ) {
        const signature = signatures[activeSignature];
        const parameters = signature.parameters;
        let doc = signature.documentation.toString();

        if (
          activeParameter >= 0 &&
          activeParameter <
            (signatures[activeSignature].parameters?.length ?? 0)
        ) {
          doc =
            parameters[activeParameter].documentation.toString() + '\n\n' + doc;
        }

        result = [
          {
            pos: pos,
            above: true,
            strictSide: true,
            arrow: true,
            create: () => {
              const div = document.createElement('div');
              const methodName = document.createElement('div');
              const argPlusDescription = document.createElement('div');
              const separator = document.createElement('hr');
              const lineBreak = document.createElement('br');

              div.append(
                ...[methodName, separator, lineBreak, argPlusDescription],
              );
              div.className = 'cm-tooltip-cursor';

              methodName.innerText = signature.label;
              argPlusDescription.innerText = doc;

              return { dom: div };
            },
          },
        ];
      }
    }
  }

  return result;
}

export function signatureHelpTooltip(config: CypherConfig) {
  return StateField.define<readonly Tooltip[]>({
    create: (state) => getSignatureHelpTooltip(state, config),

    update(tooltips, tr) {
      if (!tr.docChanged && !tr.selection) return tooltips;
      return getSignatureHelpTooltip(tr.state, config);
    },

    provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
  });
}
