parser grammar CypherParser;


options { tokenVocab = CypherLexer; }
statements
   : statement+ EOF
   ;

statement
   : periodicCommitQueryHintFailure? (useClause singleQueryOrCommandWithUseClause | singleQueryOrCommand) SEMICOLON?
   ;

singleQueryOrCommand
   : (createCommand | command | singleQuery union*)
   ;

singleQueryOrCommandWithUseClause
   : (createCommand | command | singleQueryWithUseClause union*)
   ;

periodicCommitQueryHintFailure
   : USING PERIODIC COMMIT UNSIGNED_DECIMAL_INTEGER?
   ;

regularQuery
   : singleQuery union*
   ;

union
   : UNION ALL? singleQuery
   ;

singleQuery
   : clause+
   ;

singleQueryWithUseClause
   : clause*
   ;

clause
   : (useClause | returnClause | createClause | deleteClause | setClause | removeClause | matchClause | mergeClause | withClause | unwindClause | callClause | subqueryClause | loadCSVClause | foreachClause)
   ;

useClause
   : USE (GRAPH expression | expression)
   ;

returnClause
   : RETURN returnBody
   ;

returnBody
   : DISTINCT? returnItems (ORDER BY orderItem (COMMA orderItem)*)? skip? limit?
   ;

returnItem
   : expression (AS variable)?
   ;

returnItems
   : (TIMES (COMMA returnItem)* | returnItem (COMMA returnItem)*)
   ;

orderItem
   : expression (DESC | ASC?)
   ;

skip
   : SKIPROWS expression
   ;

limit
   : LIMITROWS expression
   ;

whereClause
   : WHERE expression
   ;

withClause
   : WITH returnBody whereClause?
   ;

createClause
   : CREATE patternList
   ;

setClause
   : SET setItem (COMMA setItem)*
   ;

setItem
   : (propertyExpression EQ expression | variable EQ expression | variable PLUSEQUAL expression | variable nodeLabels)
   ;

removeClause
   : REMOVE removeItem (COMMA removeItem)*
   ;

removeItem
   : (propertyExpression | variable nodeLabels)
   ;

deleteClause
   : DETACH? DELETE expression (COMMA expression)*
   ;

matchClause
   : ((OPTIONAL MATCH) | MATCH) patternList hints* whereClause?
   ;

hints
   : USING (INDEX indexHintBody | BTREE INDEX indexHintBody | TEXT INDEX indexHintBody | RANGE INDEX indexHintBody | POINT INDEX indexHintBody | JOIN ON variableList1 | SCAN variable labelOrRelType)
   ;

indexHintBody
   : SEEK? variable labelOrRelType LPAREN symbolicNameList1 RPAREN
   ;

mergeClause
   : MERGE pattern (ON (MATCH setClause | CREATE setClause))*
   ;

unwindClause
   : UNWIND expression AS variable
   ;

callClause
   : CALL procedureName (LPAREN procedureArgument? (COMMA procedureArgument)* RPAREN)? (YIELD (TIMES | procedureResultItem (COMMA procedureResultItem)* whereClause?))?
   ;

procedureName
   : namespace symbolicNameString
   ;

procedureArgument
   : expression
   ;

procedureResultItem
   : symbolicNameString (AS variable)?
   ;

loadCSVClause
   : LOAD CSV (WITH HEADERS)? FROM expression AS variable (FIELDTERMINATOR stringToken)?
   ;

foreachClause
   : FOREACH LPAREN variable IN expression BAR clause+ RPAREN
   ;

subqueryClause
   : CALL LCURLY regularQuery RCURLY subqueryInTransactionsParameters?
   ;

subqueryInTransactionsParameters
   : IN TRANSACTIONS (subqueryInTransactionsBatchParameters | subqueryInTransactionsErrorParameters | subqueryInTransactionsReportParameters)*
   ;

subqueryInTransactionsBatchParameters
   : OF expression (ROW | ROWS)
   ;

subqueryInTransactionsErrorParameters
   : ON ERROR (CONTINUE | BREAK | FAIL)
   ;

subqueryInTransactionsReportParameters
   : REPORT STATUS AS variable
   ;

patternList
   : pattern (COMMA pattern)*
   ;

pattern
   : (variable EQ anonymousPattern | anonymousPattern)
   ;

quantifier
   : (LCURLY UNSIGNED_DECIMAL_INTEGER RCURLY | LCURLY UNSIGNED_DECIMAL_INTEGER? COMMA UNSIGNED_DECIMAL_INTEGER? RCURLY | PLUS | TIMES)
   ;

anonymousPattern
   : (shortestPathPattern | everyPathPattern)
   ;

shortestPathPattern
   : (SHORTEST_PATH LPAREN everyPathPattern RPAREN | ALL_SHORTEST_PATH LPAREN everyPathPattern RPAREN)
   ;

maybeQuantifiedRelationshipPattern
   : relationshipPattern quantifier?
   ;

everyPathPattern
   : (nodePattern (maybeQuantifiedRelationshipPattern nodePattern)* | parenthesizedPath)+
   ;

