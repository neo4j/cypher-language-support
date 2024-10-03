/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
parser grammar Cypher25Parser;


options { tokenVocab = Cypher25Lexer; }
statements_Cypher25: statement_Cypher25 (SEMICOLON statement_Cypher25)* SEMICOLON? EOF
   ;

statement_Cypher25: command_Cypher25 | regularQuery_Cypher25
   ;

regularQuery_Cypher25: singleQuery_Cypher25 (UNION (ALL | DISTINCT)? singleQuery_Cypher25)*
   ;

singleQuery_Cypher25: clause_Cypher25+
   ;

clause_Cypher25: useClause_Cypher25
   | finishClause_Cypher25
   | returnClause_Cypher25
   | createClause_Cypher25
   | insertClause_Cypher25
   | deleteClause_Cypher25
   | setClause_Cypher25
   | removeClause_Cypher25
   | matchClause_Cypher25
   | mergeClause_Cypher25
   | withClause_Cypher25
   | unwindClause_Cypher25
   | callClause_Cypher25
   | subqueryClause_Cypher25
   | loadCSVClause_Cypher25
   | foreachClause_Cypher25
   | orderBySkipLimitClause_Cypher25
   ;

useClause_Cypher25: USE GRAPH? graphReference_Cypher25
   ;

graphReference_Cypher25: LPAREN graphReference_Cypher25 RPAREN
   | functionInvocation_Cypher25
   | symbolicAliasName_Cypher25
   ;

finishClause_Cypher25: FINISH
   ;

returnClause_Cypher25: RETURN returnBody_Cypher25
   ;

returnBody_Cypher25: DISTINCT? returnItems_Cypher25 orderBy_Cypher25? skip_Cypher25? limit_Cypher25?
   ;

returnItem_Cypher25: expression_Cypher25 (AS variable_Cypher25)?
   ;

returnItems_Cypher25: (TIMES | returnItem_Cypher25) (COMMA returnItem_Cypher25)*
   ;

orderItem_Cypher25: expression_Cypher25 (ascToken_Cypher25 | descToken_Cypher25)?
   ;

ascToken_Cypher25: ASC | ASCENDING
   ;

descToken_Cypher25: DESC | DESCENDING
   ;

orderBy_Cypher25: ORDER BY orderItem_Cypher25 (COMMA orderItem_Cypher25)*
   ;

skip_Cypher25: (OFFSET | SKIPROWS) expression_Cypher25
   ;

limit_Cypher25: LIMITROWS expression_Cypher25
   ;

whereClause_Cypher25: WHERE expression_Cypher25
   ;

withClause_Cypher25: WITH returnBody_Cypher25 whereClause_Cypher25?
   ;

createClause_Cypher25: CREATE patternList_Cypher25
   ;

insertClause_Cypher25: INSERT insertPatternList_Cypher25
   ;

setClause_Cypher25: SET setItem_Cypher25 (COMMA setItem_Cypher25)*
   ;

setItem_Cypher25: propertyExpression_Cypher25 EQ expression_Cypher25        # SetProp
   | dynamicPropertyExpression_Cypher25 EQ expression_Cypher25 # SetDynamicProp
   | variable_Cypher25 EQ expression_Cypher25                  # SetProps
   | variable_Cypher25 PLUSEQUAL expression_Cypher25           # AddProp
   | variable_Cypher25 nodeLabels_Cypher25                     # SetLabels
   | variable_Cypher25 nodeLabelsIs_Cypher25                   # SetLabelsIs
   ;

removeClause_Cypher25: REMOVE removeItem_Cypher25 (COMMA removeItem_Cypher25)*
   ;

removeItem_Cypher25: propertyExpression_Cypher25         # RemoveProp
   | dynamicPropertyExpression_Cypher25  # RemoveDynamicProp
   | variable_Cypher25 nodeLabels_Cypher25        # RemoveLabels
   | variable_Cypher25 nodeLabelsIs_Cypher25      # RemoveLabelsIs
   ;

deleteClause_Cypher25: (DETACH | NODETACH)? DELETE expression_Cypher25 (COMMA expression_Cypher25)*
   ;

matchClause_Cypher25: OPTIONAL? MATCH matchMode_Cypher25? patternList_Cypher25 hint_Cypher25* whereClause_Cypher25?
   ;

matchMode_Cypher25: REPEATABLE (ELEMENT BINDINGS? | ELEMENTS)
   | DIFFERENT (RELATIONSHIP BINDINGS? | RELATIONSHIPS)
   ;

hint_Cypher25: USING (((
      INDEX
      | TEXT INDEX
      | RANGE INDEX
      | POINT INDEX
   ) SEEK? variable_Cypher25 labelOrRelType_Cypher25 LPAREN nonEmptyNameList_Cypher25 RPAREN)
   | JOIN ON nonEmptyNameList_Cypher25
   | SCAN variable_Cypher25 labelOrRelType_Cypher25
   )
   ;

mergeClause_Cypher25: MERGE pattern_Cypher25 mergeAction_Cypher25*
   ;

mergeAction_Cypher25: ON (MATCH | CREATE) setClause_Cypher25
   ;

unwindClause_Cypher25: UNWIND expression_Cypher25 AS variable_Cypher25
   ;

callClause_Cypher25: OPTIONAL? CALL procedureName_Cypher25 (LPAREN (procedureArgument_Cypher25 (COMMA procedureArgument_Cypher25)*)? RPAREN)? (YIELD (TIMES | procedureResultItem_Cypher25 (COMMA procedureResultItem_Cypher25)* whereClause_Cypher25?))?
   ;

procedureName_Cypher25: namespace_Cypher25 symbolicNameString_Cypher25
   ;

procedureArgument_Cypher25: expression_Cypher25
   ;

procedureResultItem_Cypher25: symbolicNameString_Cypher25 (AS variable_Cypher25)?
   ;

loadCSVClause_Cypher25: LOAD CSV (WITH HEADERS)? FROM expression_Cypher25 AS variable_Cypher25 (FIELDTERMINATOR stringLiteral_Cypher25)?
   ;

foreachClause_Cypher25: FOREACH LPAREN variable_Cypher25 IN expression_Cypher25 BAR clause_Cypher25+ RPAREN
   ;

subqueryClause_Cypher25: OPTIONAL? CALL subqueryScope_Cypher25? LCURLY regularQuery_Cypher25 RCURLY subqueryInTransactionsParameters_Cypher25?
   ;

subqueryScope_Cypher25: LPAREN (TIMES | variable_Cypher25 (COMMA variable_Cypher25)*)? RPAREN
   ;

subqueryInTransactionsParameters_Cypher25: IN (expression_Cypher25? CONCURRENT)? TRANSACTIONS (subqueryInTransactionsBatchParameters_Cypher25 | subqueryInTransactionsErrorParameters_Cypher25 | subqueryInTransactionsReportParameters_Cypher25)*
   ;

subqueryInTransactionsBatchParameters_Cypher25: OF expression_Cypher25 (ROW | ROWS)
   ;

subqueryInTransactionsErrorParameters_Cypher25: ON ERROR (CONTINUE | BREAK | FAIL)
   ;

subqueryInTransactionsReportParameters_Cypher25: REPORT STATUS AS variable_Cypher25
   ;

orderBySkipLimitClause_Cypher25: orderBy_Cypher25 skip_Cypher25? limit_Cypher25?
   | skip_Cypher25 limit_Cypher25?
   | limit_Cypher25
   ;

patternList_Cypher25: pattern_Cypher25 (COMMA pattern_Cypher25)*
   ;

insertPatternList_Cypher25: insertPattern_Cypher25 (COMMA insertPattern_Cypher25)*
   ;

pattern_Cypher25: (variable_Cypher25 EQ)? selector_Cypher25? anonymousPattern_Cypher25
   ;

