import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver-types';

import {
  ANTLRErrorListener,
  CharStreams,
  CommonToken,
  CommonTokenStream,
  Recognizer,
  Token,
} from 'antlr4ts';

import { CypherLexer } from '../generated-parser/CypherLexer';

import { ATNSimulator } from 'antlr4ts/atn/ATNSimulator';
import { CypherParser } from '../generated-parser/CypherParser';

export class ErrorListener implements ANTLRErrorListener<CommonToken> {
  diagnostics: Diagnostic[];

  constructor() {
    this.diagnostics = [];
  }

  public syntaxError<T extends Token>(
    recognizer: Recognizer<T, ATNSimulator>,
    offendingSymbol: T | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
  ): void {
    const lineIndex = (offendingSymbol?.line ?? 1) - 1;
    const start = offendingSymbol?.startIndex ?? 0;
    const end = (offendingSymbol?.stopIndex ?? 0) + 1;

    const diagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Warning,
      range: {
        start: Position.create(lineIndex, start),
        end: Position.create(lineIndex, end),
      },
      message: msg,
    };
    this.diagnostics.push(diagnostic);
  }
}

export function validateSyntax(wholeFileText: string): Diagnostic[] {
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);

  const parser = new CypherParser(tokenStream);
  const errorListener = new ErrorListener();
  parser.addErrorListener(errorListener);
  parser.statements();

  return errorListener.diagnostics;
}