everyPathPatternNonEmpty
   : nodePattern (relationshipPattern nodePattern)+
   ;

nodePattern
   : LPAREN (variable WHERE expression | variable properties (WHERE expression)? | WHERE expression | variable? labelExpression? properties? (WHERE expression)?) RPAREN
   ;

parenthesizedPath
   : LPAREN pattern (WHERE expression)? RPAREN quantifier?
   ;

nodeLabels
   : labelOrRelType+
   ;

labelExpressionPredicate
   : labelExpression
   ;

labelOrRelType
   : COLON symbolicNameString
   ;

labelOrRelTypes
   : COLON symbolicNameString (BAR symbolicNameString)*
   ;

properties
   : (mapLiteral | parameter)
   ;

relationshipPattern
   : leftArrow? arrowLine (LBRACKET (variable WHERE expression | variable properties (WHERE expression)? | WHERE expression | variable? labelExpression? pathLength? properties? (WHERE expression)?) RBRACKET)? arrowLine rightArrow?
   ;

leftArrow
   : (LT | ARROW_LEFT_HEAD)
   ;

arrowLine
   : (ARROW_LINE | MINUS)
   ;

rightArrow
   : (GT | ARROW_RIGHT_HEAD)
   ;

pathLength
   : TIMES pathLengthLiteral?
   ;

pathLengthLiteral
   : (UNSIGNED_DECIMAL_INTEGER? DOTDOT UNSIGNED_DECIMAL_INTEGER? | UNSIGNED_DECIMAL_INTEGER)
   ;

labelExpression
   : COLON labelExpressionName
   ;

labelExpressionName
   : (labelExpression4ExpectingBar | labelExpression4)
   ;

labelExpression4
   : labelExpression3 (BAR (COLON labelExpression3 | labelExpression3))*
   ;

labelExpression4ExpectingBar
   : labelExpression3 (BAR (COLON labelExpression3 | labelExpression3))*
   ;

labelExpression3
   : labelExpression2 (AMPERSAND labelExpression2 | COLON labelExpression2)*
   ;

labelExpression2
   : (EXCLAMATION_MARK labelExpression2 | labelExpression1)
   ;

labelExpression1
   : (LPAREN labelExpression4 RPAREN) #ParenthesizedLabelExpression
     | PERCENT                        #AnyLabel
     | symbolicNameString             #LabelName
   ;

expression
   : expression12
   ;

expression12
   : expression11 (OR expression11)*
   ;

expression11
   : expression10 (XOR expression10)*
   ;

expression10
   : expression9 (AND expression9)*
   ;

expression9
   : (NOT expression9 | expression8)
   ;

expression8
   : expression7 (EQ expression7 | NEQ expression7 | NEQ2 expression7 | LE expression7 | GE expression7 | LT expression7 | GT expression7)*
   ;

expression7
   : expression6 comparisonExpression6?
   ;

comparisonExpression6
   : (REGEQ expression6 | STARTS WITH expression6 | ENDS WITH expression6 | CONTAINS expression6 | IN expression6 | IS (NULL | NOT NULL))
   ;

expression6
   : expression5 (PLUS expression5 | MINUS expression5)*
   ;

expression5
   : expression4 (TIMES expression4 | DIVIDE expression4 | PERCENT expression4)*
   ;

expression4
   : expression3 (POW expression3)*
   ;

expression3
   : (expression2 | PLUS expression2 | MINUS expression2)
   ;

expression2
   : expression1 postFix1*
   ;

postFix1
   : (property | labelExpressionPredicate | LBRACKET expression RBRACKET | LBRACKET expression? DOTDOT expression? RBRACKET)
   ;

property
   : DOT propertyKeyName
   ;

propertyExpression
   : expression1 property+
   ;

expression1
   : literal | parameter | caseExpression | COUNT LPAREN TIMES RPAREN | existsExpression | countExpression | mapProjection | listComprehension | patternComprehension | reduceExpression | allExpression | anyExpression | noneExpression | singleExpression | patternExpression | shortestPathExpression | LPAREN expression RPAREN | functionInvocation | variable
   ;

literal
   : numberLiteral    #NummericLiteral
   | stringLiteral    #StringsLiteral
   | mapLiteral       #OtherLiteral
   | listLiteral      #OtherLiteral
   | TRUE             #BooleanLiteral
   | FALSE            #BooleanLiteral
   | (INFINITY | INF) #KeywordLiteral
   | NAN              #KeywordLiteral
   | NULL             #KeywordLiteral
   ;

caseExpression
   : CASE (expression WHEN | WHEN) expression THEN expression (WHEN expression THEN expression)* (ELSE expression)? END
   ;

listComprehension
   : LBRACKET variable IN expression (WHERE expression)? (BAR expression)? RBRACKET
   ;

patternComprehension
   : LBRACKET (variable EQ)? everyPathPatternNonEmpty (WHERE expression)? BAR expression RBRACKET
   ;

patternComprehensionPrefix
   : LBRACKET (variable EQ)? everyPathPattern (WHERE | BAR)
   ;

