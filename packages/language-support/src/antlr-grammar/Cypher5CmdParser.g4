parser grammar Cypher5CmdParser;

import Cypher5Parser;

options { tokenVocab = Cypher5CmdLexer; }

statementsOrCommands: statementOrCommand (SEMICOLON statementOrCommand)* SEMICOLON? EOF;

statementOrCommand: (preparsedStatement | consoleCommand);

preparsedStatement:
   cypher5Query;

cypher5Query:
   preparserOption? statement_Cypher5;

cypher5:
   CYPHER FIVE;

cypher25:
   CYPHER TWENTYFIVE;

preparserOption:
   EXPLAIN | PROFILE;

consoleCommand: 
    COLON (clearCmd | historyCmd | useCmd | paramsCmd);

paramsCmd: PARAM paramsArgs?;

paramsArgs: (CLEAR | listCompletionRule | map_Cypher5 | lambda);

lambda: unescapedSymbolicNameString_Cypher5 EQ GT expression_Cypher5;

clearCmd: CLEAR;

historyCmd: HISTORY;

useCmd: useCompletionRule symbolicAliasName_Cypher5?;

// These rules are needed to distinguish cypher <-> commands, for exapmle `USE` and `:use` in autocompletion
listCompletionRule: LIST; 

useCompletionRule: USE;

externalKeywords: preparserOption | HISTORY | CLEAR | PARAM;

unescapedLabelSymbolicNameString_Cypher5:
   unescapedLabelSymbolicNameString__Cypher5 | externalKeywords;