insertPattern_Cypher25: (symbolicNameString_Cypher25 EQ)? insertNodePattern_Cypher25 (insertRelationshipPattern_Cypher25 insertNodePattern_Cypher25)*
   ;

quantifier_Cypher25: LCURLY UNSIGNED_DECIMAL_INTEGER RCURLY
   | LCURLY from = UNSIGNED_DECIMAL_INTEGER? COMMA to = UNSIGNED_DECIMAL_INTEGER? RCURLY
   | PLUS
   | TIMES
   ;

anonymousPattern_Cypher25: shortestPathPattern_Cypher25
   | patternElement_Cypher25
   ;

shortestPathPattern_Cypher25: (SHORTEST_PATH | ALL_SHORTEST_PATHS) LPAREN patternElement_Cypher25 RPAREN
   ;

patternElement_Cypher25: (nodePattern_Cypher25 (relationshipPattern_Cypher25 quantifier_Cypher25? nodePattern_Cypher25)* | parenthesizedPath_Cypher25)+
   ;

selector_Cypher25: ANY SHORTEST pathToken_Cypher25?                                  # AnyShortestPath
   | ALL SHORTEST pathToken_Cypher25?                                  # AllShortestPath
   | ANY UNSIGNED_DECIMAL_INTEGER? pathToken_Cypher25?                 # AnyPath
   | ALL pathToken_Cypher25?                                           # AllPath
   | SHORTEST UNSIGNED_DECIMAL_INTEGER? pathToken_Cypher25? groupToken_Cypher25 # ShortestGroup
   | SHORTEST UNSIGNED_DECIMAL_INTEGER pathToken_Cypher25?             # AnyShortestPath
   ;

groupToken_Cypher25: GROUP | GROUPS
   ;

pathToken_Cypher25: PATH | PATHS
   ;

pathPatternNonEmpty_Cypher25: nodePattern_Cypher25 (relationshipPattern_Cypher25 nodePattern_Cypher25)+
   ;

nodePattern_Cypher25: LPAREN variable_Cypher25? labelExpression_Cypher25? properties_Cypher25? (WHERE expression_Cypher25)? RPAREN
   ;

insertNodePattern_Cypher25: LPAREN variable_Cypher25? insertNodeLabelExpression_Cypher25? map_Cypher25? RPAREN
   ;

parenthesizedPath_Cypher25: LPAREN pattern_Cypher25 (WHERE expression_Cypher25)? RPAREN quantifier_Cypher25?
   ;

nodeLabels_Cypher25: (labelType_Cypher25 | dynamicLabelType_Cypher25)+
   ;

nodeLabelsIs_Cypher25: IS (symbolicNameString_Cypher25 | dynamicExpression_Cypher25) (labelType_Cypher25 | dynamicLabelType_Cypher25)*
   ;

dynamicExpression_Cypher25: DOLLAR LPAREN expression_Cypher25 RPAREN
   ;
   
dynamicAnyAllExpression_Cypher25: DOLLAR (ALL | ANY)? LPAREN expression_Cypher25 RPAREN
   ;

dynamicLabelType_Cypher25: COLON dynamicExpression_Cypher25
   ;

labelType_Cypher25: COLON symbolicNameString_Cypher25
   ;

relType_Cypher25: COLON symbolicNameString_Cypher25
   ;

labelOrRelType_Cypher25: COLON symbolicNameString_Cypher25
   ;

properties_Cypher25: map_Cypher25
   | parameter["ANY"]
   ;

relationshipPattern_Cypher25: leftArrow_Cypher25? arrowLine_Cypher25 (LBRACKET variable_Cypher25? labelExpression_Cypher25? pathLength_Cypher25? properties_Cypher25? (WHERE expression_Cypher25)? RBRACKET)? arrowLine_Cypher25 rightArrow_Cypher25?
   ;

insertRelationshipPattern_Cypher25: leftArrow_Cypher25? arrowLine_Cypher25 LBRACKET variable_Cypher25? insertRelationshipLabelExpression_Cypher25 map_Cypher25? RBRACKET arrowLine_Cypher25 rightArrow_Cypher25?
   ;

leftArrow_Cypher25: LT
   | ARROW_LEFT_HEAD
   ;

arrowLine_Cypher25: ARROW_LINE
   | MINUS
   ;

rightArrow_Cypher25: GT
   | ARROW_RIGHT_HEAD
   ;

pathLength_Cypher25: TIMES (from = UNSIGNED_DECIMAL_INTEGER? DOTDOT to = UNSIGNED_DECIMAL_INTEGER? | single = UNSIGNED_DECIMAL_INTEGER)?
   ;

labelExpression_Cypher25: COLON labelExpression4_Cypher25
   | IS labelExpression4Is_Cypher25
   ;

labelExpression4_Cypher25: labelExpression3_Cypher25 (BAR COLON? labelExpression3_Cypher25)*
   ;

labelExpression4Is_Cypher25: labelExpression3Is_Cypher25 (BAR COLON? labelExpression3Is_Cypher25)*
   ;

labelExpression3_Cypher25: labelExpression2_Cypher25 ((AMPERSAND | COLON) labelExpression2_Cypher25)*
   ;

labelExpression3Is_Cypher25: labelExpression2Is_Cypher25 ((AMPERSAND | COLON) labelExpression2Is_Cypher25)*
   ;

labelExpression2_Cypher25: EXCLAMATION_MARK* labelExpression1_Cypher25
   ;

labelExpression2Is_Cypher25: EXCLAMATION_MARK* labelExpression1Is_Cypher25
   ;

labelExpression1_Cypher25: LPAREN labelExpression4_Cypher25 RPAREN #ParenthesizedLabelExpression
   | PERCENT                        #AnyLabel
   | dynamicAnyAllExpression_Cypher25        #DynamicLabel
   | symbolicNameString_Cypher25             #LabelName
   ;

labelExpression1Is_Cypher25: LPAREN labelExpression4Is_Cypher25 RPAREN #ParenthesizedLabelExpressionIs
   | PERCENT                          #AnyLabelIs
   | dynamicAnyAllExpression_Cypher25          #DynamicLabelIs
   | symbolicLabelNameString_Cypher25          #LabelNameIs
   ;

insertNodeLabelExpression_Cypher25: (COLON | IS) symbolicNameString_Cypher25 ((AMPERSAND | COLON) symbolicNameString_Cypher25)*
   ;

insertRelationshipLabelExpression_Cypher25: (COLON | IS) symbolicNameString_Cypher25
   ;

expression_Cypher25: expression11_Cypher25 (OR expression11_Cypher25)*
   ;

expression11_Cypher25: expression10_Cypher25 (XOR expression10_Cypher25)*
   ;

expression10_Cypher25: expression9_Cypher25 (AND expression9_Cypher25)*
   ;

expression9_Cypher25: NOT* expression8_Cypher25
   ;

// Making changes here? Consider looking at extendedWhen_Cypher25 too.
expression8_Cypher25: expression7_Cypher25 ((
      EQ
      | INVALID_NEQ
      | NEQ
      | LE
      | GE
      | LT
      | GT
   ) expression7_Cypher25)*
   ;

expression7_Cypher25: expression6_Cypher25 comparisonExpression6_Cypher25?
   ;

// Making changes here? Consider looking at extendedWhen_Cypher25 too.
comparisonExpression6_Cypher25: (
      REGEQ
      | STARTS WITH
      | ENDS WITH
      | CONTAINS
      | IN
   ) expression6_Cypher25                                      # StringAndListComparison
   | IS NOT? NULL                                     # NullComparison
   | (IS NOT? (TYPED | COLONCOLON) | COLONCOLON) type_Cypher25 # TypeComparison
   | IS NOT? normalForm_Cypher25? NORMALIZED                   # NormalFormComparison
   ;

normalForm_Cypher25: NFC
   | NFD
   | NFKC
   | NFKD
   ;

expression6_Cypher25: expression5_Cypher25 ((PLUS | MINUS | DOUBLEBAR) expression5_Cypher25)*
   ;

