import { CandidateRule, CodeCompletionCore } from 'antlr4-c3';
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

  // For tokens that consist of generic user input (variables/functions, etc as opposed to keywords, symbols etc.)
  // we don't want to suggest the names of the tokens themselves as completions
  // instead we want to build suggestions from what we know of the database/query so far.
  // For some rules we've not implemented the proper suggestions yet, but having them in
  // the preferredRules list early is still useful as it prevents the basic
  // token completions such as STRING_LITERAL1 from being suggested in the meantime
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

  const ruleCompletions = Array.from(candidates.rules.entries())
    .flatMap((candidate): CompletionItem[] => {
      const [ruleNumber, candidateRule] = candidate;

      if (
        ruleNumber === CypherParser.RULE_unescapedSymbolicNameString ||
        ruleNumber === CypherParser.RULE_symbolicLabelNameString
      ) {
        const completingUserInputInExpression = candidateRule.ruleList.includes(
          CypherParser.RULE_expression2,
        );
        if (completingUserInputInExpression) {
          return completeInExpression(candidateRule, dbInfo);
        }

        if (candidateRule.ruleList.includes(CypherParser.RULE_procedureName)) {
          return proceduresCompletions(dbInfo);
        }

        if (candidateRule.ruleList.includes(CypherParser.RULE_functionName)) {
          return proceduresCompletions(dbInfo);
        }

        if (
          candidateRule.ruleList.includes(CypherParser.RULE_relationshipPattern)
        ) {
          return reltypeCompletions(dbInfo);
        }

        if (candidateRule.ruleList.includes(CypherParser.RULE_nodePattern)) {
          return labelCompletions(dbInfo);
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

function completeInExpression(candidateRule: CandidateRule, dbInfo: DbInfo) {
  const expressionCompletions: CompletionItem[] = [
    // all symbolic name strings in an expression can be a function (?)
    // TODO check so that there is no symbolic name string in a place such that
    // it cannot be a function invocation
    // TODO check that completion result starts from right position (including . and such)
    ...functionCompletions(dbInfo),
  ];

  // nodes, reltypes or both
  const partOfLabelPattern = candidateRule.ruleList.includes(
    CypherParser.RULE_nodePattern,
  );
  const partOfReltypepattern = candidateRule.ruleList.includes(
    CypherParser.RULE_relationshipPattern,
  );
  const partOfNonSpecific = candidateRule.ruleList.includes(
    CypherParser.RULE_labelExpression,
  );

  if (partOfLabelPattern) {
    expressionCompletions.push(...labelCompletions(dbInfo));
  } else if (partOfReltypepattern) {
    expressionCompletions.push(...reltypeCompletions(dbInfo));
  } else if (partOfNonSpecific) {
    expressionCompletions.push(
      ...reltypeCompletions(dbInfo),
      ...labelCompletions(dbInfo),
    );
  }

  return expressionCompletions;
}
