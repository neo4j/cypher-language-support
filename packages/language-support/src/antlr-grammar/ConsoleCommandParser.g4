parser grammar ConsoleCommandParser;

import CypherParser;

options { tokenVocab = ConsoleCommandLexer; }

fullStatements: (SEMICOLON statementOrCommand)* statementOrCommand SEMICOLON? EOF;

statementOrCommand: (consoleCommand | statement);

consoleCommand: COLON (helpCmd | playCmd | clearCmd | history | use | paramsCmd /*| deprecatedCommand*/);


paramsCmd: PARAM (LIST | CLEAR | SHOW | map | lambda)?; 

lambda: unescapedSymbolicNameString EQ ARROW_RIGHT_HEAD expression;

helpCmd: HELP helpTopic;

helpTopic: HELP unescapedSymbolicNameString;

playCmd: PLAY guideNameOrUrl;

guideNameOrUrl: unescapedSymbolicNameString;

clearCmd: CLEAR;

history: HISTORY;

use: USE symbolicAliasName;


// Lista -> supported commands -> tom för 



/* TODO: 
semantic analysis
grass
gamla commandon
highlighting // lexer types

deprecatedCommand: (auto | config | dbs | delete | get | head | post | put | schema | server | style | sysinfo);

auto: AUTO anything;

/* 
Browser commands.

Available commands:
  :begin        Open a transaction
  :commit       Commit the currently open transaction
  :connect      Connects to a database
  :disconnect   Disconnects from database
  :exit         Exit the logger
  :help         Show this help message
  :history      Statement history
  :impersonate  Impersonate user
  :param        Set, list or clear query parameters
  :rollback     Rollback the currently open transaction
  :source       Executes Cypher statements from a file
  :sysinfo      Show Neo4j system information 
  :use          Set the active database

:auto <Cypher query>
:clear
:config
:config <key-value>
:config {}
:config {<key-value pairs>}
:dbs
:delete <request>
:get <request>
:guide
:guide <guide-name>
:guide <URL>
:help
:head <request>
:history
:history clear
:put <request>
:play
:play <guide-name>
:play <URL>
:post <request>
:param <key-value>
:params
:params {}
:params {<key-value pairs>}
:queries
:style
:style <CSS>
:style reset
:server change-password / connect 
:server connect
:server disconnect
:server status
:schema
:sysinfo
:use <database>

Available commands:
  :begin        Open a transaction
  :commit       Commit the currently open transaction
  :connect      Connects to a database
  :disconnect   Disconnects from database
  :exit         Exit the logger
  :help         Show this help message
  :history      Statement history
  :impersonate  Impersonate user
  :param        Set, list or clear query parameters
  :rollback     Rollback the currently open transaction
  :source       Executes Cypher statements from a file
  :sysinfo      Show Neo4j system information 
  :use          Set the active database

 */