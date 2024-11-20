// Generated from src/PreParser/antlr-grammar/PreParser.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import PreParserListener from "./PreParserListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class PreParserParser extends Parser {
	public static readonly FIVE = 1;
	public static readonly TWENTYFIVE = 2;
	public static readonly CYPHER = 3;
	public static readonly SPACE = 4;
	public static readonly CHAR = 5;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_query = 0;
	public static readonly RULE_cypherVersion = 1;
	public static readonly RULE_cypherFive = 2;
	public static readonly RULE_cypherTwentyFive = 3;
	public static readonly literalNames: (string | null)[] = [ null, "'5'", 
                                                            "'25'", "'CYPHER'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "FIVE", 
                                                             "TWENTYFIVE", 
                                                             "CYPHER", "SPACE", 
                                                             "CHAR" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"query", "cypherVersion", "cypherFive", "cypherTwentyFive",
	];
	public get grammarFileName(): string { return "PreParser.g4"; }
	public get literalNames(): (string | null)[] { return PreParserParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return PreParserParser.symbolicNames; }
	public get ruleNames(): string[] { return PreParserParser.ruleNames; }
	public get serializedATN(): number[] { return PreParserParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, PreParserParser._ATN, PreParserParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public query(): QueryContext {
		let localctx: QueryContext = new QueryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, PreParserParser.RULE_query);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 9;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===3) {
				{
				this.state = 8;
				this.cypherVersion();
				}
			}

			this.state = 14;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 11;
				this.match(PreParserParser.CHAR);
				}
				}
				this.state = 16;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 17;
			this.match(PreParserParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public cypherVersion(): CypherVersionContext {
		let localctx: CypherVersionContext = new CypherVersionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, PreParserParser.RULE_cypherVersion);
		try {
			this.state = 21;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 19;
				this.cypherFive();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 20;
				this.cypherTwentyFive();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public cypherFive(): CypherFiveContext {
		let localctx: CypherFiveContext = new CypherFiveContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, PreParserParser.RULE_cypherFive);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 23;
			this.match(PreParserParser.CYPHER);
			this.state = 24;
			this.match(PreParserParser.FIVE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public cypherTwentyFive(): CypherTwentyFiveContext {
		let localctx: CypherTwentyFiveContext = new CypherTwentyFiveContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, PreParserParser.RULE_cypherTwentyFive);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 26;
			this.match(PreParserParser.CYPHER);
			this.state = 27;
			this.match(PreParserParser.TWENTYFIVE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public static readonly _serializedATN: number[] = [4,1,5,30,2,0,7,0,2,1,
	7,1,2,2,7,2,2,3,7,3,1,0,3,0,10,8,0,1,0,5,0,13,8,0,10,0,12,0,16,9,0,1,0,
	1,0,1,1,1,1,3,1,22,8,1,1,2,1,2,1,2,1,3,1,3,1,3,1,3,0,0,4,0,2,4,6,0,0,28,
	0,9,1,0,0,0,2,21,1,0,0,0,4,23,1,0,0,0,6,26,1,0,0,0,8,10,3,2,1,0,9,8,1,0,
	0,0,9,10,1,0,0,0,10,14,1,0,0,0,11,13,5,5,0,0,12,11,1,0,0,0,13,16,1,0,0,
	0,14,12,1,0,0,0,14,15,1,0,0,0,15,17,1,0,0,0,16,14,1,0,0,0,17,18,5,0,0,1,
	18,1,1,0,0,0,19,22,3,4,2,0,20,22,3,6,3,0,21,19,1,0,0,0,21,20,1,0,0,0,22,
	3,1,0,0,0,23,24,5,3,0,0,24,25,5,1,0,0,25,5,1,0,0,0,26,27,5,3,0,0,27,28,
	5,2,0,0,28,7,1,0,0,0,3,9,14,21];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!PreParserParser.__ATN) {
			PreParserParser.__ATN = new ATNDeserializer().deserialize(PreParserParser._serializedATN);
		}

		return PreParserParser.__ATN;
	}


	static DecisionsToDFA = PreParserParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class QueryContext extends ParserRuleContext {
	constructor(parser?: PreParserParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(PreParserParser.EOF, 0);
	}
	public cypherVersion(): CypherVersionContext {
		return this.getTypedRuleContext(CypherVersionContext, 0) as CypherVersionContext;
	}
	public CHAR_list(): TerminalNode[] {
	    	return this.getTokens(PreParserParser.CHAR);
	}
	public CHAR(i: number): TerminalNode {
		return this.getToken(PreParserParser.CHAR, i);
	}
    public get ruleIndex(): number {
    	return PreParserParser.RULE_query;
	}
	public enterRule(listener: PreParserListener): void {
	    if(listener.enterQuery) {
	 		listener.enterQuery(this);
		}
	}
	public exitRule(listener: PreParserListener): void {
	    if(listener.exitQuery) {
	 		listener.exitQuery(this);
		}
	}
}


export class CypherVersionContext extends ParserRuleContext {
	constructor(parser?: PreParserParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public cypherFive(): CypherFiveContext {
		return this.getTypedRuleContext(CypherFiveContext, 0) as CypherFiveContext;
	}
	public cypherTwentyFive(): CypherTwentyFiveContext {
		return this.getTypedRuleContext(CypherTwentyFiveContext, 0) as CypherTwentyFiveContext;
	}
    public get ruleIndex(): number {
    	return PreParserParser.RULE_cypherVersion;
	}
	public enterRule(listener: PreParserListener): void {
	    if(listener.enterCypherVersion) {
	 		listener.enterCypherVersion(this);
		}
	}
	public exitRule(listener: PreParserListener): void {
	    if(listener.exitCypherVersion) {
	 		listener.exitCypherVersion(this);
		}
	}
}


export class CypherFiveContext extends ParserRuleContext {
	constructor(parser?: PreParserParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CYPHER(): TerminalNode {
		return this.getToken(PreParserParser.CYPHER, 0);
	}
	public FIVE(): TerminalNode {
		return this.getToken(PreParserParser.FIVE, 0);
	}
    public get ruleIndex(): number {
    	return PreParserParser.RULE_cypherFive;
	}
	public enterRule(listener: PreParserListener): void {
	    if(listener.enterCypherFive) {
	 		listener.enterCypherFive(this);
		}
	}
	public exitRule(listener: PreParserListener): void {
	    if(listener.exitCypherFive) {
	 		listener.exitCypherFive(this);
		}
	}
}


export class CypherTwentyFiveContext extends ParserRuleContext {
	constructor(parser?: PreParserParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CYPHER(): TerminalNode {
		return this.getToken(PreParserParser.CYPHER, 0);
	}
	public TWENTYFIVE(): TerminalNode {
		return this.getToken(PreParserParser.TWENTYFIVE, 0);
	}
    public get ruleIndex(): number {
    	return PreParserParser.RULE_cypherTwentyFive;
	}
	public enterRule(listener: PreParserListener): void {
	    if(listener.enterCypherTwentyFive) {
	 		listener.enterCypherTwentyFive(this);
		}
	}
	public exitRule(listener: PreParserListener): void {
	    if(listener.exitCypherTwentyFive) {
	 		listener.exitCypherTwentyFive(this);
		}
	}
}
