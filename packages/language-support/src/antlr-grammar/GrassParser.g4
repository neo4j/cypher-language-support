parser grammar GrassParser;

import CypherPreParser;

options { tokenVocab = GrassLexer; }

styleSheet: styleRule* EOF;

styleRule: MATCH pattern (WHERE whereClause)? APPLY styleMap;

pattern: nodePattern
       | relationshipPattern
       | pathPattern
       | multiLabelPattern;

nodePattern: LPAREN variable? (COLON grassLabelName)? RPAREN;

relationshipPattern: LBRACKET variable? (COLON grassRelTypeName)? RBRACKET;

pathPattern: 
    LPAREN RPAREN MINUS LBRACKET variable? (COLON grassRelTypeName)? RBRACKET ARROW_RIGHT_HEAD LPAREN RPAREN  # rightArrowPath
  | LPAREN RPAREN ARROW_LEFT_HEAD LBRACKET variable? (COLON grassRelTypeName)? RBRACKET MINUS LPAREN RPAREN   # leftArrowPath
  | LPAREN RPAREN MINUS LBRACKET variable? (COLON grassRelTypeName)? RBRACKET MINUS LPAREN RPAREN             # undirectedPath
  ;

multiLabelPattern: LPAREN variable? (COLON grassLabelName) (COLON grassLabelName)+ RPAREN;

variable: symbolicNameString;

grassLabelName: symbolicNameString;

grassRelTypeName: symbolicNameString;

whereClause: booleanExpression;

booleanExpression: orExpression;

orExpression: andExpression (OR andExpression)*;

andExpression: notExpression (AND notExpression)*;

notExpression: NOT notExpression
             | comparisonExpression;

comparisonExpression: 
    valueExpression EQ valueExpression       # equalComparison
  | valueExpression NEQ valueExpression      # notEqualComparison
  | valueExpression LT valueExpression       # lessThanComparison
  | valueExpression GT valueExpression       # greaterThanComparison
  | valueExpression LE valueExpression       # lessThanOrEqualComparison
  | valueExpression GE valueExpression       # greaterThanOrEqualComparison
  | valueExpression CONTAINS valueExpression # containsComparison
  | valueExpression STARTS WITH valueExpression # startsWithComparison
  | valueExpression ENDS WITH valueExpression   # endsWithComparison
  | valueExpression IS NULL                  # isNullCheck
  | valueExpression IS NOT NULL              # isNotNullCheck
  | variable COLON grassLabelName            # labelCheck
  | propertyAccess                           # propertyExistenceCheck
  | LPAREN booleanExpression RPAREN          # parenthesizedBoolean
  ;

valueExpression: propertyAccess
               | grassLiteral;

propertyAccess: variable DOT propertyName;

propertyName: symbolicNameString;

grassLiteral: grassStringLiteral
            | grassNumberLiteral
            | grassBooleanLiteral
            | grassNullLiteral;

grassStringLiteral: STRING_LITERAL1 | STRING_LITERAL2;

grassNumberLiteral: UNSIGNED_DECIMAL_INTEGER 
                  | DECIMAL_DOUBLE 
                  | MINUS UNSIGNED_DECIMAL_INTEGER 
                  | MINUS DECIMAL_DOUBLE;

grassBooleanLiteral: TRUE | FALSE;
grassNullLiteral: NULL;

styleMap: LCURLY styleProperty (COMMA styleProperty)* COMMA? RCURLY
        | LCURLY RCURLY;

styleProperty: colorProperty
             | sizeProperty
             | widthProperty
             | captionsProperty
             | captionSizeProperty
             | captionAlignProperty;

colorProperty: COLOR COLON colorValue;
colorValue: HEX_COLOR | grassStringLiteral;

sizeProperty: SIZE COLON grassNumberLiteral;

widthProperty: WIDTH COLON grassNumberLiteral;

captionsProperty: CAPTIONS COLON captionExpression;

captionSizeProperty: CAPTIONSIZE COLON grassNumberLiteral;

captionAlignProperty: CAPTIONALIGN COLON captionAlignValue;

captionAlignValue: TOP | BOTTOM | CENTER | grassStringLiteral;

captionExpression: captionTerm (PLUS captionTerm)*;

captionTerm: styledCaption
           | plainCaption;

styledCaption: BOLD LPAREN captionExpression RPAREN       # boldCaption
             | ITALIC LPAREN captionExpression RPAREN     # italicCaption
             | UNDERLINE LPAREN captionExpression RPAREN  # underlineCaption
             ;

plainCaption: grassStringLiteral
            | propertyAccess
            | typeFunction;

typeFunction: TYPE LPAREN variable RPAREN;

unescapedSymbolicNameString: 
    unescapedSymbolicNameString_
    | preparserKeyword
    | APPLY
    | BOLD | ITALIC | UNDERLINE
    | SIZE | WIDTH | COLOR | CAPTIONS | CAPTIONSIZE | CAPTIONALIGN
    | TOP | BOTTOM | CENTER
    ;
