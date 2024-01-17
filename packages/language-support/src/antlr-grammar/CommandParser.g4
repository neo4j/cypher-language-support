parser grammar CommandParser;

import CypherParser;

options { tokenVocab = CommandLexer; }

fullStatements: (SEMICOLON statementOrCommand)* statementOrCommand SEMICOLON? EOF;

statementOrCommand: (consoleCommand | statement);

consoleCommand: COLON (clearCmd | history | use | paramsCmd);

paramsCmd: PARAM (LIST | CLEAR | SHOW | map | lambda)?; 

lambda: unescapedSymbolicNameString EQ ARROW_RIGHT_HEAD expression;

clearCmd: CLEAR;

history: HISTORY;

use: USE symbolicAliasName;



/* TODO: 
send only cypher to Semantic analysis
function som parsar trevligare 
highlighting 

*/