reduceExpression
   : REDUCE LPAREN variable EQ expression COMMA variable IN expression BAR expression RPAREN
   ;

allExpression
   : ALL LPAREN variable IN expression (WHERE expression)? RPAREN
   ;

anyExpression
   : ANY LPAREN variable IN expression (WHERE expression)? RPAREN
   ;

noneExpression
   : NONE LPAREN variable IN expression (WHERE expression)? RPAREN
   ;

singleExpression
   : SINGLE LPAREN variable IN expression (WHERE expression)? RPAREN
   ;

patternExpression
   : everyPathPatternNonEmpty
   ;

shortestPathExpression
   : shortestPathPattern
   ;

mapProjection
   : variable LCURLY mapProjectionItem? (COMMA mapProjectionItem)* RCURLY
   ;

mapProjectionItem
   : (propertyKeyName COLON expression | DOT propertyKeyName | variable | DOT TIMES)
   ;

existsExpression
   : EXISTS LCURLY (regularQuery | patternList whereClause?) RCURLY
   ;

countExpression
   : COUNT LCURLY (regularQuery | patternList whereClause?) RCURLY
   ;

stringLiteral
   : stringToken
   ;

numberLiteral
   : MINUS? (DECIMAL_DOUBLE | UNSIGNED_DECIMAL_INTEGER | UNSIGNED_HEX_INTEGER | UNSIGNED_OCTAL_INTEGER)
   ;

signedIntegerLiteral
   : MINUS? UNSIGNED_DECIMAL_INTEGER
   ;

listLiteral
   : LBRACKET expression? (COMMA expression)* RBRACKET
   ;

mapLiteral
   : LCURLY (propertyKeyName COLON expression)? (COMMA propertyKeyName COLON expression)* RCURLY
   ;

propertyKeyName
   : symbolicNameString
   ;

parameter
   : DOLLAR parameterName
   ;

parameterName
   : (variable | UNSIGNED_DECIMAL_INTEGER)
   ;

functionInvocation
   : functionName LPAREN DISTINCT? functionArgument? (COMMA functionArgument)* RPAREN
   ;

functionName
   : namespace symbolicNameString
   ;

functionArgument
   : expression
   ;

namespace
   : (symbolicNameString DOT)*
   ;

variableList1
   : symbolicNameString (COMMA symbolicNameString)*
   ;

variable
   : symbolicNameString
   ;

symbolicNameList1
   : symbolicNameString (COMMA symbolicNameString)*
   ;

createCommand
   : CREATE (OR REPLACE)? (createRole | createUser | createDatabase | createConstraint | createIndex | createAlias | createCompositeDatabase)
   ;

command
   : (commandWithUseGraph | showCommand | terminateCommand)
   ;

commandWithUseGraph
   : (dropCommand | alterCommand | renameCommand | denyPrivilege | revokeCommand | grantCommand | startDatabase | stopDatabase | enableServerCommand | allocationCommand)
   ;

dropCommand
   : DROP (dropRole | dropUser | dropDatabase | dropConstraint | dropIndex | dropAlias | dropServer)
   ;

alterCommand
   : ALTER (alterDatabase | alterAlias | alterCurrentUser | alterUser | alterServer)
   ;

showCommand
   : SHOW (ALL showAllCommand | POPULATED (ROLES | ROLE) showRoles | BTREE showIndexesAllowBrief | RANGE showIndexesNoBrief | FULLTEXT showIndexesNoBrief | TEXT showIndexesNoBrief | POINT showIndexesNoBrief | LOOKUP showIndexesNoBrief | UNIQUE showConstraintsAllowBriefAndYield | UNIQUENESS showConstraintsAllowYield | KEY showConstraintsAllowYield | NODE showNodeCommand | PROPERTY showPropertyCommand | EXISTENCE showConstraintsAllowYield | EXISTS showConstraintsAllowBrief | EXIST showConstraintsAllowBriefAndYield | RELATIONSHIP showRelationshipCommand | REL showRelCommand | BUILT IN showFunctions | showIndexesAllowBrief | showDatabase | showCurrentUser | showConstraintsAllowBriefAndYield | showProcedures | showSettings | showFunctions | showTransactions | showAliases | showServers | showPrivileges | (ROLES | ROLE) (showRolePrivileges | showRoles | showRolePrivileges) | USER DEFINED showFunctions | (USERS | USER) (showUserPrivileges | showUsers | showUserPrivileges))
   ;

terminateCommand
   : TERMINATE terminateTransactions
   ;

showAllCommand
   : ((ROLES | ROLE) showRoles | showIndexesAllowBrief | showConstraintsAllowBriefAndYield | showFunctions | showPrivileges)
   ;

showNodeCommand
   : ((UNIQUE | UNIQUENESS) showConstraintsAllowYield | KEY showConstraintsAllowBriefAndYield | PROPERTY showPropertyCommand | EXISTENCE showConstraintsAllowYield | EXISTS showConstraintsAllowBrief | EXIST showConstraintsAllowBriefAndYield)
   ;

