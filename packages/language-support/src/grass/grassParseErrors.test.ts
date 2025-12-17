import { describe, it, expect } from 'vitest';
import { parseGrass } from './grassParserWrapper';

describe('Grass DSL Parser - Error Handling', () => {
  it('returns errors for invalid syntax', () => {
    const result = parseGrass(`MATCH (n) APPLY`);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('handles empty input', () => {
    const result = parseGrass('');
    expect(result.errors).toHaveLength(0);
    expect(result.rules).toHaveLength(0);
  });

  it('requires semicolons between multiple rules', () => {
    // Without semicolon - should fail
    const withoutSemicolon = parseGrass(`
      MATCH (n) APPLY {size: 10}
      MATCH (n:Person) APPLY {color: '#ff0000'}
    `);
    expect(withoutSemicolon.errors.length).toBeGreaterThan(0);

    // With semicolon - should pass
    const withSemicolon = parseGrass(`
      MATCH (n) APPLY {size: 10};
      MATCH (n:Person) APPLY {color: '#ff0000'}
    `);
    expect(withSemicolon.errors).toHaveLength(0);
    expect(withSemicolon.rules).toHaveLength(2);
  });

  it('allows trailing semicolon', () => {
    const result = parseGrass(`MATCH (n) APPLY {size: 10};`);
    expect(result.errors).toHaveLength(0);
    expect(result.rules).toHaveLength(1);
  });

  describe('unsupported literal types', () => {
    it('returns error for map literals in WHERE clause', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.data = {key: 'value'} APPLY {size: 10}`,
      );
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some((e) => e.message.includes('map literals')),
      ).toBe(true);
    });

    it('returns error for INF literal', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.value = INF APPLY {size: 10}`,
      );
      expect(result.errors.length).toBeGreaterThan(0);
      const infError = result.errors.find((e) => e.message.includes("'INF'"));
      expect(infError).toBeDefined();
      expect(infError?.message).toContain('Use a number instead');
    });

    it('returns error for INFINITY literal', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.value = INFINITY APPLY {size: 10}`,
      );
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.message.includes("'INFINITY'"))).toBe(
        true,
      );
    });

    it('returns error for NaN literal', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.value = NaN APPLY {size: 10}`,
      );
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.message.includes("'NAN'"))).toBe(true);
    });

    it('allows null literal (IS NULL pattern)', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.value IS NULL APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
    });
  });

  it('returns error for path patterns', () => {
    const result = parseGrass(`MATCH ()-[r:KNOWS]->() APPLY {width: 3}`);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe(
      'Grass does not support paths. Use [r:TYPE] for relationships.',
    );
    expect(result.rules).toHaveLength(0);
  });

  it('returns error for left arrow path patterns', () => {
    const result = parseGrass(`MATCH ()<-[r:KNOWS]-() APPLY {width: 3}`);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('Grass does not support paths');
  });

  it('returns error for undirected path patterns', () => {
    const result = parseGrass(`MATCH ()-[r:KNOWS]-() APPLY {width: 3}`);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('Grass does not support paths');
  });

  it('returns error for multiple labels in MATCH', () => {
    const result = parseGrass(`MATCH (n:Person:Actor) APPLY {size: 10}`);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain(
      'Multiple labels in MATCH are not supported',
    );
    expect(result.errors[0].message).toContain('WHERE n:Actor');
    expect(result.rules).toHaveLength(0);
  });

  it('returns error for multiple labels without variable', () => {
    const result = parseGrass(`MATCH (:Person:Actor) APPLY {size: 10}`);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain(
      'Multiple labels in MATCH are not supported',
    );
    expect(result.rules).toHaveLength(0);
  });

  it('returns error for three or more labels', () => {
    const result = parseGrass(
      `MATCH (n:Person:Actor:Employee) APPLY {size: 10}`,
    );

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain(
      'Multiple labels in MATCH are not supported',
    );
    expect(result.errors[0].message).toContain('WHERE n:Actor');
    expect(result.rules).toHaveLength(0);
  });

  it('returns error for missing closing paren', () => {
    const result = parseGrass(`MATCH (n APPLY {size: 10}`);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('returns error for missing APPLY clause', () => {
    // Parser should handle missing APPLY clause gracefully
    const result = parseGrass(`MATCH (n:Person) WHERE n.age > 18`);
    expect(result.errors.length).toBeGreaterThan(0);
    // Should produce syntax error, not crash
    expect(result.errors[0].message).toBeDefined();
  });

  it.todo('returns error for invalid property in APPLY', () => {
    // Should validate unknown style properties
    // Example: MATCH (n) APPLY {invalidProperty: 10}
  });

  it('returns semantic error for null comparison with =', () => {
    const result = parseGrass(
      `MATCH (n:Person) WHERE n.middleName = null APPLY {color: '#cccccc'}`,
    );

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('Comparing with null');
    expect(result.errors[0].message).toContain('IS NULL');
    expect(result.errors[0].message).toContain('null = null evaluates to null');
  });

  it('returns semantic error for null comparison with <>', () => {
    const result = parseGrass(
      `MATCH (n) WHERE n.value <> null APPLY {size: 10}`,
    );

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('Comparing with null');
    expect(result.errors[0].message).toContain('IS NOT NULL');
  });

  it('returns semantic error for null on left side of comparison', () => {
    const result = parseGrass(
      `MATCH (n) WHERE null = n.value APPLY {size: 10}`,
    );

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('Comparing with null');
    expect(result.errors[0].message).toContain('IS NULL');
  });

  it('does not error for IS NULL check', () => {
    const result = parseGrass(
      `MATCH (n) WHERE n.value IS NULL APPLY {size: 10}`,
    );

    expect(result.errors).toHaveLength(0);
    expect(result.rules).toHaveLength(1);
  });

  it('does not error for IS NOT NULL check', () => {
    const result = parseGrass(
      `MATCH (n) WHERE n.value IS NOT NULL APPLY {size: 10}`,
    );

    expect(result.errors).toHaveLength(0);
    expect(result.rules).toHaveLength(1);
  });
});

