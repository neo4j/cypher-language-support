parser grammar Cypher25CmdParser;

import Cypher25Parser, Cypher5Parser;

options { tokenVocab = Cypher25CmdLexer; }

statementsOrCommands: statementOrCommand (SEMICOLON statementOrCommand)* SEMICOLON? EOF;

statementOrCommand: (preparsedStatement | consoleCommand);

preparsedStatement:
   cypher5Query | cypher25Query;

cypher5Query:
   cypher5? preparserOption? statement_Cypher5;

cypher25Query:
   cypher25 preparserOption? statement_Cypher25;

cypher5:
   CYPHER FIVE;

cypher25:
   CYPHER TWENTYFIVE;

preparserOption:
   EXPLAIN | PROFILE;

consoleCommand: 
   COLON (clearCmd | historyCmd | useCmd | paramsCmd);

paramsCmd: PARAM paramsArgs?;

paramsArgs: (CLEAR | listCompletionRule | map_Cypher25 | lambda);

lambda: unescapedSymbolicNameString_Cypher25 EQ GT expression_Cypher25;

clearCmd: CLEAR;

historyCmd: HISTORY;

useCmd: useCompletionRule symbolicAliasName_Cypher25?;

// These rules are needed to distinguish cypher <-> commands, for exapmle `USE` and `:use` in autocompletion
listCompletionRule: LIST; 

useCompletionRule: USE;

externalKeywords: preparserOption | HISTORY | CLEAR | PARAM;

unescapedLabelSymbolicNameString_Cypher5:
   unescapedLabelSymbolicNameString__Cypher5 | externalKeywords;

unescapedLabelSymbolicNameString_Cypher25:
   unescapedLabelSymbolicNameString__Cypher25 | externalKeywords;