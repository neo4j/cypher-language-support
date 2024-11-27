parser grammar CypherPreParser;

import Cypher5Parser;

options { tokenVocab = CypherPreLexer; }

preparsedStatement:
   preparserOption? statement;

preparserOption:
   EXPLAIN | PROFILE | cypherOption;

cypherOption:
   CYPHER UNSIGNED_DECIMAL_INTEGER;