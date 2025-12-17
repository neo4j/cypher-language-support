parser grammar GrassParser;

import CypherPreParser;

options { tokenVocab = GrassLexer; }

// =============================================================================
// Grass Style Rules DSL
// =============================================================================
// This grammar defines a Cypher-like DSL for styling graph visualizations.
// It imports CypherPreParser which provides:
//   - symbolicNameString (for identifiers with proper escaping)
//   - stringLiteral, numberLiteral, booleanLiteral
//   - expression (if needed for more complex conditions)
//
// Example:
//   MATCH (n:Person) WHERE n.age > 18 APPLY {color: '#ff0000', size: 30}
//   MATCH [r:KNOWS] APPLY {width: 3, captions: bold(r.since)}
// =============================================================================

// Entry point - multiple style rules
styleSheet: styleRule* EOF;

// A single style rule: MATCH pattern [WHERE condition] APPLY styles
styleRule: MATCH pattern (WHERE whereClause)? APPLY styleMap;

// Pattern matching - either node, relationship, path pattern, or invalid patterns we catch for errors
pattern: nodePattern
       | relationshipPattern
       | pathPattern
       | multiLabelPattern;

// Node pattern: (n), (n:Label), (:Label), or ()
nodePattern: LPAREN variable? (COLON grassLabelName)? RPAREN;

// Relationship pattern: [r], [r:TYPE], [:TYPE], or []
relationshipPattern: LBRACKET variable? (COLON grassRelTypeName)? RBRACKET;

// Path patterns - parsed but produce semantic error "Grass does not support paths"
pathPattern: 
    LPAREN RPAREN MINUS LBRACKET variable? (COLON grassRelTypeName)? RBRACKET ARROW_RIGHT_HEAD LPAREN RPAREN  # rightArrowPath
  | LPAREN RPAREN ARROW_LEFT_HEAD LBRACKET variable? (COLON grassRelTypeName)? RBRACKET MINUS LPAREN RPAREN   # leftArrowPath
  | LPAREN RPAREN MINUS LBRACKET variable? (COLON grassRelTypeName)? RBRACKET MINUS LPAREN RPAREN             # undirectedPath
  ;

// Multiple labels like (n:Person:Employee) - parsed so we can give helpful error
// "Use WHERE n:Employee to add additional label conditions"
multiLabelPattern: LPAREN variable? (COLON grassLabelName) (COLON grassLabelName)+ RPAREN;

// Variable name - reuses Cypher's symbolic name handling
variable: symbolicNameString;

// Label name for nodes (prefixed to avoid conflict with Cypher's LabelName alt label)
grassLabelName: symbolicNameString;

// Relationship type name (prefixed to avoid conflict with Cypher's RelTypeName alt label)
grassRelTypeName: symbolicNameString;

// WHERE clause conditions
whereClause: booleanExpression;

// Boolean expressions with AND/OR precedence
booleanExpression: orExpression;

orExpression: andExpression (OR andExpression)*;

andExpression: notExpression (AND notExpression)*;

notExpression: NOT notExpression
             | comparisonExpression;

// Comparison expressions
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
  | LPAREN booleanExpression RPAREN          # parenthesizedBoolean
  ;

// Value expressions used in comparisons
valueExpression: propertyAccess
               | grassLiteral;

// Property access: n.propertyName
propertyAccess: variable DOT propertyName;

propertyName: symbolicNameString;

// Literal values - using Cypher's literal tokens
grassLiteral: grassStringLiteral
            | grassNumberLiteral
            | grassBooleanLiteral
            | grassNullLiteral;

// Cypher uses STRING_LITERAL1 (single quotes) and STRING_LITERAL2 (double quotes)
grassStringLiteral: STRING_LITERAL1 | STRING_LITERAL2;

// Cypher uses UNSIGNED_DECIMAL_INTEGER and DECIMAL_DOUBLE
grassNumberLiteral: UNSIGNED_DECIMAL_INTEGER 
                  | DECIMAL_DOUBLE 
                  | MINUS UNSIGNED_DECIMAL_INTEGER 
                  | MINUS DECIMAL_DOUBLE;

grassBooleanLiteral: TRUE | FALSE;
grassNullLiteral: NULL;

// APPLY style map: {color: '#fff', size: 10, ...}
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

// Caption expressions with concatenation
captionExpression: captionTerm (PLUS captionTerm)*;

// A single caption term - styled or plain
captionTerm: styledCaption
           | plainCaption;

// Styled captions: bold(...), italic(...), underline(...)
styledCaption: BOLD LPAREN captionExpression RPAREN       # boldCaption
             | ITALIC LPAREN captionExpression RPAREN     # italicCaption
             | UNDERLINE LPAREN captionExpression RPAREN  # underlineCaption
             ;

// Plain caption - string literal or property reference
plainCaption: grassStringLiteral
            | propertyAccess;

// Override unescapedSymbolicNameString to add Grass keywords as valid identifiers
// This allows using keywords like 'color', 'size' as property names when unescaped
unescapedSymbolicNameString: 
    unescapedSymbolicNameString_
    | preparserKeyword
    // Grass-specific keywords that should be allowed as identifiers
    | APPLY
    | BOLD | ITALIC | UNDERLINE
    | SIZE | WIDTH | COLOR | CAPTIONS | CAPTIONSIZE | CAPTIONALIGN
    | TOP | BOTTOM | CENTER
    ;
