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
    expect(result.errors[0].message).toContain('Multiple labels in MATCH are not supported');
    expect(result.errors[0].message).toContain('WHERE n:Actor');
    expect(result.rules).toHaveLength(0);
  });

  it('returns error for multiple labels without variable', () => {
    const result = parseGrass(`MATCH (:Person:Actor) APPLY {size: 10}`);
    
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('Multiple labels in MATCH are not supported');
    expect(result.rules).toHaveLength(0);
  });

  it('returns error for three or more labels', () => {
    const result = parseGrass(`MATCH (n:Person:Actor:Employee) APPLY {size: 10}`);
    
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('Multiple labels in MATCH are not supported');
    expect(result.errors[0].message).toContain('WHERE n:Actor');
    expect(result.rules).toHaveLength(0);
  });
});
