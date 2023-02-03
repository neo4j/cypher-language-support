/**
 * Copyright (c) 2015-2022 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
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
 * 
 * Attribution Notice under the terms of the Apache License 2.0
 * 
 * This work was created by the collective efforts of the openCypher community.
 * Without limiting the terms of Section 6, any Derivative Work that is not
 * approved by the public consensus process of the openCypher Implementers Group
 * should not be described as “Cypher” (and Cypher® is a registered trademark of
 * Neo4j Inc.) or as "openCypher". Extensions by implementers or prototypes or
 * proposals for change that have been documented or implemented should only be
 * described as "implementation extensions to Cypher" or as "proposed changes to
 * Cypher that are not yet approved by the openCypher community".
 */
grammar Cypher;

oC_Cypher
      : oC_Statement+ EOF;

oC_Statement
         :  oC_Query ';'?;

oC_Query
     :  oC_RegularQuery | oC_StandaloneCall;

oC_RegularQuery
            :  oC_SingleQuery oC_Union* ;

oC_Union
     :  ( UNION ALL oC_SingleQuery )
         | ( UNION oC_SingleQuery )
         ;

UNION : ( 'U' | 'u' ) ( 'N' | 'n' ) ( 'I' | 'i' ) ( 'O' | 'o' ) ( 'N' | 'n' ) ;

ALL : ( 'A' | 'a' ) ( 'L' | 'l' ) ( 'L' | 'l' ) ;

oC_SingleQuery
           :  oc_StartSingleQuery? oC_RestSingleQuery;

oc_StartSingleQuery
           : (oC_Match | oC_Unwind) oC_ReadingClause*;

oC_RestSingleQuery
    : oC_Return
    | ( oC_With oC_MultiPartQuery )
    | ( oC_UpdatingClause+ oC_EndSingleQuery ) ;

oC_EndSingleQuery:
    ( oC_With oC_MultiPartQuery ) | oC_Return?
    ;

oC_SinglePartQuery
                : oC_ReadingClause ( oC_Return | ( oC_UpdatingClause+ oC_Return? ) ) ;

oC_MultiPartQuery
              :  ( oC_ReadingClause oC_UpdatingClause* oC_With )* oC_SinglePartQuery ;

oC_UpdatingClause
              :  oC_Create
                  | oC_Merge
                  | oC_Delete
                  | oC_Set
                  | oC_Remove
                  ;

oC_ReadingClause
             :  oC_Match
                 | oC_Unwind
                 | oC_InQueryCall
                 ;
oC_Match
     :  (oC_OptionalMatch | oC_SimpleMatch) oC_Pattern oC_Where? ;

oC_OptionalMatch:
    OPTIONAL MATCH;

oC_SimpleMatch:
    MATCH;

OPTIONAL : ( 'O' | 'o' ) ( 'P' | 'p' ) ( 'T' | 't' ) ( 'I' | 'i' ) ( 'O' | 'o' ) ( 'N' | 'n' ) ( 'A' | 'a' ) ( 'L' | 'l' ) ;

MATCH : ( 'M' | 'm' ) ( 'A' | 'a' ) ( 'T' | 't' ) ( 'C' | 'c' ) ( 'H' | 'h' ) ;

oC_Unwind
      :  UNWIND oC_Expression AS oC_Variable ;

UNWIND : ( 'U' | 'u' ) ( 'N' | 'n' ) ( 'W' | 'w' ) ( 'I' | 'i' ) ( 'N' | 'n' ) ( 'D' | 'd' ) ;

AS : ( 'A' | 'a' ) ( 'S' | 's' ) ;

oC_Merge
     :  MERGE oC_PatternPart oC_MergeAction* ;

MERGE : ( 'M' | 'm' ) ( 'E' | 'e' ) ( 'R' | 'r' ) ( 'G' | 'g' ) ( 'E' | 'e' ) ;

oC_MergeAction
           :  ( ON MATCH oC_Set )
               | ( ON CREATE oC_Set )
               ;

ON : ( 'O' | 'o' ) ( 'N' | 'n' ) ;

CREATE : ( 'C' | 'c' ) ( 'R' | 'r' ) ( 'E' | 'e' ) ( 'A' | 'a' ) ( 'T' | 't' ) ( 'E' | 'e' ) ;

oC_Create
      :  CREATE oC_Pattern ;

