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
    | styleCmd
    | playCmd
    | accessModeCmd
);

paramsCmd: PARAM paramsArgs?;

paramsArgs: (CLEAR | listCompletionRule | map | lambda);

lambda: parameterName["ANY"] EQ GT expression;

clearCmd: CLEAR;

historyCmd: HISTORY;

useCmd: useCompletionRule symbolicAliasName?;

serverCmd: serverCompletionRule serverArgs;

serverArgs: (CONNECT | DISCONNECT);

connectCmd: CONNECT;

disconnectCmd: DISCONNECT;

sysInfoCmd: SYSINFO;

styleCmd: STYLE RESET?;

welcomeCmd: WELCOME;

playCmd: PLAY;

accessModeCompletionRule: ACCESSMODE;

accessModeArgs: (readCompletionRule | writeCompletionRule);

accessModeCmd: accessModeCompletionRule accessModeArgs;

// These rules are needed to distinguish cypher <-> commands, for exapmle `USE` and `:use` in autocompletion
listCompletionRule: LIST; 

useCompletionRule: USE;

serverCompletionRule: SERVER;

readCompletionRule: READ;

writeCompletionRule: WRITE;

// This rule overrides the identifiers adding EXPLAIN, PROFILE, etc
unescapedSymbolicNameString: 
    preparserKeyword 
    | HISTORY
    | CLEAR
    | PARAM
    | CONNECT
    | DISCONNECT
    | WELCOME
    | SYSINFO
    | unescapedSymbolicNameString_
    ;
