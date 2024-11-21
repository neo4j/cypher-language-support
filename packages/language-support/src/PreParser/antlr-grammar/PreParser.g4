grammar PreParser;
options { caseInsensitive = true; }

query:
    cypherVersion? CHAR* EOF;

cypherVersion:
    cypherFive | cypherTwentyFive;

cypherFive:
    CYPHER FIVE;

FIVE: '5';

TWENTYFIVE: '25';

cypherTwentyFive:
    CYPHER TWENTYFIVE;

CYPHER:
    'CYPHER';

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
      | '\u0085'
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
   ) -> channel (HIDDEN)
   ;


CHAR:
    [\u0000-\uFFFE];
