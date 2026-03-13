
import * as antlr4 from 'antlr4ng';

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
export type IntervalSet = antlr4.IntervalSet;
export interface Parser extends antlr4.Parser {
    literalNames: (string | null)[];
    symbolicNames: (string | null)[];
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
  transitionType: number;
  isEpsilon: boolean;
  constructor: TransitionTypeEnum;
  label: IntervalSet;
};
export type RuleTransition = any;
export type PrecedencePredicateTransition = any;
export interface ATNState {
  stateNumber: number;
  transitions: Transition[];
  constructor: ATNStateTypeEnum;
  ruleIndex: number;
};
export type RuleStartState = any;

export function getStateType(state: ATNState): number {
  return (state.constructor as any).stateType;
}

export function intervalSetOf(a: number, b:number): IntervalSet {
  return antlr4.IntervalSet.of(a, b);
}

export function intervalSetToArray(set: antlr4.IntervalSet): number[] {
  return set.toArray();
}