// Generated from src/PreParser/antlr-grammar/PreParser.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
import {
	ATN,
	ATNDeserializer,
	CharStream,
	DecisionState, DFA,
	Lexer,
	LexerATNSimulator,
	RuleContext,
	PredictionContextCache,
	Token
} from "antlr4";
export default class PreParserLexer extends Lexer {
	public static readonly FIVE = 1;
	public static readonly TWENTYFIVE = 2;
	public static readonly CYPHER = 3;
	public static readonly SPACE = 4;
	public static readonly CHAR = 5;
	public static readonly EOF = Token.EOF;

	public static readonly channelNames: string[] = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	public static readonly literalNames: (string | null)[] = [ null, "'5'", 
                                                            "'25'", "'CYPHER'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "FIVE", 
                                                             "TWENTYFIVE", 
                                                             "CYPHER", "SPACE", 
                                                             "CHAR" ];
	public static readonly modeNames: string[] = [ "DEFAULT_MODE", ];

	public static readonly ruleNames: string[] = [
		"FIVE", "TWENTYFIVE", "CYPHER", "SPACE", "CHAR",
	];


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(this, PreParserLexer._ATN, PreParserLexer.DecisionsToDFA, new PredictionContextCache());
	}

	public get grammarFileName(): string { return "PreParser.g4"; }

	public get literalNames(): (string | null)[] { return PreParserLexer.literalNames; }
	public get symbolicNames(): (string | null)[] { return PreParserLexer.symbolicNames; }
	public get ruleNames(): string[] { return PreParserLexer.ruleNames; }

	public get serializedATN(): number[] { return PreParserLexer._serializedATN; }

	public get channelNames(): string[] { return PreParserLexer.channelNames; }

	public get modeNames(): string[] { return PreParserLexer.modeNames; }

	public static readonly _serializedATN: number[] = [4,0,5,29,6,-1,2,0,7,
	0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,1,0,1,0,1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,
	2,1,2,1,2,1,3,1,3,1,3,1,3,1,4,1,4,0,0,5,1,1,3,2,5,3,7,4,9,5,1,0,8,2,0,67,
	67,99,99,2,0,89,89,121,121,2,0,80,80,112,112,2,0,72,72,104,104,2,0,69,69,
	101,101,2,0,82,82,114,114,10,0,9,13,28,32,133,133,160,160,5760,5760,8192,
	8202,8232,8233,8239,8239,8287,8287,12288,12288,1,0,0,65534,28,0,1,1,0,0,
	0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,1,11,1,0,0,0,3,13,1,0,
	0,0,5,16,1,0,0,0,7,23,1,0,0,0,9,27,1,0,0,0,11,12,5,53,0,0,12,2,1,0,0,0,
	13,14,5,50,0,0,14,15,5,53,0,0,15,4,1,0,0,0,16,17,7,0,0,0,17,18,7,1,0,0,
	18,19,7,2,0,0,19,20,7,3,0,0,20,21,7,4,0,0,21,22,7,5,0,0,22,6,1,0,0,0,23,
	24,7,6,0,0,24,25,1,0,0,0,25,26,6,3,0,0,26,8,1,0,0,0,27,28,7,7,0,0,28,10,
	1,0,0,0,1,0,1,0,1,0];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!PreParserLexer.__ATN) {
			PreParserLexer.__ATN = new ATNDeserializer().deserialize(PreParserLexer._serializedATN);
		}

		return PreParserLexer.__ATN;
	}


	static DecisionsToDFA = PreParserLexer._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );
}