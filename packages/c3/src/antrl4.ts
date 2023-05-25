
import * as antlr4 from 'antlr4';

export interface ParserRuleContext extends antlr4.ParserRuleContext {
    ruleIndex: number;
}
export interface ATN extends antlr4.ATN {
    maxTokenType: number;
}
export interface Token extends antlr4.Token {
    channel: number;
}
export const Token = antlr4.Token as unknown as {
    MIN_USER_TOKEN_TYPE: number;
    DEFAULT_CHANNEL: number;
    EOF: number;
}
export interface IntervalSet extends antlr4.IntervalSet {
    addInterval(v: antlr4.Interval): void;
    addSet(other: antlr4.IntervalSet): antlr4.IntervalSet;
    complement(start: number, stop:number): IntervalSet;
    length: number;
}
export interface Parser extends antlr4.Parser {
    getLiteralNames(): string[];
    getSymbolicNames(): string[];
    getTokenNames(): string[];
    ruleNames: string[];
    atn: ATN;
}

export interface TransitionTypeEnum {
  EPSILON: number;
  RANGE: number;
  RULE: number;
  PREDICATE: number;
  ATOM: number;
  ACTION: number;
  SET: number;
  NOT_SET: number;
  WILDCARD: number;
  PRECEDENCE: number;
}

export interface ATNStateTypeEnum {
  INVALID_TYPE: number,
  BASIC: number,
  RULE_START: number,
  BLOCK_START: number,
  PLUS_BLOCK_START: number,
  STAR_BLOCK_START: number,
  TOKEN_START: number,
  RULE_STOP: number,
  BLOCK_END: number,
  STAR_LOOP_BACK: number,
  STAR_LOOP_ENTRY: number,
  PLUS_LOOP_BACK: number,
  LOOP_END: number,
  INVALID_STATE_NUMBER: number,
}

export type PredicateTransition = any;
export interface Transition {
  target: ATNState;
  serializationType: number;
  isEpsilon: boolean;
  constructor: TransitionTypeEnum;
  label: IntervalSet;
};
export type RuleTransition = any;
export type PrecedencePredicateTransition = any;
export interface ATNState {
  stateNumber: number;
  stateType: number;
  transitions: Transition[];
  constructor: ATNStateTypeEnum;
  ruleIndex: number;
};
export type RuleStartState = any;

export function intervalSetOf(a: number, b:number): IntervalSet {
  let s = new antlr4.IntervalSet() as IntervalSet;
  s.addInterval(new antlr4.Interval(a, b));
  return s;
}

export function intervalSetToArray(set: antlr4.IntervalSet): number[] {
  const values: number[] = [];
  const n = set.intervals.length;
  for (let i = 0; i < n; i++) {
      const interval = set.intervals[i];
      const a = interval.start;
      const b = interval.stop;
      for (let v = a; v < b; v++) {
          values.push(v);
      }
  }
  return values;
}