parser grammar CommandParser;

import CypherParser;

options { tokenVocab = CommandLexer; }

fullStatements: (statementOrCommand SEMICOLON)* statementOrCommand SEMICOLON? EOF;

statementOrCommand: (consoleCommand | statement);

consoleCommand: COLON (clearCmd | history | use | paramsCmd);

paramsCmd: PARAM (LIST | CLEAR | map | lambda)?; 

lambda: unescapedSymbolicNameString EQ GT expression;

clearCmd: CLEAR;

history: HISTORY;

use: USE symbolicAliasName?;



/* TODO: 
send only cypher to Semantic analysis
function som parsar trevligare 
should they be highlighted? 
todo lowercase completions


use already exists. so how do we sometimes compete it uppercase, sometimes lowercase?


how should they highlight.
how to handle upper/lower case for USE? How to handle other "dual use" aspects 
how would the actual parsing work for the command list if the list was complety dynamic?


*/