oC_Set
   :  SET oC_SetItem ( ',' oC_SetItem )* ;

SET : ( 'S' | 's' ) ( 'E' | 'e' ) ( 'T' | 't' ) ;

oC_SetItem
       :  ( oC_PropertyExpression '=' oC_Expression )
           | ( oC_Variable '=' oC_Expression )
           | ( oC_Variable '+=' oC_Expression )
           | ( oC_Variable oC_NodeLabels )
           ;

oC_Delete
      :  DETACH? DELETE oC_Expression ( ',' oC_Expression )* ;

DETACH : ( 'D' | 'd' ) ( 'E' | 'e' ) ( 'T' | 't' ) ( 'A' | 'a' ) ( 'C' | 'c' ) ( 'H' | 'h' ) ;

DELETE : ( 'D' | 'd' ) ( 'E' | 'e' ) ( 'L' | 'l' ) ( 'E' | 'e' ) ( 'T' | 't' ) ( 'E' | 'e' ) ;

oC_Remove
      :  REMOVE oC_RemoveItem ( ',' oC_RemoveItem )* ;

REMOVE : ( 'R' | 'r' ) ( 'E' | 'e' ) ( 'M' | 'm' ) ( 'O' | 'o' ) ( 'V' | 'v' ) ( 'E' | 'e' ) ;

oC_RemoveItem
          :  ( oC_Variable oC_NodeLabels )
              | oC_PropertyExpression
              ;

oC_InQueryCall
           :  CALL oC_ProcedureName oC_ExplicitProcedureInvocation ( YIELD oC_YieldItems )? ;

CALL : ( 'C' | 'c' ) ( 'A' | 'a' ) ( 'L' | 'l' ) ( 'L' | 'l' ) ;

YIELD : ( 'Y' | 'y' ) ( 'I' | 'i' ) ( 'E' | 'e' ) ( 'L' | 'l' ) ( 'D' | 'd' ) ;

oC_StandaloneCall
              :  CALL 
              ( oC_ProcedureName oC_ExplicitProcedureInvocation? )? 
              ( YIELD ( '*' | oC_YieldItems ) )? ;

oC_YieldItems
          :  oC_YieldItem ( ',' oC_YieldItem )* oC_Where? ;

oC_YieldItem
         :  ( oC_ProcedureResultField AS )? oC_Variable ;

oC_With
    :  WITH oC_ProjectionBody oC_Where? ;

WITH : ( 'W' | 'w' ) ( 'I' | 'i' ) ( 'T' | 't' ) ( 'H' | 'h' ) ;

oC_Return
      :  RETURN oC_ProjectionBody ;

RETURN : ( 'R' | 'r' ) ( 'E' | 'e' ) ( 'T' | 't' ) ( 'U' | 'u' ) ( 'R' | 'r' ) ( 'N' | 'n' ) ;

oC_ProjectionBody
              :  DISTINCT? oC_ProjectionItems oC_Order? oC_Skip? oC_Limit? ;

DISTINCT : ( 'D' | 'd' ) ( 'I' | 'i' ) ( 'S' | 's' ) ( 'T' | 't' ) ( 'I' | 'i' ) ( 'N' | 'n' ) ( 'C' | 'c' ) ( 'T' | 't' ) ;

oC_ProjectionItems
               :  ( '*' ( ',' oC_ProjectionItem )* )
                   | ( oC_ProjectionItem ( ',' oC_ProjectionItem )* )
                   ;

oC_ProjectionItem
              :  ( oC_Expression AS oC_Variable )
                  | oC_Expression
                  ;

oC_Order
     :  ORDER BY oC_SortItem ( ',' oC_SortItem )* ;

ORDER : ( 'O' | 'o' ) ( 'R' | 'r' ) ( 'D' | 'd' ) ( 'E' | 'e' ) ( 'R' | 'r' ) ;

BY : ( 'B' | 'b' ) ( 'Y' | 'y' ) ;

oC_Skip
    :  L_SKIP oC_Expression ;

L_SKIP : ( 'S' | 's' ) ( 'K' | 'k' ) ( 'I' | 'i' ) ( 'P' | 'p' ) ;

oC_Limit
     :  LIMIT oC_Expression ;

LIMIT : ( 'L' | 'l' ) ( 'I' | 'i' ) ( 'M' | 'm' ) ( 'I' | 'i' ) ( 'T' | 't' ) ;

