import { SignatureHelp } from 'vscode-languageserver-types';
import { autocomplete as autocomplete_v25 } from './Cypher25/autocompletion/autocompletion';
import { signatureHelp as signatureHelp_v25 } from './Cypher25/signatureHelp';
import { applySyntaxColouring as applySyntaxColouring_v25 } from './Cypher25/syntaxColouring/syntaxColouring';
import {
  lintCypherQuery as lintCypherQuery_v25,
  validateSemantics as validateSemantics_v25,
  validateSyntax as validateSyntax_v25,
} from './Cypher25/syntaxValidation/syntaxValidation';
import { autocomplete as autocomplete_v5 } from './Cypher5/autocompletion/autocompletion';
import { signatureHelp as signatureHelp_v5 } from './Cypher5/signatureHelp';
import { applySyntaxColouring as applySyntaxColouring_v5 } from './Cypher5/syntaxColouring/syntaxColouring';
import {
  lintCypherQuery as lintCypherQuery_v5,
  validateSemantics as validateSemantics_v5,
  validateSyntax as validateSyntax_v5,
} from './Cypher5/syntaxValidation/syntaxValidation';
import { DbSchema } from './dbSchema';
import { cypherVersion } from './helpers';
import { CompletionItem, ParsedCypherToken, SyntaxDiagnostic } from './types';

export function signatureHelp(
  query: string,
  dbSchema: DbSchema,
  caretPosition: number = query.length,
): SignatureHelp {
  if (cypherVersion(query, dbSchema) === 'cypher 5') {
    return signatureHelp_v5(query, dbSchema, caretPosition);
  } else {
    return signatureHelp_v25(query, dbSchema, caretPosition);
  }
}

export function autocomplete(
  query: string,
  dbSchema: DbSchema,
  caretPosition: number = query.length,
  manual = false,
): CompletionItem[] {
  if (cypherVersion(query, dbSchema) === 'cypher 5') {
    return autocomplete_v5(query, dbSchema, caretPosition, manual);
  } else {
    return autocomplete_v25(query, dbSchema, caretPosition, manual);
  }
}

export function applySyntaxColouring(
  query: string,
  dbSchema: DbSchema,
): ParsedCypherToken[] {
  if (cypherVersion(query, dbSchema) === 'cypher 5') {
    return applySyntaxColouring_v5(query);
  } else {
    return applySyntaxColouring_v25(query);
  }
}

export function lintCypherQuery(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (cypherVersion(query, dbSchema) === 'cypher 5') {
    return lintCypherQuery_v5(query, dbSchema);
  } else {
    return lintCypherQuery_v25(query, dbSchema);
  }
}

export function validateSemantics(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (cypherVersion(query, dbSchema) === 'cypher 5') {
    return validateSemantics_v5(query, dbSchema);
  } else {
    return validateSemantics_v25(query, dbSchema);
  }
}

export function validateSyntax(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (cypherVersion(query, dbSchema) === 'cypher 5') {
    return validateSyntax_v5(query, dbSchema);
  } else {
    return validateSyntax_v25(query, dbSchema);
  }
}
