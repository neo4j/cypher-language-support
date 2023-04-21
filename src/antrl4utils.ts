
import { IntervalSet, Interval } from 'antlr4';

declare module "antlr4" {
    interface ParserRuleContext {
        ruleIndex: number;
    }
    interface RuleStartState {
        isPrecedenceRule: boolean;
    }
    interface ATN {
        maxTokenType: number;
    }
    interface Token {
        channel: number;
    }
    namespace Token {
        const MIN_USER_TOKEN_TYPE: number;
        const DEFAULT_CHANNEL: number;
    }
    interface IntervalSet {
        addInterval(v: Interval): void;
        addSet(other: IntervalSet): IntervalSet;
        toArray(): number[];
    }
    namespace IntervalSet {
        function of(a: number, b: number): IntervalSet;
    }
    interface Parser {
        getLiteralNames(): string[];
        getSymbolicNames(): string[];
        getTokenNames(): string[];
        ruleNames: string[];
        atn: ATN;
    }
}

export enum TransitionType {
  EPSILON = 1,
  RANGE = 2,
  RULE = 3,
  PREDICATE = 4,
  ATOM = 5,
  ACTION = 6,
  SET = 7,
  NOT_SET = 8,
  WILDCARD = 9,
  PRECEDENCE = 10,
}

export enum ATNStateType {
  INVALID_TYPE= 0,
  BASIC = 1,
  RULE_START = 2,
  BLOCK_START = 3,
  PLUS_BLOCK_START = 4,
  STAR_BLOCK_START = 5,
  TOKEN_START = 6,
  RULE_STOP = 7,
  BLOCK_END = 8,
  STAR_LOOP_BACK = 9,
  STAR_LOOP_ENTRY = 10,
  PLUS_LOOP_BACK = 11,
  LOOP_END = 12,
  INVALID_STATE_NUMBER = -1,
}

export type PredicateTransition = any;
export type Transition = any;
export type RuleTransition = any;
export type PrecedencePredicateTransition = any;
export type ATNState = any;
export type RuleStartState = any;

IntervalSet.of = function(a: number, b:number): IntervalSet {
  let s: IntervalSet = new IntervalSet();
  s.addInterval(new Interval(a, b));
  return s;
}

IntervalSet.prototype.toArray = function(this: IntervalSet): number[] {
  let values: number[] = [];
  let n = this.intervals.length;
  for (let i = 0; i < n; i++) {
      const interval = this.intervals[i];
      const a = interval.start;
      const b = interval.stop;
      for (let v = a; v < b; v++) {
          values.push(v);
      }
  }
  return values;
}