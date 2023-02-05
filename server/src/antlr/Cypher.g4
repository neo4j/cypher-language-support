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

cypher
   : statement+ EOF
   ;

statement
   : query ';'?
   ;

query
   : regularQuery
   | standaloneCall
   ;

regularQuery
   : singleQuery union*
   ;

union
   : (UNION ALL singleQuery)
   | (UNION singleQuery)
   ;

UNION
   : ('U' | 'u') ('N' | 'n') ('I' | 'i') ('O' | 'o') ('N' | 'n')
   ;

ALL
   : ('A' | 'a') ('L' | 'l') ('L' | 'l')
   ;

singleQuery
   : startSingleQuery? restSingleQuery
   ;

startSingleQuery
   : (matchStatement | unwind) readingClause*
   ;

restSingleQuery
   : returnStatement
   | (with multiPartQuery)
   | (updatingClause+ endSingleQuery)
   ;

endSingleQuery
   : (with multiPartQuery)
   | returnStatement?
   ;

singlePartQuery
   : readingClause (returnStatement | (updatingClause+ returnStatement?))
   ;

multiPartQuery
   : (readingClause updatingClause* with)* singlePartQuery
   ;

updatingClause
   : create
   | merge
   | delete
   | set
   | remove
   ;

readingClause
   : matchStatement
   | unwind
   | inQueryCall
   ;

matchStatement
   : (optionalMatch | simpleMatch) pattern where?
   ;

optionalMatch
   : OPTIONAL MATCH
   ;

simpleMatch
   : MATCH
   ;

OPTIONAL
   : ('O' | 'o') ('P' | 'p') ('T' | 't') ('I' | 'i') ('O' | 'o') ('N' | 'n') ('A' | 'a') ('L' | 'l')
   ;

MATCH
   : ('M' | 'm') ('A' | 'a') ('T' | 't') ('C' | 'c') ('H' | 'h')
   ;

unwind
   : UNWIND expression AS variable
   ;

UNWIND
   : ('U' | 'u') ('N' | 'n') ('W' | 'w') ('I' | 'i') ('N' | 'n') ('D' | 'd')
   ;

AS
   : ('A' | 'a') ('S' | 's')
   ;

merge
   : MERGE patternPart mergeAction*
   ;

MERGE
   : ('M' | 'm') ('E' | 'e') ('R' | 'r') ('G' | 'g') ('E' | 'e')
   ;

mergeAction
   : (ON MATCH set)
   | (ON CREATE set)
   ;

ON
   : ('O' | 'o') ('N' | 'n')
   ;

CREATE
   : ('C' | 'c') ('R' | 'r') ('E' | 'e') ('A' | 'a') ('T' | 't') ('E' | 'e')
   ;

create
   : CREATE pattern
   ;

set
   : SET setItem (',' setItem)*
   ;

SET
   : ('S' | 's') ('E' | 'e') ('T' | 't')
   ;

setItem
   : (propertyExpression '=' expression)
   | (variable '=' expression)
   | (variable '+=' expression)
   | (variable nodeLabels)
   ;

delete
   : DETACH? DELETE expression (',' expression)*
   ;

DETACH
   : ('D' | 'd') ('E' | 'e') ('T' | 't') ('A' | 'a') ('C' | 'c') ('H' | 'h')
   ;

DELETE
   : ('D' | 'd') ('E' | 'e') ('L' | 'l') ('E' | 'e') ('T' | 't') ('E' | 'e')
   ;

remove
   : REMOVE removeItem (',' removeItem)*
   ;

REMOVE
   : ('R' | 'r') ('E' | 'e') ('M' | 'm') ('O' | 'o') ('V' | 'v') ('E' | 'e')
   ;

removeItem
   : (variable nodeLabels)
   | propertyExpression
   ;

inQueryCall
   : CALL procedureName explicitProcedureInvocation (YIELD yieldItems)?
   ;

CALL
   : ('C' | 'c') ('A' | 'a') ('L' | 'l') ('L' | 'l')
   ;

YIELD
   : ('Y' | 'y') ('I' | 'i') ('E' | 'e') ('L' | 'l') ('D' | 'd')
   ;

standaloneCall
   : CALL (procedureName explicitProcedureInvocation?)? (YIELD ('*' | yieldItems))?
   ;

yieldItems
   : yieldItem (',' yieldItem)* where?
   ;

