parser grammar ConsoleCommandParser;

import CypherParser;

options { tokenVocab = ConsoleCommandLexer; }

// PLAY: 'play'; 
// Re use Cypher lexer ??? declreare here or not? ?
 // HELP: 'help'; 

consoleCommand: COLON (/* playCommand | helpCommand  | */  paramsCmd);

paramsCmd: PARAM expression?;
// playCommand: PLAY ; 

// helpCommand: HELP; 



/*
cypherConsoleCommandName ( cypherConsoleCommandParameters )? ;
 cypherConsoleCommandName: COLON symbolicNameString (MINUS symbolicNameString)*;

cypherConsoleCommandParameters : cypherConsoleCommandParameter ( cypherConsoleCommandParameter )* ;

cypherConsoleCommandParameter:
*/
	// url
	// | json
	// | arrowExpression
	// | mapLiteral
	// | keyValueLiteral
	// | stringLiteral
	// | numberLiteral
	// | booleanLiteralRule
	// | subCommand
	// | commandPath;

// url: uri;

//uri: scheme '://' login? host (':' port)? ('/' path)? urlQuery? frag? ;


// arrowExpression: symbolicNameString  '=>'  expression;

/* 
scheme: string;

host: '/'? (hostname | hostnumber);

hostname: string ('.' string)*;

hostnumber: urlDigits '.' urlDigits '.' urlDigits '.' urlDigits;

port: urlDigits;

path: string ('/' string)*;

user: string;

login: user ':' password '@';

password: string;

frag: ('#' string);

urlQuery: ('?' search);

search: searchparameter ('&' searchparameter)*;

searchparameter: string ('=' (string | urlDigits  /* | UrlHex* /))?;

string: symbolicNameString (('+'| '.')? symbolicNameString)*? ;

urlDigits: UNSIGNED_DECIMAL_INTEGER+;

// JSON

/* 
json: value;

obj : '{'  pair  (',' pair )* '}'
   | '{' '}'
   ;

pair : stringLiteral ':'  value
   ;

array : '['  value  (','  value )* ']'
   | '['  ']'
   ;

value : stringLiteral
   | numberLiteral
   | obj
   | array
   | booleanLiteralRule
   | NULL
   ;


keyValueLiteral : variable ':' ( stringLiteral | numberLiteral | booleanLiteralRule | symbolicNameString ) ;

commandPath : ( '/' ( symbolicNameString | numberLiteral ) )+ '/'? ;


subCommand : ( symbolicNameString ( '-' symbolicNameString )* ) ;

booleanLiteralRule: TRUE | FALSE ;
*/ 