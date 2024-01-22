import { EditorState, StateField } from '@codemirror/state';
import { showTooltip, Tooltip } from '@codemirror/view';
import { signatureHelp } from '@neo4j-cypher/language-support';
import { CypherConfig } from './lang-cypher';

function getTriggerCharacter(query: string, offset: number) {
  let i = offset - 1;
  let triggerCharacter = query.at(i);

  // Discard all space characters. Note that a space can be more than just a ' '
  while (/\s/.test(triggerCharacter) && i > 0) {
    i -= 1;
    triggerCharacter = query.at(i);
  }

  return triggerCharacter;
}

function getSignatureHelpTooltip(
  state: EditorState,
  config: CypherConfig,
): Tooltip[] {
  let result: Tooltip[] = [];
  const schema = config.schema;
  const ranges = state.selection.ranges;
  const range = ranges.at(0);

  if (schema && ranges.length === 1 && range.from === range.to) {
    const offset = range.from;
    const query = state.doc.toString();

    const triggerCharacter = getTriggerCharacter(query, offset);

    if (triggerCharacter === '(' || triggerCharacter === ',') {
      const queryUntilPosition = query.slice(0, offset);

      const signatureHelpInfo = signatureHelp(
        queryUntilPosition,
        schema,
        offset,
      );
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
            pos: offset,
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
              div.className = 'cm-tooltip-signature-help';

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