yieldItem
   : (procedureResultField AS)? variable
   ;

with
   : WITH projectionBody where?
   ;

WITH
   : ('W' | 'w') ('I' | 'i') ('T' | 't') ('H' | 'h')
   ;

returnStatement
   : RETURN projectionBody
   ;

RETURN
   : ('R' | 'r') ('E' | 'e') ('T' | 't') ('U' | 'u') ('R' | 'r') ('N' | 'n')
   ;

projectionBody
   : DISTINCT? projectionItems order? skip? limit?
   ;

DISTINCT
   : ('D' | 'd') ('I' | 'i') ('S' | 's') ('T' | 't') ('I' | 'i') ('N' | 'n') ('C' | 'c') ('T' | 't')
   ;

projectionItems
   : ('*' (',' projectionItem)*)
   | (projectionItem (',' projectionItem)*)
   ;

projectionItem
   : expression (AS variable)?
   ;

order
   : ORDER BY sortItem (',' sortItem)*
   ;

ORDER
   : ('O' | 'o') ('R' | 'r') ('D' | 'd') ('E' | 'e') ('R' | 'r')
   ;

BY
   : ('B' | 'b') ('Y' | 'y')
   ;

skip
   : L_SKIP expression
   ;

L_SKIP
   : ('S' | 's') ('K' | 'k') ('I' | 'i') ('P' | 'p')
   ;

limit
   : LIMIT expression
   ;

LIMIT
   : ('L' | 'l') ('I' | 'i') ('M' | 'm') ('I' | 'i') ('T' | 't')
   ;

sortItem
   : expression (ASCENDING | ASC | DESCENDING | DESC)?
   ;

ASCENDING
   : ('A' | 'a') ('S' | 's') ('C' | 'c') ('E' | 'e') ('N' | 'n') ('D' | 'd') ('I' | 'i') ('N' | 'n') ('G' | 'g')
   ;

ASC
   : ('A' | 'a') ('S' | 's') ('C' | 'c')
   ;

DESCENDING
   : ('D' | 'd') ('E' | 'e') ('S' | 's') ('C' | 'c') ('E' | 'e') ('N' | 'n') ('D' | 'd') ('I' | 'i') ('N' | 'n') ('G' | 'g')
   ;

DESC
   : ('D' | 'd') ('E' | 'e') ('S' | 's') ('C' | 'c')
   ;

where
   : WHERE expression
   ;

WHERE
   : ('W' | 'w') ('H' | 'h') ('E' | 'e') ('R' | 'r') ('E' | 'e')
   ;

pattern
   : patternPart (',' patternPart)*
   ;

patternPart
   : (variable '=' anonymousPatternPart)
   | anonymousPatternPart
   ;

anonymousPatternPart
   : patternElement
   ;

patternElement
   : (nodePattern patternElementChain*)
   | ('(' patternElement ')')
   ;

relationshipsPattern
   : nodePattern patternElementChain+
   ;

nodePattern
   : '(' variable? nodeLabels? properties? ')'
   ;

patternElementChain
   : relationshipPattern nodePattern
   ;

relationshipPattern
   : (leftArrowHead dash relationshipDetail? dash rightArrowHead?)
   | (dash relationshipDetail? dash rightArrowHead?)
   ;

relationshipDetail
   : '[' variable? relationshipTypes? rangeLiteral? properties? ']'
   ;

properties
   : mapLiteral
   | parameter
   ;

relationshipTypes
   : ':' relTypeName ('|' ':'? relTypeName)*
   ;

nodeLabels
   : nodeLabel nodeLabel*
   ;

nodeLabel
   : ':' labelName
   ;

rangeLiteral
   : '*' integerLiteral? ('..' integerLiteral?)?
   ;

labelName
   : schemaName
   ;

relTypeName
   : schemaName
   ;

propertyExpression
   : atom propertyLookup+
   ;

expression
   : orExpression
   ;

orExpression
   : xorExpression (OR xorExpression)*
   ;

OR
   : ('O' | 'o') ('R' | 'r')
   ;

xorExpression
   : andExpression (XOR andExpression)*
   ;

XOR
   : ('X' | 'x') ('O' | 'o') ('R' | 'r')
   ;

andExpression
   : notExpression (AND notExpression)*
   ;

AND
   : ('A' | 'a') ('N' | 'n') ('D' | 'd')
   ;

notExpression
   : NOT* comparisonExpression
   ;

