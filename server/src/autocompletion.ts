import {
  CompletionItemKind,
  Position,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { Range } from 'vscode-languageserver-types';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CodeCompletionCore } from 'antlr4-c3';

import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { CypherLexer } from './antlr/CypherLexer';

import {
  CypherParser,
  OC_LabelNameContext,
  OC_ProcedureNameContext,
} from './antlr/CypherParser';

import { CypherListener } from './antlr/CypherListener';

import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';
import { DbInfo } from './dbInfo';

class LabelDectector implements CypherListener {
  parsedLabels: string[] = [];

  exitOC_LabelName(ctx: OC_LabelNameContext) {
    this.parsedLabels.push(ctx.text);
  }
}

class CallProcedureDetector implements CypherListener {
  parsedProcedureNames: string[] = [];

  exitOC_ProcedureName(ctx: OC_ProcedureNameContext) {
    this.parsedProcedureNames.push(ctx.text);
  }
}

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doAutoCompletion(
  documents: TextDocuments<TextDocument>,
  dbInfo: DbInfo,
) {
  return (textDocumentPosition: TextDocumentPositionParams) => {
    const d = documents.get(textDocumentPosition.textDocument.uri);
    const position: Position = textDocumentPosition.position;
    const range: Range = {
      // TODO Nacho: We are parsing from the begining of the file.
      // Do we need to parse from the begining of the current query?
      start: Position.create(0, 0),
      end: position,
    };
    const wholeFileText: string = d?.getText(range).trim() ?? '';
    const inputStream = CharStreams.fromString(wholeFileText);
    const lexer = new CypherLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const wholeFileParser = new CypherParser(tokenStream);

    const labelDetector = new LabelDectector();
    const procedureNameDetector = new CallProcedureDetector();
    wholeFileParser.addParseListener(labelDetector as ParseTreeListener);
    wholeFileParser.addParseListener(
      procedureNameDetector as ParseTreeListener,
    );
    const tree = wholeFileParser.oC_Cypher();

    // If we are parsing a label, offer labels from the database as autocompletion
    const parsedLabels = labelDetector.parsedLabels;
    const lastParsedLabel = parsedLabels?.at(parsedLabels.length - 1);
    const parsedProcedureNames = procedureNameDetector.parsedProcedureNames;
    const lastParsedProcedureName = parsedProcedureNames?.at(
      parsedProcedureNames.length - 1,
    );

    if (lastParsedLabel && tree.stop?.text == lastParsedLabel) {
      return dbInfo.labels.map((t) => {
        return {
          label: t,
          kind: CompletionItemKind.Keyword,
        };
      });
    } else if (
      lastParsedProcedureName &&
      tree.stop?.text == lastParsedProcedureName
    ) {
      return Array.from(dbInfo.procedureSignatures.keys()).map((t) => {
        return {
          label: t,
          kind: CompletionItemKind.Function,
        };
      });
    } else {
      // If we are not completing a label of a procedure name,
      // we need to use the antlr completion

      const codeCompletion = new CodeCompletionCore(wholeFileParser);
      const caretIndex = tokenStream.size - 2;

      if (caretIndex >= 0) {
        // TODO Can this be extracted for more performance?
        const allPosibleTokens = new Map();
        wholeFileParser.getTokenTypeMap().forEach(function (value, key, map) {
          allPosibleTokens.set(map.get(key), key);
        });
        const candidates = codeCompletion.collectCandidates(
          caretIndex as number,
        );
        const tokens = candidates.tokens.keys();
        const tokenCandidates = Array.from(tokens).map((t) =>
          allPosibleTokens.get(t),
        );

        return tokenCandidates.map((t) => {
          return {
            label: t,
            kind: CompletionItemKind.Keyword,
          };
        });
      } else {
        return [];
      }
    }
  };
}
