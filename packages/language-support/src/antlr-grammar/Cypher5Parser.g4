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
parser grammar Cypher5Parser;


options { tokenVocab = Cypher5Lexer; }
statements_Cypher5: statement_Cypher5 (SEMICOLON statement_Cypher5)* SEMICOLON? EOF
   ;

statement_Cypher5: periodicCommitQueryHintFailure_Cypher5? (command_Cypher5 | regularQuery_Cypher5)
   ;

periodicCommitQueryHintFailure_Cypher5: USING PERIODIC COMMIT UNSIGNED_DECIMAL_INTEGER?
   ;

regularQuery_Cypher5: singleQuery_Cypher5 (UNION (ALL | DISTINCT)? singleQuery_Cypher5)*
   ;

singleQuery_Cypher5: clause_Cypher5+
   ;

clause_Cypher5: useClause_Cypher5
   | finishClause_Cypher5
   | returnClause_Cypher5
   | createClause_Cypher5
   | insertClause_Cypher5
   | deleteClause_Cypher5
   | setClause_Cypher5
   | removeClause_Cypher5
   | matchClause_Cypher5
   | mergeClause_Cypher5
   | withClause_Cypher5
   | unwindClause_Cypher5
   | callClause_Cypher5
   | subqueryClause_Cypher5
   | loadCSVClause_Cypher5
   | foreachClause_Cypher5
   | orderBySkipLimitClause_Cypher5
   ;

useClause_Cypher5: USE GRAPH? graphReference_Cypher5
   ;

graphReference_Cypher5: LPAREN graphReference_Cypher5 RPAREN
   | functionInvocation_Cypher5
   | symbolicAliasName_Cypher5
   ;

finishClause_Cypher5: FINISH
   ;

returnClause_Cypher5: RETURN returnBody_Cypher5
   ;

returnBody_Cypher5: DISTINCT? returnItems_Cypher5 orderBy_Cypher5? skip_Cypher5? limit_Cypher5?
   ;

returnItem_Cypher5: expression_Cypher5 (AS variable_Cypher5)?
   ;

returnItems_Cypher5: (TIMES | returnItem_Cypher5) (COMMA returnItem_Cypher5)*
   ;

orderItem_Cypher5: expression_Cypher5 (ascToken_Cypher5 | descToken_Cypher5)?
   ;

ascToken_Cypher5: ASC | ASCENDING
   ;

descToken_Cypher5: DESC | DESCENDING
   ;

orderBy_Cypher5: ORDER BY orderItem_Cypher5 (COMMA orderItem_Cypher5)*
   ;

skip_Cypher5: (OFFSET | SKIPROWS) expression_Cypher5
   ;

limit_Cypher5: LIMITROWS expression_Cypher5
   ;

whereClause_Cypher5: WHERE expression_Cypher5
   ;

withClause_Cypher5: WITH returnBody_Cypher5 whereClause_Cypher5?
   ;

createClause_Cypher5: CREATE patternList_Cypher5
   ;

insertClause_Cypher5: INSERT insertPatternList_Cypher5
   ;

setClause_Cypher5: SET setItem_Cypher5 (COMMA setItem_Cypher5)*
   ;

setItem_Cypher5: propertyExpression_Cypher5 EQ expression_Cypher5        # SetProp5
   | dynamicPropertyExpression_Cypher5 EQ expression_Cypher5 # SetDynamicProp5
   | variable_Cypher5 EQ expression_Cypher5                  # SetProps5
   | variable_Cypher5 PLUSEQUAL expression_Cypher5           # AddProp5
   | variable_Cypher5 nodeLabels_Cypher5                     # SetLabels5
   | variable_Cypher5 nodeLabelsIs_Cypher5                   # SetLabelsIs5
   ;

removeClause_Cypher5: REMOVE removeItem_Cypher5 (COMMA removeItem_Cypher5)*
   ;

removeItem_Cypher5: propertyExpression_Cypher5         # RemoveProp5
   | dynamicPropertyExpression_Cypher5  # RemoveDynamicProp5
   | variable_Cypher5 nodeLabels_Cypher5        # RemoveLabels5
   | variable_Cypher5 nodeLabelsIs_Cypher5      # RemoveLabelsIs5
   ;

deleteClause_Cypher5: (DETACH | NODETACH)? DELETE expression_Cypher5 (COMMA expression_Cypher5)*
   ;

matchClause_Cypher5: OPTIONAL? MATCH matchMode_Cypher5? patternList_Cypher5 hint_Cypher5* whereClause_Cypher5?
   ;

matchMode_Cypher5: REPEATABLE (ELEMENT BINDINGS? | ELEMENTS)
   | DIFFERENT (RELATIONSHIP BINDINGS? | RELATIONSHIPS)
   ;

hint_Cypher5: USING (((
      INDEX
      | BTREE INDEX
      | TEXT INDEX
      | RANGE INDEX
      | POINT INDEX
   ) SEEK? variable_Cypher5 labelOrRelType_Cypher5 LPAREN nonEmptyNameList_Cypher5 RPAREN)
   | JOIN ON nonEmptyNameList_Cypher5
   | SCAN variable_Cypher5 labelOrRelType_Cypher5
   )
   ;

mergeClause_Cypher5: MERGE pattern_Cypher5 mergeAction_Cypher5*
   ;

mergeAction_Cypher5: ON (MATCH | CREATE) setClause_Cypher5
   ;

unwindClause_Cypher5: UNWIND expression_Cypher5 AS variable_Cypher5
   ;

callClause_Cypher5: OPTIONAL? CALL procedureName_Cypher5 (LPAREN (procedureArgument_Cypher5 (COMMA procedureArgument_Cypher5)*)? RPAREN)? (YIELD (TIMES | procedureResultItem_Cypher5 (COMMA procedureResultItem_Cypher5)* whereClause_Cypher5?))?
   ;

procedureName_Cypher5: namespace_Cypher5 symbolicNameString_Cypher5
   ;

procedureArgument_Cypher5: expression_Cypher5
   ;

procedureResultItem_Cypher5: symbolicNameString_Cypher5 (AS variable_Cypher5)?
   ;

loadCSVClause_Cypher5: LOAD CSV (WITH HEADERS)? FROM expression_Cypher5 AS variable_Cypher5 (FIELDTERMINATOR stringLiteral_Cypher5)?
   ;

foreachClause_Cypher5: FOREACH LPAREN variable_Cypher5 IN expression_Cypher5 BAR clause_Cypher5+ RPAREN
   ;

subqueryClause_Cypher5: OPTIONAL? CALL subqueryScope_Cypher5? LCURLY regularQuery_Cypher5 RCURLY subqueryInTransactionsParameters_Cypher5?
   ;

subqueryScope_Cypher5: LPAREN (TIMES | variable_Cypher5 (COMMA variable_Cypher5)*)? RPAREN
   ;

subqueryInTransactionsParameters_Cypher5: IN (expression_Cypher5? CONCURRENT)? TRANSACTIONS (subqueryInTransactionsBatchParameters_Cypher5 | subqueryInTransactionsErrorParameters_Cypher5 | subqueryInTransactionsReportParameters_Cypher5)*
   ;

subqueryInTransactionsBatchParameters_Cypher5: OF expression_Cypher5 (ROW | ROWS)
   ;

subqueryInTransactionsErrorParameters_Cypher5: ON ERROR (CONTINUE | BREAK | FAIL)
   ;

subqueryInTransactionsReportParameters_Cypher5: REPORT STATUS AS variable_Cypher5
   ;

