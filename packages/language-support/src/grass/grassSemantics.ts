import type {
  GrassRuleAST,
  GrassWhereAST,
  GrassSyntaxError,
} from './grassTypes';

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

      const lines = input.substring(0, start).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length;

      errors.push({
        message:
          'Grass does not support paths. Use [r:TYPE] for relationships.',
        line,
        column,
        offsets: { start, end },
      });
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

      const lines = input.substring(0, start).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length;

      errors.push({
        message: `Multiple labels in MATCH are not supported. Use WHERE ${
          rule.match.variable || 'variable'
        }:${labels[1]} for additional label conditions.`,
        line,
        column,
        offsets: { start, end },
      });
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
          let match: RegExpExecArray | null;
          let start = 0;
          let end = 0;
          let line = 1;
          let column = 0;

          while ((match = nullRegex.exec(input)) !== null) {
            start = match.index;
            end = start + 4;
            const lines = input.substring(0, start).split('\n');
            line = lines.length;
            column = lines[lines.length - 1].length;
            break;
          }

          const operator = where.operator === 'equal' ? '=' : '<>';
          const suggestion =
            where.operator === 'equal' ? 'IS NULL' : 'IS NOT NULL';

          errors.push({
            message: `Comparing with null using '${operator}' is not recommended. Use '${suggestion}' instead. (In Cypher, null ${operator} null evaluates to null, not true/false)`,
            line,
            column,
            offsets: { start, end },
          });
        }
      }
      break;
  }
}

/**
 * Convert GrassSyntaxError offsets for use with :style command prefix.
 * Adjusts line, column, and offsets to account for the `:style ` prefix.
 */
export function adjustErrorOffsetsForStyleCommand(
  errors: GrassSyntaxError[],
  styleCommandOffset: number,
  styleCommandLine: number,
  styleCommandColumn: number,
): GrassSyntaxError[] {
  return errors.map((error) => ({
    ...error,
    line:
      error.line === 1 ? styleCommandLine : styleCommandLine + error.line - 1,
    column: error.line === 1 ? styleCommandColumn + error.column : error.column,
    offsets: {
      start: error.offsets.start + styleCommandOffset,
      end: error.offsets.end + styleCommandOffset,
    },
  }));
}

