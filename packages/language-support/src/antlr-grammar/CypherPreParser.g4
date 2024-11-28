parser grammar CypherPreParser;

import Cypher5Parser;

options { tokenVocab = CypherPreLexer; }

preparsedStatement:
   preparserOption? statement;

preparserOption:
   EXPLAIN | PROFILE | CYPHER (UNSIGNED_DECIMAL_INTEGER | IDENTIFIER EQ (IDENTIFIER | numberLiteral))*;