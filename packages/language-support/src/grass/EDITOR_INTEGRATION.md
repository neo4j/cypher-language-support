# Grass DSL - Editor Integration

This document outlines what's needed for full editor support (syntax highlighting, completions, linting) for the Grass style DSL.

## Current State

- ✅ Parser merged into `CypherCmdParser.g4`
- ✅ Lexer tokens added to `CypherCmdLexer.g4`
- ✅ Token types registered in `lexerSymbols.ts`
- ⏳ Completions need configuration
- ⏳ Syntax highlighting uses shared tokens (mostly works)

---

## Syntax Highlighting

### What Works Now

Grass already benefits from shared Cypher tokens:

- Keywords (`MATCH`, `WHERE`, `AND`, `OR`, `NOT`, etc.)
- Literals (`STRING_LITERAL1/2`, `UNSIGNED_DECIMAL_INTEGER`, `DECIMAL_DOUBLE`)
- Operators (`EQ`, `NEQ`, `LT`, `GT`, `LE`, `GE`)
- Brackets and punctuation
- Boolean values (`TRUE`, `FALSE`, `NULL`)

### What Needs Work

The new Grass-specific keywords need highlighting configuration in the editor:

| Token                                     | Type    | Notes                      |
| ----------------------------------------- | ------- | -------------------------- |
| `APPLY`                                   | keyword | Grass style application    |
| `BOLD`, `ITALIC`, `UNDERLINE`             | keyword | Caption styling functions  |
| `SIZE`, `WIDTH`, `COLOR`                  | keyword | Style properties           |
| `CAPTIONS`, `CAPTIONSIZE`, `CAPTIONALIGN` | keyword | Caption properties         |
| `TOP`, `BOTTOM`, `CENTER`                 | keyword | Alignment values           |
| `HEX_COLOR`                               | literal | `#rrggbb` or `#rgb` format |

### Implementation Steps

1. **Already done in `lexerSymbols.ts`:**

   ```typescript
   export const lexerGrassKeywords = [
     CypherLexer.APPLY, CypherLexer.BOLD, CypherLexer.ITALIC, ...
   ];
   ```

2. **For VS Code / Monaco**: The `lexerSymbols` are used by the syntax highlighting system. No additional work needed if your editor reads from `lexerSymbols`.

3. **For other editors**: Export the token lists and map to your editor's highlighting categories.

---

## Autocompletion

### Integration Points

The `antlr4-c3` completion engine needs configuration to provide schema-aware completions.

### Required Changes in `completionCoreCompletions.ts`

Add grass rules to `preferredRules`:

```typescript
codeCompletion.preferredRules = new Set<number>([
  // ... existing rules ...

  // Grass completions (add these)
  CypherParser.RULE_grassLabelName, // -> suggest node labels
  CypherParser.RULE_grassRelTypeName, // -> suggest relationship types
  // Note: propertyKeyName is already handled by Cypher's existing rule
]);
```

### Completion Scenarios

| Context           | What to suggest      | Source                                                            |
| ----------------- | -------------------- | ----------------------------------------------------------------- |
| `MATCH (n:│`      | Node labels          | `dbSchema.labels`                                                 |
| `MATCH [r:│`      | Relationship types   | `dbSchema.relationshipTypes`                                      |
| `WHERE n.│`       | Property keys        | `dbSchema.propertyKeys` (already uses Cypher's `propertyKeyName`) |
| `APPLY {│`        | Style property names | Static list: `color`, `size`, `width`, `captions`, etc.           |
| `captionAlign: │` | Alignment values     | Static list: `top`, `bottom`, `center`                            |
| `:style │`        | `RESET` or `MATCH`   | Grammar tokens                                                    |

### Implementation Steps

1. **Label/RelType completions** - In `completionCoreCompletions.ts`, add handler for `grassLabelName` and `grassRelTypeName`:

```typescript
// In the ruleCompletions handler:
case CypherParser.RULE_grassLabelName:
  return allLabelCompletions(dbSchema);

case CypherParser.RULE_grassRelTypeName:
  return allReltypeCompletions(dbSchema);
```

2. **Style property completions** - Add static completions for style properties:

```typescript
const grassStyleProperties = [
  { label: 'color', kind: CompletionItemKind.Property },
  { label: 'size', kind: CompletionItemKind.Property },
  { label: 'width', kind: CompletionItemKind.Property },
  { label: 'captions', kind: CompletionItemKind.Property },
  { label: 'captionSize', kind: CompletionItemKind.Property },
  { label: 'captionAlign', kind: CompletionItemKind.Property },
];
```

3. **Property completions** - Already works via Cypher's `propertyKeyName` rule

---

## Linting / Validation

### Currently Working

- Syntax errors (missing `APPLY`, invalid tokens, etc.)
- Path pattern errors ("Grass does not support paths")
- Multi-label pattern errors
- Null comparison warnings

### Future Enhancements

| Feature                  | Description                      | Priority |
| ------------------------ | -------------------------------- | -------- |
| Unknown label warning    | Warn if label not in schema      | Medium   |
| Unknown property warning | Warn if property not in schema   | Medium   |
| Invalid color format     | Validate hex colors              | Low      |
| Numeric range validation | Validate size/width are positive | Low      |

---

## Testing

Placeholder tests exist in `grassCompletion.test.ts`. Enable them as completion features are implemented:

```typescript
describe('Grass DSL Completions', () => {
  test.todo('completes labels inside node pattern');
  test.todo('completes relationship types');
  test.todo('completes style properties inside APPLY');
  // ...etc
});
```

---

## Summary

| Feature                    | Status             | Work Needed            |
| -------------------------- | ------------------ | ---------------------- |
| Syntax highlighting        | ✅ Mostly working  | Minor token mapping    |
| Label completions          | ⏳ Not connected   | Add rule handler       |
| RelType completions        | ⏳ Not connected   | Add rule handler       |
| Property completions       | ✅ Works           | Uses Cypher's rule     |
| Style property completions | ⏳ Not implemented | Add static list        |
| Syntax validation          | ✅ Working         | None                   |
| Semantic validation        | ⏳ Basic           | Schema checks optional |
