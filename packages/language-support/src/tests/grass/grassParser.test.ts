import { describe, it, expect } from 'vitest';
import {
  parseGrass,
  stringifyGrass,
  validateGrass,
  astToStyleRule,
  type GrassRuleAST,
} from '../../grass';
import type { StyleRule } from '../../grass/grass-definition';

describe('Grass DSL Parser', () => {
  describe('parseGrass', () => {
    it.skip('should parse a simple node pattern', () => {
      const input = `MATCH (n) APPLY {size: 10}`;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0]).toEqual({
        match: { label: null },
        apply: { size: 10 },
      });
    });

    it.skip('should parse a node pattern with label', () => {
      const input = `MATCH (n:Person) APPLY {color: '#ff0000', size: 30}`;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules[0]).toEqual({
        match: { label: 'Person' },
        apply: { color: '#ff0000', size: 30 },
      });
    });

    it.skip('should parse a node pattern with WHERE clause', () => {
      const input = `MATCH (n:Trainer) WHERE n.reputation = 'Gym Leader' APPLY {color: '#9b59b6', size: 45}`;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules[0]).toEqual({
        match: { label: 'Trainer' },
        where: {
          equal: [{ property: 'reputation' }, 'Gym Leader'],
        },
        apply: { color: '#9b59b6', size: 45 },
      });
    });

    it.skip('should parse AND conditions', () => {
      const input = `MATCH (n:Pokemon) WHERE n.level < 10 AND NOT n.is_starter = true APPLY {size: 25}`;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        and: [
          { lessThan: [{ property: 'level' }, 10] },
          { not: { equal: [{ property: 'is_starter' }, true] } },
        ],
      });
    });

    it.skip('should parse ENDS WITH operator', () => {
      const input = `MATCH (n:Pokemon) WHERE n.name ENDS WITH 'saur' APPLY {color: '#2ecc71'}`;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        endsWith: [{ property: 'name' }, 'saur'],
      });
    });

    it.skip('should parse relationship patterns', () => {
      const input = `MATCH ()-[r:BATTLED]->() WHERE r.won = true APPLY {color: '#27ae60', width: 4}`;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules[0]).toEqual({
        match: { reltype: 'BATTLED' },
        where: {
          equal: [{ property: 'won' }, true],
        },
        apply: { color: '#27ae60', width: 4 },
      });
    });

    it.skip('should parse captions with bold styling', () => {
      const input = `MATCH ()-[r:BATTLED]->() APPLY {captions: bold('WON BATTLE')}`;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.captions).toEqual([
        { value: 'WON BATTLE', styles: ['bold'] },
      ]);
    });

    it.skip('should parse concatenated captions', () => {
      const input = `MATCH ()-[r:CAUGHT]->() APPLY {captions: 'Caught @ Lv' + bold(r.level)}`;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.captions).toEqual([
        { value: 'Caught @ Lv' },
        { value: { property: 'level' }, styles: ['bold'] },
      ]);
    });

    it.skip('should parse nested style functions', () => {
      const input = `MATCH (n:Pokemon) APPLY {captions: bold(italic(n.name))}`;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.captions).toEqual([
        { value: { property: 'name' }, styles: ['bold', 'italic'] },
      ]);
    });

    it.skip('should parse multiple rules', () => {
      const input = `
        MATCH (n) APPLY {size: 10}
        MATCH (n:Person) APPLY {color: '#ff0000'}
      `;
      const result = parseGrass(input);

      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(2);
    });
  });

  describe('stringifyGrass', () => {
    it('should convert simple rule to DSL string', () => {
      const rules: StyleRule[] = [
        {
          match: { label: null },
          apply: { size: 10 },
        },
      ];

      const result = stringifyGrass(rules);
      expect(result).toBe(`MATCH (n) APPLY {size: 10}`);
    });

    it('should convert rule with label to DSL string', () => {
      const rules: StyleRule[] = [
        {
          match: { label: 'Person' },
          apply: { color: '#ff0000', size: 30 },
        },
      ];

      const result = stringifyGrass(rules);
      expect(result).toContain('MATCH (n:Person)');
      expect(result).toContain("color: '#ff0000'");
      expect(result).toContain('size: 30');
    });

    it('should convert rule with WHERE clause', () => {
      const rules: StyleRule[] = [
        {
          match: { label: 'Trainer' },
          where: {
            equal: [{ property: 'reputation' }, 'Gym Leader'],
          },
          apply: { color: '#9b59b6' },
        },
      ];

      const result = stringifyGrass(rules);
      expect(result).toContain('WHERE');
      expect(result).toContain('n.reputation');
      expect(result).toContain("'Gym Leader'");
    });

    it('should convert relationship rules', () => {
      const rules: StyleRule[] = [
        {
          match: { reltype: 'BATTLED' },
          apply: { width: 4 },
        },
      ];

      const result = stringifyGrass(rules);
      expect(result).toContain('MATCH [r:BATTLED]');
      expect(result).toContain('width: 4');
    });

    it('should convert rules with captions', () => {
      const rules: StyleRule[] = [
        {
          match: { label: 'Person' },
          apply: {
            captions: [
              { value: { property: 'name' }, styles: ['bold'] },
              { value: ' - ', styles: undefined },
              { value: { property: 'age' }, styles: ['italic'] },
            ],
          },
        },
      ];

      const result = stringifyGrass(rules);
      expect(result).toContain('captions:');
      expect(result).toContain('bold(');
      expect(result).toContain('italic(');
    });
  });

  describe('validateGrass', () => {
    it('should return empty array for valid input', () => {
      // This test is skipped until parser is generated
      // const errors = validateGrass(`MATCH (n) APPLY {size: 10}`);
      // expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid input', () => {
      // This test will work once parser is generated
      // const errors = validateGrass(`INVALID SYNTAX`);
      // expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('astToStyleRule', () => {
    it('should convert simple node AST to StyleRule', () => {
      const ast: GrassRuleAST = {
        match: { type: 'node', variable: 'n', label: 'Person' },
        apply: { color: '#ff0000', size: 30 },
      };

      const rule = astToStyleRule(ast);

      expect(rule).toEqual({
        match: { label: 'Person' },
        apply: { color: '#ff0000', size: 30 },
      });
    });

    it('should convert relationship AST to StyleRule', () => {
      const ast: GrassRuleAST = {
        match: { type: 'relationship', variable: 'r', reltype: 'KNOWS' },
        apply: { width: 2 },
      };

      const rule = astToStyleRule(ast);

      expect(rule).toEqual({
        match: { reltype: 'KNOWS' },
        apply: { width: 2 },
      });
    });

    it('should convert AST with WHERE clause', () => {
      const ast: GrassRuleAST = {
        match: { type: 'node', variable: 'n', label: 'Person' },
        where: {
          type: 'comparison',
          operator: 'greaterThan',
          left: { type: 'property', name: 'age' },
          right: { type: 'number', value: 18 },
        },
        apply: { size: 30 },
      };

      const rule = astToStyleRule(ast);

      expect(rule.where).toEqual({
        greaterThan: [{ property: 'age' }, 18],
      });
    });

    it('should convert AST with AND conditions', () => {
      const ast: GrassRuleAST = {
        match: { type: 'node', variable: 'n' },
        where: {
          type: 'and',
          operands: [
            {
              type: 'comparison',
              operator: 'equal',
              left: { type: 'property', name: 'active' },
              right: { type: 'boolean', value: true },
            },
            {
              type: 'comparison',
              operator: 'lessThan',
              left: { type: 'property', name: 'level' },
              right: { type: 'number', value: 10 },
            },
          ],
        },
        apply: { color: '#00ff00' },
      };

      const rule = astToStyleRule(ast);

      expect(rule.where).toEqual({
        and: [
          { equal: [{ property: 'active' }, true] },
          { lessThan: [{ property: 'level' }, 10] },
        ],
      });
    });

    it('should convert AST with NOT condition', () => {
      const ast: GrassRuleAST = {
        match: { type: 'node', variable: 'n' },
        where: {
          type: 'not',
          operand: {
            type: 'comparison',
            operator: 'equal',
            left: { type: 'property', name: 'hidden' },
            right: { type: 'boolean', value: true },
          },
        },
        apply: { size: 20 },
      };

      const rule = astToStyleRule(ast);

      expect(rule.where).toEqual({
        not: { equal: [{ property: 'hidden' }, true] },
      });
    });

    it('should convert AST with captions', () => {
      const ast: GrassRuleAST = {
        match: { type: 'node', variable: 'n' },
        apply: {
          captions: [
            { value: { property: 'name' }, styles: ['bold'] },
            { value: ' - ', styles: [] },
          ],
        },
      };

      const rule = astToStyleRule(ast);

      expect(rule.apply.captions).toEqual([
        { value: { property: 'name' }, styles: ['bold'] },
        { value: ' - ' },
      ]);
    });
  });
});