expression5_Cypher25: expression4_Cypher25 ((TIMES | DIVIDE | PERCENT) expression4_Cypher25)*
   ;

expression4_Cypher25: expression3_Cypher25 (POW expression3_Cypher25)*
   ;

expression3_Cypher25: expression2_Cypher25
   | (PLUS | MINUS) expression2_Cypher25
   ;

expression2_Cypher25: expression1_Cypher25 postFix_Cypher25*
   ;

postFix_Cypher25: property_Cypher25                                                           # PropertyPostfix
   | labelExpression_Cypher25                                                    # LabelPostfix
   | LBRACKET expression_Cypher25 RBRACKET                                       # IndexPostfix
   | LBRACKET fromExp = expression_Cypher25? DOTDOT toExp = expression_Cypher25? RBRACKET # RangePostfix
   ;

property_Cypher25: DOT propertyKeyName_Cypher25
   ;

dynamicProperty_Cypher25: LBRACKET expression_Cypher25 RBRACKET
   ;

propertyExpression_Cypher25: expression1_Cypher25 property_Cypher25+
   ;

dynamicPropertyExpression_Cypher25: expression1_Cypher25 dynamicProperty_Cypher25
   ;

expression1_Cypher25: literal_Cypher25
   | parameter["ANY"]
   | caseExpression_Cypher25
   | extendedCaseExpression_Cypher25
   | countStar_Cypher25
   | existsExpression_Cypher25
   | countExpression_Cypher25
   | collectExpression_Cypher25
   | mapProjection_Cypher25
   | listComprehension_Cypher25
   | listLiteral_Cypher25
   | patternComprehension_Cypher25
   | reduceExpression_Cypher25
   | listItemsPredicate_Cypher25
   | normalizeFunction_Cypher25
   | trimFunction_Cypher25
   | patternExpression_Cypher25
   | shortestPathExpression_Cypher25
   | parenthesizedExpression_Cypher25
   | functionInvocation_Cypher25
   | variable_Cypher25
   ;

literal_Cypher25: numberLiteral_Cypher25 # NummericLiteral
   | stringLiteral_Cypher25 # StringsLiteral
   | map_Cypher25           # OtherLiteral
   | TRUE          # BooleanLiteral
   | FALSE         # BooleanLiteral
   | INF           # KeywordLiteral
   | INFINITY      # KeywordLiteral
   | NAN           # KeywordLiteral
   | NULL          # KeywordLiteral
   ;

caseExpression_Cypher25: CASE caseAlternative_Cypher25+ (ELSE expression_Cypher25)? END
   ;

caseAlternative_Cypher25: WHEN expression_Cypher25 THEN expression_Cypher25
   ;

extendedCaseExpression_Cypher25: CASE expression_Cypher25 extendedCaseAlternative_Cypher25+ (ELSE elseExp = expression_Cypher25)? END
   ;

extendedCaseAlternative_Cypher25: WHEN extendedWhen_Cypher25 (COMMA extendedWhen_Cypher25)* THEN expression_Cypher25
   ;

// Making changes here? Consider looking at comparisonExpression6_Cypher25 and expression8_Cypher25 too.
extendedWhen_Cypher25: (REGEQ | STARTS WITH | ENDS WITH) expression6_Cypher25 # WhenStringOrList
   | IS NOT? NULL                                  # WhenNull
   | (IS NOT? TYPED | COLONCOLON) type_Cypher25             # WhenType
   | IS NOT? normalForm_Cypher25? NORMALIZED                # WhenForm
   | (
      EQ
      | NEQ
      | INVALID_NEQ
      | LE
      | GE
      | LT
      | GT
   ) expression7_Cypher25                                   # WhenComparator
   | expression_Cypher25                                    # WhenEquals
   ;

// Observe that this is not possible to write as:
// (WHERE whereExp = expression_Cypher25)? (BAR barExp = expression_Cypher25)? RBRACKET
// Due to an ambigouity with cases such as [node IN nodes WHERE node:A|B]
// where |B will be interpreted as part of the whereExp, rather than as the expected barExp.
listComprehension_Cypher25: LBRACKET variable_Cypher25 IN expression_Cypher25 ((WHERE whereExp = expression_Cypher25)? BAR barExp = expression_Cypher25 | (WHERE whereExp = expression_Cypher25)?) RBRACKET
   ;

patternComprehension_Cypher25: LBRACKET (variable_Cypher25 EQ)? pathPatternNonEmpty_Cypher25 (WHERE whereExp = expression_Cypher25)? BAR barExp = expression_Cypher25 RBRACKET
   ;

reduceExpression_Cypher25: REDUCE LPAREN variable_Cypher25 EQ expression_Cypher25 COMMA variable_Cypher25 IN expression_Cypher25 BAR expression_Cypher25 RPAREN
   ;

listItemsPredicate_Cypher25: (
      ALL
      | ANY
      | NONE
      | SINGLE
   ) LPAREN variable_Cypher25 IN inExp = expression_Cypher25 (WHERE whereExp = expression_Cypher25)? RPAREN
   ;

normalizeFunction_Cypher25: NORMALIZE LPAREN expression_Cypher25 (COMMA normalForm_Cypher25)? RPAREN
   ;

trimFunction_Cypher25: TRIM LPAREN ((BOTH | LEADING | TRAILING)? (trimCharacterString = expression_Cypher25)? FROM)? trimSource = expression_Cypher25 RPAREN
   ;

patternExpression_Cypher25: pathPatternNonEmpty_Cypher25
   ;

shortestPathExpression_Cypher25: shortestPathPattern_Cypher25
   ;

parenthesizedExpression_Cypher25: LPAREN expression_Cypher25 RPAREN
   ;

mapProjection_Cypher25: variable_Cypher25 LCURLY (mapProjectionElement_Cypher25 (COMMA mapProjectionElement_Cypher25)* )? RCURLY
   ;

mapProjectionElement_Cypher25: propertyKeyName_Cypher25 COLON expression_Cypher25
   | property_Cypher25
   | variable_Cypher25
   | DOT TIMES
   ;

countStar_Cypher25: COUNT LPAREN TIMES RPAREN
   ;

existsExpression_Cypher25: EXISTS LCURLY (regularQuery_Cypher25 | matchMode_Cypher25? patternList_Cypher25 whereClause_Cypher25?) RCURLY
   ;

countExpression_Cypher25: COUNT LCURLY (regularQuery_Cypher25 | matchMode_Cypher25? patternList_Cypher25 whereClause_Cypher25?) RCURLY
   ;

collectExpression_Cypher25: COLLECT LCURLY regularQuery_Cypher25 RCURLY
   ;

numberLiteral_Cypher25: MINUS? (
      DECIMAL_DOUBLE
      | UNSIGNED_DECIMAL_INTEGER
      | UNSIGNED_HEX_INTEGER
      | UNSIGNED_OCTAL_INTEGER
   )
   ;

signedIntegerLiteral_Cypher25: MINUS? UNSIGNED_DECIMAL_INTEGER
   ;

listLiteral_Cypher25: LBRACKET (expression_Cypher25 (COMMA expression_Cypher25)* )? RBRACKET
   ;

propertyKeyName_Cypher25: symbolicNameString_Cypher25
   ;

parameter[String paramType]
   : DOLLAR parameterName[paramType]
   ;

parameterName[String paramType]
   : (symbolicNameString_Cypher25 | UNSIGNED_DECIMAL_INTEGER | UNSIGNED_OCTAL_INTEGER | EXTENDED_IDENTIFIER)
   ;

functionInvocation_Cypher25: functionName_Cypher25 LPAREN (DISTINCT | ALL)? (functionArgument_Cypher25 (COMMA functionArgument_Cypher25)* )? RPAREN
   ;

functionArgument_Cypher25: expression_Cypher25
   ;

functionName_Cypher25: namespace_Cypher25 symbolicNameString_Cypher25
   ;