orderBySkipLimitClause_Cypher5: orderBy_Cypher5 skip_Cypher5? limit_Cypher5?
   | skip_Cypher5 limit_Cypher5?
   | limit_Cypher5
   ;

patternList_Cypher5: pattern_Cypher5 (COMMA pattern_Cypher5)*
   ;

insertPatternList_Cypher5: insertPattern_Cypher5 (COMMA insertPattern_Cypher5)*
   ;

pattern_Cypher5: (variable_Cypher5 EQ)? selector_Cypher5? anonymousPattern_Cypher5
   ;

insertPattern_Cypher5: (symbolicNameString_Cypher5 EQ)? insertNodePattern_Cypher5 (insertRelationshipPattern_Cypher5 insertNodePattern_Cypher5)*
   ;

quantifier_Cypher5: LCURLY UNSIGNED_DECIMAL_INTEGER RCURLY
   | LCURLY from = UNSIGNED_DECIMAL_INTEGER? COMMA to = UNSIGNED_DECIMAL_INTEGER? RCURLY
   | PLUS
   | TIMES
   ;

anonymousPattern_Cypher5: shortestPathPattern_Cypher5
   | patternElement_Cypher5
   ;

shortestPathPattern_Cypher5: (SHORTEST_PATH | ALL_SHORTEST_PATHS) LPAREN patternElement_Cypher5 RPAREN
   ;

patternElement_Cypher5: (nodePattern_Cypher5 (relationshipPattern_Cypher5 quantifier_Cypher5? nodePattern_Cypher5)* | parenthesizedPath_Cypher5)+
   ;

selector_Cypher5: ANY SHORTEST pathToken_Cypher5?                                  # AnyShortestPath5
   | ALL SHORTEST pathToken_Cypher5?                                  # AllShortestPath5
   | ANY UNSIGNED_DECIMAL_INTEGER? pathToken_Cypher5?                 # AnyPath5
   | ALL pathToken_Cypher5?                                           # AllPath5
   | SHORTEST UNSIGNED_DECIMAL_INTEGER? pathToken_Cypher5? groupToken_Cypher5 # ShortestGroup5
   | SHORTEST UNSIGNED_DECIMAL_INTEGER pathToken_Cypher5?             # AnyShortestPath5
   ;

groupToken_Cypher5: GROUP | GROUPS
   ;

pathToken_Cypher5: PATH | PATHS
   ;

pathPatternNonEmpty_Cypher5: nodePattern_Cypher5 (relationshipPattern_Cypher5 nodePattern_Cypher5)+
   ;

nodePattern_Cypher5: LPAREN variable_Cypher5? labelExpression_Cypher5? properties_Cypher5? (WHERE expression_Cypher5)? RPAREN
   ;

insertNodePattern_Cypher5: LPAREN variable_Cypher5? insertNodeLabelExpression_Cypher5? map_Cypher5? RPAREN
   ;

parenthesizedPath_Cypher5: LPAREN pattern_Cypher5 (WHERE expression_Cypher5)? RPAREN quantifier_Cypher5?
   ;

nodeLabels_Cypher5: (labelType_Cypher5 | dynamicLabelType_Cypher5)+
   ;

nodeLabelsIs_Cypher5: IS (symbolicNameString_Cypher5 | dynamicExpression_Cypher5) (labelType_Cypher5 | dynamicLabelType_Cypher5)*
   ;

dynamicExpression_Cypher5: DOLLAR LPAREN expression_Cypher5 RPAREN
   ;

dynamicLabelType_Cypher5: COLON dynamicExpression_Cypher5
   ;

labelType_Cypher5: COLON symbolicNameString_Cypher5
   ;

relType_Cypher5: COLON symbolicNameString_Cypher5
   ;

labelOrRelType_Cypher5: COLON symbolicNameString_Cypher5
   ;

properties_Cypher5: map_Cypher5
   | parameter_Cypher5["ANY"]
   ;

relationshipPattern_Cypher5: leftArrow_Cypher5? arrowLine_Cypher5 (LBRACKET variable_Cypher5? labelExpression_Cypher5? pathLength_Cypher5? properties_Cypher5? (WHERE expression_Cypher5)? RBRACKET)? arrowLine_Cypher5 rightArrow_Cypher5?
   ;

insertRelationshipPattern_Cypher5: leftArrow_Cypher5? arrowLine_Cypher5 LBRACKET variable_Cypher5? insertRelationshipLabelExpression_Cypher5 map_Cypher5? RBRACKET arrowLine_Cypher5 rightArrow_Cypher5?
   ;

leftArrow_Cypher5: LT
   | ARROW_LEFT_HEAD
   ;

arrowLine_Cypher5: ARROW_LINE
   | MINUS
   ;

rightArrow_Cypher5: GT
   | ARROW_RIGHT_HEAD
   ;

pathLength_Cypher5: TIMES (from = UNSIGNED_DECIMAL_INTEGER? DOTDOT to = UNSIGNED_DECIMAL_INTEGER? | single = UNSIGNED_DECIMAL_INTEGER)?
   ;

labelExpression_Cypher5: COLON labelExpression4_Cypher5
   | IS labelExpression4Is_Cypher5
   ;

labelExpression4_Cypher5: labelExpression3_Cypher5 (BAR COLON? labelExpression3_Cypher5)*
   ;

labelExpression4Is_Cypher5: labelExpression3Is_Cypher5 (BAR COLON? labelExpression3Is_Cypher5)*
   ;

labelExpression3_Cypher5: labelExpression2_Cypher5 ((AMPERSAND | COLON) labelExpression2_Cypher5)*
   ;

labelExpression3Is_Cypher5: labelExpression2Is_Cypher5 ((AMPERSAND | COLON) labelExpression2Is_Cypher5)*
   ;

labelExpression2_Cypher5: EXCLAMATION_MARK* labelExpression1_Cypher5
   ;

labelExpression2Is_Cypher5: EXCLAMATION_MARK* labelExpression1Is_Cypher5
   ;

labelExpression1_Cypher5: LPAREN labelExpression4_Cypher5 RPAREN #ParenthesizedLabelExpression5
   | PERCENT                        #AnyLabel5
   | symbolicNameString_Cypher5             #LabelName5
   ;

labelExpression1Is_Cypher5: LPAREN labelExpression4Is_Cypher5 RPAREN #ParenthesizedLabelExpressionIs5
   | PERCENT                          #AnyLabelIs5
   | symbolicLabelNameString_Cypher5          #LabelNameIs5
   ;

insertNodeLabelExpression_Cypher5: (COLON | IS) symbolicNameString_Cypher5 ((AMPERSAND | COLON) symbolicNameString_Cypher5)*
   ;

insertRelationshipLabelExpression_Cypher5: (COLON | IS) symbolicNameString_Cypher5
   ;

expression_Cypher5: expression11_Cypher5 (OR expression11_Cypher5)*
   ;

expression11_Cypher5: expression10_Cypher5 (XOR expression10_Cypher5)*
   ;

expression10_Cypher5: expression9_Cypher5 (AND expression9_Cypher5)*
   ;

expression9_Cypher5: NOT* expression8_Cypher5
   ;

// Making changes here? Consider looking at extendedWhen_Cypher5 too.
expression8_Cypher5: expression7_Cypher5 ((
      EQ
      | INVALID_NEQ
      | NEQ
      | LE
      | GE
      | LT
      | GT
   ) expression7_Cypher5)*
   ;

