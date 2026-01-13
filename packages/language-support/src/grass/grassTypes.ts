import type {
  StyleRule,
  Where,
  Value,
  Caption,
  CaptionVariation,
  Style,
} from './grass-definition';

// Re-export for convenience
export type { StyleRule, Where, Value, Caption, CaptionVariation, Style };

/**
 * Result of parsing a grass stylesheet
 */
export interface GrassParseResult {
  /** The original input text */
  input: string;
  /** Successfully parsed style rules */
  rules: StyleRule[];
  /** Any syntax errors encountered */
  errors: GrassSyntaxError[];
}

/**
 * A syntax error in the grass DSL
 */
export interface GrassSyntaxError {
  message: string;
  line: number;
  column: number;
  offsets: {
    start: number;
    end: number;
  };
}

/**
 * Intermediate AST representation before conversion to StyleRule
 */
export interface GrassAST {
  rules: GrassRuleAST[];
}

export interface GrassRuleAST {
  match: GrassMatchAST;
  where?: GrassWhereAST;
  apply: GrassStyleAST;
}

export interface GrassMatchAST {
  type: 'node' | 'relationship' | 'path' | 'multiLabel';
  variable?: string; // optional - not needed if no WHERE clause
  label?: string; // for nodes
  labels?: string[]; // for multiLabel patterns (error case)
  reltype?: string; // for relationships and paths
}

export type GrassWhereAST =
  | { type: 'and'; operands: GrassWhereAST[] }
  | { type: 'or'; operands: GrassWhereAST[] }
  | { type: 'not'; operand: GrassWhereAST }
  | {
      type: 'comparison';
      operator: ComparisonOperator;
      left: GrassValueAST;
      right: GrassValueAST;
    }
  | { type: 'isNull'; value: GrassValueAST }
  | { type: 'isNotNull'; value: GrassValueAST }
  | { type: 'labelCheck'; variable: string; label: string }
  | { type: 'propertyExistence'; property: string };

export type ComparisonOperator =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'greaterThan'
  | 'lessThanOrEqual'
  | 'greaterThanOrEqual'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

export type GrassValueAST =
  | { type: 'property'; name: string }
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'null' };

export interface GrassStyleAST {
  color?: string;
  size?: number;
  width?: number;
  captions?: GrassCaptionAST[];
  captionSize?: number;
  captionAlign?: 'top' | 'bottom' | 'center';
}

export interface GrassCaptionAST {
  value: string | { property: string } | { useType: true };
  styles: CaptionVariation[];
}