namespace_Cypher25: (symbolicNameString_Cypher25 DOT)*
   ;

variable_Cypher25: symbolicNameString_Cypher25
   ;

// Returns non-list of propertyKeyNames
nonEmptyNameList_Cypher25: symbolicNameString_Cypher25 (COMMA symbolicNameString_Cypher25)*
   ;

type_Cypher25: typePart_Cypher25 (BAR typePart_Cypher25)*
   ;

typePart_Cypher25: typeName typeNullability_Cypher25? typeListSuffix_Cypher25*
   ;

typeName
   // Note! These are matched based on the first token. Take precaution in ExpressionBuilder.scala when modifying
   : NOTHING
   | NULL
   | BOOL
   | BOOLEAN
   | VARCHAR
   | STRING
   | INT
   | SIGNED? INTEGER
   | FLOAT
   | DATE
   | LOCAL (TIME | DATETIME)
   | ZONED (TIME | DATETIME)
   | TIME (WITHOUT | WITH) (TIMEZONE | TIME ZONE)
   | TIMESTAMP (WITHOUT | WITH) (TIMEZONE | TIME ZONE)
   | DURATION
   | POINT
   | NODE
   | VERTEX
   | RELATIONSHIP
   | EDGE
   | MAP
   | (LIST | ARRAY) LT type_Cypher25 GT
   | PATH
   | PATHS
   | PROPERTY VALUE
   | ANY (
      NODE
      | VERTEX
      | RELATIONSHIP
      | EDGE
      | MAP
      | PROPERTY VALUE
      | VALUE? LT type_Cypher25 GT
      | VALUE
   )?
   ;

typeNullability_Cypher25: NOT NULL
   | EXCLAMATION_MARK
   ;

typeListSuffix_Cypher25: (LIST | ARRAY) typeNullability_Cypher25?
   ;

// Show, terminate, schema and admin commands

command_Cypher25: useClause_Cypher25? (
      createCommand_Cypher25
      | dropCommand_Cypher25
      | alterCommand_Cypher25
      | renameCommand_Cypher25
      | denyCommand_Cypher25
      | revokeCommand_Cypher25
      | grantCommand_Cypher25
      | startDatabase_Cypher25
      | stopDatabase_Cypher25
      | enableServerCommand_Cypher25
      | allocationCommand_Cypher25
      | showCommand_Cypher25
      | terminateCommand_Cypher25
   )
   ;

createCommand_Cypher25: CREATE (OR REPLACE)? (
      createAlias_Cypher25
      | createCompositeDatabase_Cypher25
      | createConstraint_Cypher25
      | createDatabase_Cypher25
      | createIndex_Cypher25
      | createRole_Cypher25
      | createUser_Cypher25
   )
   ;

dropCommand_Cypher25: DROP (
      dropAlias_Cypher25
      | dropConstraint_Cypher25
      | dropDatabase_Cypher25
      | dropIndex_Cypher25
      | dropRole_Cypher25
      | dropServer_Cypher25
      | dropUser_Cypher25
   )
   ;

showCommand_Cypher25: SHOW (
      showAliases_Cypher25
      | showConstraintCommand_Cypher25
      | showCurrentUser_Cypher25
      | showDatabase_Cypher25
      | showFunctions_Cypher25
      | showIndexCommand_Cypher25
      | showPrivileges_Cypher25
      | showProcedures_Cypher25
      | showRolePrivileges_Cypher25
      | showRoles_Cypher25
      | showServers_Cypher25
      | showSettings_Cypher25
      | showSupportedPrivileges_Cypher25
      | showTransactions_Cypher25
      | showUserPrivileges_Cypher25
      | showUsers_Cypher25
   )
   ;

showCommandYield_Cypher25: yieldClause_Cypher25 returnClause_Cypher25?
   | whereClause_Cypher25
   ;

yieldItem_Cypher25: variable_Cypher25 (AS variable_Cypher25)?
   ;

yieldSkip_Cypher25: (OFFSET | SKIPROWS) signedIntegerLiteral_Cypher25
   ;

yieldLimit_Cypher25: LIMITROWS signedIntegerLiteral_Cypher25
   ;

yieldClause_Cypher25: YIELD (TIMES | yieldItem_Cypher25 (COMMA yieldItem_Cypher25)*) orderBy_Cypher25? yieldSkip_Cypher25? yieldLimit_Cypher25? whereClause_Cypher25?
   ;

commandOptions_Cypher25: OPTIONS mapOrParameter_Cypher25
   ;

// Non-admin show and terminate commands

terminateCommand_Cypher25: TERMINATE terminateTransactions_Cypher25
   ;

composableCommandClauses_Cypher25: terminateCommand_Cypher25
   | composableShowCommandClauses_Cypher25
   ;

composableShowCommandClauses_Cypher25: SHOW (
      showIndexCommand_Cypher25
      | showConstraintCommand_Cypher25
      | showFunctions_Cypher25
      | showProcedures_Cypher25
      | showSettings_Cypher25
      | showTransactions_Cypher25
   )
   ;

showIndexCommand_Cypher25: (showIndexType_Cypher25)? showIndexesEnd_Cypher25
   ;

showIndexType_Cypher25: ALL
    | FULLTEXT
    | LOOKUP
    | POINT
    | RANGE
    | TEXT
    | VECTOR
    ;

showIndexesEnd_Cypher25: indexToken_Cypher25 showCommandYield_Cypher25? composableCommandClauses_Cypher25?
   ;

showConstraintCommand_Cypher25: ALL? showConstraintsEnd_Cypher25                                                        # ShowConstraintAll
   | (showConstraintEntity_Cypher25)? constraintExistType_Cypher25 showConstraintsEnd_Cypher25                 # ShowConstraintExist
   | (showConstraintEntity_Cypher25)? KEY showConstraintsEnd_Cypher25                                 # ShowConstraintKey
   | (showConstraintEntity_Cypher25)? PROPERTY TYPE showConstraintsEnd_Cypher25                       # ShowConstraintPropType
   | (showConstraintEntity_Cypher25)? (PROPERTY)? (UNIQUE | UNIQUENESS) showConstraintsEnd_Cypher25   # ShowConstraintUnique
   ;

showConstraintEntity_Cypher25: NODE                  # nodeEntity
    | (RELATIONSHIP | REL)  # relEntity
    ;

constraintExistType_Cypher25: EXISTENCE
   | EXIST
   | PROPERTY EXISTENCE
   | PROPERTY EXIST
   ;

showConstraintsEnd_Cypher25: constraintToken_Cypher25 showCommandYield_Cypher25? composableCommandClauses_Cypher25?
   ;

showProcedures_Cypher25: (PROCEDURE | PROCEDURES) executableBy_Cypher25? showCommandYield_Cypher25? composableCommandClauses_Cypher25?
   ;

showFunctions_Cypher25: showFunctionsType_Cypher25? functionToken_Cypher25 executableBy_Cypher25? showCommandYield_Cypher25? composableCommandClauses_Cypher25?
   ;

functionToken_Cypher25: FUNCTION | FUNCTIONS
   ;

executableBy_Cypher25: EXECUTABLE (BY (CURRENT USER | symbolicNameString_Cypher25))?
   ;

showFunctionsType_Cypher25: ALL
   | BUILT IN
   | USER DEFINED
   ;

showTransactions_Cypher25: transactionToken_Cypher25 namesAndClauses_Cypher25
   ;

terminateTransactions_Cypher25: transactionToken_Cypher25 namesAndClauses_Cypher25
   ;

showSettings_Cypher25: settingToken_Cypher25 namesAndClauses_Cypher25
   ;

settingToken_Cypher25: SETTING | SETTINGS
   ;

namesAndClauses_Cypher25: (showCommandYield_Cypher25? | stringsOrExpression_Cypher25 showCommandYield_Cypher25?) composableCommandClauses_Cypher25?
   ;

