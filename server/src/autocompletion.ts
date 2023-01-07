import {
  CompletionItemKind,
  Position,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { Range } from 'vscode-languageserver-types';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CodeCompletionCore } from 'antlr4-c3';

import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';

import { CypherLexer } from './antlr/CypherLexer';

import { CypherParser, OC_LabelNameContext } from './antlr/CypherParser';

import { auth, driver, session } from 'neo4j-driver';

import { CypherListener } from './antlr/CypherListener';

import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';

const neo4j = driver(
  'neo4j://localhost',
  // TODO Nacho This is hardcoded
  auth.basic('neo4j', 'pass12345'),
);

let labels: string[] = [];

function updateLabels() {
  const s = neo4j.session({ defaultAccessMode: session.WRITE });
  const tx = s.beginTransaction();
  const resultPromise = tx.run('CALL db.labels()');

  resultPromise.then((result) => {
    labels = result.records.map((record) => record.get('label'));
  });
}

class LabelDectector implements CypherListener {
  parsedLabels: string[] = [];

  exitOC_LabelName(ctx: OC_LabelNameContext) {
    this.parsedLabels.push(ctx.text);
  }
}

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doAutoCompletion(documents: TextDocuments<TextDocument>) {
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
    const inputStream = new ANTLRInputStream(wholeFileText);
    const lexer = new CypherLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const wholeFileParser = new CypherParser(tokenStream);
    updateLabels();

    const labelDetector = new LabelDectector();
    wholeFileParser.addParseListener(labelDetector as ParseTreeListener);
    const tree = wholeFileParser.oC_Cypher();

    // If we are parsing a label, offer labels from the database as autocompletion
    const parsedLabels = labelDetector.parsedLabels;
    let lastParsedLabel: string | undefined;

    if (parsedLabels.length > 0) {
      lastParsedLabel = parsedLabels.at(parsedLabels.length - 1);
    }
    if (lastParsedLabel && tree.stop?.text == lastParsedLabel) {
      return labels.map((t) => {
        return {
          label: t,
          kind: CompletionItemKind.Keyword,
        };
      });
    } else {
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
