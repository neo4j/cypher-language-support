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



/* 
Open questions:
- Should they be keywords or something else
- If they are not keywords, how should they highlight?
- Does it matter if we give completions for : commands?
- Improve the error messages for when giving an extra argument?

TODO:
- How to handle "dual use" of use (ha ha)? Catch the USE completion early, so that we can give it in lower case instead? does it make sense to check if "last character was :"? 
- If parsed command is not in list of Enabled Commands -> Create diagnostic from the parse
- Ensure Semantic analysis only runs on Cypher statements, replace all client commands with " " <- so positions still match?
*/
