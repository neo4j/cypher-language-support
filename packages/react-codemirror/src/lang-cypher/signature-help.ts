import { EditorState, StateField } from '@codemirror/state';
import { showTooltip, Tooltip } from '@codemirror/view';
import {
  CallClauseContext,
  findParent,
  FunctionInvocationContext,
  ParserRuleContext,
  parserWrapper,
  signatureHelp,
  StatementsContext,
} from '@neo4j-cypher/language-support';
import { CypherConfig } from './lang-cypher';

function isMethodNameOrExpressionName(parent: ParserRuleContext) {
  return (
    parent instanceof FunctionInvocationContext ||
    parent instanceof CallClauseContext ||
    parent instanceof StatementsContext
  );
}

function isMethodName(parent: ParserRuleContext) {
  return (
    parent instanceof FunctionInvocationContext ||
    parent instanceof CallClauseContext
  );
}

function getSignatureHelpTooltip(
  state: EditorState,
  config: CypherConfig,
): Tooltip[] {
  let result: Tooltip[] = [];
  const schema = config.schema;

  const tokens = parserWrapper.parsingResult.tokens.filter(
    (token) => token.channel == 0,
  );
  const lastToken = tokens.at(-2);
  const prevToken = tokens.at(-3);

  if (schema && lastToken) {
    const pos = state.selection.main.head;
    const tree = parserWrapper.parsingResult;
    const isOpenBracket = lastToken.text === '(';
    const isPairOfBrackets =
      prevToken !== undefined &&
      prevToken.text === '(' &&
      lastToken.text === ')';
    const isSeparator = lastToken.text === ',';

    if (
      (isOpenBracket || isPairOfBrackets || isSeparator) &&
      tree &&
      findParent(tree.stopNode, (parent) =>
        isOpenBracket
          ? isMethodNameOrExpressionName(parent)
          : isMethodName(parent),
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