stringsOrExpression_Cypher25: stringList_Cypher25
   | expression_Cypher25
   ;

// Schema commands

commandNodePattern_Cypher25: LPAREN variable_Cypher25 labelType_Cypher25 RPAREN
   ;

commandRelPattern_Cypher25: LPAREN RPAREN leftArrow_Cypher25? arrowLine_Cypher25 LBRACKET variable_Cypher25 relType_Cypher25 RBRACKET arrowLine_Cypher25 rightArrow_Cypher25? LPAREN RPAREN
   ;

createConstraint_Cypher25: CONSTRAINT symbolicNameOrStringParameter_Cypher25? (IF NOT EXISTS)? FOR (commandNodePattern_Cypher25 | commandRelPattern_Cypher25) constraintType_Cypher25 commandOptions_Cypher25?
   ;

constraintType_Cypher25: REQUIRE propertyList_Cypher25 (COLONCOLON | IS (TYPED | COLONCOLON)) type_Cypher25 # ConstraintTyped
   | REQUIRE propertyList_Cypher25 IS (NODE | RELATIONSHIP | REL)? UNIQUE      # ConstraintIsUnique
   | REQUIRE propertyList_Cypher25 IS (NODE | RELATIONSHIP | REL)? KEY         # ConstraintKey
   | REQUIRE propertyList_Cypher25 IS NOT NULL                                 # ConstraintIsNotNull
   ;

dropConstraint_Cypher25: CONSTRAINT symbolicNameOrStringParameter_Cypher25 (IF EXISTS)?
   ;

createIndex_Cypher25: RANGE INDEX createIndex__Cypher25
   | TEXT INDEX createIndex__Cypher25
   | POINT INDEX createIndex__Cypher25
   | VECTOR INDEX createIndex__Cypher25
   | LOOKUP INDEX createLookupIndex_Cypher25
   | FULLTEXT INDEX createFulltextIndex_Cypher25
   | INDEX createIndex__Cypher25
   ;

createIndex__Cypher25: symbolicNameOrStringParameter_Cypher25? (IF NOT EXISTS)? FOR (commandNodePattern_Cypher25 | commandRelPattern_Cypher25) ON propertyList_Cypher25 commandOptions_Cypher25?
   ;

createFulltextIndex_Cypher25: symbolicNameOrStringParameter_Cypher25? (IF NOT EXISTS)? FOR (fulltextNodePattern_Cypher25 | fulltextRelPattern_Cypher25) ON EACH LBRACKET enclosedPropertyList_Cypher25 RBRACKET commandOptions_Cypher25?
   ;

fulltextNodePattern_Cypher25: LPAREN variable_Cypher25 COLON symbolicNameString_Cypher25 (BAR symbolicNameString_Cypher25)* RPAREN
   ;

fulltextRelPattern_Cypher25: LPAREN RPAREN leftArrow_Cypher25? arrowLine_Cypher25 LBRACKET variable_Cypher25 COLON symbolicNameString_Cypher25 (BAR symbolicNameString_Cypher25)* RBRACKET arrowLine_Cypher25 rightArrow_Cypher25? LPAREN RPAREN
   ;

createLookupIndex_Cypher25: symbolicNameOrStringParameter_Cypher25? (IF NOT EXISTS)? FOR (lookupIndexNodePattern_Cypher25 | lookupIndexRelPattern_Cypher25) symbolicNameString_Cypher25 LPAREN variable_Cypher25 RPAREN commandOptions_Cypher25?
   ;

lookupIndexNodePattern_Cypher25: LPAREN variable_Cypher25 RPAREN ON EACH
   ;

lookupIndexRelPattern_Cypher25: LPAREN RPAREN leftArrow_Cypher25? arrowLine_Cypher25 LBRACKET variable_Cypher25 RBRACKET arrowLine_Cypher25 rightArrow_Cypher25? LPAREN RPAREN ON EACH?
   ;

dropIndex_Cypher25: INDEX symbolicNameOrStringParameter_Cypher25 (IF EXISTS)?
   ;

propertyList_Cypher25: variable_Cypher25 property_Cypher25 | LPAREN enclosedPropertyList_Cypher25 RPAREN
   ;

enclosedPropertyList_Cypher25: variable_Cypher25 property_Cypher25 (COMMA variable_Cypher25 property_Cypher25)*
   ;

// Admin commands

alterCommand_Cypher25: ALTER (
      alterAlias_Cypher25
      | alterCurrentUser_Cypher25
      | alterDatabase_Cypher25
      | alterUser_Cypher25
      | alterServer_Cypher25
   )
   ;

renameCommand_Cypher25: RENAME (renameRole_Cypher25 | renameServer_Cypher25 | renameUser_Cypher25)
   ;

grantCommand_Cypher25: GRANT (
      IMMUTABLE? privilege_Cypher25 TO roleNames_Cypher25
      | roleToken_Cypher25 grantRole_Cypher25
   )
   ;

denyCommand_Cypher25: DENY IMMUTABLE? privilege_Cypher25 TO roleNames_Cypher25
   ;

revokeCommand_Cypher25: REVOKE (
      (DENY | GRANT)? IMMUTABLE? privilege_Cypher25 FROM roleNames_Cypher25
      | roleToken_Cypher25 revokeRole_Cypher25
   )
   ;

userNames_Cypher25: symbolicNameOrStringParameterList_Cypher25
   ;

roleNames_Cypher25: symbolicNameOrStringParameterList_Cypher25
   ;

roleToken_Cypher25: ROLES
   | ROLE
   ;

// Server commands

enableServerCommand_Cypher25: ENABLE SERVER stringOrParameter_Cypher25 commandOptions_Cypher25?
   ;

alterServer_Cypher25: SERVER stringOrParameter_Cypher25 SET commandOptions_Cypher25
   ;

renameServer_Cypher25: SERVER stringOrParameter_Cypher25 TO stringOrParameter_Cypher25
   ;

dropServer_Cypher25: SERVER stringOrParameter_Cypher25
   ;

showServers_Cypher25: (SERVER | SERVERS) showCommandYield_Cypher25?
   ;

allocationCommand_Cypher25: DRYRUN? (deallocateDatabaseFromServers_Cypher25 | reallocateDatabases_Cypher25)
   ;

deallocateDatabaseFromServers_Cypher25: DEALLOCATE (DATABASE | DATABASES) FROM (SERVER | SERVERS) stringOrParameter_Cypher25 (COMMA stringOrParameter_Cypher25)*
   ;

reallocateDatabases_Cypher25: REALLOCATE (DATABASE | DATABASES)
   ;

// Role commands

createRole_Cypher25: ROLE commandNameExpression_Cypher25 (IF NOT EXISTS)? (AS COPY OF commandNameExpression_Cypher25)?
   ;

dropRole_Cypher25: ROLE commandNameExpression_Cypher25 (IF EXISTS)?
   ;

renameRole_Cypher25: ROLE commandNameExpression_Cypher25 (IF EXISTS)? TO commandNameExpression_Cypher25
   ;

showRoles_Cypher25: (ALL | POPULATED)? roleToken_Cypher25 (WITH (USER | USERS))? showCommandYield_Cypher25?
   ;

grantRole_Cypher25: roleNames_Cypher25 TO userNames_Cypher25
   ;

revokeRole_Cypher25: roleNames_Cypher25 FROM userNames_Cypher25
   ;

// User commands

createUser_Cypher25: USER commandNameExpression_Cypher25 (IF NOT EXISTS)? (SET (
      password_Cypher25
      | PASSWORD passwordChangeRequired_Cypher25
      | userStatus_Cypher25
      | homeDatabase_Cypher25
      | setAuthClause_Cypher25
   ))+;

dropUser_Cypher25: USER commandNameExpression_Cypher25 (IF EXISTS)?
   ;

renameUser_Cypher25: USER commandNameExpression_Cypher25 (IF EXISTS)? TO commandNameExpression_Cypher25
   ;