expression7_Cypher5: expression6_Cypher5 comparisonExpression6_Cypher5?
   ;

// Making changes here? Consider looking at extendedWhen_Cypher5 too.
comparisonExpression6_Cypher5: (
      REGEQ
      | STARTS WITH
      | ENDS WITH
      | CONTAINS
      | IN
   ) expression6_Cypher5                                      # StringAndListComparison5
   | IS NOT? NULL                                     # NullComparison5
   | (IS NOT? (TYPED | COLONCOLON) | COLONCOLON) type_Cypher5 # TypeComparison5
   | IS NOT? normalForm_Cypher5? NORMALIZED                   # NormalFormComparison5
   ;

normalForm_Cypher5: NFC
   | NFD
   | NFKC
   | NFKD
   ;

expression6_Cypher5: expression5_Cypher5 ((PLUS | MINUS | DOUBLEBAR) expression5_Cypher5)*
   ;

expression5_Cypher5: expression4_Cypher5 ((TIMES | DIVIDE | PERCENT) expression4_Cypher5)*
   ;

expression4_Cypher5: expression3_Cypher5 (POW expression3_Cypher5)*
   ;

expression3_Cypher5: expression2_Cypher5
   | (PLUS | MINUS) expression2_Cypher5
   ;

expression2_Cypher5: expression1_Cypher5 postFix_Cypher5*
   ;

postFix_Cypher5: property_Cypher5                                                           # PropertyPostfix5
   | labelExpression_Cypher5                                                    # LabelPostfix5
   | LBRACKET expression_Cypher5 RBRACKET                                       # IndexPostfix5
   | LBRACKET fromExp = expression_Cypher5? DOTDOT toExp = expression_Cypher5? RBRACKET # RangePostfix5
   ;

property_Cypher5: DOT propertyKeyName_Cypher5
   ;

dynamicProperty_Cypher5: LBRACKET expression_Cypher5 RBRACKET
   ;

propertyExpression_Cypher5: expression1_Cypher5 property_Cypher5+
   ;

dynamicPropertyExpression_Cypher5: expression1_Cypher5 dynamicProperty_Cypher5
   ;

expression1_Cypher5: literal_Cypher5
   | parameter_Cypher5["ANY"]
   | caseExpression_Cypher5
   | extendedCaseExpression_Cypher5
   | countStar_Cypher5
   | existsExpression_Cypher5
   | countExpression_Cypher5
   | collectExpression_Cypher5
   | mapProjection_Cypher5
   | listComprehension_Cypher5
   | listLiteral_Cypher5
   | patternComprehension_Cypher5
   | reduceExpression_Cypher5
   | listItemsPredicate_Cypher5
   | normalizeFunction_Cypher5
   | trimFunction_Cypher5
   | patternExpression_Cypher5
   | shortestPathExpression_Cypher5
   | parenthesizedExpression_Cypher5
   | functionInvocation_Cypher5
   | variable_Cypher5
   ;

literal_Cypher5: numberLiteral_Cypher5 # NummericLiteral5
   | stringLiteral_Cypher5 # StringsLiteral5
   | map_Cypher5           # OtherLiteral5
   | TRUE          # BooleanLiteral5
   | FALSE         # BooleanLiteral5
   | INF           # KeywordLiteral5
   | INFINITY      # KeywordLiteral5
   | NAN           # KeywordLiteral5
   | NULL          # KeywordLiteral5
   ;

caseExpression_Cypher5: CASE caseAlternative_Cypher5+ (ELSE expression_Cypher5)? END
   ;

caseAlternative_Cypher5: WHEN expression_Cypher5 THEN expression_Cypher5
   ;

extendedCaseExpression_Cypher5: CASE expression_Cypher5 extendedCaseAlternative_Cypher5+ (ELSE elseExp = expression_Cypher5)? END
   ;

extendedCaseAlternative_Cypher5: WHEN extendedWhen_Cypher5 (COMMA extendedWhen_Cypher5)* THEN expression_Cypher5
   ;

// Making changes here? Consider looking at comparisonExpression6_Cypher5 and expression8_Cypher5 too.
extendedWhen_Cypher5: (REGEQ | STARTS WITH | ENDS WITH) expression6_Cypher5 # WhenStringOrList5
   | IS NOT? NULL                                  # WhenNull5
   | (IS NOT? TYPED | COLONCOLON) type_Cypher5             # WhenType5
   | IS NOT? normalForm_Cypher5? NORMALIZED                # WhenForm5
   | (
      EQ
      | NEQ
      | INVALID_NEQ
      | LE
      | GE
      | LT
      | GT
   ) expression7_Cypher5                                   # WhenComparator5
   | expression_Cypher5                                    # WhenEquals5
   ;

// Observe that this is not possible to write as:
// (WHERE whereExp = expression_Cypher5)? (BAR barExp = expression_Cypher5)? RBRACKET
// Due to an ambigouity with cases such as [node IN nodes WHERE node:A|B]
// where |B will be interpreted as part of the whereExp, rather than as the expected barExp.
listComprehension_Cypher5: LBRACKET variable_Cypher5 IN expression_Cypher5 ((WHERE whereExp = expression_Cypher5)? BAR barExp = expression_Cypher5 | (WHERE whereExp = expression_Cypher5)?) RBRACKET
   ;

patternComprehension_Cypher5: LBRACKET (variable_Cypher5 EQ)? pathPatternNonEmpty_Cypher5 (WHERE whereExp = expression_Cypher5)? BAR barExp = expression_Cypher5 RBRACKET
   ;

reduceExpression_Cypher5: REDUCE LPAREN variable_Cypher5 EQ expression_Cypher5 COMMA variable_Cypher5 IN expression_Cypher5 BAR expression_Cypher5 RPAREN
   ;

listItemsPredicate_Cypher5: (
      ALL
      | ANY
      | NONE
      | SINGLE
   ) LPAREN variable_Cypher5 IN inExp = expression_Cypher5 (WHERE whereExp = expression_Cypher5)? RPAREN
   ;

normalizeFunction_Cypher5: NORMALIZE LPAREN expression_Cypher5 (COMMA normalForm_Cypher5)? RPAREN
   ;

trimFunction_Cypher5: TRIM LPAREN ((BOTH | LEADING | TRAILING)? (trimCharacterString = expression_Cypher5)? FROM)? trimSource = expression_Cypher5 RPAREN
   ;

patternExpression_Cypher5: pathPatternNonEmpty_Cypher5
   ;

shortestPathExpression_Cypher5: shortestPathPattern_Cypher5
   ;

parenthesizedExpression_Cypher5: LPAREN expression_Cypher5 RPAREN
   ;

mapProjection_Cypher5: variable_Cypher5 LCURLY (mapProjectionElement_Cypher5 (COMMA mapProjectionElement_Cypher5)* )? RCURLY
   ;

mapProjectionElement_Cypher5: propertyKeyName_Cypher5 COLON expression_Cypher5
   | property_Cypher5
   | variable_Cypher5
   | DOT TIMES
   ;

countStar_Cypher5: COUNT LPAREN TIMES RPAREN
   ;

existsExpression_Cypher5: EXISTS LCURLY (regularQuery_Cypher5 | matchMode_Cypher5? patternList_Cypher5 whereClause_Cypher5?) RCURLY
   ;

countExpression_Cypher5: COUNT LCURLY (regularQuery_Cypher5 | matchMode_Cypher5? patternList_Cypher5 whereClause_Cypher5?) RCURLY
   ;

