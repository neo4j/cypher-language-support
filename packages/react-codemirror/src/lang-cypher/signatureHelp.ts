import { EditorState, StateField } from '@codemirror/state';
import { showTooltip, Tooltip } from '@codemirror/view';
import { signatureHelp } from '@neo4j-cypher/language-support';
import { CypherConfig } from './langCypher';

function getTriggerCharacter(query: string, caretPosition: number) {
  let i = caretPosition - 1;
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
    const caretPosition = range.from;
    const query = state.doc.toString();

    const triggerCharacter = getTriggerCharacter(query, caretPosition);

    if (triggerCharacter === '(' || triggerCharacter === ',') {
      const signatureHelpInfo = signatureHelp(query, schema, caretPosition);
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
        const doc = signature.documentation.toString();

        result = [
          {
            pos: caretPosition,
            above: true,
            strictSide: true,
            arrow: true,
            create: () => {
              const dom = document.createElement('div');
              // TODO description?
              // todo deprecations
              // todo scroll
              // TODO e2e tests
              /**
               * we want
               * methodName(arg: Type, arg2: Type2)
               * and bolding on the current arg
               *
               * function description on the next line
               * if description is really long, we want to wrap it
               *
               * todo verify we don't get any XSS here
               */

              const signatureLabel = document.createElement('div');
              signatureLabel.style.padding = '5px';
              signatureLabel.appendChild(
                document.createTextNode(`${signature.label}(`),
              );

              parameters.forEach((param, index) => {
                if (typeof param.documentation === 'string') {
                  const span = document.createElement('span');
                  span.appendChild(
                    document.createTextNode(param.documentation),
                  );
                  if (index !== parameters.length - 1) {
                    span.appendChild(document.createTextNode(', '));
                  }

                  if (index === activeParameter) {
                    span.style.fontWeight = 'bold';
                  }
                  signatureLabel.appendChild(span);
                }
              });

              signatureLabel.appendChild(document.createTextNode(')'));

              dom.appendChild(signatureLabel);

              const separator = document.createElement('div');
              separator.style.border = '1px solid #ccc';
              // TODO, do this with class names?

              dom.appendChild(separator);

              const description = document.createElement('div');
              description.style.padding = '5px';
              description.appendChild(document.createTextNode(doc));

              dom.appendChild(description);

              return { dom };
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
