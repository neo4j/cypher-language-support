import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import type {
  GrassRuleAST,
  GrassWhereAST,
  GrassSyntaxError,
} from './grassTypes';

function createError(
  message: string,
  input: string,
  start: number,
  end: number,
): GrassSyntaxError {
  const beforeStart = input.substring(0, start);
  const linesBeforeStart = beforeStart.split('\n');
  const startLine = linesBeforeStart.length - 1;
  const startColumn = linesBeforeStart[linesBeforeStart.length - 1].length;

  const beforeEnd = input.substring(0, end);
  const linesBeforeEnd = beforeEnd.split('\n');
  const endLine = linesBeforeEnd.length - 1;
  const endColumn = linesBeforeEnd[linesBeforeEnd.length - 1].length;

  return {
    severity: DiagnosticSeverity.Error,
    message,
    range: {
      start: Position.create(startLine, startColumn),
      end: Position.create(endLine, endColumn),
    },
    offsets: { start, end },
  };
}

/**
 * Validate grass rules for semantic errors that aren't caught by the grammar.
 * Returns errors for:
 * - Path patterns (not supported)
 * - Multiple labels in MATCH (not supported)
 * - Comparing with null using = or <> (should use IS NULL / IS NOT NULL)
 */
export function validateGrassSemantics(
  rules: GrassRuleAST[],
  input: string,
): { validRules: GrassRuleAST[]; errors: GrassSyntaxError[] } {
  const errors: GrassSyntaxError[] = [];
  const validRules: GrassRuleAST[] = [];

  for (const rule of rules) {
    if (rule.match.type === 'path') {
      // Path patterns like ()-[r:TYPE]->()
      const ruleText = `()-[${rule.match.variable || ''}`;
      const startIndex = input.indexOf(ruleText);
      const start = startIndex >= 0 ? startIndex : 0;
      const end = start + (ruleText.length + 10); // approximate end

      errors.push(
        createError(
          'Grass does not support paths. Use [r:TYPE] for relationships.',
          input,
          start,
          end,
        ),
      );
    } else if (rule.match.type === 'multiLabel') {
      // Multiple labels like (n:Person:Actor)
      const labels = rule.match.labels || [];
      const labelStr = labels.join(':');
      const searchStr = rule.match.variable
        ? `(${rule.match.variable}:${labelStr}`
        : `(:${labelStr}`;
      const startIndex = input.indexOf(searchStr);
      const start = startIndex >= 0 ? startIndex : 0;
      const end = start + searchStr.length + 1;

      errors.push(
        createError(
          `Multiple labels in MATCH are not supported. Use WHERE ${
            rule.match.variable || 'variable'
          }:${labels[1]} for additional label conditions.`,
          input,
          start,
          end,
        ),
      );
    } else {
      validRules.push(rule);
    }
  }

  // Check for semantic errors in WHERE clauses (null comparisons)
  for (const rule of validRules) {
    if (rule.where) {
      checkForNullComparisons(rule.where, input, errors);
    }
  }

  return { validRules, errors };
}

function checkForNullComparisons(
  where: GrassWhereAST,
  input: string,
  errors: GrassSyntaxError[],
): void {
  switch (where.type) {
    case 'and':
    case 'or':
      for (const operand of where.operands) {
        checkForNullComparisons(operand, input, errors);
      }
      break;
    case 'not':
      checkForNullComparisons(where.operand, input, errors);
      break;
    case 'comparison':
      if (where.operator === 'equal' || where.operator === 'notEqual') {
        const leftIsNull = where.left.type === 'null';
        const rightIsNull = where.right.type === 'null';

        if (leftIsNull || rightIsNull) {
          const nullRegex = /\bnull\b/gi;
          const match = nullRegex.exec(input);

          if (match) {
            const start = match.index;
            const end = start + 4; // 'null' is 4 characters

            const operator = where.operator === 'equal' ? '=' : '<>';
            const suggestion =
              where.operator === 'equal' ? 'IS NULL' : 'IS NOT NULL';

            errors.push(
              createError(
                `Comparing with null using '${operator}' is not recommended. Use '${suggestion}' instead. (In Cypher, null ${operator} null evaluates to null, not true/false)`,
                input,
                start,
                end,
              ),
            );
          }
        }
      }
      break;
  }
}

/**
 * Adjust SyntaxDiagnostic positions for use with :style command prefix.
 * Adjusts range and offsets to account for the `:style ` prefix.
 */
export function adjustErrorOffsetsForStyleCommand(
  errors: GrassSyntaxError[],
  styleCommandOffset: number,
  styleCommandLine: number,
  styleCommandColumn: number,
): GrassSyntaxError[] {
  return errors.map((error) => {
    const isFirstLine = error.range.start.line === 0;
    const newStartLine = isFirstLine
      ? styleCommandLine
      : styleCommandLine + error.range.start.line;
    const newStartColumn = isFirstLine
      ? styleCommandColumn + error.range.start.character
      : error.range.start.character;

    const isEndOnFirstLine = error.range.end.line === 0;
    const newEndLine = isEndOnFirstLine
      ? styleCommandLine
      : styleCommandLine + error.range.end.line;
    const newEndColumn = isEndOnFirstLine
      ? styleCommandColumn + error.range.end.character
      : error.range.end.character;

    return {
      ...error,
      range: {
        start: Position.create(newStartLine, newStartColumn),
        end: Position.create(newEndLine, newEndColumn),
      },
      offsets: {
        start: error.offsets.start + styleCommandOffset,
        end: error.offsets.end + styleCommandOffset,
      },
    };
  });
}