collectExpression_Cypher5: COLLECT LCURLY regularQuery_Cypher5 RCURLY
   ;

numberLiteral_Cypher5: MINUS? (
      DECIMAL_DOUBLE
      | UNSIGNED_DECIMAL_INTEGER
      | UNSIGNED_HEX_INTEGER
      | UNSIGNED_OCTAL_INTEGER
   )
   ;

signedIntegerLiteral_Cypher5: MINUS? UNSIGNED_DECIMAL_INTEGER
   ;

listLiteral_Cypher5: LBRACKET (expression_Cypher5 (COMMA expression_Cypher5)* )? RBRACKET
   ;

propertyKeyName_Cypher5: symbolicNameString_Cypher5
   ;

parameter_Cypher5[String paramType]
   : DOLLAR parameterName_Cypher5[paramType]
   ;

parameterName_Cypher5[String paramType]
   : (symbolicNameString_Cypher5 | UNSIGNED_DECIMAL_INTEGER)
   ;

functionInvocation_Cypher5: functionName_Cypher5 LPAREN (DISTINCT | ALL)? (functionArgument_Cypher5 (COMMA functionArgument_Cypher5)* )? RPAREN
   ;

functionArgument_Cypher5: expression_Cypher5
   ;

functionName_Cypher5: namespace_Cypher5 symbolicNameString_Cypher5
   ;

namespace_Cypher5: (symbolicNameString_Cypher5 DOT)*
   ;

variable_Cypher5: symbolicNameString_Cypher5
   ;

// Returns non-list of propertyKeyNames
nonEmptyNameList_Cypher5: symbolicNameString_Cypher5 (COMMA symbolicNameString_Cypher5)*
   ;

type_Cypher5: typePart_Cypher5 (BAR typePart_Cypher5)*
   ;

typePart_Cypher5: typeName typeNullability_Cypher5? typeListSuffix_Cypher5*
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
   | (LIST | ARRAY) LT type_Cypher5 GT
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
      | VALUE? LT type_Cypher5 GT
      | VALUE
   )?
   ;

typeNullability_Cypher5: NOT NULL
   | EXCLAMATION_MARK
   ;

typeListSuffix_Cypher5: (LIST | ARRAY) typeNullability_Cypher5?
   ;

// Show, terminate, schema and admin commands

command_Cypher5: useClause_Cypher5? (
      createCommand_Cypher5
      | dropCommand_Cypher5
      | alterCommand_Cypher5
      | renameCommand_Cypher5
      | denyCommand_Cypher5
      | revokeCommand_Cypher5
      | grantCommand_Cypher5
      | startDatabase_Cypher5
      | stopDatabase_Cypher5
      | enableServerCommand_Cypher5
      | allocationCommand_Cypher5
      | showCommand_Cypher5
      | terminateCommand_Cypher5
   )
   ;

createCommand_Cypher5: CREATE (OR REPLACE)? (
      createAlias_Cypher5
      | createCompositeDatabase_Cypher5
      | createConstraint_Cypher5
      | createDatabase_Cypher5
      | createIndex_Cypher5
      | createRole_Cypher5
      | createUser_Cypher5
   )
   ;

dropCommand_Cypher5: DROP (
      dropAlias_Cypher5
      | dropConstraint_Cypher5
      | dropDatabase_Cypher5
      | dropIndex_Cypher5
      | dropRole_Cypher5
      | dropServer_Cypher5
      | dropUser_Cypher5
   )
   ;

showCommand_Cypher5: SHOW (
      showAliases_Cypher5
      | showConstraintCommand_Cypher5
      | showCurrentUser_Cypher5
      | showDatabase_Cypher5
      | showFunctions_Cypher5
      | showIndexCommand_Cypher5
      | showPrivileges_Cypher5
      | showProcedures_Cypher5
      | showRolePrivileges_Cypher5
      | showRoles_Cypher5
      | showServers_Cypher5
      | showSettings_Cypher5
      | showSupportedPrivileges_Cypher5
      | showTransactions_Cypher5
      | showUserPrivileges_Cypher5
      | showUsers_Cypher5
   )
   ;

showCommandYield_Cypher5: yieldClause_Cypher5 returnClause_Cypher5?
   | whereClause_Cypher5
   ;

yieldItem_Cypher5: variable_Cypher5 (AS variable_Cypher5)?
   ;

yieldSkip_Cypher5: (OFFSET | SKIPROWS) signedIntegerLiteral_Cypher5
   ;

yieldLimit_Cypher5: LIMITROWS signedIntegerLiteral_Cypher5
   ;

yieldClause_Cypher5: YIELD (TIMES | yieldItem_Cypher5 (COMMA yieldItem_Cypher5)*) orderBy_Cypher5? yieldSkip_Cypher5? yieldLimit_Cypher5? whereClause_Cypher5?
   ;

commandOptions_Cypher5: OPTIONS mapOrParameter_Cypher5
   ;

// Non-admin show and terminate commands

terminateCommand_Cypher5: TERMINATE terminateTransactions_Cypher5
   ;

composableCommandClauses_Cypher5: terminateCommand_Cypher5
   | composableShowCommandClauses_Cypher5
   ;

composableShowCommandClauses_Cypher5: SHOW (
      showIndexCommand_Cypher5
      | showConstraintCommand_Cypher5
      | showFunctions_Cypher5
      | showProcedures_Cypher5
      | showSettings_Cypher5
      | showTransactions_Cypher5
   )
   ;

showBriefAndYield_Cypher5: (BRIEF | VERBOSE) OUTPUT?
   | yieldClause_Cypher5 returnClause_Cypher5?
   | whereClause_Cypher5
   ;

showIndexCommand_Cypher5: (
      FULLTEXT
      | LOOKUP
      | POINT
      | RANGE
      | TEXT
      | VECTOR
   ) showIndexesNoBrief_Cypher5
   | (ALL | BTREE)? showIndexesAllowBrief_Cypher5
   ;

showIndexesAllowBrief_Cypher5: indexToken_Cypher5 showBriefAndYield_Cypher5? composableCommandClauses_Cypher5?
   ;

showIndexesNoBrief_Cypher5: indexToken_Cypher5 showCommandYield_Cypher5? composableCommandClauses_Cypher5?
   ;

showConstraintCommand_Cypher5: (NODE | RELATIONSHIP | REL)? constraintAllowYieldType_Cypher5 showConstraintsAllowYield_Cypher5 # ShowConstraintMulti5
   | (NODE | RELATIONSHIP | REL) UNIQUE showConstraintsAllowYield_Cypher5                    # ShowConstraintUnique5
   | (RELATIONSHIP | REL)? KEY showConstraintsAllowYield_Cypher5                             # ShowConstraintKey5
   | REL EXIST showConstraintsAllowYield_Cypher5                                             # ShowConstraintRelExist5
   | (NODE | RELATIONSHIP)? EXISTS showConstraintsAllowBrief_Cypher5                         # ShowConstraintOldExists5
   | constraintBriefAndYieldType_Cypher5? showConstraintsAllowBriefAndYield_Cypher5                  # ShowConstraintBriefAndYield5
   ;

constraintAllowYieldType_Cypher5: UNIQUENESS
   | constraintExistType_Cypher5
   | PROPERTY TYPE
   ;

constraintExistType_Cypher5: EXISTENCE
   | PROPERTY EXISTENCE
   | PROPERTY EXIST
   ;

constraintBriefAndYieldType_Cypher5: ALL
   | UNIQUE
   | EXIST
   | NODE KEY
   | NODE EXIST
   | RELATIONSHIP EXIST
   ;

