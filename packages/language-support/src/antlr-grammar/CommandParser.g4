parser grammar CommandParser;

import CypherParser;

options { tokenVocab = CommandLexer; }

fullStatements: statementOrCommand (SEMICOLON statementOrCommand)* SEMICOLON? EOF;

statementOrCommand: (statement | consoleCommand);

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
