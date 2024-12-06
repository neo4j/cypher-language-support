parser grammar CypherCmdParser;

import CypherPreParser;

options { tokenVocab = CypherCmdLexer; }

statementsOrCommands: statementOrCommand (SEMICOLON statementOrCommand)* SEMICOLON? EOF;

statementOrCommand: (preparsedStatement | consoleCommand);

consoleCommand: COLON (
    clearCmd
    | historyCmd
    | useCmd
    | paramsCmd
    | serverCmd
    | connectCmd
    | disconnectCmd
    | welcomeCmd
    | sysInfoCmd
);

paramsCmd: PARAM paramsArgs?;

paramsArgs: (CLEAR | listCompletionRule | map | lambda);

lambda: symbolicNameString EQ GT expression;

clearCmd: CLEAR;

historyCmd: HISTORY;

useCmd: useCompletionRule symbolicAliasName?;

serverCmd: serverCompletionRule serverArgs;

serverArgs: (CONNECT | DISCONNECT);

connectCmd: CONNECT;

disconnectCmd: DISCONNECT;

sysInfoCmd: SYSINFO;

welcomeCmd: WELCOME;

// These rules are needed to distinguish cypher <-> commands, for exapmle `USE` and `:use` in autocompletion
listCompletionRule: LIST; 

useCompletionRule: USE;

serverCompletionRule: SERVER;

// This rule overrides the identifiers adding EXPLAIN, PROFILE, etc
unescapedLabelSymbolicNameString: 
    preparserOption 
    | HISTORY
    | CLEAR
    | PARAM
    | CONNECT
    | DISCONNECT
    | WELCOME
    | SYSINFO
    | unescapedLabelSymbolicNameString_
    ;
