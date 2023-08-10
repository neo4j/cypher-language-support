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

  // If the previous token is an identifier, we don't count it as "finished" so we move the caret back one token
  // The identfier is finished when the last token is a SPACE or dot etc. etc.
  // this allows us to give completions that replace the current text => for example `RET` <- it's parsed as an identifier
  // The need for this caret movement is outlined in the documentation of antlr4-c3 in the section about caret position
  if (tokens[caretIndex - 1]?.type === CypherLexer.IDENTIFIER) {
    caretIndex--;
  }

  // We need this to ignore the list of tokens from:
  // * unescapedSymbolicNameString, because a lot of keywords are allowed there
  // * escapedSymbolicNameString, to avoid showing ESCAPED_SYMBOLIC_NAME
  // * stringLiteral to avoid getting autocompletions like STRING_LITERAL1, STRING_LITERAL2
  //
  // That way we do not populate tokens that are coming from those rules and those
  // are collected as rule names instead
  codeCompletion.preferredRules = new Set<number>()
    .add(CypherParser.RULE_unescapedSymbolicNameString)
    .add(CypherParser.RULE_escapedSymbolicNameString)
    .add(CypherParser.RULE_stringLiteral)
    .add(CypherParser.RULE_symbolicLabelNameString)
    .add(CypherParser.RULE_symbolicAliasName);

  // Keep only keywords as suggestions
  codeCompletion.ignoredTokens = new Set<number>(
    Object.entries(lexerSymbols)
      .filter(([, type]) => type !== CypherTokenType.keyword)
      .map(([token]) => Number(token)),
  );

  codeCompletion.ignoredTokens.add(CypherParser.EOF);

  const candidates = codeCompletion.collectCandidates(caretIndex);

  const labelCompletions = dbInfo.labels.map((labelName) => ({
    label: labelName,
    kind: CompletionItemKind.TypeParameter,
  }));
  const reltypeCompletions = dbInfo.relationshipTypes.map((relType) => ({
    label: relType,
    kind: CompletionItemKind.TypeParameter,
  }));
  const proceduresCompletions = Array.from(
    dbInfo.procedureSignatures.keys(),
  ).map((procedureName) => ({
    label: procedureName,
    kind: CompletionItemKind.Function,
  }));

  const ruleCompletions = Array.from(candidates.rules.entries())
    .flatMap((candidate): CompletionItem[] => {
      const [ruleNumber, candidateRule] = candidate;
      if (
        ruleNumber === CypherParser.RULE_unescapedSymbolicNameString ||
        ruleNumber === CypherParser.RULE_symbolicLabelNameString
      ) {
        if (candidateRule.ruleList.includes(CypherParser.RULE_procedureName)) {
          return proceduresCompletions;
        }

        if (candidateRule.ruleList.includes(CypherParser.RULE_functionName)) {
          return proceduresCompletions;
        }

        if (
          candidateRule.ruleList.includes(CypherParser.RULE_relationshipPattern)
        ) {
          return reltypeCompletions;
        }

        if (candidateRule.ruleList.includes(CypherParser.RULE_nodePattern)) {
          return labelCompletions;
        }

        if (
          candidateRule.ruleList.includes(CypherParser.RULE_labelExpression)
        ) {
          return reltypeCompletions.concat(labelCompletions);
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