showRelationshipCommand
   : ((UNIQUE | UNIQUENESS) showConstraintsAllowYield | KEY showConstraintsAllowYield | PROPERTY showPropertyCommand | EXISTENCE showConstraintsAllowYield | EXISTS showConstraintsAllowBrief | EXIST showConstraintsAllowBriefAndYield)
   ;

showRelCommand
   : ((UNIQUE | UNIQUENESS) showConstraintsAllowYield | KEY showConstraintsAllowYield | PROPERTY showPropertyCommand | EXISTENCE showConstraintsAllowYield | EXIST showConstraintsAllowYield)
   ;

showPropertyCommand
   : (EXISTENCE | EXIST) showConstraintsAllowYield
   ;

yieldItem
   : variable (AS variable)?
   ;

yieldClause
   : YIELD (TIMES | yieldItem (COMMA yieldItem)*) (ORDER BY orderItem (COMMA orderItem)*)? (SKIPROWS signedIntegerLiteral)? (LIMITROWS signedIntegerLiteral)? whereClause?
   ;

showIndexesAllowBrief
   : (INDEX | INDEXES) ((BRIEF | VERBOSE) OUTPUT? | yieldClause returnClause? | whereClause)?
   ;

showIndexesNoBrief
   : (INDEX | INDEXES) (yieldClause returnClause? | whereClause)?
   ;

showConstraintsAllowBriefAndYield
   : (CONSTRAINT | CONSTRAINTS) ((BRIEF | VERBOSE) OUTPUT? | yieldClause returnClause? | whereClause)?
   ;

showConstraintsAllowBrief
   : (CONSTRAINT | CONSTRAINTS) ((BRIEF | VERBOSE) OUTPUT?)?
   ;

showConstraintsAllowYield
   : (CONSTRAINT | CONSTRAINTS) (yieldClause returnClause? | whereClause)?
   ;

showProcedures
   : (PROCEDURE | PROCEDURES) (EXECUTABLE (BY (CURRENT USER | symbolicNameString))?)? (yieldClause returnClause? | whereClause)?
   ;

showFunctions
   : (FUNCTION | FUNCTIONS) (EXECUTABLE (BY (CURRENT USER | symbolicNameString))?)? (yieldClause returnClause? | whereClause)?
   ;

showTransactions
   : (TRANSACTION | TRANSACTIONS) (showOrTerminateTransactions | (stringsOrExpression (yieldClause returnClause? | whereClause) | yieldClause returnClause? | whereClause | stringsOrExpression) showOrTerminateTransactions?)?
   ;

terminateTransactions
   : (TRANSACTION | TRANSACTIONS) (showOrTerminateTransactions | (stringsOrExpression (yieldClause returnClause? | whereClause) | yieldClause returnClause? | whereClause | stringsOrExpression) showOrTerminateTransactions?)?
   ;

showOrTerminateTransactions
   : (TERMINATE terminateTransactions | SHOW showTransactions)
   ;

stringsOrExpression
   : (stringList | expression)
   ;

showSettings
   : (SETTING | SETTINGS) (stringsOrExpression (yieldClause returnClause? | whereClause) | yieldClause returnClause? | whereClause | stringsOrExpression)?
   ;

createConstraint
   : CONSTRAINT (ON LPAREN | FOR LPAREN | IF NOT EXISTS (ON | FOR) LPAREN | symbolicNameString? (IF NOT EXISTS)? (ON | FOR) LPAREN) (variable labelOrRelType RPAREN | RPAREN leftArrow? arrowLine LBRACKET variable labelOrRelType RBRACKET arrowLine rightArrow? LPAREN RPAREN) (ASSERT EXISTS propertyList | (REQUIRE | ASSERT) propertyList IS (UNIQUE | KEY | NODE (KEY | UNIQUE) | (RELATIONSHIP | REL) (KEY | UNIQUE) | NOT NULL)) (OPTIONS mapOrParameter)?
   ;

dropConstraint
   : CONSTRAINT (ON LPAREN (variable labelOrRelType RPAREN | RPAREN leftArrow? arrowLine LBRACKET variable labelOrRelType RBRACKET arrowLine rightArrow? LPAREN RPAREN) ASSERT (EXISTS propertyList | propertyList IS (UNIQUE | NODE KEY | NOT NULL)) | symbolicNameString (IF EXISTS)?)
   ;

createIndex
   : (BTREE INDEX createIndex_ | RANGE INDEX createIndex_ | FULLTEXT INDEX createFulltextIndex | TEXT INDEX createIndex_ | POINT INDEX createIndex_ | LOOKUP INDEX createLookupIndex | INDEX (ON oldCreateIndex | createIndex_))
   ;

oldCreateIndex
   : labelOrRelType LPAREN symbolicNamePositions RPAREN
   ;

createIndex_
   : (FOR LPAREN | IF NOT EXISTS FOR LPAREN | symbolicNameString (IF NOT EXISTS)? FOR LPAREN) (variable labelOrRelType RPAREN | RPAREN leftArrow? arrowLine LBRACKET variable labelOrRelType RBRACKET arrowLine rightArrow? LPAREN RPAREN) ON propertyList (OPTIONS mapOrParameter)? createIndex
   ;

