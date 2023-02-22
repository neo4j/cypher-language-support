import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
  SemanticTokensBuilder,
  SemanticTokensLegend,
  SemanticTokensParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  ANTLRErrorListener,
  CharStreams,
  CommonToken,
  CommonTokenStream,
  RecognitionException,
  Recognizer,
  Token,
} from 'antlr4ts';

import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';

import { CypherLexer } from './antlr/CypherLexer';

import {
  CallClauseContext,
  CypherParser,
  LabelExpression1Context,
  LiteralContext,
  MatchClauseContext,
  ProcedureNameContext,
  ProcedureResultItemContext,
  PropertyKeyNameContext,
  ReturnClauseContext,
  VariableContext,
  WhereClauseContext,
} from './antlr/CypherParser';

import { CypherParserListener } from './antlr/CypherParserListener';

const tokenTypesMap = new Map<string, number>();
const tokenModifiersMap = new Map<string, number>();

// ************************************************************
// Part of the code that does the highlighting
// ************************************************************
export class Legend implements SemanticTokensLegend {
  tokenTypes: string[] = [];
  tokenModifiers: string[] = [];

  constructor() {
    const tokenTypesLegend = [
      'comment',
      'string',
      'keyword',
      'number',
      'regexp',
      'operator',
      'namespace',
      'type',
      'struct',
      'class',
      'interface',
      'enum',
      'typeParameter',
      'function',
      'method',
      'decorator',
      'macro',
      'variable',
      'parameter',
      'property',
      'label',
    ];
    tokenTypesLegend.forEach((tokenType, index) => {
      this.tokenTypes.push(tokenType);
      tokenTypesMap.set(tokenType, index);
    });

    const tokenModifiersLegend = [
      'declaration',
      'documentation',
      'readonly',
      'static',
      'abstract',
      'deprecated',
      'modification',
      'async',
    ];
    tokenModifiersLegend.forEach((tokenModifier, index) => {
      this.tokenModifiers.push(tokenModifier);
      tokenModifiersMap.set(tokenModifier, index);
    });
  }
}

export interface ParsedToken {
  line: number;
  startCharacter: number;
  length: number;
  tokenType: string;
  token: string | undefined;
}

class SyntaxHighlighter implements CypherParserListener {
  allTokens: ParsedToken[] = [];

  private addToken(
    token: Token,
    tokenType: string,
    tokenStr: string = token.text ?? '',
  ) {
    if (token.startIndex >= 0) {
      this.allTokens.push({
        line: token.line - 1,
        startCharacter: token.charPositionInLine,
        length: tokenStr.length,
        tokenType: tokenType,
        token: tokenStr,
      });
    }
  }
  enterLabelExpression1(ctx: LabelExpression1Context) {
    this.addToken(ctx.start, 'typeParameter');
  }

  enterReturnClause(ctx: ReturnClauseContext) {
    this.addToken(ctx.start, 'keyword');
  }

  exitMatchClause(ctx: MatchClauseContext) {
    const optional = ctx.OPTIONAL();
    const match = ctx.MATCH();

    if (optional) {
      this.addToken(optional.symbol, 'keyword');
    }
    if (match) {
      this.addToken(match.symbol, 'keyword');
    }
  }

  exitCallClause(ctx: CallClauseContext) {
    const call = ctx.CALL();
    const _yield = ctx.YIELD();

    this.addToken(call.symbol, 'method');

    if (_yield) {
      const yieldToken = _yield.symbol;
      this.addToken(yieldToken, 'keyword');
    }
  }

  exitProcedureName(ctx: ProcedureNameContext) {
    this.addToken(ctx.start, 'function', ctx.text);
  }

  enterVariable(ctx: VariableContext) {
    this.addToken(ctx.start, 'variable');
  }

  enterWhereClause(ctx: WhereClauseContext) {
    this.addToken(ctx.start, 'keyword');
  }

  exitProcedureResultItem(ctx: ProcedureResultItemContext) {
    this.addToken(ctx.start, 'variable');
  }

  enterPropertyKeyName(ctx: PropertyKeyNameContext) {
    // FIXME Is this correct in this case for all cases, not just simple properties?
    this.addToken(ctx.start, 'property');
  }

  exitLiteral(ctx: LiteralContext) {
    this.addToken(ctx.start, 'string');
  }
}

function encodeTokenType(tokenType: string): number | undefined {
  if (tokenTypesMap.has(tokenType)) {
    return tokenTypesMap.get(tokenType);
  }
  return 0;
}

export function doSemanticHighlightingText(
  wholeFileText: string,
): ParsedToken[] {
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);

  const parser = new CypherParser(tokenStream);
  const syntaxHighliter = new SyntaxHighlighter();
  parser.addParseListener(syntaxHighliter as ParseTreeListener);
  const tree = parser.statements();

  // When we push to the builder, tokens need to be sorted in ascending starting position
  // i.e. as we find them when we read them from left to right, and from top to bottom in the file
  const sortedTokens = syntaxHighliter.allTokens.sort((a, b) => {
    const lineDiff = a.line - b.line;
    if (lineDiff != 0) {
      return lineDiff;
    } else {
      return a.startCharacter - b.startCharacter;
    }
  });

  return sortedTokens;
}

export function doSemanticHighlighting(documents: TextDocuments<TextDocument>) {
  return (params: SemanticTokensParams) => {
    const textDocument = documents.get(params.textDocument.uri);
    if (textDocument === undefined) return { data: [] };

    const wholeFileText: string = textDocument.getText();
    const tokens = doSemanticHighlightingText(wholeFileText);

    const builder = new SemanticTokensBuilder();
    tokens.forEach((token) => {
      // Nacho: FIXME The 0 index for the token modifiers at the end is hardcoded
      const index = encodeTokenType(token.tokenType) ?? 0;
      builder.push(token.line, token.startCharacter, token.length, index, 0);
    });
    return builder.build();
  };
}

// ************************************************************
// Part of the code that highlights the syntax errors
// ************************************************************
export class ErrorListener implements ANTLRErrorListener<CommonToken> {
  diagnostics: Diagnostic[];

  constructor() {
    this.diagnostics = [];
  }

  public syntaxError<T extends Token>(
    recognizer: Recognizer<T, any>,
    offendingSymbol: T | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
    _: RecognitionException | undefined,
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

export function provideSyntaxErrors(wholeFileText: string): Diagnostic[] {
  const inputStream = CharStreams.fromString(wholeFileText);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);

  const parser = new CypherParser(tokenStream);
  const errorListener = new ErrorListener();
  parser.addErrorListener(errorListener);
  parser.statements();

  return errorListener.diagnostics;
}

export function validateTextDocument(textDocument: TextDocument): Diagnostic[] {
  // Remove trailings EOF when we read the file
  const wholeFileText: string = textDocument.getText().trimEnd();
  return provideSyntaxErrors(wholeFileText);
}