oC_SortItem
        :  oC_Expression ( ASCENDING | ASC | DESCENDING | DESC )? ;

ASCENDING : ( 'A' | 'a' ) ( 'S' | 's' ) ( 'C' | 'c' ) ( 'E' | 'e' ) ( 'N' | 'n' ) ( 'D' | 'd' ) ( 'I' | 'i' ) ( 'N' | 'n' ) ( 'G' | 'g' ) ;

ASC : ( 'A' | 'a' ) ( 'S' | 's' ) ( 'C' | 'c' ) ;

DESCENDING : ( 'D' | 'd' ) ( 'E' | 'e' ) ( 'S' | 's' ) ( 'C' | 'c' ) ( 'E' | 'e' ) ( 'N' | 'n' ) ( 'D' | 'd' ) ( 'I' | 'i' ) ( 'N' | 'n' ) ( 'G' | 'g' ) ;

DESC : ( 'D' | 'd' ) ( 'E' | 'e' ) ( 'S' | 's' ) ( 'C' | 'c' ) ;

oC_Where
     :  WHERE oC_Expression ;

WHERE : ( 'W' | 'w' ) ( 'H' | 'h' ) ( 'E' | 'e' ) ( 'R' | 'r' ) ( 'E' | 'e' ) ;

oC_Pattern
       :  oC_PatternPart ( ',' oC_PatternPart )* ;

oC_PatternPart
           :  ( oC_Variable '=' oC_AnonymousPatternPart )
               | oC_AnonymousPatternPart
               ;

oC_AnonymousPatternPart
                    :  oC_PatternElement ;

oC_PatternElement
              :  ( oC_NodePattern oC_PatternElementChain* )
                  | ( '(' oC_PatternElement ')' )
                  ;

oC_RelationshipsPattern
                    :  oC_NodePattern oC_PatternElementChain+ ;

oC_NodePattern
           :  '(' oC_Variable? oC_NodeLabels? oC_Properties? ')' ;

oC_PatternElementChain
                   :  oC_RelationshipPattern oC_NodePattern ;

oC_RelationshipPattern
                   :  ( oC_LeftArrowHead oC_Dash oC_RelationshipDetail? oC_Dash oC_RightArrowHead? )
                    | ( oC_Dash oC_RelationshipDetail? oC_Dash oC_RightArrowHead? )
                    ;

oC_RelationshipDetail
                  :  '[' oC_Variable? oC_RelationshipTypes? oC_RangeLiteral? oC_Properties? ']' ;

oC_Properties
          :  oC_MapLiteral
              | oC_Parameter
              ;

oC_RelationshipTypes
                 :  ':' oC_RelTypeName ( '|' ':'? oC_RelTypeName )* ;

oC_NodeLabels
          :  oC_NodeLabel oC_NodeLabel* ;

oC_NodeLabel
         :  ':' oC_LabelName ;

oC_RangeLiteral
            :  '*' oC_IntegerLiteral? ( '..' oC_IntegerLiteral? )? ;

oC_LabelName
         :  oC_SchemaName ;

oC_RelTypeName
           :  oC_SchemaName ;

oC_PropertyExpression
                  :  oC_Atom oC_PropertyLookup+ ;

oC_Expression
          :  oC_OrExpression ;

oC_OrExpression
            :  oC_XorExpression ( OR oC_XorExpression )* ;

OR : ( 'O' | 'o' ) ( 'R' | 'r' ) ;

oC_XorExpression
             :  oC_AndExpression ( XOR oC_AndExpression )* ;

XOR : ( 'X' | 'x' ) ( 'O' | 'o' ) ( 'R' | 'r' ) ;

oC_AndExpression
             :  oC_NotExpression ( AND oC_NotExpression )* ;

AND : ( 'A' | 'a' ) ( 'N' | 'n' ) ( 'D' | 'd' ) ;

oC_NotExpression
             :  NOT* oC_ComparisonExpression ;

NOT : ( 'N' | 'n' ) ( 'O' | 'o' ) ( 'T' | 't' ) ;

oC_ComparisonExpression
                    :  oC_StringListNullPredicateExpression oC_PartialComparisonExpression* ;

