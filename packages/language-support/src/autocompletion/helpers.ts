import { CodeCompletionCore } from 'antlr4-c3';
import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver-types';
import { DbInfo } from '../dbInfo';
import CypherLexer from '../generated-parser/CypherLexer';
import CypherParser from '../generated-parser/CypherParser';
import { CypherTokenType, lexerSymbols, tokenNames } from '../lexerSymbols';
import { ParsingResult } from '../parserWrapper';

const labelCompletions = (dbInfo: DbInfo) =>
  dbInfo.labels.map((labelName) => ({
    label: labelName,
    kind: CompletionItemKind.TypeParameter,
  }));

const reltypeCompletions = (dbInfo: DbInfo) =>
  dbInfo.relationshipTypes.map((relType) => ({
    label: relType,
    kind: CompletionItemKind.TypeParameter,
  }));
const proceduresCompletions = (dbInfo: DbInfo) =>
  Object.keys(dbInfo.procedureSignatures).map((procedureName) => ({
    label: procedureName,
    kind: CompletionItemKind.Function,
  }));
const functionCompletions = (dbInfo: DbInfo) =>
  Object.keys(dbInfo.functionSignatures).map((fnName) => ({
    label: fnName,
    kind: CompletionItemKind.Function,
  }));

export function completionCoreCompletion(
  parsingResult: ParsingResult,
  dbInfo: DbInfo,
): CompletionItem[] {
  const parser = parsingResult.parser;
  const tokens = parsingResult.tokens;

  const codeCompletion = new CodeCompletionCore(parser);

  // We always need to subtract one for the EOF
  // Except if the query is empty and only contains EOF
  let caretIndex = tokens.length > 1 ? tokens.length - 1 : 0;

  const eof = tokens[caretIndex];

  // When we have EOF with a different text in the token, it means the parser has failed to parse it.
  // We give empty completions in that case because the query is severely broken at the
  // point of completion (e.g. an unclosed string)
  if (eof.text !== '<EOF>') {
    return [];
  }

  // If the previous token is an identifier, we don't count it as "finished" so we move the caret back one token
  // The identfier is finished when the last token is a SPACE or dot etc. etc.
  // this allows us to give completions that replace the current text => for example `RET` <- it's parsed as an identifier
  // The need for this caret movement is outlined in the documentation of antlr4-c3 in the section about caret position
  if (tokens[caretIndex - 1]?.type === CypherLexer.IDENTIFIER) {
    caretIndex--;
  }

  codeCompletion.preferredRules = new Set<number>([
    CypherParser.RULE_functionName,
    CypherParser.RULE_procedureName,
    CypherParser.RULE_labelExpression,
    CypherParser.RULE_variable,
  ]);

  // Keep only keywords as suggestions
  codeCompletion.ignoredTokens = new Set<number>(
    Object.entries(lexerSymbols)
      .filter(([, type]) => type !== CypherTokenType.keyword)
      .map(([token]) => Number(token)),
  );

  codeCompletion.ignoredTokens.add(CypherParser.EOF);
  codeCompletion.ignoredTokens.add(CypherLexer.STRING_LITERAL1);
  codeCompletion.ignoredTokens.add(CypherLexer.STRING_LITERAL2);

  const candidates = codeCompletion.collectCandidates(caretIndex);

  const ruleCompletions = Array.from(candidates.rules.entries())
    .flatMap((candidate): CompletionItem[] => {
      const [ruleNumber, candidateRule] = candidate;
      if (ruleNumber === CypherParser.RULE_functionName) {
        return functionCompletions(dbInfo);
      }

      if (ruleNumber === CypherParser.RULE_procedureName) {
        return proceduresCompletions(dbInfo);
      }

      if (ruleNumber === CypherParser.RULE_labelExpression) {
        const parentRuleOfLabelExpr = candidateRule.ruleList.at(-1);
        if (parentRuleOfLabelExpr === CypherParser.RULE_nodePattern) {
          return labelCompletions(dbInfo);
        }

        if (parentRuleOfLabelExpr === CypherParser.RULE_relationshipPattern) {
          return reltypeCompletions(dbInfo);
        }

        if (
          parentRuleOfLabelExpr === CypherParser.RULE_labelExpressionPredicate
        ) {
          return [...labelCompletions(dbInfo), ...reltypeCompletions(dbInfo)];
        }
      }
      return null;
    })
    .filter((r) => r !== null);

  const tokenEntries = candidates.tokens.entries();
  const tokenCandidates = Array.from(tokenEntries).flatMap((value) => {
    const [tokenNumber, followUpList] = value;

    const firstToken = tokenNames[tokenNumber];
    const followUpString = followUpList.indexes
      .map((i) => tokenNames[i])
      .join(' ');

    if (firstToken === undefined) {
      return [];
    } else if (followUpString === '') {
      return [firstToken];
    } else {
      const followUp = firstToken + ' ' + followUpString;
      if (followUpList.optional) {
        return [firstToken, followUp];
      }

      return [followUp];
    }
  });

  const tokenCompletions: CompletionItem[] = tokenCandidates.map((t) => ({
    label: t,
    kind: CompletionItemKind.Keyword,
  }));

  return [...ruleCompletions, ...tokenCompletions];
}
