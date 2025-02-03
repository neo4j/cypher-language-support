parser grammar CypherPreParser;

import Cypher25Parser;

options { tokenVocab = CypherPreLexer; }

preparsedStatement:
   preparserOption* statement;

preparserKeyword:
   EXPLAIN | PROFILE | CYPHER; 

preparserOption:
   EXPLAIN | PROFILE | cypherOptions;

cypher: 
   CYPHER;

cypherOptions:
   cypher cypherVersion? cypherOption*;

cypherOption:
   cypherOptionName EQ cypherOptionValue;

cypherOptionValue:
   (IDENTIFIER | numberLiteral);

cypherOptionName:
   IDENTIFIER;

cypherVersion:
   VERSION;