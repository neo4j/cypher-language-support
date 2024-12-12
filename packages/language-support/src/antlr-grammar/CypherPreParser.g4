parser grammar CypherPreParser;

import Cypher5Parser;

options { tokenVocab = CypherPreLexer; }

preparsedStatement:
   (analysisKeyword cypherOptions | cypherOptions analysisKeyword)? statement;

preparserKeyword:
   analysisKeyword | CYPHER; 

analysisKeyword:
   EXPLAIN | PROFILE;

cypherOptions:
   CYPHER cypherVersion? cypherOption*;

cypherOption:
   IDENTIFIER EQ (IDENTIFIER | numberLiteral);

cypherVersion:
   UNSIGNED_DECIMAL_INTEGER;