alterCurrentUser_Cypher25: CURRENT USER SET PASSWORD FROM passwordExpression_Cypher25 TO passwordExpression_Cypher25
   ;

alterUser_Cypher25: USER commandNameExpression_Cypher25 (IF EXISTS)? (REMOVE (
      HOME DATABASE
      | ALL AUTH (PROVIDER | PROVIDERS)?
      | removeNamedProvider_Cypher25
   ))* (SET (
      password_Cypher25
      | PASSWORD passwordChangeRequired_Cypher25
      | userStatus_Cypher25
      | homeDatabase_Cypher25
      | setAuthClause_Cypher25
   ))*
   ;

removeNamedProvider_Cypher25: AUTH (PROVIDER | PROVIDERS)? (stringLiteral_Cypher25 | stringListLiteral_Cypher25 | parameter["ANY"])
   ;

password_Cypher25: (PLAINTEXT | ENCRYPTED)? PASSWORD passwordExpression_Cypher25 passwordChangeRequired_Cypher25?
   ;

passwordOnly_Cypher25: (PLAINTEXT | ENCRYPTED)? PASSWORD passwordExpression_Cypher25
   ;

passwordExpression_Cypher25: stringLiteral_Cypher25
   | parameter["STRING"]
   ;

passwordChangeRequired_Cypher25: CHANGE NOT? REQUIRED
   ;

userStatus_Cypher25: STATUS (SUSPENDED | ACTIVE)
   ;

homeDatabase_Cypher25: HOME DATABASE symbolicAliasNameOrParameter_Cypher25
   ;

setAuthClause_Cypher25: AUTH PROVIDER? stringLiteral_Cypher25 LCURLY (SET (
      userAuthAttribute_Cypher25
   ))+ RCURLY
   ;

userAuthAttribute_Cypher25: ID stringOrParameterExpression_Cypher25
   | passwordOnly_Cypher25
   | PASSWORD passwordChangeRequired_Cypher25
   ;

showUsers_Cypher25: (USER | USERS) (WITH AUTH)? showCommandYield_Cypher25?
   ;

showCurrentUser_Cypher25: CURRENT USER showCommandYield_Cypher25?
   ;

// Privilege commands

showSupportedPrivileges_Cypher25: SUPPORTED privilegeToken_Cypher25 showCommandYield_Cypher25?
   ;

showPrivileges_Cypher25: ALL? privilegeToken_Cypher25 privilegeAsCommand_Cypher25? showCommandYield_Cypher25?
   ;

showRolePrivileges_Cypher25: (ROLE | ROLES) roleNames_Cypher25 privilegeToken_Cypher25 privilegeAsCommand_Cypher25? showCommandYield_Cypher25?
   ;

showUserPrivileges_Cypher25: (USER | USERS) userNames_Cypher25? privilegeToken_Cypher25 privilegeAsCommand_Cypher25? showCommandYield_Cypher25?
   ;

privilegeAsCommand_Cypher25: AS REVOKE? (COMMAND | COMMANDS)
   ;

privilegeToken_Cypher25: PRIVILEGE
   | PRIVILEGES
   ;

privilege_Cypher25: allPrivilege_Cypher25
   | createPrivilege_Cypher25
   | databasePrivilege_Cypher25
   | dbmsPrivilege_Cypher25
   | dropPrivilege_Cypher25
   | loadPrivilege_Cypher25
   | qualifiedGraphPrivileges_Cypher25
   | qualifiedGraphPrivilegesWithProperty_Cypher25
   | removePrivilege_Cypher25
   | setPrivilege_Cypher25
   | showPrivilege_Cypher25
   | writePrivilege_Cypher25
   ;

allPrivilege_Cypher25: ALL allPrivilegeType_Cypher25? ON allPrivilegeTarget_Cypher25
   ;

allPrivilegeType_Cypher25: (DATABASE | GRAPH | DBMS)? PRIVILEGES
   ;

allPrivilegeTarget_Cypher25: HOME (DATABASE | GRAPH)                                # DefaultTarget
   | (DATABASE | DATABASES) (TIMES | symbolicAliasNameList_Cypher25) # DatabaseVariableTarget
   | (GRAPH | GRAPHS) (TIMES | symbolicAliasNameList_Cypher25)       # GraphVariableTarget
   | DBMS                                                   # DBMSTarget
   ;

createPrivilege_Cypher25: CREATE (
      createPrivilegeForDatabase_Cypher25 ON databaseScope_Cypher25
      | actionForDBMS_Cypher25 ON DBMS
      | ON graphScope_Cypher25 graphQualifier_Cypher25
   )
   ;

createPrivilegeForDatabase_Cypher25: indexToken_Cypher25
   | constraintToken_Cypher25
   | createNodePrivilegeToken_Cypher25
   | createRelPrivilegeToken_Cypher25
   | createPropertyPrivilegeToken_Cypher25
   ;

createNodePrivilegeToken_Cypher25: NEW NODE? (LABEL | LABELS)
   ;

createRelPrivilegeToken_Cypher25: NEW RELATIONSHIP? (TYPE | TYPES)
   ;

createPropertyPrivilegeToken_Cypher25: NEW PROPERTY? (NAME | NAMES)
   ;

actionForDBMS_Cypher25: ALIAS
   | COMPOSITE? DATABASE
   | ROLE
   | USER
   ;

dropPrivilege_Cypher25: DROP (
      (indexToken_Cypher25 | constraintToken_Cypher25) ON databaseScope_Cypher25
      | actionForDBMS_Cypher25 ON DBMS
   )
   ;

loadPrivilege_Cypher25: LOAD ON (
      (URL | CIDR) stringOrParameter_Cypher25
      | ALL DATA
   )
   ;

showPrivilege_Cypher25: SHOW (
      (indexToken_Cypher25 | constraintToken_Cypher25 | transactionToken_Cypher25 userQualifier_Cypher25?) ON databaseScope_Cypher25
      | (ALIAS | PRIVILEGE | ROLE | SERVER | SERVERS | settingToken_Cypher25 settingQualifier_Cypher25 | USER) ON DBMS
   )
   ;

setPrivilege_Cypher25: SET (
      (passwordToken_Cypher25 | USER (STATUS | HOME DATABASE) | DATABASE ACCESS) ON DBMS
      | LABEL labelsResource_Cypher25 ON graphScope_Cypher25
      | PROPERTY propertiesResource_Cypher25 ON graphScope_Cypher25 graphQualifier_Cypher25
      | AUTH ON DBMS
   )
   ;

passwordToken_Cypher25: PASSWORD
   | PASSWORDS
   ;

removePrivilege_Cypher25: REMOVE (
      (PRIVILEGE | ROLE) ON DBMS
      | LABEL labelsResource_Cypher25 ON graphScope_Cypher25
   )
   ;

writePrivilege_Cypher25: WRITE ON graphScope_Cypher25
   ;

databasePrivilege_Cypher25: (
      ACCESS
      | START
      | STOP
      | (indexToken_Cypher25 | constraintToken_Cypher25 | NAME) MANAGEMENT?
      | (TRANSACTION MANAGEMENT? | TERMINATE transactionToken_Cypher25) userQualifier_Cypher25?
   )
   ON databaseScope_Cypher25
   ;

dbmsPrivilege_Cypher25: (
      ALTER (ALIAS | DATABASE | USER)
      | ASSIGN (PRIVILEGE | ROLE)
      | (ALIAS | COMPOSITE? DATABASE | PRIVILEGE | ROLE | SERVER | USER) MANAGEMENT
      | dbmsPrivilegeExecute_Cypher25
      | RENAME (ROLE | USER)
      | IMPERSONATE userQualifier_Cypher25?
   )
   ON DBMS
   ;