createFulltextIndex
   : (FOR LPAREN | IF NOT EXISTS FOR LPAREN | symbolicNameString (IF NOT EXISTS)? FOR LPAREN) (variable labelOrRelTypes RPAREN | RPAREN leftArrow? arrowLine LBRACKET variable labelOrRelTypes RBRACKET arrowLine rightArrow? LPAREN RPAREN) ON EACH LBRACKET variable property (COMMA variable property)* RBRACKET (OPTIONS mapOrParameter)? createFulltextIndex
   ;

createLookupIndex
   : (FOR LPAREN | IF NOT EXISTS FOR LPAREN | symbolicNameString (IF NOT EXISTS)? FOR LPAREN) (variable RPAREN ON EACH | RPAREN leftArrow? arrowLine LBRACKET variable RBRACKET arrowLine rightArrow? LPAREN RPAREN ON EACH?) symbolicNameString LPAREN variable RPAREN (OPTIONS mapOrParameter)? createLookupIndex
   ;

dropIndex
   : INDEX (ON labelOrRelType LPAREN symbolicNamePositions RPAREN | symbolicNameString (IF EXISTS)?)
   ;

propertyList
   : (variable property | LPAREN variable property (COMMA variable property)* RPAREN)
   ;

renameCommand
   : RENAME (renameRole | renameUser | renameServer)
   ;

grantCommand
   : GRANT (IMMUTABLE (grantPrivilege | ROLE grantRoleManagement) | (grantPrivilege | ROLE (grantRoleManagement | grantRole) | ROLES grantRole))
   ;

revokeCommand
   : REVOKE (DENY IMMUTABLE? (revokePrivilege | ROLE revokeRoleManagement) | GRANT IMMUTABLE? (revokePrivilege | ROLE revokeRoleManagement) | IMMUTABLE (revokePrivilege | ROLE revokeRoleManagement) | (revokePrivilege | ROLE revokeRoleManagement | (ROLE | ROLES) revokeRole))
   ;

enableServerCommand
   : ENABLE SERVER stringOrParameter options_?
   ;

alterServer
   : SERVER stringOrParameter SET options_
   ;

renameServer
   : SERVER stringOrParameter TO stringOrParameter
   ;

dropServer
   : SERVER stringOrParameter
   ;

showServers
   : (SERVERS | SERVER) (yieldClause returnClause? | whereClause)?
   ;

allocationCommand
   : DRYRUN? (deallocateDatabaseFromServers | reallocateDatabases)
   ;

deallocateDatabaseFromServers
   : DEALLOCATE (DATABASE | DATABASES) FROM (SERVER | SERVERS) stringOrParameter (COMMA stringOrParameter)*
   ;

reallocateDatabases
   : REALLOCATE (DATABASE | DATABASES)
   ;

createRole
   : ROLE symbolicNameOrStringParameter (IF NOT EXISTS)? (AS COPY OF symbolicNameOrStringParameter)?
   ;

dropRole
   : ROLE symbolicNameOrStringParameter (IF EXISTS)?
   ;

renameRole
   : ROLE symbolicNameOrStringParameter (IF EXISTS)? TO symbolicNameOrStringParameter
   ;

showRoles
   : (WITH (USERS | USER))? (yieldClause returnClause? | whereClause)?
   ;

grantRole
   : symbolicNameOrStringParameterList TO symbolicNameOrStringParameterList
   ;

revokeRole
   : symbolicNameOrStringParameterList FROM symbolicNameOrStringParameterList
   ;

createUser
   : USER symbolicNameOrStringParameter (IF NOT EXISTS)? SET (PLAINTEXT | ENCRYPTED)? PASSWORD passwordExpression passwordChangeRequired? (SET (PASSWORD passwordChangeRequired | userStatus | homeDatabase))*
   ;

dropUser
   : USER symbolicNameOrStringParameter (IF EXISTS)?
   ;

renameUser
   : USER symbolicNameOrStringParameter (IF EXISTS)? TO symbolicNameOrStringParameter
   ;

alterCurrentUser
   : CURRENT USER SET PASSWORD FROM passwordExpression TO passwordExpression
   ;

alterUser
   : USER symbolicNameOrStringParameter (IF EXISTS)? ((SET (PLAINTEXT PASSWORD setPassword passwordChangeRequired? | ENCRYPTED PASSWORD setPassword passwordChangeRequired? | PASSWORD (passwordChangeRequired | setPassword passwordChangeRequired?) | userStatus | homeDatabase))+ | REMOVE HOME DATABASE)
   ;

setPassword
   : passwordExpression
   ;

passwordExpression
   : stringToken | parameter
   ;

passwordChangeRequired
   : CHANGE NOT? REQUIRED
   ;

userStatus
   : STATUS (SUSPENDED | ACTIVE)
   ;

homeDatabase
   : HOME DATABASE symbolicAliasName
   ;

showUsers
   : (yieldClause returnClause? | whereClause)?
   ;

showCurrentUser
   : CURRENT USER (yieldClause returnClause? | whereClause)?
   ;

