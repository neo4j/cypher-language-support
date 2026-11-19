import type { PropertyType } from '../../../cypherLanguageService/parsingTypes.js';
import type { SymbolTable, Symbol } from '../../../types.js';

export function isNodeOrRelationshipProperty(
  property: PropertyType,
  symbolTable: SymbolTable,
): boolean {
  const variable = property.variable;
  if (!variable) {
    return false;
  }
  const symbol = symbolTable.find((symbol) => {
    return symbol.variable === variable.name;
  });
  return Boolean(symbol && symbolIsNodeOrRel(symbol));
}

/** Checks all possible types of a symbol are Node or Relationship */
function symbolIsNodeOrRel(symbol: Symbol): boolean {
  if (symbol.types.length === 0) {
    return false;
  }

  return symbol.types.every((type) => {
    return type === 'Node' || type === 'Relationship';
  });
}
