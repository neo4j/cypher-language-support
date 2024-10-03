parser grammar Cypher25CmdParser;

import Cypher25Parser;

options { tokenVocab = Cypher25CmdLexer; }

statementOrCommand: (preparsedStatement | consoleCommand) SEMICOLON? EOF;

preparsedStatement:
   preparserOption* statement;

cypherVersion:
   CYPHER UNSIGNED_DECIMAL_INTEGER;

preparserOption:
   EXPLAIN | PROFILE | cypherVersion;

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

externalKeywords: preparserOption | CYPHER | HISTORY | CLEAR | PARAM;