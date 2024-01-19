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
- If parsed command is not in list of Enabled Commands -> Create diagnostic from the parse
- Does it matter if we give completions for : commands?

- Ensure Semantic analysis only runs on Cypher statements, replace all client commands with " " <- so positions still match?

> double check highlithing & completion icon vscode? 
*/

