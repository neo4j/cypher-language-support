parser grammar CommandParser;

import CypherParser;

options { tokenVocab = CommandLexer; }

fullStatements: (statementOrCommand SEMICOLON)* statementOrCommand SEMICOLON? EOF;

statementOrCommand: (consoleCommand | statement);

consoleCommand: COLON (clearCmd | historyCmd | useCmd | paramsCmd);

paramsCmd: PARAM paramsArgs?;

paramsArgs: (CLEAR | listCompleteRule | map | lambda);

lambda: unescapedSymbolicNameString EQ GT expression;

clearCmd: CLEAR;

historyCmd: HISTORY;

useCmd: useCompletionRule symbolicAliasName?;

// These rules are needed to distinguish between use and use command in autocopmletion
listCompleteRule: LIST; 

useCompletionRule: USE;

/* 
TODO:
- How to handle "dual use" of use (ha ha)? Catch the USE completion early, so that we can give it in lower case instead? does it make sense to check if "last character was :"? 
- make sure the completion icon is correct and lower case
- If parsed command is not in list of Enabled Commands -> Create diagnostic from the parse
- Ensure Semantic analysis only runs on Cypher statements, replace all client commands with " " <- so positions still match?
- Tests for highlighting 
- double check highlithing for vscode? 
- Does it matter if we give completions for : commands?

- Improve the error messages for when giving an extra argument?


// LIST also has wrong
*/