NOT
   : ('N' | 'n') ('O' | 'o') ('T' | 't')
   ;

comparisonExpression
   : stringListNullPredicateExpression partialComparisonExpression*
   ;

partialComparisonExpression
   : ('=' stringListNullPredicateExpression)
   | ('<>' stringListNullPredicateExpression)
   | ('<' stringListNullPredicateExpression)
   | ('>' stringListNullPredicateExpression)
   | ('<=' stringListNullPredicateExpression)
   | ('>=' stringListNullPredicateExpression)
   ;

stringListNullPredicateExpression
   : addOrSubtractExpression (stringPredicateExpression | listPredicateExpression | nullPredicateExpression)*
   ;

stringPredicateExpression
   : ((STARTS WITH) | (ENDS WITH) | CONTAINS) addOrSubtractExpression
   ;

STARTS
   : ('S' | 's') ('T' | 't') ('A' | 'a') ('R' | 'r') ('T' | 't') ('S' | 's')
   ;

ENDS
   : ('E' | 'e') ('N' | 'n') ('D' | 'd') ('S' | 's')
   ;

CONTAINS
   : ('C' | 'c') ('O' | 'o') ('N' | 'n') ('T' | 't') ('A' | 'a') ('I' | 'i') ('N' | 'n') ('S' | 's')
   ;

listPredicateExpression
   : IN addOrSubtractExpression
   ;

IN
   : ('I' | 'i') ('N' | 'n')
   ;

nullPredicateExpression
   : (IS NULL)
   | (IS NOT NULL)
   ;

IS
   : ('I' | 'i') ('S' | 's')
   ;

NULL
   : ('N' | 'n') ('U' | 'u') ('L' | 'l') ('L' | 'l')
   ;

addOrSubtractExpression
   : multiplyDivideModuloExpression (('+' multiplyDivideModuloExpression) | ('-' multiplyDivideModuloExpression))*
   ;

multiplyDivideModuloExpression
   : powerOfExpression (('*' powerOfExpression) | ('/' powerOfExpression) | ('%' powerOfExpression))*
   ;

powerOfExpression
   : unaryAddOrSubtractExpression ('^' unaryAddOrSubtractExpression)*
   ;

unaryAddOrSubtractExpression
   : listOperatorExpression
   | (('+' | '-') listOperatorExpression)
   ;

listOperatorExpression
   : propertyOrLabelsExpression (('[' expression ']') | ('[' expression? '..' expression? ']'))*
   ;

propertyOrLabelsExpression
   : atom propertyLookup* nodeLabels?
   ;

propertyLookup
   : '.' propertyKeyName
   ;

atom
   : literal
   | parameter
   | caseExpression
   | (COUNT '(' '*' ')')
   | listComprehension
   | patternComprehension
   | quantifier
   | patternPredicate
   | parenthesizedExpression
   | functionInvocation
   | existentialSubquery
   | variable
   ;

COUNT
   : ('C' | 'c') ('O' | 'o') ('U' | 'u') ('N' | 'n') ('T' | 't')
   ;

caseExpression
   : ((CASE caseAlternative+) | (CASE expression caseAlternative+)) (ELSE expression)? END
   ;

CASE
   : ('C' | 'c') ('A' | 'a') ('S' | 's') ('E' | 'e')
   ;

ELSE
   : ('E' | 'e') ('L' | 'l') ('S' | 's') ('E' | 'e')
   ;

END
   : ('E' | 'e') ('N' | 'n') ('D' | 'd')
   ;

caseAlternative
   : WHEN expression THEN expression
   ;

WHEN
   : ('W' | 'w') ('H' | 'h') ('E' | 'e') ('N' | 'n')
   ;

THEN
   : ('T' | 't') ('H' | 'h') ('E' | 'e') ('N' | 'n')
   ;

listComprehension
   : '[' filterExpression ('|' expression)? ']'
   ;

patternComprehension
   : '[' (variable '=')? relationshipsPattern where? '|' expression ']'
   ;

quantifier
   : (ALL '(' filterExpression ')')
   | (ANY '(' filterExpression ')')
   | (NONE '(' filterExpression ')')
   | (SINGLE '(' filterExpression ')')
   ;

ANY
   : ('A' | 'a') ('N' | 'n') ('Y' | 'y')
   ;

NONE
   : ('N' | 'n') ('O' | 'o') ('N' | 'n') ('E' | 'e')
   ;