oC_PartialComparisonExpression
                           :  ( '=' oC_StringListNullPredicateExpression )
                               | ( '<>' oC_StringListNullPredicateExpression )
                               | ( '<' oC_StringListNullPredicateExpression )
                               | ( '>' oC_StringListNullPredicateExpression )
                               | ( '<=' oC_StringListNullPredicateExpression )
                               | ( '>=' oC_StringListNullPredicateExpression )
                               ;

oC_StringListNullPredicateExpression
                                 :  oC_AddOrSubtractExpression ( oC_StringPredicateExpression | oC_ListPredicateExpression | oC_NullPredicateExpression )* ;

oC_StringPredicateExpression
                         :  ( ( STARTS WITH ) | ( ENDS WITH ) | CONTAINS ) oC_AddOrSubtractExpression ;

STARTS : ( 'S' | 's' ) ( 'T' | 't' ) ( 'A' | 'a' ) ( 'R' | 'r' ) ( 'T' | 't' ) ( 'S' | 's' ) ;

ENDS : ( 'E' | 'e' ) ( 'N' | 'n' ) ( 'D' | 'd' ) ( 'S' | 's' ) ;

CONTAINS : ( 'C' | 'c' ) ( 'O' | 'o' ) ( 'N' | 'n' ) ( 'T' | 't' ) ( 'A' | 'a' ) ( 'I' | 'i' ) ( 'N' | 'n' ) ( 'S' | 's' ) ;

oC_ListPredicateExpression
                       :  IN oC_AddOrSubtractExpression ;

IN : ( 'I' | 'i' ) ( 'N' | 'n' ) ;

oC_NullPredicateExpression
                       :  ( IS NULL )
                           | ( IS NOT NULL )
                           ;

IS : ( 'I' | 'i' ) ( 'S' | 's' ) ;

NULL : ( 'N' | 'n' ) ( 'U' | 'u' ) ( 'L' | 'l' ) ( 'L' | 'l' ) ;

oC_AddOrSubtractExpression
                       :  oC_MultiplyDivideModuloExpression ( ( '+' oC_MultiplyDivideModuloExpression ) | ( '-' oC_MultiplyDivideModuloExpression ) )* ;

oC_MultiplyDivideModuloExpression
                              :  oC_PowerOfExpression ( ( '*' oC_PowerOfExpression ) | ( '/' oC_PowerOfExpression ) | ( '%' oC_PowerOfExpression ) )* ;

oC_PowerOfExpression
                 :  oC_UnaryAddOrSubtractExpression ( '^' oC_UnaryAddOrSubtractExpression )* ;

oC_UnaryAddOrSubtractExpression
                            :  oC_ListOperatorExpression
                                | ( ( '+' | '-' ) oC_ListOperatorExpression )
                                ;

oC_ListOperatorExpression
                      :  oC_PropertyOrLabelsExpression ( ( '[' oC_Expression ']' ) | ( '[' oC_Expression? '..' oC_Expression? ']' ) )* ;

oC_PropertyOrLabelsExpression
                          :  oC_Atom oC_PropertyLookup* oC_NodeLabels? ;

oC_PropertyLookup
              :  '.' oC_PropertyKeyName ;

oC_Atom
    :  oC_Literal
        | oC_Parameter
        | oC_CaseExpression
        | ( COUNT '(' '*' ')' )
        | oC_ListComprehension
        | oC_PatternComprehension
        | oC_Quantifier
        | oC_PatternPredicate
        | oC_ParenthesizedExpression
        | oC_FunctionInvocation
        | oC_ExistentialSubquery
        | oC_Variable
        ;

COUNT : ( 'C' | 'c' ) ( 'O' | 'o' ) ( 'U' | 'u' ) ( 'N' | 'n' ) ( 'T' | 't' ) ;

oC_CaseExpression
              :  ( ( CASE oC_CaseAlternative+ ) | ( CASE oC_Expression oC_CaseAlternative+ ) ) ( ELSE oC_Expression )? END ;

CASE : ( 'C' | 'c' ) ( 'A' | 'a' ) ( 'S' | 's' ) ( 'E' | 'e' ) ;

ELSE : ( 'E' | 'e' ) ( 'L' | 'l' ) ( 'S' | 's' ) ( 'E' | 'e' ) ;

END : ( 'E' | 'e' ) ( 'N' | 'n' ) ( 'D' | 'd' ) ;

oC_CaseAlternative
               :  WHEN oC_Expression THEN oC_Expression ;

