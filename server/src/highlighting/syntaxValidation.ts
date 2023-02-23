import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver/node';

import {
  ANTLRErrorListener,
  CharStreams,
  CommonToken,
  CommonTokenStream,
  Recognizer,
  Token,
} from 'antlr4ts';

import { CypherLexer } from '../antlr/CypherLexer';

<<<<<<< HEAD:server/src/syntaxValidation.ts
import { ATNSimulator } from 'antlr4ts/atn/ATNSimulator';
import { CypherParser } from './antlr/CypherParser';
=======
import { CypherParser } from '../antlr/CypherParser';
>>>>>>> e3aaa99 (Adds colouring table):server/src/highlighting/syntaxValidation.ts

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

export function doSyntaxValidationText(wholeFileText: string): Diagnostic[] {
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);

  const parser = new CypherParser(tokenStream);
  const errorListener = new ErrorListener();
  parser.addErrorListener(errorListener);
  parser.statements();

  return errorListener.diagnostics;
}
