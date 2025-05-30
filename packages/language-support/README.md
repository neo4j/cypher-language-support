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

## Cypherfmt CLI

This package includes a command-line tool for formatting Cypher queries using `cypherfmt`. After installation, you can use it via the `cypherfmt` command:

```bash
# Format a file and output to stdout
cypherfmt file.cy

# Format a file in place
cypherfmt -i file.cy

# Check if a file is formatted correctly
cypherfmt -c file.cy

# Format all .cy, .cyp, and .cypher files in a directory recursively
cypherfmt directory/

# Format input from stdin
cat file.cy | cypherfmt
```

For more information, run `cypherfmt --help`.