WHEN : ( 'W' | 'w' ) ( 'H' | 'h' ) ( 'E' | 'e' ) ( 'N' | 'n' ) ;

THEN : ( 'T' | 't' ) ( 'H' | 'h' ) ( 'E' | 'e' ) ( 'N' | 'n' ) ;

oC_ListComprehension
                 :  '[' oC_FilterExpression ( '|' oC_Expression )? ']' ;

oC_PatternComprehension
                    :  '[' ( oC_Variable '=' )? oC_RelationshipsPattern oC_Where? '|' oC_Expression ']' ;

oC_Quantifier
          :  ( ALL '(' oC_FilterExpression ')' )
              | ( ANY '(' oC_FilterExpression ')' )
              | ( NONE '(' oC_FilterExpression ')' )
              | ( SINGLE '(' oC_FilterExpression ')' )
              ;

ANY : ( 'A' | 'a' ) ( 'N' | 'n' ) ( 'Y' | 'y' ) ;

NONE : ( 'N' | 'n' ) ( 'O' | 'o' ) ( 'N' | 'n' ) ( 'E' | 'e' ) ;

SINGLE : ( 'S' | 's' ) ( 'I' | 'i' ) ( 'N' | 'n' ) ( 'G' | 'g' ) ( 'L' | 'l' ) ( 'E' | 'e' ) ;

oC_FilterExpression
                :  oC_IdInColl oC_Where? ;

oC_PatternPredicate
                :  oC_RelationshipsPattern ;

oC_ParenthesizedExpression
                       :  '(' oC_Expression ')' ;

oC_IdInColl
        :  oC_Variable IN oC_Expression ;

oC_FunctionInvocation
                  :  oC_FunctionName '(' DISTINCT? ( oC_Expression ( ',' oC_Expression )* )? ')' ;

oC_FunctionName
            :  oC_Namespace oC_SymbolicName ;

oC_ExistentialSubquery
                   :  EXISTS '{' ( oC_RegularQuery | ( oC_Pattern oC_Where? ) ) '}' ;

EXISTS : ( 'E' | 'e' ) ( 'X' | 'x' ) ( 'I' | 'i' ) ( 'S' | 's' ) ( 'T' | 't' ) ( 'S' | 's' ) ;

oC_ExplicitProcedureInvocation
                           : '(' ( oc_ProcedureNameArg ( ',' oc_ProcedureNameArg )* )? ')' ;

oc_ProcedureNameArg
                :  oC_Expression ;

oC_ProcedureResultField
                    :  oC_SymbolicName ;

oC_ProcedureName
             :  oC_Namespace oC_SymbolicName ;

oC_Namespace
         :  ( oC_SymbolicName '.' )* |
         ( oC_SymbolicName '.' )* ;

oC_Variable
        :  oC_SymbolicName ;

oC_Literal
       :  oC_BooleanLiteral
           | NULL
           | oC_NumberLiteral
           | StringLiteral
           | oC_ListLiteral
           | oC_MapLiteral
           ;

oC_BooleanLiteral
              :  TRUE
                  | FALSE
                  ;

TRUE : ( 'T' | 't' ) ( 'R' | 'r' ) ( 'U' | 'u' ) ( 'E' | 'e' ) ;

FALSE : ( 'F' | 'f' ) ( 'A' | 'a' ) ( 'L' | 'l' ) ( 'S' | 's' ) ( 'E' | 'e' ) ;

oC_NumberLiteral
             :  oC_DoubleLiteral
                 | oC_IntegerLiteral
                 ;

oC_IntegerLiteral
              :  HexInteger
                  | OctalInteger
                  | DecimalInteger
                  ;

HexInteger
          :  '0x' HexDigit+ ;

DecimalInteger
              :  ZeroDigit
                  | ( NonZeroDigit Digit* )
                  ;

OctalInteger
            :  '0o' OctDigit+ ;

HexLetter
         :  ( ( 'A' | 'a' ) )
             | ( ( 'B' | 'b' ) )
             | ( ( 'C' | 'c' ) )
             | ( ( 'D' | 'd' ) )
             | ( ( 'E' | 'e' ) )
             | ( ( 'F' | 'f' ) )
             ;

HexDigit
        :  Digit
            | HexLetter
            ;

Digit
     :  ZeroDigit
         | NonZeroDigit
         ;

