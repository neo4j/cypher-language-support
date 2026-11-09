import type { ParsedFunction } from '../../../cypherLanguageService/parsingTypes.js';
import type { Neo4jFunction } from '../../../types.js';

export function functionExists(
  functionCandidate: ParsedFunction,
  functionsSchema: Record<string, Neo4jFunction>,
): boolean {
  if (!functionCandidate || !functionsSchema) {
    return false;
  }
  const functionExistsWithExactName = Boolean(
    functionsSchema[functionCandidate.name],
  );
  const lowerCaseFunctionName = functionCandidate.name.toLowerCase();
  const caseInsensitiveBuiltInFunctionExists = Boolean(
    Object.values(functionsSchema).find(
      (fn) => fn.isBuiltIn && fn.name.toLowerCase() === lowerCaseFunctionName,
    ),
  );
  // Built-in functions are case-insensitive in the database
  return caseInsensitiveBuiltInFunctionExists || functionExistsWithExactName;
}