describe('Grass DSL Parser - Edge Cases', () => {
  describe('Keyword Handling', () => {
    it('allows keywords as property names', () => {
      // Keywords like 'color', 'size', 'type' should work as properties
      const result = parseGrass(
        `MATCH (n) WHERE n.color = 'red' APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'color' }, 'red'],
      });
    });

    it('allows Grass keywords as identifiers', () => {
      // APPLY, BOLD, etc. as property names
      const result = parseGrass(
        `MATCH (n) WHERE n.apply = true APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'apply' }, true],
      });
    });

    it('allows style property names as property references', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.width > 5 APPLY {color: '#fff'}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        greaterThan: [{ property: 'width' }, 5],
      });
    });
  });

  describe('Escaped Identifiers', () => {
    it('handles backtick-escaped identifiers', () => {
      const result = parseGrass(
        `MATCH (\`node-with-dashes\`:Label) APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(1);
      // The variable name should be preserved
      expect(result.rules[0].match).toEqual({ label: 'Label' });
    });

    it('handles escaped label names', () => {
      const result = parseGrass(
        `MATCH (n:\`Label-Name\`) APPLY {color: '#ff0000'}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].match).toEqual({ label: 'Label-Name' });
      expect(result.rules[0].apply.color).toBe('#ff0000');
    });

    it('handles escaped relationship types', () => {
      const result = parseGrass(`MATCH [:\`REL-TYPE\`] APPLY {width: 3}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].match).toEqual({ reltype: 'REL-TYPE' });
      expect(result.rules[0].apply.width).toBe(3);
    });

    it('handles escaped property names', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.\`property-name\` = 'value' APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'property-name' }, 'value'],
      });
    });

    it('handles escaped names with spaces', () => {
      const result = parseGrass(
        `MATCH (n:\`Label With Spaces\`) APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].match).toEqual({ label: 'Label With Spaces' });
    });

    it('handles escaped names with special characters', () => {
      const result = parseGrass(`MATCH (n:\`Label@#$%\`) APPLY {size: 10}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].match).toEqual({ label: 'Label@#$%' });
    });
  });

  describe('String Literals', () => {
    it('handles double-quoted strings', () => {
      // Both single and double quotes should work
      const result = parseGrass(
        `MATCH (n) WHERE n.name = "John" APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'name' }, 'John'],
      });
    });

    it('handles escaped characters in strings', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.name = 'O\\'Brien' APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'name' }, "O'Brien"],
      });
    });

    it('handles unicode in strings', () => {
      const result1 = parseGrass(
        `MATCH (n) WHERE n.name = '日本語' APPLY {size: 10}`,
      );
      expect(result1.errors).toHaveLength(0);
      expect(result1.rules[0].where).toEqual({
        equal: [{ property: 'name' }, '日本語'],
      });

      const result2 = parseGrass(
        `MATCH (n) WHERE n.emoji = '🎉' APPLY {size: 10}`,
      );
      expect(result2.errors).toHaveLength(0);
      expect(result2.rules[0].where).toEqual({
        equal: [{ property: 'emoji' }, '🎉'],
      });
    });

    it('handles empty strings', () => {
      const result = parseGrass(`MATCH (n) WHERE n.name = '' APPLY {size: 10}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'name' }, ''],
      });
    });

    it('handles strings with special characters', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.path = 'C:\\\\Users\\\\name' APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'path' }, 'C:\\Users\\name'],
      });
    });
  });

  describe('Number Literals', () => {
    it('handles very large numbers', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.value > 9999999999999 APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        greaterThan: [{ property: 'value' }, 9999999999999],
      });
    });

    it('handles very small decimals', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.value < 0.0000001 APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        lessThan: [{ property: 'value' }, 0.0000001],
      });
    });

    it.todo('handles scientific notation', () => {
      // Scientific notation may not be supported by the grammar yet
      // Example: WHERE n.value > 1e10
      // Example: WHERE n.value < 1.5e-5
    });

    it('handles zero values', () => {
      const result1 = parseGrass(
        `MATCH (n) WHERE n.value = 0 APPLY {size: 10}`,
      );
      expect(result1.errors).toHaveLength(0);
      expect(result1.rules[0].where).toEqual({
        equal: [{ property: 'value' }, 0],
      });

      const result2 = parseGrass(
        `MATCH (n) WHERE n.value = 0.0 APPLY {size: 10}`,
      );
      expect(result2.errors).toHaveLength(0);
      expect(result2.rules[0].where).toEqual({
        equal: [{ property: 'value' }, 0],
      });
    });

    it('handles decimal numbers in comparisons', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.price = 19.99 APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'price' }, 19.99],
      });
    });
  });

  describe('Complex Boolean Expressions', () => {
    it('handles deeply nested expressions', () => {
      const result = parseGrass(
        `MATCH (n) WHERE (n.a > 1 AND (n.b < 2 OR (n.c = 3 AND n.d <> 4))) APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(1);
      // Verify it has nested structure
      expect(result.rules[0].where).toHaveProperty('and');
    });

    it('handles multiple ANDs', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.a = 1 AND n.b = 2 AND n.c = 3 APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        and: [
          { equal: [{ property: 'a' }, 1] },
          { equal: [{ property: 'b' }, 2] },
          { equal: [{ property: 'c' }, 3] },
        ],
      });
    });

    it('handles multiple ORs', () => {
      const result = parseGrass(
        `MATCH (n) WHERE n.a = 1 OR n.b = 2 OR n.c = 3 APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        or: [
          { equal: [{ property: 'a' }, 1] },
          { equal: [{ property: 'b' }, 2] },
          { equal: [{ property: 'c' }, 3] },
        ],
      });
    });

    it('handles NOT with complex expressions', () => {
      const result = parseGrass(
        `MATCH (n) WHERE NOT (n.a > 1 AND n.b < 2) APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        not: {
          and: [
            { greaterThan: [{ property: 'a' }, 1] },
            { lessThan: [{ property: 'b' }, 2] },
          ],
        },
      });
    });

    it('handles double negation', () => {
      const result = parseGrass(
        `MATCH (n) WHERE NOT NOT n.active = true APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        not: {
          not: {
            equal: [{ property: 'active' }, true],
          },
        },
      });
    });

    it('handles mixed AND/OR with proper precedence', () => {
      // AND has higher precedence than OR
      const result = parseGrass(
        `MATCH (n) WHERE n.a = 1 OR n.b = 2 AND n.c = 3 APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      // Should parse as: a = 1 OR (b = 2 AND c = 3)
      expect(result.rules[0].where).toEqual({
        or: [
          { equal: [{ property: 'a' }, 1] },
          {
            and: [
              { equal: [{ property: 'b' }, 2] },
              { equal: [{ property: 'c' }, 3] },
            ],
          },
        ],
      });
    });
  });

  describe('Caption Expression Edge Cases', () => {
    it('handles mixed styled and plain captions', () => {
      const result = parseGrass(
        `MATCH (n) APPLY {captions: bold(n.name) + ' is ' + n.age}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.captions).toHaveLength(3);
      expect(result.rules[0].apply.captions[0]).toEqual({
        value: { property: 'name' },
        styles: ['bold'],
      });
      expect(result.rules[0].apply.captions[1]).toEqual({
        value: ' is ',
      });
      expect(result.rules[0].apply.captions[2]).toEqual({
        value: { property: 'age' },
      });
    });

    it('handles empty caption strings', () => {
      const result = parseGrass(`MATCH (n) APPLY {captions: ''}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.captions).toEqual([{ value: '' }]);
    });

    it('handles long concatenation chains', () => {
      const result = parseGrass(
        `MATCH (n) APPLY {captions: n.a + ' ' + n.b + ' ' + n.c}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.captions).toHaveLength(5);
    });

    it('handles triple nested styling', () => {
      const result = parseGrass(
        `MATCH (n) APPLY {captions: bold(italic(underline(n.name)))}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.captions[0]).toEqual({
        value: { property: 'name' },
        styles: ['bold', 'italic', 'underline'],
      });
    });

    it('handles multiple properties in styled captions', () => {
      const result = parseGrass(
        `MATCH (n) APPLY {captions: bold(n.first + ' ' + n.last)}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.captions).toHaveLength(3);
      // All parts should have bold styling
      expect(result.rules[0].apply.captions[0].styles).toEqual(['bold']);
      expect(result.rules[0].apply.captions[1].styles).toEqual(['bold']);
      expect(result.rules[0].apply.captions[2].styles).toEqual(['bold']);
    });

    it('handles plain string literals in captions', () => {
      const result = parseGrass(
        `MATCH (n) APPLY {captions: 'Label: ' + n.value}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.captions[0]).toEqual({ value: 'Label: ' });
      expect(result.rules[0].apply.captions[1]).toEqual({
        value: { property: 'value' },
      });
    });
  });

  describe('Style Property Edge Cases', () => {
    it('handles trailing comma in style map', () => {
      const result = parseGrass(`MATCH (n) APPLY {color: '#fff', size: 10,}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply).toEqual({
        color: '#fff',
        size: 10,
      });
    });

    it('handles hex colors in various formats', () => {
      const result1 = parseGrass(`MATCH (n) APPLY {color: #fff}`);
      expect(result1.errors).toHaveLength(0);
      expect(result1.rules[0].apply.color).toBe('#fff');

      const result2 = parseGrass(`MATCH (n) APPLY {color: #ffffff}`);
      expect(result2.errors).toHaveLength(0);
      expect(result2.rules[0].apply.color).toBe('#ffffff');

      const result3 = parseGrass(`MATCH (n) APPLY {color: #FFFFFF}`);
      expect(result3.errors).toHaveLength(0);
      expect(result3.rules[0].apply.color).toBe('#FFFFFF');
    });

    it('handles captionAlign as string literal', () => {
      // The grammar allows captionAlign: stringLiteral for custom values
      // But current implementation may normalize to keywords
      const result = parseGrass(`MATCH (n) APPLY {captionAlign: 'left'}`);
      expect(result.errors).toHaveLength(0);
      // Parser may normalize string literals that match keywords
      expect(result.rules[0].apply.captionAlign).toBeDefined();
    });

    it('handles color as string literal', () => {
      const result1 = parseGrass(`MATCH (n) APPLY {color: 'red'}`);
      expect(result1.errors).toHaveLength(0);
      expect(result1.rules[0].apply.color).toBe('red');

      const result2 = parseGrass(`MATCH (n) APPLY {color: 'rgb(255, 0, 0)'}`);
      expect(result2.errors).toHaveLength(0);
      expect(result2.rules[0].apply.color).toBe('rgb(255, 0, 0)');
    });

    it('handles decimal numbers in style properties', () => {
      const result = parseGrass(`MATCH (n) APPLY {size: 10.5, width: 2.75}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply).toEqual({
        size: 10.5,
        width: 2.75,
      });
    });

    it('handles zero values in styles', () => {
      const result = parseGrass(`MATCH (n) APPLY {size: 0, captionSize: 0}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply).toEqual({
        size: 0,
        captionSize: 0,
      });
    });

    it('handles all style properties together', () => {
      const result = parseGrass(
        `MATCH (n) APPLY {color: '#ff0000', size: 20, captions: n.name, captionSize: 14, captionAlign: center}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply).toMatchObject({
        color: '#ff0000',
        size: 20,
        captionSize: 14,
        captionAlign: 'center',
      });
    });
  });

  describe('Whitespace and Formatting', () => {
    it('handles minimal whitespace', () => {
      const result = parseGrass(`MATCH(n)APPLY{size:10}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].apply.size).toBe(10);
    });

    it('handles excessive whitespace', () => {
      const result = parseGrass(
        `MATCH   (  n  :  Person  )   WHERE   n.age   >   18   APPLY  {  size  :  10  }`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].match).toEqual({ label: 'Person' });
    });

    it('handles newlines in expressions', () => {
      const result = parseGrass(`MATCH (n:Person)
WHERE n.age > 18
APPLY {
  size: 10,
  color: '#ff0000'
}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].apply).toEqual({
        size: 10,
        color: '#ff0000',
      });
    });

    it('handles tabs and mixed whitespace', () => {
      const result = parseGrass(`MATCH\t(n)\t\tAPPLY\t{size:\t10}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].apply.size).toBe(10);
    });

    it('handles whitespace in WHERE clauses', () => {
      const result = parseGrass(`MATCH (n) WHERE
  n.a = 1
  AND n.b = 2
APPLY {size: 10}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        and: [
          { equal: [{ property: 'a' }, 1] },
          { equal: [{ property: 'b' }, 2] },
        ],
      });
    });
  });

  describe('Performance and Limits', () => {
    it('handles many rules efficiently', () => {
      // Generate 100 rules with semicolons between them
      const rules = Array.from(
        { length: 100 },
        (_, i) => `MATCH (n${i}:Label${i}) APPLY {size: ${i}}`,
      ).join(';\n');

      const result = parseGrass(rules);
      expect(result.errors).toHaveLength(0);
      expect(result.rules).toHaveLength(100);
    });

    it('handles very long property names', () => {
      const longName = 'a'.repeat(1000);
      const result = parseGrass(
        `MATCH (n) WHERE n.${longName} = 'value' APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: longName }, 'value'],
      });
    });

    it('handles very long string literals', () => {
      const longString = 'x'.repeat(10000);
      const result = parseGrass(
        `MATCH (n) WHERE n.name = '${longString}' APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'name' }, longString],
      });
    });

    it('handles deeply nested parentheses', () => {
      // Create a deeply nested expression: ((((n.a = 1))))
      const depth = 20;
      const openParens = '('.repeat(depth);
      const closeParens = ')'.repeat(depth);
      const result = parseGrass(
        `MATCH (n) WHERE ${openParens}n.a = 1${closeParens} APPLY {size: 10}`,
      );
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toEqual({
        equal: [{ property: 'a' }, 1],
      });
    });

    it('handles complex nested boolean with many levels', () => {
      // Test deep nesting without hitting recursion limits
      const result = parseGrass(`MATCH (n) WHERE 
        (((n.a = 1 AND n.b = 2) OR (n.c = 3 AND n.d = 4)) AND 
         ((n.e = 5 AND n.f = 6) OR (n.g = 7 AND n.h = 8)))
        APPLY {size: 10}`);
      expect(result.errors).toHaveLength(0);
      expect(result.rules[0].where).toHaveProperty('and');
    });
  });
});