showPrivileges
   : (PRIVILEGE | PRIVILEGES) (AS REVOKE? (COMMAND | COMMANDS))? (yieldClause returnClause? | whereClause)?
   ;

showRolePrivileges
   : symbolicNameOrStringParameterList (PRIVILEGE | PRIVILEGES) (AS REVOKE? (COMMAND | COMMANDS))? (yieldClause returnClause? | whereClause)?
   ;

showUserPrivileges
   : (symbolicNameOrStringParameterList (PRIVILEGE | PRIVILEGES) | (PRIVILEGE | PRIVILEGES) | symbolicNameOrStringParameterList (PRIVILEGE | PRIVILEGES)) (AS REVOKE? (COMMAND | COMMANDS))? (yieldClause returnClause? | whereClause)?
   ;

grantRoleManagement
   : roleManagementPrivilege TO symbolicNameOrStringParameterList grantPrivilege
   ;

revokeRoleManagement
   : roleManagementPrivilege FROM symbolicNameOrStringParameterList
   ;

roleManagementPrivilege
   : MANAGEMENT ON DBMS dbmsPrivilege
   ;

grantPrivilege
   : privilege TO symbolicNameOrStringParameterList grantPrivilege
   ;

denyPrivilege
   : DENY IMMUTABLE? (privilege | ROLE roleManagementPrivilege) TO symbolicNameOrStringParameterList
   ;

revokePrivilege
   : privilege FROM symbolicNameOrStringParameterList
   ;

privilege
   : (allPrivilege | createPrivilege | dropPrivilege | showPrivilege | setPrivilege | removePrivilege | databasePrivilege | dbmsPrivilege | writePrivilege | qualifiedGraphPrivileges | qualifiedGraphPrivilegesWithProperty)
   ;

allPrivilege
   : ALL ((DBMS | GRAPH | DATABASE)? PRIVILEGES)? ON (DEFAULT_TOKEN (GRAPH | DATABASE databasePrivilege) | HOME (GRAPH | DATABASE databasePrivilege) | DBMS dbmsPrivilege | (GRAPH | GRAPHS) (TIMES | symbolicAliasNameList) | (DATABASE | DATABASES) (TIMES | symbolicAliasNameList) databasePrivilege)
   ;

createPrivilege
   : CREATE (((INDEX | INDEXES) | (CONSTRAINT | CONSTRAINTS) | NEW (NODE? (LABEL | LABELS) | RELATIONSHIP? (TYPE | TYPES) | PROPERTY? (NAME | NAMES))) ON databaseScopeList databasePrivilege | (DATABASE | ALIAS | ROLE | USER | COMPOSITE DATABASE) ON DBMS dbmsPrivilege | ON graphScopeList graphQualifier)
   ;

dropPrivilege
   : DROP (((INDEX | INDEXES) | (CONSTRAINT | CONSTRAINTS)) ON databaseScopeList databasePrivilege | (DATABASE | ALIAS | ROLE | USER | COMPOSITE DATABASE) ON DBMS dbmsPrivilege)
   ;

showPrivilege
   : SHOW (((INDEX | INDEXES) | (CONSTRAINT | CONSTRAINTS) | (TRANSACTION | TRANSACTIONS) (LPAREN (TIMES | symbolicNameOrStringParameterList) RPAREN)?) ON databaseScopeList databasePrivilege | (ALIAS | PRIVILEGE | ROLE | USER | (SERVER | SERVERS) | (SETTING | SETTINGS) settingQualifier) ON DBMS dbmsPrivilege)
   ;

setPrivilege
   : SET (((PASSWORD | PASSWORDS) | USER (STATUS | HOME DATABASE) | DATABASE ACCESS) ON DBMS dbmsPrivilege | (LABEL labelResource ON graphScopeList | PROPERTY propertyResource ON graphScopeList graphQualifier))
   ;

removePrivilege
   : REMOVE ((PRIVILEGE | ROLE) ON DBMS dbmsPrivilege | LABEL labelResource ON graphScopeList)
   ;

writePrivilege
   : WRITE ON graphScopeList
   ;

databasePrivilege
   : (ACCESS | START | STOP | (INDEX | INDEXES) MANAGEMENT? | (CONSTRAINT | CONSTRAINTS) MANAGEMENT? | TRANSACTION MANAGEMENT? (LPAREN (TIMES | symbolicNameOrStringParameterList) RPAREN)? | TERMINATE (TRANSACTION | TRANSACTIONS) (LPAREN (TIMES | symbolicNameOrStringParameterList) RPAREN)? | NAME MANAGEMENT?) ON databaseScopeList databasePrivilege
   ;

dbmsPrivilege
   : (ALTER (USER | DATABASE | ALIAS) | ASSIGN (PRIVILEGE | ROLE) | COMPOSITE DATABASE MANAGEMENT | DATABASE MANAGEMENT | ALIAS MANAGEMENT | EXECUTE ((ADMIN | ADMINISTRATOR) PROCEDURES | BOOSTED ((PROCEDURE | PROCEDURES) executeProcedureQualifier | (USER DEFINED?)? (FUNCTION | FUNCTIONS) executeFunctionQualifier) | (PROCEDURE | PROCEDURES) executeProcedureQualifier | (USER DEFINED?)? (FUNCTION | FUNCTIONS) executeFunctionQualifier) | PRIVILEGE MANAGEMENT | RENAME (ROLE | USER) | SERVER MANAGEMENT | USER MANAGEMENT | IMPERSONATE (LPAREN (TIMES | symbolicNameOrStringParameterList) RPAREN)?) ON DBMS dbmsPrivilege
   ;

