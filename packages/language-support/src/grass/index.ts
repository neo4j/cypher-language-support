export type {
  StyleRule,
  Where,
  Value,
  Caption,
  CaptionVariation,
  Style,
  GrassParseResult,
  GrassSyntaxError,
  GrassAST,
  GrassRuleAST,
  GrassMatchAST,
  GrassWhereAST,
  GrassValueAST,
  GrassStyleAST,
  GrassCaptionAST,
  ComparisonOperator,
} from './grassTypes';

export { stringifyGrass } from './grassStringify';

export { GrassASTConverter, astToStyleRule } from './grassASTConverter';

export {
  validateGrassSemantics,
  adjustErrorOffsetsForStyleCommand,
} from './grassSemantics';

import {
  CharStreams,
  CommonTokenStream,
  ErrorListener,
  Token,
  Recognizer,
} from 'antlr4';
import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import CypherCmdLexer from '../generated-parser/CypherCmdLexer';
import CypherCmdParser from '../generated-parser/CypherCmdParser';
import { GrassASTConverter, astToStyleRule } from './grassASTConverter';
import { validateGrassSemantics } from './grassSemantics';
import type {
  GrassParseResult,
  GrassSyntaxError,
  StyleRule,
} from './grassTypes';

/**
 * Custom error listener to collect syntax errors
 */
class GrassSyntaxErrorListener extends ErrorListener<Token> {
  errors: GrassSyntaxError[] = [];
  private input: string;

  constructor(input: string) {
    super();
    this.input = input;
  }

  syntaxError(
    _recognizer: Recognizer<Token>,
    offendingSymbol: Token | null,
    line: number,
    column: number,
    msg: string,
  ): void {
    // Calculate character offsets from line/column
    const lines = this.input.split('\n');
    let start = 0;
    for (let i = 0; i < line - 1; i++) {
      start += lines[i].length + 1; // +1 for newline
    }
    start += column;

    const tokenLength = offendingSymbol?.text?.length ?? 1;
    const end = start + tokenLength;

    // Use 0-based line numbers for LSP compatibility
    const startLine = line - 1;
    const endLine = startLine;
    const endColumn = column + tokenLength;

    this.errors.push({
      severity: DiagnosticSeverity.Error,
      message: msg,
      range: {
        start: Position.create(startLine, column),
        end: Position.create(endLine, endColumn),
      },
      offsets: { start, end },
    });
  }
}

/**
 * Parse a grass DSL string into StyleRule objects.
 *
 * This function parses standalone grass syntax (without the :style prefix).
 * For parsing grass through the main Cypher parser with :style command,
 * use `parserWrapper.parse()` and access the `styleRules` from the parsed command.
 *
 * @param input - The grass DSL string to parse
 * @returns ParseResult containing rules and any errors
 *
 * @example
 * ```typescript
 * const result = parseGrass(`MATCH (n:Person) APPLY {color: '#ff0000'}`);
 * if (result.errors.length === 0) {
 *   console.log(result.rules); // StyleRule[]
 * }
 * ```
 */
export function parseGrass(input: string): GrassParseResult {
  if (input.trim().length === 0) {
    return {
      input,
      rules: [],
      errors: [],
    };
  }

  const inputStream = CharStreams.fromString(input);
  const lexer = new CypherCmdLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new CypherCmdParser(tokenStream);

  const errorListener = new GrassSyntaxErrorListener(input);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  const tree = parser.styleSheet();

  const converter = new GrassASTConverter(input);
  const ast = converter.convertStyleSheet(tree);

  // Run semantic validation
  const { validRules, errors: semanticErrors } = validateGrassSemantics(
    ast.rules,
    input,
  );

  // Combine all errors
  const errors = [
    ...errorListener.errors,
    ...converter.errors,
    ...semanticErrors,
  ];

  // Convert valid rules to StyleRule format
  const rules = validRules.map(astToStyleRule);

  return {
    input,
    rules,
    errors,
  };
}

/**
 * Get StyleRule objects from a :style console command that has been parsed
 * by the main parser. This is the preferred way to extract styles when
 * the user is editing in an editor context.
 *
 * @param styleRuleContexts - The styleRule_list() from a parsed StyleCmdContext
 * @param input - The original input string (for error reporting)
 * @returns ParseResult containing rules and any errors
 */
export function convertStyleRuleContextsToRules(
  styleRuleContexts: ReturnType<
    typeof CypherCmdParser.prototype.styleSheet
  >['styleRule_list'] extends () => infer R
    ? R
    : never,
  input: string,
): { rules: StyleRule[]; errors: GrassSyntaxError[] } {
  const converter = new GrassASTConverter(input);

  const astRules = styleRuleContexts.map((ctx) =>
    converter.convertStyleRule(ctx),
  );
  const validAstRules = astRules.filter(
    (rule): rule is NonNullable<typeof rule> => rule !== null,
  );

  // Run semantic validation
  const { validRules, errors: semanticErrors } = validateGrassSemantics(
    validAstRules,
    input,
  );

  const errors = [...converter.errors, ...semanticErrors];
  const rules = validRules.map(astToStyleRule);

  return { rules, errors };
}