showConstraintsAllowBriefAndYield_Cypher5: constraintToken_Cypher5 showBriefAndYield_Cypher5? composableCommandClauses_Cypher5?
   ;

showConstraintsAllowBrief_Cypher5: constraintToken_Cypher5 ((BRIEF | VERBOSE) OUTPUT?)? composableCommandClauses_Cypher5?
   ;

showConstraintsAllowYield_Cypher5: constraintToken_Cypher5 showCommandYield_Cypher5? composableCommandClauses_Cypher5?
   ;

showProcedures_Cypher5: (PROCEDURE | PROCEDURES) executableBy_Cypher5? showCommandYield_Cypher5? composableCommandClauses_Cypher5?
   ;

showFunctions_Cypher5: showFunctionsType_Cypher5? functionToken_Cypher5 executableBy_Cypher5? showCommandYield_Cypher5? composableCommandClauses_Cypher5?
   ;

functionToken_Cypher5: FUNCTION | FUNCTIONS
   ;

executableBy_Cypher5: EXECUTABLE (BY (CURRENT USER | symbolicNameString_Cypher5))?
   ;

showFunctionsType_Cypher5: ALL
   | BUILT IN
   | USER DEFINED
   ;

showTransactions_Cypher5: transactionToken_Cypher5 namesAndClauses_Cypher5
   ;

terminateTransactions_Cypher5: transactionToken_Cypher5 namesAndClauses_Cypher5
   ;

showSettings_Cypher5: settingToken_Cypher5 namesAndClauses_Cypher5
   ;

settingToken_Cypher5: SETTING | SETTINGS
   ;

namesAndClauses_Cypher5: (showCommandYield_Cypher5? | stringsOrExpression_Cypher5 showCommandYield_Cypher5?) composableCommandClauses_Cypher5?
   ;

stringsOrExpression_Cypher5: stringList_Cypher5
   | expression_Cypher5
   ;

// Schema commands

commandNodePattern_Cypher5: LPAREN variable_Cypher5 labelType_Cypher5 RPAREN
   ;

commandRelPattern_Cypher5: LPAREN RPAREN leftArrow_Cypher5? arrowLine_Cypher5 LBRACKET variable_Cypher5 relType_Cypher5 RBRACKET arrowLine_Cypher5 rightArrow_Cypher5? LPAREN RPAREN
   ;

createConstraint_Cypher5: CONSTRAINT symbolicNameOrStringParameter_Cypher5? (IF NOT EXISTS)? (ON | FOR) (commandNodePattern_Cypher5 | commandRelPattern_Cypher5) constraintType_Cypher5 commandOptions_Cypher5?
   ;

constraintType_Cypher5: ASSERT EXISTS propertyList_Cypher5                                                  # ConstraintExists5
   | (REQUIRE | ASSERT) propertyList_Cypher5 (COLONCOLON | IS (TYPED | COLONCOLON)) type_Cypher5 # ConstraintTyped5
   | (REQUIRE | ASSERT) propertyList_Cypher5 IS (NODE | RELATIONSHIP | REL)? UNIQUE      # ConstraintIsUnique5
   | (REQUIRE | ASSERT) propertyList_Cypher5 IS (NODE | RELATIONSHIP | REL)? KEY         # ConstraintKey5
   | (REQUIRE | ASSERT) propertyList_Cypher5 IS NOT NULL                                 # ConstraintIsNotNull5
   ;

dropConstraint_Cypher5: CONSTRAINT (ON (commandNodePattern_Cypher5 | commandRelPattern_Cypher5) ASSERT (EXISTS propertyList_Cypher5 | propertyList_Cypher5 IS (UNIQUE | NODE KEY | NOT NULL)) | symbolicNameOrStringParameter_Cypher5 (IF EXISTS)?)
   ;

createIndex_Cypher5: BTREE INDEX createIndex__Cypher5
   | RANGE INDEX createIndex__Cypher5
   | TEXT INDEX createIndex__Cypher5
   | POINT INDEX createIndex__Cypher5
   | VECTOR INDEX createIndex__Cypher5
   | LOOKUP INDEX createLookupIndex_Cypher5
   | FULLTEXT INDEX createFulltextIndex_Cypher5
   | INDEX (ON oldCreateIndex_Cypher5 | createIndex__Cypher5)
   ;

oldCreateIndex_Cypher5: labelType_Cypher5 LPAREN nonEmptyNameList_Cypher5 RPAREN
   ;

createIndex__Cypher5: symbolicNameOrStringParameter_Cypher5? (IF NOT EXISTS)? FOR (commandNodePattern_Cypher5 | commandRelPattern_Cypher5) ON propertyList_Cypher5 commandOptions_Cypher5?
   ;

createFulltextIndex_Cypher5: symbolicNameOrStringParameter_Cypher5? (IF NOT EXISTS)? FOR (fulltextNodePattern_Cypher5 | fulltextRelPattern_Cypher5) ON EACH LBRACKET enclosedPropertyList_Cypher5 RBRACKET commandOptions_Cypher5?
   ;

fulltextNodePattern_Cypher5: LPAREN variable_Cypher5 COLON symbolicNameString_Cypher5 (BAR symbolicNameString_Cypher5)* RPAREN
   ;

fulltextRelPattern_Cypher5: LPAREN RPAREN leftArrow_Cypher5? arrowLine_Cypher5 LBRACKET variable_Cypher5 COLON symbolicNameString_Cypher5 (BAR symbolicNameString_Cypher5)* RBRACKET arrowLine_Cypher5 rightArrow_Cypher5? LPAREN RPAREN
   ;

createLookupIndex_Cypher5: symbolicNameOrStringParameter_Cypher5? (IF NOT EXISTS)? FOR (lookupIndexNodePattern_Cypher5 | lookupIndexRelPattern_Cypher5) symbolicNameString_Cypher5 LPAREN variable_Cypher5 RPAREN commandOptions_Cypher5?
   ;

lookupIndexNodePattern_Cypher5: LPAREN variable_Cypher5 RPAREN ON EACH
   ;

lookupIndexRelPattern_Cypher5: LPAREN RPAREN leftArrow_Cypher5? arrowLine_Cypher5 LBRACKET variable_Cypher5 RBRACKET arrowLine_Cypher5 rightArrow_Cypher5? LPAREN RPAREN ON EACH?
   ;

dropIndex_Cypher5: INDEX (ON labelType_Cypher5 LPAREN nonEmptyNameList_Cypher5 RPAREN | symbolicNameOrStringParameter_Cypher5 (IF EXISTS)?)
   ;

propertyList_Cypher5: variable_Cypher5 property_Cypher5 | LPAREN enclosedPropertyList_Cypher5 RPAREN
   ;

enclosedPropertyList_Cypher5: variable_Cypher5 property_Cypher5 (COMMA variable_Cypher5 property_Cypher5)*
   ;

// Admin commands

alterCommand_Cypher5: ALTER (
      alterAlias_Cypher5
      | alterCurrentUser_Cypher5
      | alterDatabase_Cypher5
      | alterUser_Cypher5
      | alterServer_Cypher5
   )
   ;

renameCommand_Cypher5: RENAME (renameRole_Cypher5 | renameServer_Cypher5 | renameUser_Cypher5)
   ;

grantCommand_Cypher5: GRANT (
      IMMUTABLE? privilege_Cypher5 TO roleNames_Cypher5
      | roleToken_Cypher5 grantRole_Cypher5
   )
   ;