executeFunctionQualifier
   : globs
   ;

executeProcedureQualifier
   : globs
   ;

settingQualifier
   : globs+
   ;

globs
   : glob (COMMA glob)*
   ;

qualifiedGraphPrivilegesWithProperty
   : (TRAVERSE | READ propertyResource | MATCH propertyResource) ON graphScopeList graphQualifier (LPAREN TIMES RPAREN)?
   ;

qualifiedGraphPrivileges
   : (DELETE | MERGE propertyResource) ON graphScopeList graphQualifier
   ;

labelResource
   : (TIMES | symbolicNameList1)
   ;

propertyResource
   : LCURLY (TIMES | symbolicNameList1) RCURLY
   ;

graphQualifier
   : ((RELATIONSHIP | RELATIONSHIPS) (TIMES | symbolicNameString (COMMA symbolicNameString)*) | (NODE | NODES) (TIMES | symbolicNameString (COMMA symbolicNameString)*) | (ELEMENT | ELEMENTS) (TIMES | symbolicNameString (COMMA symbolicNameString)*))?
   ;

createDatabase
   : DATABASE symbolicAliasName (IF NOT EXISTS)? (TOPOLOGY (UNSIGNED_DECIMAL_INTEGER ((PRIMARY | PRIMARIES) | (SECONDARY | SECONDARIES)))+)? options_? waitClause?
   ;

options_
   : OPTIONS mapOrParameter
   ;

createCompositeDatabase
   : COMPOSITE DATABASE symbolicAliasName (IF NOT EXISTS)? options_? waitClause?
   ;

dropDatabase
   : COMPOSITE? DATABASE symbolicAliasName (IF EXISTS)? ((DUMP | DESTROY) DATA)? waitClause?
   ;

alterDatabase
   : DATABASE symbolicAliasName (IF EXISTS)? ((SET (ACCESS READ (ONLY | WRITE) | TOPOLOGY (UNSIGNED_DECIMAL_INTEGER ((PRIMARY | PRIMARIES) | (SECONDARY | SECONDARIES)))+ | OPTION symbolicNameString expression))+ | (REMOVE OPTION symbolicNameString)+)
   ;

startDatabase
   : START DATABASE symbolicAliasName waitClause?
   ;

stopDatabase
   : STOP DATABASE symbolicAliasName waitClause?
   ;

waitClause
   : (WAIT (UNSIGNED_DECIMAL_INTEGER (SEC | SECOND | SECONDS)?)? | NOWAIT)
   ;

showDatabase
   : ((DATABASES | DATABASE) (symbolicAliasName (yieldClause returnClause? | whereClause) | yieldClause returnClause? | whereClause | symbolicAliasName)? | (DEFAULT_TOKEN DATABASE | HOME DATABASE) (yieldClause returnClause? | whereClause)?)
   ;

databaseScopeList
   : ((DATABASE | DATABASES) (TIMES | symbolicAliasNameList) | DEFAULT_TOKEN DATABASE | HOME DATABASE)
   ;

graphScopeList
   : ((GRAPH | GRAPHS) (TIMES | symbolicAliasNameList) | DEFAULT_TOKEN GRAPH | HOME GRAPH)
   ;

createAlias
   : ALIAS symbolicAliasName (IF NOT EXISTS)? FOR DATABASE symbolicAliasName (AT stringOrParameter USER symbolicNameOrStringParameter PASSWORD passwordExpression (DRIVER mapOrParameter)?)? (PROPERTIES mapOrParameter)?
   ;

dropAlias
   : ALIAS symbolicAliasName (IF EXISTS)? FOR DATABASE
   ;

alterAlias
   : ALIAS symbolicAliasName (IF EXISTS)? SET DATABASE (TARGET symbolicAliasName (AT stringOrParameter)? | USER symbolicNameOrStringParameter | PASSWORD passwordExpression | DRIVER mapOrParameter | PROPERTIES mapOrParameter)+
   ;

showAliases
   : (ALIAS | ALIASES) symbolicAliasName? FOR (DATABASE | DATABASES) (yieldClause returnClause? | whereClause)?
   ;

symbolicAliasNameList
   : symbolicAliasName (COMMA symbolicAliasName)*
   ;

symbolicAliasName
   : (symbolicNameString (DOT symbolicNameString)* | parameter)
   ;

symbolicNameOrStringParameterList
   : symbolicNameOrStringParameter (COMMA symbolicNameOrStringParameter)*
   ;

symbolicNameOrStringParameter
   : (symbolicNameString | parameter)
   ;

glob
   : (escapedSymbolicNameString | escapedSymbolicNameString globRecursive | globRecursive)
   ;

