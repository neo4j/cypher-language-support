import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { autocomplete } from '../autocompletion/autocompletion';
import { _internalFeatureFlags } from '../featureFlags';
import { parserWrapper } from '../parserWrapper';
import { applySyntaxColouring } from '../syntaxColouring/syntaxColouring';
import { lintCypherQuery } from '../syntaxValidation/syntaxValidation';
import { DbSchema } from '../dbSchema';

/**
 * Integration tests for Grass DSL editor features.
 *
 * These tests verify that the main parser entrypoint correctly handles
 * grass syntax via the :style command, including:
 * - Syntax highlighting
 * - Syntax validation
 * - Autocompletion
 *
 * These are smoke tests, not exhaustive. See grassFixtures.test.ts and
 * grassParseErrors.test.ts for comprehensive parser coverage.
 */

const dbSchema: DbSchema = {
  labels: ['Person', 'Movie', 'Actor'],
  relationshipTypes: ['ACTED_IN', 'DIRECTED', 'KNOWS'],
  propertyKeys: ['name', 'age', 'title', 'year'],
};

describe('Grass DSL Editor Integration', () => {
  let consoleCommands: boolean;

  beforeAll(() => {
    consoleCommands = _internalFeatureFlags.consoleCommands;
    _internalFeatureFlags.consoleCommands = true;
  });

  afterAll(() => {
    _internalFeatureFlags.consoleCommands = consoleCommands;
  });

  describe('Syntax Highlighting', () => {
    test('highlights :style command tokens', () => {
      const tokens = applySyntaxColouring(':style');
      expect(tokens).toHaveLength(2);
      expect(tokens[0]).toMatchObject({
        token: ':',
        tokenType: 'consoleCommand',
      });
      expect(tokens[1]).toMatchObject({
        token: 'style',
        tokenType: 'consoleCommand',
      });
    });

    test('highlights :style reset tokens', () => {
      const tokens = applySyntaxColouring(':style reset');
      expect(tokens).toHaveLength(3);
      expect(tokens[2]).toMatchObject({
        token: 'reset',
        tokenType: 'consoleCommand',
      });
    });

    test('highlights MATCH keyword in grass rule', () => {
      const tokens = applySyntaxColouring(
        ':style MATCH (n:Person) APPLY {color: "#ff0000"}',
      );
      const matchToken = tokens.find((t) => t.token === 'MATCH');
      expect(matchToken).toBeDefined();
      expect(matchToken?.tokenType).toBe('keyword');
    });

    test('highlights label in grass rule', () => {
      const tokens = applySyntaxColouring(
        ':style MATCH (n:Person) APPLY {size: 10}',
      );
      const labelToken = tokens.find((t) => t.token === 'Person');
      expect(labelToken).toBeDefined();
      // Currently highlighted as 'symbolicName', could be improved to 'label'
      expect(labelToken?.tokenType).toBe('symbolicName');
    });

    test('highlights string literals in grass rule', () => {
      const tokens = applySyntaxColouring(
        ':style MATCH (n) APPLY {color: "#ff0000"}',
      );
      const stringToken = tokens.find((t) => t.token === '"#ff0000"');
      expect(stringToken).toBeDefined();
      expect(stringToken?.tokenType).toBe('stringLiteral');
    });

    test('highlights numbers in grass rule', () => {
      const tokens = applySyntaxColouring(':style MATCH (n) APPLY {size: 20}');
      const numberToken = tokens.find((t) => t.token === '20');
      expect(numberToken).toBeDefined();
      expect(numberToken?.tokenType).toBe('numberLiteral');
    });

    test('highlights WHERE clause keywords', () => {
      const tokens = applySyntaxColouring(
        ':style MATCH (n) WHERE n.age > 18 APPLY {size: 10}',
      );
      const whereToken = tokens.find((t) => t.token === 'WHERE');
      expect(whereToken).toBeDefined();
      expect(whereToken?.tokenType).toBe('keyword');
    });

    test('highlights boolean operators', () => {
      const tokens = applySyntaxColouring(
        ':style MATCH (n) WHERE n.a = 1 AND n.b = 2 APPLY {size: 10}',
      );
      const andToken = tokens.find((t) => t.token === 'AND');
      expect(andToken).toBeDefined();
      expect(andToken?.tokenType).toBe('keyword');
    });
  });

  describe('Syntax Validation', () => {
    test('parses valid :style command without errors', () => {
      const result = parserWrapper.parse(
        ':style MATCH (n:Person) APPLY {color: "#ff0000"}',
      );
      const errors = result.statementsParsing.flatMap((s) => s.syntaxErrors);
      expect(errors).toHaveLength(0);
    });

    test('parses :style reset without errors', () => {
      const result = parserWrapper.parse(':style reset');
      const errors = result.statementsParsing.flatMap((s) => s.syntaxErrors);
      expect(errors).toHaveLength(0);
    });

    test('parses grass with WHERE clause without errors', () => {
      const result = parserWrapper.parse(
        ':style MATCH (n:Person) WHERE n.age > 18 APPLY {size: 30}',
      );
      const errors = result.statementsParsing.flatMap((s) => s.syntaxErrors);
      expect(errors).toHaveLength(0);
    });

    test('parses grass with relationship pattern without errors', () => {
      const result = parserWrapper.parse(
        ':style MATCH [r:KNOWS] APPLY {width: 3}',
      );
      const errors = result.statementsParsing.flatMap((s) => s.syntaxErrors);
      expect(errors).toHaveLength(0);
    });

    test('parses grass with styled captions without errors', () => {
      const result = parserWrapper.parse(
        ':style MATCH (n) APPLY {captions: bold(n.name)}',
      );
      const errors = result.statementsParsing.flatMap((s) => s.syntaxErrors);
      expect(errors).toHaveLength(0);
    });

    test('reports error for missing APPLY clause', () => {
      const result = parserWrapper.parse(':style MATCH (n:Person)');
      const errors = result.statementsParsing.flatMap((s) => s.syntaxErrors);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('reports error for invalid style property syntax', () => {
      const result = parserWrapper.parse(':style MATCH (n) APPLY {color}');
      const errors = result.statementsParsing.flatMap((s) => s.syntaxErrors);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('lintCypherQuery works with grass rules', () => {
      const diagnostics = lintCypherQuery(
        ':style MATCH (n:Person) APPLY {size: 10}',
        dbSchema,
        true, // consoleCommandsEnabled
      ).diagnostics;
      expect(diagnostics).toHaveLength(0);
    });
  });

  describe('Error Messages', () => {
    test('error message mentions APPLY when missing', () => {
      const result = parserWrapper.parse(':style MATCH (n:Person)');
      const errors = result.statementsParsing.flatMap((s) => s.syntaxErrors);
      expect(errors.length).toBeGreaterThan(0);
      // Should mention what's expected
      const errorMessages = errors.map((e) => e.message).join(' ');
      expect(errorMessages.toLowerCase()).toMatch(/apply|expected/i);
    });

    test('error includes position information', () => {
      const result = parserWrapper.parse(':style MATCH (n) APPLY {color}');
      const errors = result.statementsParsing.flatMap((s) => s.syntaxErrors);
      expect(errors.length).toBeGreaterThan(0);
      // Errors should have position info for editor squiggles
      expect(errors[0]).toHaveProperty('offsets');
      expect(errors[0].offsets).toHaveProperty('start');
      expect(errors[0].offsets).toHaveProperty('end');
    });

    test('lintCypherQuery returns diagnostics with positions', () => {
      const { diagnostics } = lintCypherQuery(
        ':style MATCH (n) APPLY {color}',
        dbSchema,
        true,
      );
      expect(diagnostics.length).toBeGreaterThan(0);
      // Diagnostics should have range for editor integration
      expect(diagnostics[0]).toHaveProperty('range');
    });
  });

  describe('Autocompletion', () => {
    test('suggests :style in console command completions', () => {
      const completions = autocomplete(':', dbSchema);
      const styleCompletion = completions.find((c) => c.label === 'style');
      expect(styleCompletion).toBeDefined();
    });

    test('suggests MATCH after :style', () => {
      const completions = autocomplete(':style ', dbSchema);
      const matchCompletion = completions.find((c) => c.label === 'MATCH');
      expect(matchCompletion).toBeDefined();
    });

    test('suggests RESET after :style', () => {
      const completions = autocomplete(':style ', dbSchema);
      const resetCompletion = completions.find((c) => c.label === 'reset');
      expect(resetCompletion).toBeDefined();
    });

    test('suggests labels in grass node pattern', () => {
      const completions = autocomplete(':style MATCH (n:', dbSchema);
      const personCompletion = completions.find((c) => c.label === 'Person');
      expect(personCompletion).toBeDefined();
    });

    test('suggests relationship types in grass relationship pattern', () => {
      const completions = autocomplete(':style MATCH [r:', dbSchema);
      const knowsCompletion = completions.find((c) => c.label === 'KNOWS');
      expect(knowsCompletion).toBeDefined();
    });

    test('suggests WHERE after pattern', () => {
      const completions = autocomplete(':style MATCH (n:Person) ', dbSchema);
      const whereCompletion = completions.find((c) => c.label === 'WHERE');
      expect(whereCompletion).toBeDefined();
    });

    test('suggests APPLY after pattern', () => {
      const completions = autocomplete(':style MATCH (n:Person) ', dbSchema);
      const applyCompletion = completions.find((c) => c.label === 'APPLY');
      expect(applyCompletion).toBeDefined();
    });

    test('suggests APPLY after WHERE clause', () => {
      const completions = autocomplete(
        ':style MATCH (n:Person) WHERE n.age > 18 ',
        dbSchema,
      );
      const applyCompletion = completions.find((c) => c.label === 'APPLY');
      expect(applyCompletion).toBeDefined();
    });

    test('suggests boolean operators in WHERE clause', () => {
      const completions = autocomplete(
        ':style MATCH (n) WHERE n.age > 18 ',
        dbSchema,
      );
      const andCompletion = completions.find((c) => c.label === 'AND');
      const orCompletion = completions.find((c) => c.label === 'OR');
      expect(andCompletion).toBeDefined();
      expect(orCompletion).toBeDefined();
    });

    test('suggests style properties inside APPLY block with correct casing', () => {
      const completions = autocomplete(':style MATCH (n) APPLY {', dbSchema);
      const colorCompletion = completions.find((c) => c.label === 'color');
      const captionAlignCompletion = completions.find(
        (c) => c.label === 'captionAlign',
      );
      expect(colorCompletion).toBeDefined();
      expect(captionAlignCompletion).toBeDefined();
    });

    test('captionAlign expects a string value', () => {
      // captionAlign now uses string literals like 'top', 'bottom', 'center'
      // rather than keyword tokens, so no token-based completions are offered
      const completions = autocomplete(
        ':style MATCH (n) APPLY {captionAlign: ',
        dbSchema,
      );
      // String literal positions don't offer keyword completions
      // Users should type 'top', 'bottom', or 'center' as strings
      expect(completions.length).toBe(0);
    });
  });
});