NonZeroDigit
            :  NonZeroOctDigit
                | '8'
                | '9'
                ;

NonZeroOctDigit
               :  '1'
                   | '2'
                   | '3'
                   | '4'
                   | '5'
                   | '6'
                   | '7'
                   ;

OctDigit
        :  ZeroDigit
            | NonZeroOctDigit
            ;

ZeroDigit
         :  '0' ;

oC_DoubleLiteral
             :  ExponentDecimalReal
                 | RegularDecimalReal
                 ;

ExponentDecimalReal
                   :  ( Digit+ | ( Digit+ '.' Digit+ ) | ( '.' Digit+ ) ) ( ( 'E' | 'e' ) ) '-'? Digit+ ;

RegularDecimalReal
                  :  Digit* '.' Digit+ ;

StringLiteral
             :  ( '"' ( StringLiteral_0 | EscapedChar )* '"' )
                 | ( '\'' ( StringLiteral_1 | EscapedChar )* '\'' )
                 ;

EscapedChar
           :  '\\' ( '\\' | '\'' | '"' | ( ( 'B' | 'b' ) ) | ( ( 'F' | 'f' ) ) | ( ( 'N' | 'n' ) ) | ( ( 'R' | 'r' ) ) | ( ( 'T' | 't' ) ) | ( ( ( 'U' | 'u' ) ) ( HexDigit HexDigit HexDigit HexDigit ) ) | ( ( ( 'U' | 'u' ) ) ( HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit ) ) ) ;

oC_ListLiteral
           :  '[' ( oC_Expression ( ',' oC_Expression )* )? ']' ;

oC_MapLiteral
          :  '{' ( oC_PropertyKeyName ':' oC_Expression ( ',' oC_PropertyKeyName ':' oC_Expression )* )? '}' ;

oC_PropertyKeyName
               :  oC_SchemaName ;

oC_Parameter
         :  '$' ( oC_SymbolicName | DecimalInteger ) ;

oC_SchemaName
          :  oC_SymbolicName
              | oC_ReservedWord
              ;

oC_ReservedWord
            :  ALL
                | ASC
                | ASCENDING
                | BY
                | CREATE
                | DELETE
                | DESC
                | DESCENDING
                | DETACH
                | EXISTS
                | LIMIT
                | MATCH
                | MERGE
                | ON
                | OPTIONAL
                | ORDER
                | REMOVE
                | RETURN
                | SET
                | L_SKIP
                | WHERE
                | WITH
                | UNION
                | UNWIND
                | AND
                | AS
                | CONTAINS
                | DISTINCT
                | ENDS
                | IN
                | IS
                | NOT
                | OR
                | STARTS
                | XOR
                | FALSE
                | TRUE
                | NULL
                | CONSTRAINT
                | FOR
                | REQUIRE
                | UNIQUE
                | CASE
                | WHEN
                | THEN
                | ELSE
                | END
                | MANDATORY
                | SCALAR
                | OF
                | ADD
                | DROP
                ;

CONSTRAINT : ( 'C' | 'c' ) ( 'O' | 'o' ) ( 'N' | 'n' ) ( 'S' | 's' ) ( 'T' | 't' ) ( 'R' | 'r' ) ( 'A' | 'a' ) ( 'I' | 'i' ) ( 'N' | 'n' ) ( 'T' | 't' ) ;

FOR : ( 'F' | 'f' ) ( 'O' | 'o' ) ( 'R' | 'r' ) ;

REQUIRE : ( 'R' | 'r' ) ( 'E' | 'e' ) ( 'Q' | 'q' ) ( 'U' | 'u' ) ( 'I' | 'i' ) ( 'R' | 'r' ) ( 'E' | 'e' ) ;

UNIQUE : ( 'U' | 'u' ) ( 'N' | 'n' ) ( 'I' | 'i' ) ( 'Q' | 'q' ) ( 'U' | 'u' ) ( 'E' | 'e' ) ;

MANDATORY : ( 'M' | 'm' ) ( 'A' | 'a' ) ( 'N' | 'n' ) ( 'D' | 'd' ) ( 'A' | 'a' ) ( 'T' | 't' ) ( 'O' | 'o' ) ( 'R' | 'r' ) ( 'Y' | 'y' ) ;

