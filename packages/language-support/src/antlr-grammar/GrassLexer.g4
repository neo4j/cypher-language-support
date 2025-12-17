lexer grammar GrassLexer;

import CypherPreLexer;

// =============================================================================
// Grass-specific tokens
// =============================================================================
// The following tokens are inherited from CypherPreLexer (via Cypher25Lexer):
//
// Keywords: MATCH, WHERE, AND, OR, NOT, TRUE, FALSE, NULL, IS, CONTAINS, STARTS, ENDS, WITH
// Symbols: LPAREN, RPAREN, LBRACKET, RBRACKET, LCURLY, RCURLY, COLON, DOT, COMMA, PLUS, MINUS
// Operators: EQ, NEQ (as '<>'), LT, GT, LE, GE
// Literals: STRING_LITERAL1, STRING_LITERAL2, DECIMAL_DOUBLE, UNSIGNED_DECIMAL_INTEGER
// Identifiers: IDENTIFIER, ESCAPED_SYMBOLIC_NAME
// Whitespace: SPACE -> channel(HIDDEN)
// Comments: SINGLE_LINE_COMMENT, MULTI_LINE_COMMENT -> channel(HIDDEN)
// =============================================================================

// APPLY is the main Grass-specific keyword
APPLY: A P P L Y;

// Style function keywords
BOLD: B O L D;
ITALIC: I T A L I C;
UNDERLINE: U N D E R L I N E;

// Style property keywords
// Note: SIZE, WIDTH, COLOR are not Cypher keywords
SIZE: S I Z E;
WIDTH: W I D T H;
COLOR: C O L O R;
CAPTIONS: C A P T I O N S;
CAPTIONSIZE: C A P T I O N S I Z E;
CAPTIONALIGN: C A P T I O N A L I G N;

// Caption alignment values
TOP: T O P;
BOTTOM: B O T T O M;
CENTER: C E N T E R;

// Type function keyword for relationships
TYPE: T Y P E;

// Hex color values for styling (e.g., #ff0000, #f00)
HEX_COLOR: '#' HEX_DIGIT HEX_DIGIT HEX_DIGIT (HEX_DIGIT HEX_DIGIT HEX_DIGIT)?;

fragment HEX_DIGIT: [0-9a-fA-F];

// Relationship arrow patterns
// Uses standard Cypher-like syntax: ()-[r:TYPE]->()
ARROW_RIGHT_HEAD: '->';
ARROW_LEFT_HEAD: '<-';
