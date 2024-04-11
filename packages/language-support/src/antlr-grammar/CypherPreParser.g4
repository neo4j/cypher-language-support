parser grammar CypherPreParser;

import CypherParser;

options { tokenVocab = CypherPreLexer; }

preparsedStatement:
   preparserOption? statement;

preparserOption:
   EXPLAIN | PROFILE;