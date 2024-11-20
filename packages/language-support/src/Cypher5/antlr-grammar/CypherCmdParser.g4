parser grammar CypherCmdParser;

import CypherPreParser;

options { tokenVocab = CypherCmdLexer; }

statementsOrCommands: statementOrCommand (SEMICOLON statementOrCommand)* SEMICOLON? EOF;

statementOrCommand: (preparsedStatement | consoleCommand);

consoleCommand: COLON (clearCmd | historyCmd | useCmd | paramsCmd);

paramsCmd: PARAM paramsArgs?;

paramsArgs: (CLEAR | listCompletionRule | map | lambda);

lambda: unescapedSymbolicNameString EQ GT expression;

clearCmd: CLEAR;

historyCmd: HISTORY;

useCmd: useCompletionRule symbolicAliasName?;

// These rules are needed to distinguish cypher <-> commands, for exapmle `USE` and `:use` in autocompletion
listCompletionRule: LIST; 

useCompletionRule: USE;

// This rule overrides the identifiers adding EXPLAIN, PROFILE, etc
unescapedLabelSymbolicNameString: preparserOption | HISTORY | CLEAR | PARAM | unescapedLabelSymbolicNameString_;
