grammar Statements;

statements: (statement SEMICOLON)* statement SEMICOLON? EOF;

statement: ('EXPLAIN' | 'PROFILE' | cypherVersion)* (stringLiteral | comment | CHAR)*; 

stringLiteral
    : STRING_LITERAL;

comment
    : SINGLE_LINE_COMMENT | MULTI_LINE_COMMENT;

cypherVersion:
    CYPHER5 | CYPHER25;

CYPHER5:
   'CYPHER 5';

CYPHER25:
   'CYPHER 25';

SEMICOLON: ';';

SPACE
   : ( '\u0009'
      | '\n' //can't parse this in unicode
      | '\u000B'
      | '\u000C'
      | '\r' //can't parse this in unicode
      | '\u001C'
      | '\u001D'
      | '\u001E'
      | '\u001F'
      | '\u0020'
      | '\u00A0'
      | '\u1680'
      | '\u2000'
      | '\u2001'
      | '\u2002'
      | '\u2003'
      | '\u2004'
      | '\u2005'
      | '\u2006'
      | '\u2007'
      | '\u2008'
      | '\u2009'
      | '\u200A'
      | '\u2028'
      | '\u2029'
      | '\u202F'
      | '\u205F'
      | '\u3000'
   ) -> channel(HIDDEN)
   ;

CHAR: ~[;'"];

SINGLE_LINE_COMMENT
   : '//' ~[\r\n]*
   ;

MULTI_LINE_COMMENT
   : '/*' .*? '*/'
   ;

STRING_LITERAL
   : '\'' (~['\\] | EscapeSequence)* '\'' | '"' (~["\\] | EscapeSequence)* '"'
   ;

UNFINISHED_STRING_LITERAL
   : '\'' (~['\\] | EscapeSequence)* | '"' (~["\\] | EscapeSequence)*
   ;

// In Cypher it is allowed to have any character following a backslash.
// In the cases it is an actual escape code it is handled in the AST builder.
fragment EscapeSequence
   : '\\' .
   ;