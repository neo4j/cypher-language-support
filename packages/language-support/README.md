# Language Support

This package contains the core language support features for Cypher built with ANTLR4.

## Usage

The API is not yet properly documented, but here are two simple examples of what you can do!

`npm install @neo4j-cypher/language-support@next`

```typescript
import {
  autocomplete,
  validateSyntax,
  DbSchema,
} from '@neo4j-cypher/language-support';

const schema: DbSchema = { labels: ['Person'] };

autocomplete('MATCH (n:', schema); // yields CompletionItem[] containing "Person"

validateSyntax('RETRN 123', schema); // yields SyntaxDiagnostic[] with Invalid keyword, did you mean RETURN?
```