SINGLE
   : ('S' | 's') ('I' | 'i') ('N' | 'n') ('G' | 'g') ('L' | 'l') ('E' | 'e')
   ;

filterExpression
   : idInColl where?
   ;

patternPredicate
   : relationshipsPattern
   ;

parenthesizedExpression
   : '(' expression ')'
   ;

idInColl
   : variable IN expression
   ;

functionInvocation
   : functionName '(' DISTINCT? (procedureNameArg (',' procedureNameArg)*)? ')'
   ;

functionName
   : namespace symbolicName
   ;

functionNameArg
   : expression
   ;

existentialSubquery
   : EXISTS '{' (regularQuery | (pattern where?)) '}'
   ;

EXISTS
   : ('E' | 'e') ('X' | 'x') ('I' | 'i') ('S' | 's') ('T' | 't') ('S' | 's')
   ;

explicitProcedureInvocation
   : '(' (procedureNameArg (',' procedureNameArg)*)? ')'
   ;

procedureNameArg
   : expression
   ;

procedureResultField
   : symbolicName
   ;

procedureName
   : namespace symbolicName
   ;

namespace
   : (symbolicName '.')*
   | (symbolicName '.')*
   ;

variable
   : symbolicName
   ;

literal
   : booleanLiteral
   | NULL
   | numberLiteral
   | StringLiteral
   | listLiteral
   | mapLiteral
   ;

booleanLiteral
   : TRUE
   | FALSE
   ;

TRUE
   : ('T' | 't') ('R' | 'r') ('U' | 'u') ('E' | 'e')
   ;

FALSE
   : ('F' | 'f') ('A' | 'a') ('L' | 'l') ('S' | 's') ('E' | 'e')
   ;

numberLiteral
   : doubleLiteral
   | integerLiteral
   ;

integerLiteral
   : HexInteger
   | OctalInteger
   | DecimalInteger
   ;

HexInteger
   : '0x' HexDigit+
   ;

DecimalInteger
   : ZeroDigit
   | (NonZeroDigit Digit*)
   ;

OctalInteger
   : '0o' OctDigit+
   ;

HexLetter
   : (('A' | 'a'))
   | (('B' | 'b'))
   | (('C' | 'c'))
   | (('D' | 'd'))
   | (('E' | 'e'))
   | (('F' | 'f'))
   ;

HexDigit
   : Digit
   | HexLetter
   ;

Digit
   : ZeroDigit
   | NonZeroDigit
   ;

NonZeroDigit
   : NonZeroOctDigit
   | '8'
   | '9'
   ;

NonZeroOctDigit
   : '1'
   | '2'
   | '3'
   | '4'
   | '5'
   | '6'
   | '7'
   ;

OctDigit
   : ZeroDigit
   | NonZeroOctDigit
   ;

ZeroDigit
   : '0'
   ;

doubleLiteral
   : ExponentDecimalReal
   | RegularDecimalReal
   ;

ExponentDecimalReal
   : (Digit+ | (Digit+ '.' Digit+) | ('.' Digit+)) (('E' | 'e')) '-'? Digit+
   ;

RegularDecimalReal
   : Digit* '.' Digit+
   ;

StringLiteral
   : ('"' (StringLiteral_0 | EscapedChar)* '"')
   | ('\'' (StringLiteral_1 | EscapedChar)* '\'')
   ;

EscapedChar
   : '\\' ('\\' | '\'' | '"' | (('B' | 'b')) | (('F' | 'f')) | (('N' | 'n')) | (('R' | 'r')) | (('T' | 't')) | ((('U' | 'u')) (HexDigit HexDigit HexDigit HexDigit)) | ((('U' | 'u')) (HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit)))
   ;

listLiteral
   : '[' (expression (',' expression)*)? ']'
   ;

mapLiteral
   : '{' (propertyKeyName ':' expression (',' propertyKeyName ':' expression)*)? '}'
   ;

propertyKeyName
   : schemaName
   ;

parameter
   : '$' (symbolicName | DecimalInteger)
   ;

schemaName
   : symbolicName
   | reservedWord
   ;

reservedWord
   : ALL
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

CONSTRAINT
   : ('C' | 'c') ('O' | 'o') ('N' | 'n') ('S' | 's') ('T' | 't') ('R' | 'r') ('A' | 'a') ('I' | 'i') ('N' | 'n') ('T' | 't')
   ;

