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
    | helpCmd
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

styleCmd: STYLE (RESET | styleRule (SEMICOLON styleRule)*)?;

welcomeCmd: WELCOME;

playCmd: PLAY;

accessModeArgs: (readCompletionRule | writeCompletionRule);

accessModeCmd: ACCESSMODE accessModeArgs?;

helpCmd: HELP;

listCompletionRule: LIST; 

useCompletionRule: USE;

serverCompletionRule: SERVER;

readCompletionRule: READ;

writeCompletionRule: WRITE;

// =============================================================================
// Grass Style Rules (entry point: styleSheet for standalone parsing)
// All rules prefixed with "grass" to avoid conflicts with Cypher rules
// =============================================================================

styleSheet: (styleRule (SEMICOLON styleRule)* SEMICOLON?)? EOF;

styleRule: MATCH grassPattern (WHERE grassWhereClause)? APPLY grassStyleMap;

grassPattern: grassNodePattern
            | grassRelationshipPattern
            | grassPathPattern
            | grassMultiLabelPattern;

grassNodePattern: LPAREN grassVariable? (COLON grassLabelName)? RPAREN;

grassRelationshipPattern: LBRACKET grassVariable? (COLON grassRelTypeName)? RBRACKET;

grassPathPattern: 
    LPAREN RPAREN MINUS LBRACKET grassVariable? (COLON grassRelTypeName)? RBRACKET MINUS GT LPAREN RPAREN     # rightArrowPath
  | LPAREN RPAREN LT MINUS LBRACKET grassVariable? (COLON grassRelTypeName)? RBRACKET MINUS LPAREN RPAREN     # leftArrowPath
  | LPAREN RPAREN MINUS LBRACKET grassVariable? (COLON grassRelTypeName)? RBRACKET MINUS LPAREN RPAREN        # undirectedPath
  ;

grassMultiLabelPattern: LPAREN grassVariable? (COLON grassLabelName) (COLON grassLabelName)+ RPAREN;

grassVariable: symbolicNameString;

grassLabelName: symbolicNameString;

grassRelTypeName: symbolicNameString;

grassWhereClause: grassBooleanExpression;

grassBooleanExpression: grassOrExpression;

grassOrExpression: grassAndExpression (OR grassAndExpression)*;

grassAndExpression: grassNotExpression (AND grassNotExpression)*;

grassNotExpression: NOT grassNotExpression
                  | grassComparisonExpression;

grassComparisonExpression: 
    grassValueExpression EQ grassValueExpression       # equalComparison
  | grassValueExpression NEQ grassValueExpression      # notEqualComparison
  | grassValueExpression LT grassValueExpression       # lessThanComparison
  | grassValueExpression GT grassValueExpression       # greaterThanComparison
  | grassValueExpression LE grassValueExpression       # lessThanOrEqualComparison
  | grassValueExpression GE grassValueExpression       # greaterThanOrEqualComparison
  | grassValueExpression CONTAINS grassValueExpression # containsComparison
  | grassValueExpression STARTS WITH grassValueExpression # startsWithComparison
  | grassValueExpression ENDS WITH grassValueExpression   # endsWithComparison
  | grassValueExpression IS NULL                       # isNullCheck
  | grassValueExpression IS NOT NULL                   # isNotNullCheck
  | grassVariable COLON grassLabelName                 # labelCheck
  | grassPropertyAccess                                # propertyExistenceCheck
  | LPAREN grassBooleanExpression RPAREN               # parenthesizedBoolean
  ;

grassValueExpression: grassPropertyAccess
                    | grassLiteral;

// Reuse Cypher's propertyKeyName for property access
grassPropertyAccess: grassVariable DOT propertyKeyName;

// Reuse Cypher's literal rule directly - semantic validation rejects unsupported types
grassLiteral: literal;

grassStyleMap: LCURLY grassStyleProperty (COMMA grassStyleProperty)* COMMA? RCURLY
             | LCURLY RCURLY;

grassStyleProperty: grassColorProperty
                  | grassSizeProperty
                  | grassWidthProperty
                  | grassCaptionsProperty
                  | grassCaptionSizeProperty
                  | grassCaptionAlignProperty;

grassColorProperty: COLOR COLON grassColorValue;
grassColorValue: stringLiteral;

grassSizeProperty: SIZE COLON numberLiteral;

grassWidthProperty: WIDTH COLON numberLiteral;

grassCaptionsProperty: CAPTIONS COLON grassCaptionExpression;

grassCaptionSizeProperty: CAPTIONSIZE COLON numberLiteral;

grassCaptionAlignProperty: CAPTIONALIGN COLON grassCaptionAlignValue;

grassCaptionAlignValue: stringLiteral;

grassCaptionExpression: grassCaptionTerm (PLUS grassCaptionTerm)*;

grassCaptionTerm: grassStyledCaption
               | grassPlainCaption;

grassStyledCaption: BOLD LPAREN grassCaptionExpression RPAREN       # boldCaption
                  | ITALIC LPAREN grassCaptionExpression RPAREN     # italicCaption
                  | UNDERLINE LPAREN grassCaptionExpression RPAREN  # underlineCaption
                  ;

grassPlainCaption: stringLiteral
                 | grassPropertyAccess
                 | grassTypeFunction;

grassTypeFunction: TYPE LPAREN grassVariable RPAREN;

// Merged unescapedSymbolicNameString: console commands + grass keywords
unescapedSymbolicNameString: 
    preparserKeyword 
    | unescapedSymbolicNameString_
    // Console command keywords
    | HISTORY | CLEAR | PARAM | CONNECT | DISCONNECT | WELCOME | SYSINFO
    // Grass keywords
    | APPLY | BOLD | ITALIC | UNDERLINE
    | SIZE | WIDTH | COLOR | CAPTIONS | CAPTIONSIZE | CAPTIONALIGN
    ;