dbmsPrivilegeExecute_Cypher25: EXECUTE (
      adminToken_Cypher25 PROCEDURES
      | BOOSTED? (
         procedureToken_Cypher25 executeProcedureQualifier_Cypher25
         | (USER DEFINED?)? functionToken_Cypher25 executeFunctionQualifier_Cypher25
      )
   )
   ;

adminToken_Cypher25: ADMIN
   | ADMINISTRATOR
   ;

procedureToken_Cypher25: PROCEDURE
   | PROCEDURES
   ;

indexToken_Cypher25: INDEX
   | INDEXES
   ;

constraintToken_Cypher25: CONSTRAINT
   | CONSTRAINTS
   ;

transactionToken_Cypher25: TRANSACTION
   | TRANSACTIONS
   ;

userQualifier_Cypher25: LPAREN (TIMES | userNames_Cypher25) RPAREN
   ;

executeFunctionQualifier_Cypher25: globs_Cypher25
   ;

executeProcedureQualifier_Cypher25: globs_Cypher25
   ;

settingQualifier_Cypher25: globs_Cypher25
   ;

globs_Cypher25: glob_Cypher25 (COMMA glob_Cypher25)*
   ;

glob_Cypher25: escapedSymbolicNameString_Cypher25 globRecursive_Cypher25?
   | globRecursive_Cypher25
   ;

globRecursive_Cypher25: globPart_Cypher25 globRecursive_Cypher25?
   ;

globPart_Cypher25: DOT escapedSymbolicNameString_Cypher25?
   | QUESTION
   | TIMES
   | unescapedSymbolicNameString_Cypher25
   ;

qualifiedGraphPrivilegesWithProperty_Cypher25: (TRAVERSE | (READ | MATCH) propertiesResource_Cypher25) ON graphScope_Cypher25 graphQualifier_Cypher25 (LPAREN TIMES RPAREN)?
   ;

qualifiedGraphPrivileges_Cypher25: (DELETE | MERGE propertiesResource_Cypher25) ON graphScope_Cypher25 graphQualifier_Cypher25
   ;

labelsResource_Cypher25: TIMES
   | nonEmptyStringList_Cypher25
   ;

propertiesResource_Cypher25: LCURLY (TIMES | nonEmptyStringList_Cypher25) RCURLY
   ;

// Returns non-empty list of strings
nonEmptyStringList_Cypher25: symbolicNameString_Cypher25 (COMMA symbolicNameString_Cypher25)*
   ;

graphQualifier_Cypher25: (
      graphQualifierToken_Cypher25 (TIMES | nonEmptyStringList_Cypher25)
      | FOR LPAREN variable_Cypher25? (COLON symbolicNameString_Cypher25 (BAR symbolicNameString_Cypher25)*)? (RPAREN WHERE expression_Cypher25 | (WHERE expression_Cypher25 | map_Cypher25) RPAREN)
   )?
   ;

graphQualifierToken_Cypher25: relToken_Cypher25
   | nodeToken_Cypher25
   | elementToken_Cypher25
   ;

relToken_Cypher25: RELATIONSHIP
   | RELATIONSHIPS
   ;

elementToken_Cypher25: ELEMENT
   | ELEMENTS
   ;

nodeToken_Cypher25: NODE
   | NODES
   ;

databaseScope_Cypher25: HOME DATABASE
   | (DATABASE | DATABASES) (TIMES | symbolicAliasNameList_Cypher25)
   ;

graphScope_Cypher25: HOME GRAPH
   | (GRAPH | GRAPHS) (TIMES | symbolicAliasNameList_Cypher25)
   ;

// Database commands

createCompositeDatabase_Cypher25: COMPOSITE DATABASE symbolicAliasNameOrParameter_Cypher25 (IF NOT EXISTS)? commandOptions_Cypher25? waitClause_Cypher25?
   ;

createDatabase_Cypher25: DATABASE symbolicAliasNameOrParameter_Cypher25 (IF NOT EXISTS)? (TOPOLOGY (primaryTopology_Cypher25 | secondaryTopology_Cypher25)+)? commandOptions_Cypher25? waitClause_Cypher25?
   ;

primaryTopology_Cypher25: UNSIGNED_DECIMAL_INTEGER primaryToken_Cypher25
   ;

primaryToken_Cypher25: PRIMARY | PRIMARIES
   ;

secondaryTopology_Cypher25: UNSIGNED_DECIMAL_INTEGER secondaryToken_Cypher25
   ;

secondaryToken_Cypher25: SECONDARY | SECONDARIES
   ;

dropDatabase_Cypher25: COMPOSITE? DATABASE symbolicAliasNameOrParameter_Cypher25 (IF EXISTS)? aliasAction_Cypher25? ((DUMP | DESTROY) DATA)? waitClause_Cypher25?
   ;

aliasAction_Cypher25: RESTRICT
   | CASCADE (ALIAS | ALIASES)
   ;

alterDatabase_Cypher25: DATABASE symbolicAliasNameOrParameter_Cypher25 (IF EXISTS)? (
      (SET (alterDatabaseAccess_Cypher25 | alterDatabaseTopology_Cypher25 | alterDatabaseOption_Cypher25))+
      | (REMOVE OPTION symbolicNameString_Cypher25)+
   ) waitClause_Cypher25?
   ;

alterDatabaseAccess_Cypher25: ACCESS READ (ONLY | WRITE)
   ;

alterDatabaseTopology_Cypher25: TOPOLOGY (primaryTopology_Cypher25 | secondaryTopology_Cypher25)+
   ;

alterDatabaseOption_Cypher25: OPTION symbolicNameString_Cypher25 expression_Cypher25
   ;

startDatabase_Cypher25: START DATABASE symbolicAliasNameOrParameter_Cypher25 waitClause_Cypher25?
   ;

stopDatabase_Cypher25: STOP DATABASE symbolicAliasNameOrParameter_Cypher25 waitClause_Cypher25?
   ;

waitClause_Cypher25: WAIT (UNSIGNED_DECIMAL_INTEGER secondsToken_Cypher25?)?
   | NOWAIT
   ;

secondsToken_Cypher25: SEC | SECOND | SECONDS;

showDatabase_Cypher25: (DEFAULT | HOME) DATABASE showCommandYield_Cypher25?
   | (DATABASE | DATABASES) symbolicAliasNameOrParameter_Cypher25? showCommandYield_Cypher25?
   ;

aliasName_Cypher25: symbolicAliasNameOrParameter_Cypher25
   ;

databaseName_Cypher25: symbolicAliasNameOrParameter_Cypher25
   ;

// Alias commands

createAlias_Cypher25: ALIAS aliasName_Cypher25 (IF NOT EXISTS)? FOR DATABASE databaseName_Cypher25 (AT stringOrParameter_Cypher25 USER commandNameExpression_Cypher25 PASSWORD passwordExpression_Cypher25 (DRIVER mapOrParameter_Cypher25)?)? (PROPERTIES mapOrParameter_Cypher25)?
   ;

dropAlias_Cypher25: ALIAS aliasName_Cypher25 (IF EXISTS)? FOR DATABASE
   ;

alterAlias_Cypher25: ALIAS aliasName_Cypher25 (IF EXISTS)? SET DATABASE (
      alterAliasTarget_Cypher25
      | alterAliasUser_Cypher25
      | alterAliasPassword_Cypher25
      | alterAliasDriver_Cypher25
      | alterAliasProperties_Cypher25
   )+
   ;

alterAliasTarget_Cypher25: TARGET databaseName_Cypher25 (AT stringOrParameter_Cypher25)?
   ;

alterAliasUser_Cypher25: USER commandNameExpression_Cypher25
   ;

alterAliasPassword_Cypher25: PASSWORD passwordExpression_Cypher25
   ;

alterAliasDriver_Cypher25: DRIVER mapOrParameter_Cypher25
   ;

alterAliasProperties_Cypher25: PROPERTIES mapOrParameter_Cypher25
   ;