FOR
   : ('F' | 'f') ('O' | 'o') ('R' | 'r')
   ;

REQUIRE
   : ('R' | 'r') ('E' | 'e') ('Q' | 'q') ('U' | 'u') ('I' | 'i') ('R' | 'r') ('E' | 'e')
   ;

UNIQUE
   : ('U' | 'u') ('N' | 'n') ('I' | 'i') ('Q' | 'q') ('U' | 'u') ('E' | 'e')
   ;

MANDATORY
   : ('M' | 'm') ('A' | 'a') ('N' | 'n') ('D' | 'd') ('A' | 'a') ('T' | 't') ('O' | 'o') ('R' | 'r') ('Y' | 'y')
   ;

SCALAR
   : ('S' | 's') ('C' | 'c') ('A' | 'a') ('L' | 'l') ('A' | 'a') ('R' | 'r')
   ;

OF
   : ('O' | 'o') ('F' | 'f')
   ;

ADD
   : ('A' | 'a') ('D' | 'd') ('D' | 'd')
   ;

DROP
   : ('D' | 'd') ('R' | 'r') ('O' | 'o') ('P' | 'p')
   ;

symbolicName
   : UnescapedSymbolicName
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

FILTER
   : ('F' | 'f') ('I' | 'i') ('L' | 'l') ('T' | 't') ('E' | 'e') ('R' | 'r')
   ;

EXTRACT
   : ('E' | 'e') ('X' | 'x') ('T' | 't') ('R' | 'r') ('A' | 'a') ('C' | 'c') ('T' | 't')
   ;

UnescapedSymbolicName
   : IdentifierStart IdentifierPart*
   ;

/**
 * Based on the unicode identifier and pattern syntax
 *   (http://www.unicode.org/reports/tr31/)
 * And extended with a few characters.
 */ IdentifierStart
   : ID_Start
   | Pc
   ;

/**
 * Based on the unicode identifier and pattern syntax
 *   (http://www.unicode.org/reports/tr31/)
 * And extended with a few characters.
 */ IdentifierPart
   : ID_Continue
   | Sc
   ;

/**
 * Any character except "`", enclosed within `backticks`. Backticks are escaped with double backticks.
 */ EscapedSymbolicName
   : ('`' EscapedSymbolicName_0* '`')+
   ;

Comment
   : ('/*' (Comment_1 | ('*' Comment_2))* '*/')
   | ('//' Comment_3* CR? (LF | EOF))
   ;

leftArrowHead
   : '<'
   | '\u27e8'
   | '\u3008'
   | '\ufe64'
   | '\uff1c'
   ;

rightArrowHead
   : '>'
   | '\u27e9'
   | '\u3009'
   | '\ufe65'
   | '\uff1e'
   ;

dash
   : '-'
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

fragment FF
   : [\f]
   ;

fragment EscapedSymbolicName_0
   : ~ [`]
   ;

fragment RS
   : [\u001E]
   ;

fragment ID_Continue
   : [\p{ID_Continue}]
   ;

fragment Comment_1
   : ~ [*]
   ;

fragment StringLiteral_1
   : ~ ['\\]
   ;

fragment Comment_3
   : ~ [\n\r]
   ;

fragment Comment_2
   : ~ [/]
   ;

fragment GS
   : [\u001D]
   ;

fragment FS
   : [\u001C]
   ;

fragment CR
   : [\r]
   ;

fragment Sc
   : [\p{Sc}]
   ;

fragment SPACE
   : [ ]
   ;

fragment Pc
   : [\p{Pc}]
   ;

fragment TAB
   : [\t]
   ;

fragment StringLiteral_0
   : ~ ["\\]
   ;

fragment LF
   : [\n]
   ;

fragment VT
   : [\u000B]
   ;

fragment US
   : [\u001F]
   ;

fragment ID_Start
   : [\p{ID_Start}]
   ;

WHITESPACE
   : (SPACE | TAB | LF | VT | FF | CR | FS | GS | RS | US | '\u1680' | '\u180e' | '\u2000' | '\u2001' | '\u2002' | '\u2003' | '\u2004' | '\u2005' | '\u2006' | '\u2008' | '\u2009' | '\u200a' | '\u2028' | '\u2029' | '\u205f' | '\u3000' | '\u00a0' | '\u2007' | '\u202f' | Comment) -> channel (HIDDEN)
   ;