SCALAR : ( 'S' | 's' ) ( 'C' | 'c' ) ( 'A' | 'a' ) ( 'L' | 'l' ) ( 'A' | 'a' ) ( 'R' | 'r' ) ;

OF : ( 'O' | 'o' ) ( 'F' | 'f' ) ;

ADD : ( 'A' | 'a' ) ( 'D' | 'd' ) ( 'D' | 'd' ) ;

DROP : ( 'D' | 'd' ) ( 'R' | 'r' ) ( 'O' | 'o' ) ( 'P' | 'p' ) ;

oC_SymbolicName
            :  UnescapedSymbolicName
                | EscapedSymbolicName
                | HexLetter
                | COUNT
                | FILTER
                | EXTRACT
                | ANY
                | NONE
                | SINGLE
                | WHEN
                ;

FILTER : ( 'F' | 'f' ) ( 'I' | 'i' ) ( 'L' | 'l' ) ( 'T' | 't' ) ( 'E' | 'e' ) ( 'R' | 'r' ) ;

EXTRACT : ( 'E' | 'e' ) ( 'X' | 'x' ) ( 'T' | 't' ) ( 'R' | 'r' ) ( 'A' | 'a' ) ( 'C' | 'c' ) ( 'T' | 't' ) ;

UnescapedSymbolicName
                     :  IdentifierStart IdentifierPart* ;

/**
 * Based on the unicode identifier and pattern syntax
 *   (http://www.unicode.org/reports/tr31/)
 * And extended with a few characters.
 */
IdentifierStart
               :  ID_Start
                   | Pc
                   ;

/**
 * Based on the unicode identifier and pattern syntax
 *   (http://www.unicode.org/reports/tr31/)
 * And extended with a few characters.
 */
IdentifierPart
              :  ID_Continue
                  | Sc
                  ;

/**
 * Any character except "`", enclosed within `backticks`. Backticks are escaped with double backticks.
 */
EscapedSymbolicName
                   :  ( '`' EscapedSymbolicName_0* '`' )+ ;

Comment
       :  ( '/*' ( Comment_1 | ( '*' Comment_2 ) )* '*/' )
           | ( '//' Comment_3* CR? ( LF | EOF ) )
           ;

oC_LeftArrowHead
             :  '<'
                 | '\u27e8'
                 | '\u3008'
                 | '\ufe64'
                 | '\uff1c'
                 ;

oC_RightArrowHead
              :  '>'
                  | '\u27e9'
                  | '\u3009'
                  | '\ufe65'
                  | '\uff1e'
                  ;

oC_Dash
    :  '-'
        | '\u00ad'
        | '\u2010'
        | '\u2011'
        | '\u2012'
        | '\u2013'
        | '\u2014'
        | '\u2015'
        | '\u2212'
        | '\ufe58'
        | '\ufe63'
        | '\uff0d'
        ;

fragment FF : [\f] ;

fragment EscapedSymbolicName_0 : ~[`] ;

fragment RS : [\u001E] ;

fragment ID_Continue : [\p{ID_Continue}] ;

fragment Comment_1 : ~[*] ;

fragment StringLiteral_1 : ~['\\] ;

fragment Comment_3 : ~[\n\r] ;

fragment Comment_2 : ~[/] ;

fragment GS : [\u001D] ;

fragment FS : [\u001C] ;

fragment CR : [\r] ;

fragment Sc : [\p{Sc}] ;

fragment SPACE : [ ] ;

fragment Pc : [\p{Pc}] ;

fragment TAB : [\t] ;

fragment StringLiteral_0 : ~["\\] ;

fragment LF : [\n] ;

fragment VT : [\u000B] ;

fragment US : [\u001F] ;

fragment ID_Start : [\p{ID_Start}] ;

WHITESPACE
          :  (SPACE
              | TAB
              | LF
              | VT
              | FF
              | CR
              | FS
              | GS
              | RS
              | US
              | '\u1680'
              | '\u180e'
              | '\u2000'
              | '\u2001'
              | '\u2002'
              | '\u2003'
              | '\u2004'
              | '\u2005'
              | '\u2006'
              | '\u2008'
              | '\u2009'
              | '\u200a'
              | '\u2028'
              | '\u2029'
              | '\u205f'
              | '\u3000'
              | '\u00a0'
              | '\u2007'
              | '\u202f'
              | Comment )
               -> channel(HIDDEN);