denyCommand_Cypher5: DENY IMMUTABLE? privilege_Cypher5 TO roleNames_Cypher5
   ;

revokeCommand_Cypher5: REVOKE (
      (DENY | GRANT)? IMMUTABLE? privilege_Cypher5 FROM roleNames_Cypher5
      | roleToken_Cypher5 revokeRole_Cypher5
   )
   ;

userNames_Cypher5: symbolicNameOrStringParameterList_Cypher5
   ;

roleNames_Cypher5: symbolicNameOrStringParameterList_Cypher5
   ;

roleToken_Cypher5: ROLES
   | ROLE
   ;

// Server commands

enableServerCommand_Cypher5: ENABLE SERVER stringOrParameter_Cypher5 commandOptions_Cypher5?
   ;

alterServer_Cypher5: SERVER stringOrParameter_Cypher5 SET commandOptions_Cypher5
   ;

renameServer_Cypher5: SERVER stringOrParameter_Cypher5 TO stringOrParameter_Cypher5
   ;

dropServer_Cypher5: SERVER stringOrParameter_Cypher5
   ;

showServers_Cypher5: (SERVER | SERVERS) showCommandYield_Cypher5?
   ;

allocationCommand_Cypher5: DRYRUN? (deallocateDatabaseFromServers_Cypher5 | reallocateDatabases_Cypher5)
   ;

deallocateDatabaseFromServers_Cypher5: DEALLOCATE (DATABASE | DATABASES) FROM (SERVER | SERVERS) stringOrParameter_Cypher5 (COMMA stringOrParameter_Cypher5)*
   ;

reallocateDatabases_Cypher5: REALLOCATE (DATABASE | DATABASES)
   ;

// Role commands

createRole_Cypher5: ROLE commandNameExpression_Cypher5 (IF NOT EXISTS)? (AS COPY OF commandNameExpression_Cypher5)?
   ;

dropRole_Cypher5: ROLE commandNameExpression_Cypher5 (IF EXISTS)?
   ;

renameRole_Cypher5: ROLE commandNameExpression_Cypher5 (IF EXISTS)? TO commandNameExpression_Cypher5
   ;

showRoles_Cypher5: (ALL | POPULATED)? roleToken_Cypher5 (WITH (USER | USERS))? showCommandYield_Cypher5?
   ;

grantRole_Cypher5: roleNames_Cypher5 TO userNames_Cypher5
   ;

revokeRole_Cypher5: roleNames_Cypher5 FROM userNames_Cypher5
   ;

// User commands

createUser_Cypher5: USER commandNameExpression_Cypher5 (IF NOT EXISTS)? (SET (
      password_Cypher5
      | PASSWORD passwordChangeRequired_Cypher5
      | userStatus_Cypher5
      | homeDatabase_Cypher5
      | setAuthClause_Cypher5
   ))+;

dropUser_Cypher5: USER commandNameExpression_Cypher5 (IF EXISTS)?
   ;

renameUser_Cypher5: USER commandNameExpression_Cypher5 (IF EXISTS)? TO commandNameExpression_Cypher5
   ;

alterCurrentUser_Cypher5: CURRENT USER SET PASSWORD FROM passwordExpression_Cypher5 TO passwordExpression_Cypher5
   ;

alterUser_Cypher5: USER commandNameExpression_Cypher5 (IF EXISTS)? (REMOVE (
      HOME DATABASE
      | ALL AUTH (PROVIDER | PROVIDERS)?
      | removeNamedProvider_Cypher5
   ))* (SET (
      password_Cypher5
      | PASSWORD passwordChangeRequired_Cypher5
      | userStatus_Cypher5
      | homeDatabase_Cypher5
      | setAuthClause_Cypher5
   ))*
   ;

removeNamedProvider_Cypher5: AUTH (PROVIDER | PROVIDERS)? (stringLiteral_Cypher5 | stringListLiteral_Cypher5 | parameter_Cypher5["ANY"])
   ;

password_Cypher5: (PLAINTEXT | ENCRYPTED)? PASSWORD passwordExpression_Cypher5 passwordChangeRequired_Cypher5?
   ;

passwordOnly_Cypher5: (PLAINTEXT | ENCRYPTED)? PASSWORD passwordExpression_Cypher5
   ;

passwordExpression_Cypher5: stringLiteral_Cypher5
   | parameter_Cypher5["STRING"]
   ;

passwordChangeRequired_Cypher5: CHANGE NOT? REQUIRED
   ;

userStatus_Cypher5: STATUS (SUSPENDED | ACTIVE)
   ;

homeDatabase_Cypher5: HOME DATABASE symbolicAliasNameOrParameter_Cypher5
   ;

setAuthClause_Cypher5: AUTH PROVIDER? stringLiteral_Cypher5 LCURLY (SET (
      userAuthAttribute_Cypher5
   ))+ RCURLY
   ;

userAuthAttribute_Cypher5: ID stringOrParameterExpression_Cypher5
   | passwordOnly_Cypher5
   | PASSWORD passwordChangeRequired_Cypher5
   ;

showUsers_Cypher5: (USER | USERS) (WITH AUTH)? showCommandYield_Cypher5?
   ;

showCurrentUser_Cypher5: CURRENT USER showCommandYield_Cypher5?
   ;

// Privilege commands

showSupportedPrivileges_Cypher5: SUPPORTED privilegeToken_Cypher5 showCommandYield_Cypher5?
   ;

showPrivileges_Cypher5: ALL? privilegeToken_Cypher5 privilegeAsCommand_Cypher5? showCommandYield_Cypher5?
   ;

showRolePrivileges_Cypher5: (ROLE | ROLES) roleNames_Cypher5 privilegeToken_Cypher5 privilegeAsCommand_Cypher5? showCommandYield_Cypher5?
   ;

showUserPrivileges_Cypher5: (USER | USERS) userNames_Cypher5? privilegeToken_Cypher5 privilegeAsCommand_Cypher5? showCommandYield_Cypher5?
   ;

privilegeAsCommand_Cypher5: AS REVOKE? (COMMAND | COMMANDS)
   ;

privilegeToken_Cypher5: PRIVILEGE
   | PRIVILEGES
   ;

privilege_Cypher5: allPrivilege_Cypher5
   | createPrivilege_Cypher5
   | databasePrivilege_Cypher5
   | dbmsPrivilege_Cypher5
   | dropPrivilege_Cypher5
   | loadPrivilege_Cypher5
   | qualifiedGraphPrivileges_Cypher5
   | qualifiedGraphPrivilegesWithProperty_Cypher5
   | removePrivilege_Cypher5
   | setPrivilege_Cypher5
   | showPrivilege_Cypher5
   | writePrivilege_Cypher5
   ;

allPrivilege_Cypher5: ALL allPrivilegeType_Cypher5? ON allPrivilegeTarget_Cypher5
   ;

allPrivilegeType_Cypher5: (DATABASE | GRAPH | DBMS)? PRIVILEGES
   ;

allPrivilegeTarget_Cypher5: (DEFAULT | HOME) (DATABASE | GRAPH)                    # DefaultTarget5
   | (DATABASE | DATABASES) (TIMES | symbolicAliasNameList_Cypher5) # DatabaseVariableTarget5
   | (GRAPH | GRAPHS) (TIMES | symbolicAliasNameList_Cypher5)       # GraphVariableTarget5
   | DBMS                                                   # DBMSTarget5
   ;

