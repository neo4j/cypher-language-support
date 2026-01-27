import { describe, it, expect } from 'vitest';
import { parseGrass, stringifyGrass } from './index';
import type { StyleRule } from './grassTypes';

describe('stringifyGrass', () => {
  describe('string escaping', () => {
    it('escapes single quotes in string values', () => {
      const rules: StyleRule[] = [
        {
          match: { label: 'Person' },
          where: { equal: [{ property: 'name' }, "it's quoted"] },
          apply: {},
        },
      ];

      const output = stringifyGrass(rules);
      expect(output).toContain("'it\\'s quoted'");

      // Verify round-trip works
      const reparsed = parseGrass(output);
      expect(reparsed.errors).toHaveLength(0);
      expect(reparsed.rules).toEqual(rules);
    });

    it('escapes backslashes before single quotes', () => {
      // This test illustrates why we need to escape backslashes BEFORE quotes.
      // If a string ends with a backslash, naive quote-only escaping would break:
      // Input: "path\to\" → naive: 'path\to\'' (broken - the \' escapes the quote)
      // Correct: 'path\\to\\' (backslashes escaped first)
      const rules: StyleRule[] = [
        {
          match: { label: 'File' },
          where: { equal: [{ property: 'path' }, 'C:\\Users\\'] },
          apply: {},
        },
      ];

      const output = stringifyGrass(rules);
      expect(output).toContain("'C:\\\\Users\\\\'");

      // Verify round-trip works
      const reparsed = parseGrass(output);
      expect(reparsed.errors).toHaveLength(0);
      expect(reparsed.rules).toEqual(rules);
    });

    it('escapes mixed backslashes and quotes', () => {
      // A string with both backslash and quote: it\'s
      // The backslash becomes \\ and the quote becomes \', giving \\\'
      const rules: StyleRule[] = [
        {
          match: { label: 'Test' },
          where: { equal: [{ property: 'value' }, "it\\'s tricky"] },
          apply: {},
        },
      ];

      const output = stringifyGrass(rules);
      // Verify round-trip works (the escaping must be correct for this to pass)
      const reparsed = parseGrass(output);
      expect(reparsed.errors).toHaveLength(0);
      expect(reparsed.rules).toEqual(rules);
    });

    it('escapes strings in captions', () => {
      const rules: StyleRule[] = [
        {
          match: { label: 'Node' },
          apply: {
            captions: [{ value: "it's a caption" }],
          },
        },
      ];

      const output = stringifyGrass(rules);
      expect(output).toContain("'it\\'s a caption'");

      const reparsed = parseGrass(output);
      expect(reparsed.errors).toHaveLength(0);
      // styles is undefined when empty, so compare without it
      expect(reparsed.rules[0].match).toEqual(rules[0].match);
      expect(reparsed.rules[0].apply.captions?.[0].value).toEqual(
        rules[0].apply.captions?.[0].value,
      );
    });
  });
});