globRecursive
   : (globPart | globPart globRecursive)
   ;

globPart
   : (DOT escapedSymbolicNameString | QUESTION | TIMES | DOT | unescapedSymbolicNameString)
   ;

stringImage
   : stringToken
   ;

stringList
   : stringImage (COMMA stringImage)*
   ;

stringToken
   : (STRING_LITERAL1 | STRING_LITERAL2)
   ;

stringOrParameter
   : (stringToken | parameter)
   ;

mapOrParameter
   : (map | parameter)
   ;

map
   : LCURLY (symbolicNameString COLON expression (COMMA symbolicNameString COLON expression)*)? RCURLY
   ;

symbolicNamePositions
   : symbolicNameString (COMMA symbolicNameString)*
   ;

symbolicNameString
   : (escapedSymbolicNameString | unescapedSymbolicNameString)
   ;

escapedSymbolicNameString
   : ESCAPED_SYMBOLIC_NAME
   ;

unescapedSymbolicNameString
   : (IDENTIFIER |
      ACCESS |
      ACTIVE |
      ADMIN |
      ADMINISTRATOR |
      ALIAS |
      ALIASES |
      ALL_SHORTEST_PATH |
      ALL |
      ALTER |
      AND |
      ANY |
      AS |
      ASC |
      ASSERT |
      ASSIGN |
      AT |
      BOOSTED |
      BREAK |
      BRIEF |
      BTREE |
      BUILT |
      BY |
      CALL |
      CASE |
      CHANGE |
      COMMAND |
      COMMANDS |
      COMMIT |
      COMPOSITE |
      CONSTRAINT |
      CONSTRAINTS |
      CONTAINS |
      CONTINUE |
      COPY |
      COUNT |
      CREATE |
      CSV |
      CURRENT |
      DATA |
      DATABASE |
      DATABASES |
      DBMS |
      DEALLOCATE |
      DEFAULT_TOKEN |
      DEFINED |
      DELETE |
      DENY |
      DESC |
      DESTROY |
      DETACH |
      DISTINCT |
      DRIVER |
      DROP |
      DRYRUN |
      DUMP |
      EACH |
      ELEMENT |
      ELEMENTS |
      ELSE |
      ENABLE |
      ENCRYPTED |
      END |
      ENDS |
      ERROR |
      EXECUTABLE |
      EXECUTE |
      EXIST |
      EXISTENCE |
      EXISTS |
      FAIL |
      FALSE |
      FIELDTERMINATOR |
      FOREACH |
      FOR |
      FROM |
      FULLTEXT |
      FUNCTION |
      FUNCTIONS |
      GRANT |
      GRAPH |
      GRAPHS |
      HEADERS |
      HOME |
      IF |
      IMMUTABLE |
      IN |
      INDEX |
      INDEXES |
      INF |
      INFINITY |
      IS |
      JOIN |
      KEY |
      LABEL |
      LABELS |
      LIMITROWS |
      LOAD |
      LOOKUP |
      MATCH |
      MANAGEMENT |
      MERGE |
      NAME |
      NAMES |
      NAN |
      NEW |
      NODE |
      NODES |
      NONE |
      NOT |
      NOWAIT |
      NULL |
      OF |
      ON |
      ONLY |
      OPTIONAL |
      OPTIONS |
      OPTION |
      OR |
      ORDER |
      OUTPUT |
      PASSWORD |
      PASSWORDS |
      PERIODIC |
      PLAINTEXT |
      POINT |
      POPULATED |
      PRIMARY |
      PRIMARIES |
      PRIVILEGE |
      PRIVILEGES |
      PROCEDURE |
      PROCEDURES |
      PROPERTIES |
      PROPERTY |
      RANGE |
      READ |
      REALLOCATE |
      REDUCE |
      REL |
      RELATIONSHIP |
      RELATIONSHIPS |
      REMOVE |
      RENAME |
      REPLACE |
      REPORT |
      REQUIRE |
      REQUIRED |
      RETURN |
      REVOKE |
      ROLE |
      ROLES |
      ROW |
      ROWS |
      SCAN |
      SEC |
      SECOND |
      SECONDARY |
      SECONDARIES |
      SECONDS |
      SEEK |
      SERVER |
      SERVERS |
      SET |
      SETTING |
      SETTINGS |
      SHORTEST_PATH |
      SHOW |
      SINGLE |
      SKIPROWS |
      START |
      STARTS |
      STATUS |
      STOP |
      SUSPENDED |
      TARGET |
      TERMINATE |
      TEXT |
      THEN |
      TO |
      TOPOLOGY |
      TRANSACTION |
      TRANSACTIONS |
      TRAVERSE |
      TRUE |
      TYPE |
      TYPES |
      UNION |
      UNIQUE |
      UNIQUENESS |
      UNWIND |
      USE |
      USER |
      USERS |
      USING |
      VERBOSE |
      WAIT |
      WHEN |
      WHERE |
      WITH |
      WRITE |
      XOR |
      YIELD)
   ;

endOfFile
   : EOF
   ;