createPrivilege_Cypher5: CREATE (
      createPrivilegeForDatabase_Cypher5 ON databaseScope_Cypher5
      | actionForDBMS_Cypher5 ON DBMS
      | ON graphScope_Cypher5 graphQualifier_Cypher5
   )
   ;

createPrivilegeForDatabase_Cypher5: indexToken_Cypher5
   | constraintToken_Cypher5
   | createNodePrivilegeToken_Cypher5
   | createRelPrivilegeToken_Cypher5
   | createPropertyPrivilegeToken_Cypher5
   ;

createNodePrivilegeToken_Cypher5: NEW NODE? (LABEL | LABELS)
   ;

createRelPrivilegeToken_Cypher5: NEW RELATIONSHIP? (TYPE | TYPES)
   ;

createPropertyPrivilegeToken_Cypher5: NEW PROPERTY? (NAME | NAMES)
   ;

actionForDBMS_Cypher5: ALIAS
   | COMPOSITE? DATABASE
   | ROLE
   | USER
   ;

dropPrivilege_Cypher5: DROP (
      (indexToken_Cypher5 | constraintToken_Cypher5) ON databaseScope_Cypher5
      | actionForDBMS_Cypher5 ON DBMS
   )
   ;

loadPrivilege_Cypher5: LOAD ON (
      (URL | CIDR) stringOrParameter_Cypher5
      | ALL DATA
   )
   ;

showPrivilege_Cypher5: SHOW (
      (indexToken_Cypher5 | constraintToken_Cypher5 | transactionToken_Cypher5 userQualifier_Cypher5?) ON databaseScope_Cypher5
      | (ALIAS | PRIVILEGE | ROLE | SERVER | SERVERS | settingToken_Cypher5 settingQualifier_Cypher5 | USER) ON DBMS
   )
   ;

setPrivilege_Cypher5: SET (
      (passwordToken_Cypher5 | USER (STATUS | HOME DATABASE) | DATABASE ACCESS) ON DBMS
      | LABEL labelsResource_Cypher5 ON graphScope_Cypher5
      | PROPERTY propertiesResource_Cypher5 ON graphScope_Cypher5 graphQualifier_Cypher5
      | AUTH ON DBMS
   )
   ;

passwordToken_Cypher5: PASSWORD
   | PASSWORDS
   ;

removePrivilege_Cypher5: REMOVE (
      (PRIVILEGE | ROLE) ON DBMS
      | LABEL labelsResource_Cypher5 ON graphScope_Cypher5
   )
   ;

writePrivilege_Cypher5: WRITE ON graphScope_Cypher5
   ;

databasePrivilege_Cypher5: (
      ACCESS
      | START
      | STOP
      | (indexToken_Cypher5 | constraintToken_Cypher5 | NAME) MANAGEMENT?
      | (TRANSACTION MANAGEMENT? | TERMINATE transactionToken_Cypher5) userQualifier_Cypher5?
   )
   ON databaseScope_Cypher5
   ;

dbmsPrivilege_Cypher5: (
      ALTER (ALIAS | DATABASE | USER)
      | ASSIGN (PRIVILEGE | ROLE)
      | (ALIAS | COMPOSITE? DATABASE | PRIVILEGE | ROLE | SERVER | USER) MANAGEMENT
      | dbmsPrivilegeExecute_Cypher5
      | RENAME (ROLE | USER)
      | IMPERSONATE userQualifier_Cypher5?
   )
   ON DBMS
   ;

dbmsPrivilegeExecute_Cypher5: EXECUTE (
      adminToken_Cypher5 PROCEDURES
      | BOOSTED? (
         procedureToken_Cypher5 executeProcedureQualifier_Cypher5
         | (USER DEFINED?)? functionToken_Cypher5 executeFunctionQualifier_Cypher5
      )
   )
   ;

adminToken_Cypher5: ADMIN
   | ADMINISTRATOR
   ;

procedureToken_Cypher5: PROCEDURE
   | PROCEDURES
   ;

indexToken_Cypher5: INDEX
   | INDEXES
   ;

constraintToken_Cypher5: CONSTRAINT
   | CONSTRAINTS
   ;

transactionToken_Cypher5: TRANSACTION
   | TRANSACTIONS
   ;

userQualifier_Cypher5: LPAREN (TIMES | userNames_Cypher5) RPAREN
   ;

executeFunctionQualifier_Cypher5: globs_Cypher5
   ;

executeProcedureQualifier_Cypher5: globs_Cypher5
   ;

settingQualifier_Cypher5: globs_Cypher5
   ;

globs_Cypher5: glob_Cypher5 (COMMA glob_Cypher5)*
   ;

glob_Cypher5: escapedSymbolicNameString_Cypher5 globRecursive_Cypher5?
   | globRecursive_Cypher5
   ;

globRecursive_Cypher5: globPart_Cypher5 globRecursive_Cypher5?
   ;

globPart_Cypher5: DOT escapedSymbolicNameString_Cypher5?
   | QUESTION
   | TIMES
   | unescapedSymbolicNameString_Cypher5
   ;

qualifiedGraphPrivilegesWithProperty_Cypher5: (TRAVERSE | (READ | MATCH) propertiesResource_Cypher5) ON graphScope_Cypher5 graphQualifier_Cypher5 (LPAREN TIMES RPAREN)?
   ;

qualifiedGraphPrivileges_Cypher5: (DELETE | MERGE propertiesResource_Cypher5) ON graphScope_Cypher5 graphQualifier_Cypher5
   ;

labelsResource_Cypher5: TIMES
   | nonEmptyStringList_Cypher5
   ;

propertiesResource_Cypher5: LCURLY (TIMES | nonEmptyStringList_Cypher5) RCURLY
   ;

// Returns non-empty list of strings
nonEmptyStringList_Cypher5: symbolicNameString_Cypher5 (COMMA symbolicNameString_Cypher5)*
   ;

graphQualifier_Cypher5: (
      graphQualifierToken_Cypher5 (TIMES | nonEmptyStringList_Cypher5)
      | FOR LPAREN variable_Cypher5? (COLON symbolicNameString_Cypher5 (BAR symbolicNameString_Cypher5)*)? (RPAREN WHERE expression_Cypher5 | (WHERE expression_Cypher5 | map_Cypher5) RPAREN)
   )?
   ;

graphQualifierToken_Cypher5: relToken_Cypher5
   | nodeToken_Cypher5
   | elementToken_Cypher5
   ;

relToken_Cypher5: RELATIONSHIP
   | RELATIONSHIPS
   ;

elementToken_Cypher5: ELEMENT
   | ELEMENTS
   ;

nodeToken_Cypher5: NODE
   | NODES
   ;

databaseScope_Cypher5: (DEFAULT | HOME) DATABASE
   | (DATABASE | DATABASES) (TIMES | symbolicAliasNameList_Cypher5)
   ;

graphScope_Cypher5: (DEFAULT | HOME) GRAPH
   | (GRAPH | GRAPHS) (TIMES | symbolicAliasNameList_Cypher5)
   ;

// Database commands

createCompositeDatabase_Cypher5: COMPOSITE DATABASE symbolicAliasNameOrParameter_Cypher5 (IF NOT EXISTS)? commandOptions_Cypher5? waitClause_Cypher5?
   ;

createDatabase_Cypher5: DATABASE symbolicAliasNameOrParameter_Cypher5 (IF NOT EXISTS)? (TOPOLOGY (primaryTopology_Cypher5 | secondaryTopology_Cypher5)+)? commandOptions_Cypher5? waitClause_Cypher5?
   ;

