import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver-types';

import {
  CharStreams,
  CommonToken,
  CommonTokenStream,
  ErrorListener as ANTLRErrorListener,
  Recognizer,
  Token,
} from 'antlr4';

import CypherLexer from '../generated-parser/CypherLexer';

import CypherParser from '../generated-parser/CypherParser';

export class ErrorListener implements ANTLRErrorListener<CommonToken> {
  diagnostics: Diagnostic[];

  constructor() {
    this.diagnostics = [];
  }

  public syntaxError<T extends Token>(
    _recognizer: Recognizer<T>,
    offendingSymbol: T | undefined,
    _line: number,
    _charPositionInLine: number,
    msg: string,
  ): void {
    const lineIndex = (offendingSymbol?.line ?? 1) - 1;
    const start = offendingSymbol?.start ?? 0;
    const end = (offendingSymbol?.stop ?? 0) + 1;

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
  parser.removeErrorListeners();
  const errorListener = new ErrorListener();
  parser.addErrorListener(errorListener);
  parser.statements();

  return errorListener.diagnostics;
}
