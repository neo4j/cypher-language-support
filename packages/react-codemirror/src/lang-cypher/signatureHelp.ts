import type { EditorState } from '@codemirror/state';
import { StateField } from '@codemirror/state';
import type { Tooltip } from '@codemirror/view';
import { showTooltip } from '@codemirror/view';
import type { SignatureInformation } from 'vscode-languageserver-types';
import { MarkupContent } from 'vscode-languageserver-types';
import type { CypherConfig } from './langCypher';
import { getDocString } from './utils';
import {
  type TooltipCypherHighlighter,
  tooltipCypherHighlighter,
} from './tooltipHighlighting.js';

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

const createSignatureHelpElement =
  ({
    signature,
    activeParameter,
    highlighter,
  }: {
    signature: SignatureInformation;
    activeParameter: number;
    highlighter: TooltipCypherHighlighter;
  }) =>
  () => {
    const parameters = signature.parameters;
    const doc = getDocString(signature.documentation);
    const dom = document.createElement('div');
    dom.className = 'cm-signature-help-panel';

    const contents = document.createElement('div');
    contents.className = 'cm-signature-help-panel-contents';
    dom.appendChild(contents);

    const signatureLabel = document.createElement('div');
    signatureLabel.className = 'cm-signature-help-panel-name';
    const returnType = signature.label.slice(signature.label.indexOf(')') + 1);

    highlighter(signature.label, 'procedure', signatureLabel, activeParameter);
    signatureLabel.appendChild(document.createTextNode(returnType));

    contents.appendChild(signatureLabel);

    const separator = document.createElement('div');
    separator.className = 'cm-signature-help-panel-separator';

    contents.appendChild(separator);
    const currentParamDoc = parameters.find(
      (_, index) => index === activeParameter,
    )?.documentation;
    const currentParamDescription = MarkupContent.is(currentParamDoc)
      ? currentParamDoc.value
      : currentParamDoc;

    if (currentParamDescription !== undefined) {
      const argDescription = document.createElement('div');
      argDescription.className = 'cm-signature-help-panel-arg-description';
      argDescription.appendChild(
        document.createTextNode(currentParamDescription),
      );
      contents.appendChild(argDescription);
    }
    const methodDescription = document.createElement('div');
    methodDescription.className = 'cm-signature-help-panel-description';
    methodDescription.appendChild(document.createTextNode(doc));
    contents.appendChild(methodDescription);

    return { dom };
  };

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
      const signatureHelpInfo = config.languageService.getSignatureHelp(
        query,
        schema,
        { caretPosition },
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
        const showSignatureTooltipBelow =
          config.showSignatureTooltipBelow ?? true;

        const highlighter = tooltipCypherHighlighter(state, config);
        result = [
          {
            pos: caretPosition,
            above: !showSignatureTooltipBelow,
            arrow: true,
            create: createSignatureHelpElement({
              signature,
              activeParameter,
              highlighter,
            }),
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