showAliases_Cypher25: (ALIAS | ALIASES) aliasName_Cypher25? FOR (DATABASE | DATABASES) showCommandYield_Cypher25?
   ;

// Various strings, symbolic names, lists and maps

// Should return an Either[String, Parameter]
symbolicNameOrStringParameter_Cypher25: symbolicNameString_Cypher25
   | parameter["STRING"]
   ;

// Should return an Expression
commandNameExpression_Cypher25: symbolicNameString_Cypher25
   | parameter["STRING"]
   ;

symbolicNameOrStringParameterList_Cypher25: commandNameExpression_Cypher25 (COMMA commandNameExpression_Cypher25)*
   ;

symbolicAliasNameList_Cypher25: symbolicAliasNameOrParameter_Cypher25 (COMMA symbolicAliasNameOrParameter_Cypher25)*
   ;

symbolicAliasNameOrParameter_Cypher25: symbolicAliasName_Cypher25
   | parameter["STRING"]
   ;

symbolicAliasName_Cypher25: symbolicNameString_Cypher25 (DOT symbolicNameString_Cypher25)*
   ;

stringListLiteral_Cypher25: LBRACKET (stringLiteral_Cypher25 (COMMA stringLiteral_Cypher25)*)? RBRACKET
   ;

stringList_Cypher25: stringLiteral_Cypher25 (COMMA stringLiteral_Cypher25)+
   ;

stringLiteral_Cypher25: STRING_LITERAL1
   | STRING_LITERAL2
   ;

// Should return an Expression
stringOrParameterExpression_Cypher25: stringLiteral_Cypher25
   | parameter["STRING"]
   ;

// Should return an Either[String, Parameter]
stringOrParameter_Cypher25: stringLiteral_Cypher25
   | parameter["STRING"]
   ;

mapOrParameter_Cypher25: map_Cypher25
   | parameter["MAP"]
   ;

map_Cypher25: LCURLY (propertyKeyName_Cypher25 COLON expression_Cypher25 (COMMA propertyKeyName_Cypher25 COLON expression_Cypher25)*)? RCURLY
   ;

symbolicNameString_Cypher25: escapedSymbolicNameString_Cypher25
   | unescapedSymbolicNameString_Cypher25
   ;

escapedSymbolicNameString_Cypher25: ESCAPED_SYMBOLIC_NAME
   ;

unescapedSymbolicNameString_Cypher25: unescapedLabelSymbolicNameString_Cypher25
   | NOT
   | NULL
   | TYPED
   | NORMALIZED
   | NFC
   | NFD
   | NFKC
   | NFKD
   ;

symbolicLabelNameString_Cypher25: escapedSymbolicNameString_Cypher25
   | unescapedLabelSymbolicNameString_Cypher25
   ;

// Do not remove this, it is needed for composing the grammar
// with other ones (e.g. language support ones)
unescapedLabelSymbolicNameString_Cypher25: unescapedLabelSymbolicNameString__Cypher25
   ;

unescapedLabelSymbolicNameString__Cypher25: IDENTIFIER
   | ACCESS
   | ACTIVE
   | ADMIN
   | ADMINISTRATOR
   | ALIAS
   | ALIASES
   | ALL_SHORTEST_PATHS
   | ALL
   | ALTER
   | AND
   | ANY
   | ARRAY
   | AS
   | ASC
   | ASCENDING
   | ASSIGN
   | AT
   | AUTH
   | BINDINGS
   | BOOL
   | BOOLEAN
   | BOOSTED
   | BOTH
   | BREAK
   | BUILT
   | BY
   | CALL
   | CASCADE
   | CASE
   | CHANGE
   | CIDR
   | COLLECT
   | COMMAND
   | COMMANDS
   | COMPOSITE
   | CONCURRENT
   | CONSTRAINT
   | CONSTRAINTS
   | CONTAINS
   | CONTINUE
   | COPY
   | COUNT
   | CREATE
   | CSV
   | CURRENT
   | DATA
   | DATABASE
   | DATABASES
   | DATE
   | DATETIME
   | DBMS
   | DEALLOCATE
   | DEFAULT
   | DEFINED
   | DELETE
   | DENY
   | DESC
   | DESCENDING
   | DESTROY
   | DETACH
   | DIFFERENT
   | DISTINCT
   | DRIVER
   | DROP
   | DRYRUN
   | DUMP
   | DURATION
   | EACH
   | EDGE
   | ELEMENT
   | ELEMENTS
   | ELSE
   | ENABLE
   | ENCRYPTED
   | END
   | ENDS
   | ERROR
   | EXECUTABLE
   | EXECUTE
   | EXIST
   | EXISTENCE
   | EXISTS
   | FAIL
   | FALSE
   | FIELDTERMINATOR
   | FINISH
   | FLOAT
   | FOREACH
   | FOR
   | FROM
   | FULLTEXT
   | FUNCTION
   | FUNCTIONS
   | GRANT
   | GRAPH
   | GRAPHS
   | GROUP
   | GROUPS
   | HEADERS
   | HOME
   | ID
   | IF
   | IMMUTABLE
   | IMPERSONATE
   | IN
   | INDEX
   | INDEXES
   | INF
   | INFINITY
   | INSERT
   | INT
   | INTEGER
   | IS
   | JOIN
   | KEY
   | LABEL
   | LABELS
   | LEADING
   | LIMITROWS
   | LIST
   | LOAD
   | LOCAL
   | LOOKUP
   | MATCH
   | MANAGEMENT
   | MAP
   | MERGE
   | NAME
   | NAMES
   | NAN
   | NEW
   | NODE
   | NODETACH
   | NODES
   | NONE
   | NORMALIZE
   | NOTHING
   | NOWAIT
   | OF
   | OFFSET
   | ON
   | ONLY
   | OPTIONAL
   | OPTIONS
   | OPTION
   | OR
   | ORDER
   | PASSWORD
   | PASSWORDS
   | PATH
   | PATHS
   | PLAINTEXT
   | POINT
   | POPULATED
   | PRIMARY
   | PRIMARIES
   | PRIVILEGE
   | PRIVILEGES
   | PROCEDURE
   | PROCEDURES
   | PROPERTIES
   | PROPERTY
   | PROVIDER
   | PROVIDERS
   | RANGE
   | READ
   | REALLOCATE
   | REDUCE
   | REL
   | RELATIONSHIP
   | RELATIONSHIPS
   | REMOVE
   | RENAME
   | REPEATABLE
   | REPLACE
   | REPORT
   | REQUIRE
   | REQUIRED
   | RESTRICT
   | RETURN
   | REVOKE
   | ROLE
   | ROLES
   | ROW
   | ROWS
   | SCAN
   | SECONDARY
   | SECONDARIES
   | SEC
   | SECOND
   | SECONDS
   | SEEK
   | SERVER
   | SERVERS
   | SET
   | SETTING
   | SETTINGS
   | SHORTEST
   | SHORTEST_PATH
   | SHOW
   | SIGNED
   | SINGLE
   | SKIPROWS
   | START
   | STARTS
   | STATUS
   | STOP
   | VARCHAR
   | STRING
   | SUPPORTED
   | SUSPENDED
   | TARGET
   | TERMINATE
   | TEXT
   | THEN
   | TIME
   | TIMESTAMP
   | TIMEZONE
   | TO
   | TOPOLOGY
   | TRAILING
   | TRANSACTION
   | TRANSACTIONS
   | TRAVERSE
   | TRIM
   | TRUE
   | TYPE
   | TYPES
   | UNION
   | UNIQUE
   | UNIQUENESS
   | UNWIND
   | URL
   | USE
   | USER
   | USERS
   | USING
   | VALUE
   | VECTOR
   | VERTEX
   | WAIT
   | WHEN
   | WHERE
   | WITH
   | WITHOUT
   | WRITE
   | XOR
   | YIELD
   | ZONE
   | ZONED
   ;

endOfFile_Cypher25: EOF
   ;