primaryTopology_Cypher5: UNSIGNED_DECIMAL_INTEGER primaryToken_Cypher5
   ;

primaryToken_Cypher5: PRIMARY | PRIMARIES
   ;

secondaryTopology_Cypher5: UNSIGNED_DECIMAL_INTEGER secondaryToken_Cypher5
   ;

secondaryToken_Cypher5: SECONDARY | SECONDARIES
   ;

dropDatabase_Cypher5: COMPOSITE? DATABASE symbolicAliasNameOrParameter_Cypher5 (IF EXISTS)? aliasAction_Cypher5? ((DUMP | DESTROY) DATA)? waitClause_Cypher5?
   ;

aliasAction_Cypher5: RESTRICT
   | CASCADE (ALIAS | ALIASES)
   ;

alterDatabase_Cypher5: DATABASE symbolicAliasNameOrParameter_Cypher5 (IF EXISTS)? (
      (SET (alterDatabaseAccess_Cypher5 | alterDatabaseTopology_Cypher5 | alterDatabaseOption_Cypher5))+
      | (REMOVE OPTION symbolicNameString_Cypher5)+
   ) waitClause_Cypher5?
   ;

alterDatabaseAccess_Cypher5: ACCESS READ (ONLY | WRITE)
   ;

alterDatabaseTopology_Cypher5: TOPOLOGY (primaryTopology_Cypher5 | secondaryTopology_Cypher5)+
   ;

alterDatabaseOption_Cypher5: OPTION symbolicNameString_Cypher5 expression_Cypher5
   ;

startDatabase_Cypher5: START DATABASE symbolicAliasNameOrParameter_Cypher5 waitClause_Cypher5?
   ;

stopDatabase_Cypher5: STOP DATABASE symbolicAliasNameOrParameter_Cypher5 waitClause_Cypher5?
   ;

waitClause_Cypher5: WAIT (UNSIGNED_DECIMAL_INTEGER secondsToken_Cypher5?)?
   | NOWAIT
   ;

secondsToken_Cypher5: SEC | SECOND | SECONDS;

showDatabase_Cypher5: (DEFAULT | HOME) DATABASE showCommandYield_Cypher5?
   | (DATABASE | DATABASES) symbolicAliasNameOrParameter_Cypher5? showCommandYield_Cypher5?
   ;

// Alias commands

aliasName_Cypher5: symbolicAliasNameOrParameter_Cypher5
   ;

databaseName_Cypher5: symbolicAliasNameOrParameter_Cypher5
   ;

createAlias_Cypher5: ALIAS aliasName_Cypher5 (IF NOT EXISTS)? FOR DATABASE databaseName_Cypher5 (AT stringOrParameter_Cypher5 USER commandNameExpression_Cypher5 PASSWORD passwordExpression_Cypher5 (DRIVER mapOrParameter_Cypher5)?)? (PROPERTIES mapOrParameter_Cypher5)?
   ;

dropAlias_Cypher5: ALIAS aliasName_Cypher5 (IF EXISTS)? FOR DATABASE
   ;

alterAlias_Cypher5: ALIAS aliasName_Cypher5 (IF EXISTS)? SET DATABASE (
      alterAliasTarget_Cypher5
      | alterAliasUser_Cypher5
      | alterAliasPassword_Cypher5
      | alterAliasDriver_Cypher5
      | alterAliasProperties_Cypher5
   )+
   ;

alterAliasTarget_Cypher5: TARGET databaseName_Cypher5 (AT stringOrParameter_Cypher5)?
   ;

alterAliasUser_Cypher5: USER commandNameExpression_Cypher5
   ;

alterAliasPassword_Cypher5: PASSWORD passwordExpression_Cypher5
   ;

alterAliasDriver_Cypher5: DRIVER mapOrParameter_Cypher5
   ;

alterAliasProperties_Cypher5: PROPERTIES mapOrParameter_Cypher5
   ;

showAliases_Cypher5: (ALIAS | ALIASES) aliasName_Cypher5? FOR (DATABASE | DATABASES) showCommandYield_Cypher5?
   ;

// Various strings, symbolic names, lists and maps

// Should return an Either[String, Parameter]
symbolicNameOrStringParameter_Cypher5: symbolicNameString_Cypher5
   | parameter_Cypher5["STRING"]
   ;

// Should return an Expression
commandNameExpression_Cypher5: symbolicNameString_Cypher5
   | parameter_Cypher5["STRING"]
   ;

symbolicNameOrStringParameterList_Cypher5: commandNameExpression_Cypher5 (COMMA commandNameExpression_Cypher5)*
   ;

symbolicAliasNameList_Cypher5: symbolicAliasNameOrParameter_Cypher5 (COMMA symbolicAliasNameOrParameter_Cypher5)*
   ;

symbolicAliasNameOrParameter_Cypher5: symbolicAliasName_Cypher5
   | parameter_Cypher5["STRING"]
   ;

symbolicAliasName_Cypher5: symbolicNameString_Cypher5 (DOT symbolicNameString_Cypher5)*
   ;

stringListLiteral_Cypher5: LBRACKET (stringLiteral_Cypher5 (COMMA stringLiteral_Cypher5)*)? RBRACKET
   ;

stringList_Cypher5: stringLiteral_Cypher5 (COMMA stringLiteral_Cypher5)+
   ;

stringLiteral_Cypher5: STRING_LITERAL1
   | STRING_LITERAL2
   ;

// Should return an Expression
stringOrParameterExpression_Cypher5: stringLiteral_Cypher5
   | parameter_Cypher5["STRING"]
   ;

// Should return an Either[String, Parameter]
stringOrParameter_Cypher5: stringLiteral_Cypher5
   | parameter_Cypher5["STRING"]
   ;

mapOrParameter_Cypher5: map_Cypher5
   | parameter_Cypher5["MAP"]
   ;

map_Cypher5: LCURLY (propertyKeyName_Cypher5 COLON expression_Cypher5 (COMMA propertyKeyName_Cypher5 COLON expression_Cypher5)*)? RCURLY
   ;

symbolicNameString_Cypher5: escapedSymbolicNameString_Cypher5
   | unescapedSymbolicNameString_Cypher5
   ;

escapedSymbolicNameString_Cypher5: ESCAPED_SYMBOLIC_NAME
   ;

unescapedSymbolicNameString_Cypher5: unescapedLabelSymbolicNameString_Cypher5
   | NOT
   | NULL
   | TYPED
   | NORMALIZED
   | NFC
   | NFD
   | NFKC
   | NFKD
   ;

symbolicLabelNameString_Cypher5: escapedSymbolicNameString_Cypher5
   | unescapedLabelSymbolicNameString_Cypher5
   ;

// Do not remove this, it is needed for composing the grammar
// with other ones (e.g. language support ones)
unescapedLabelSymbolicNameString_Cypher5: unescapedLabelSymbolicNameString__Cypher5
   ;

unescapedLabelSymbolicNameString__Cypher5: IDENTIFIER
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
   | ASSERT
   | ASSIGN
   | AT
   | AUTH
   | BINDINGS
   | BOOL
   | BOOLEAN
   | BOOSTED
   | BOTH
   | BREAK
   | BRIEF
   | BTREE
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
   | COMMIT
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
   | OUTPUT
   | PASSWORD
   | PASSWORDS
   | PATH
   | PATHS
   | PERIODIC
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
   | VERBOSE
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

endOfFile_Cypher5: EOF
   ;
