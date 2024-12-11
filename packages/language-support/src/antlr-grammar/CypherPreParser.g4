parser grammar CypherPreParser;

import Cypher5Parser;

options { tokenVocab = CypherPreLexer; }

preparsedStatement:
   preparserOption? statement;

preparserKeyword:
   EXPLAIN | PROFILE | CYPHER; 

preparserOption:
   EXPLAIN | PROFILE | cypherOptions;

cypherOptions:
   CYPHER (cypherVersion | cypherOption)*;

cypherOption:
   IDENTIFIER EQ (IDENTIFIER | numberLiteral);

cypherVersion:
   UNSIGNED_DECIMAL_INTEGER;