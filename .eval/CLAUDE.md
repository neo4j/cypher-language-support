See @README.md for the package layout and @package.json for root scripts.

## Tooling — these are non-standard

- Linter: **`oxlint`** (not eslint). Formatter: **`oxfmt`** (not prettier).
  Never reach for eslint/prettier configs.
- Package manager: **pnpm** with workspaces. Use `pnpm --filter <name>` to
  scope commands to one package.

## Read every package.json on boot

Each package under `packages/` has its own test suite and scripts —
they're not uniform (some are vitest, others aren't). On the first
turn of a session, read every `packages/*/package.json` to learn the
dependency tree, available scripts, and per-package test commands.
Don't assume.

## Run tests innermost-out

There are dependency cycles between packages. When iterating on
failures, start with the deepest affected package's tests and only
widen outward once it's green. Use the dependency tree from the
package.jsons to decide what "innermost" means. Prefer
`pnpm --filter @neo4j-cypher/<name> <script>` over the root
`pnpm test` on every iteration — it's slower and makes attribution
harder.

## Relative imports must end in `.js`

In `packages/language-support`, `packages/query-tools`,
`packages/lint-worker`, and `vendor/antlr4-c3`, **all relative imports
must use `.js` extensions** (ESM requirement, even for `.ts` source).
The `check-imports` script and pre-commit hooks enforce this.

## Large generated files — do not read whole, exclude from diffs

These are auto-generated/transpiled. Never `Read` them without
`offset`/`limit`, and exclude them when reviewing PRs:

- `packages/language-support/src/syntaxValidation/semanticAnalysis.js`
  — ~14k lines, TeaVM-transpiled from the `neo4j/` Java repo.
- `packages/language-support/src/generated-parser/**` — ANTLR output;
  `CypherCmdParser.ts` alone is ~56k lines.

For PR review, default to:
`gh pr diff <n> -- ':!**/semanticAnalysis.js' ':!**/generated-parser/**' ':!pnpm-lock.yaml' ':!**/CHANGELOG.md'`

## ANTLR grammar

Grammar lives in `packages/language-support/src/antlr-grammar/`. After
editing a `.g4` file, regenerate with:
`pnpm --filter @neo4j-cypher/language-support gen-parser`
(requires `antlr4` and Java.)

`pnpm build` also needs `antlr4` on `$PATH`. If it isn't installed,
bootstrap with:

```bash
if ! command -v antlr4 >/dev/null 2>&1; then
  curl -fsSL https://www.antlr.org/download/antlr-4.13.0-complete.jar -o /tmp/antlr4.jar \
    || curl -fsSL https://repo1.maven.org/maven2/org/antlr/antlr4/4.13.0/antlr4-4.13.0-complete.jar \
       -o /tmp/antlr4.jar
  mkdir -p "$HOME/.local/bin"
  printf '#!/bin/bash\nexec java -jar /tmp/antlr4.jar "$@"\n' > "$HOME/.local/bin/antlr4"
  chmod +x "$HOME/.local/bin/antlr4"
  export PATH="$HOME/.local/bin:$PATH"
fi
```

## Cypher analysis pipeline

`semanticAnalysis.js` is transpiled output, not hand-written.
Source of truth lives in `~/work/neo4j/` (Java). It's regenerated and
imported here via monthly `neo4j-browser-bot` PRs titled
"Automated update of artifacts to neo4j version YYYY.MM.0" — the huge
diff in those PRs is expected.

## Changesets

Any change to a public export of `@neo4j-cypher/language-support`,
`@neo4j-cypher/react-codemirror`, or `@neo4j-cypher/query-tools` needs
a fresh changeset under `.changeset/`. A pre-existing changeset on the
branch doesn't necessarily cover later commits — verify it describes
the current diff.
