# Performance Optimization Ideas

Beyond the planned tsgo / oxlint / oxfmt migrations, here are additional
opportunities identified from analyzing the repo's build system, CI pipeline,
dependencies, and TypeScript configuration.

---

## 1. CI: Smarter Build Caching (quick win)

**File:** `.github/actions/setup-and-build/action.yaml`

The build cache currently keys on exact `github.sha` with no fallback. A cache
miss means a full rebuild from scratch. Adding a fallback restore key would let
CI reuse the closest recent build and only do incremental work:

```yaml
restore-keys: |
  build-${{ github.sha }}
  build-                     # ← falls back to most recent build
```

This alone can save 2-4 minutes on every PR commit that isn't identical to a
previous one.

---

## 2. CI: Cache the ANTLR JAR (quick win)

**File:** `.github/actions/setup-and-build/action.yaml`

Every CI run downloads `antlr-4.13.0-complete.jar` from the internet. This
~2 MB download should be cached:

```yaml
- name: Cache ANTLR JAR
  uses: actions/cache@v4
  with:
    path: antlr4.jar
    key: antlr-4.13.0

- name: Setup antlr
  if: steps.cache-antlr.outputs.cache-hit != 'true'
  run: curl https://www.antlr.org/download/antlr-4.13.0-complete.jar --output antlr4.jar
```

---

## 3. CI: Run lint + test + e2e in parallel with build (quick win)

**File:** `.github/workflows/ci.yaml`

Currently `lint-and-format`, `unit-test`, and all e2e jobs `needs: build`. But
the `setup-and-build` composite action already runs in each job (and hits the
cache). These jobs can run without `needs: build` and just rely on the cache
restore, turning the pipeline from serial into fully parallel. Even if the cache
misses for the first job, the second+ jobs will hit it.

---

## 4. CI: Standardize NODE_OPTIONS memory (quick win)

`setup-and-build/action.yaml` sets `--max_old_space_size=4096` while
`ci.yaml` sets `8192`. Pick one value (4096 is likely fine with esbuild doing
the heavy bundling) and set it in one place.

---

## 5. Avoid triple `tsc` invocations in query-tools and antlr4-c3 (medium)

**Files:** `packages/query-tools/package.json`, `vendor/antlr4-c3/package.json`

Both packages run `tsc` three times (ESM, CJS, types):

```json
"build-esm": "tsc --module esnext --outDir dist/esm",
"build-commonjs": "tsc --module commonjs --outDir dist/cjs",
"build-types": "tsc --emitDeclarationOnly --outDir dist/types"
```

**Option A:** Use esbuild for ESM + CJS (like language-support and lint-worker
already do) and a single `tsc --emitDeclarationOnly` for types. This cuts build
time by ~60% for these packages.

**Option B:** Use `tsc --module esnext` once and convert to CJS with esbuild.
One type-check instead of three.

---

## 6. Skip source maps in production builds (quick win)

**File:** `tsconfig.base.json`

`sourceMap: true` is set globally. The esbuild steps that produce production
bundles already control their own source map settings. Setting
`sourceMap: false` in the base config (or per-package for production) avoids
generating `.js.map` files that are never shipped, saving I/O during `tsc`.

The VSCode extension esbuild config already disables sourcemaps for production
(`sourcemap: !production`), but the tsc step before it still generates them.

---

## 7. Use `isolatedDeclarations` (medium — requires TS 5.5+)

**File:** `tsconfig.base.json`

With TypeScript 5.5+ (you're on 5.8.3), enabling `isolatedDeclarations: true`
lets tools like tsgo and esbuild generate `.d.ts` files without a full
type-check pass. This is the single biggest unlock for fast declaration
generation and pairs perfectly with a tsgo migration.

This requires adding explicit return types to exported functions, but the
TypeScript compiler will report exactly which ones need annotation.

---

## 8. Eliminate the vendored antlr4-c3 copy step (medium)

**File:** `packages/language-support/package.json`

The build does:
```
cp -r ../../vendor/antlr4-c3/dist/esm dist/esm/vendor/antlr4-c3/dist/
```

This copies the vendor build output into language-support's dist at a specific
path. Instead, configure the tsconfig `paths` or package.json `exports` so that
the dependency resolves through pnpm's workspace linking. This removes a
fragile, slow copy step and simplifies the build graph.

---

## 9. Deduplicate lintWorker file copies (medium)

**Files:** Multiple package.json scripts

The `lintWorker` bundle gets copied around to three locations:
- `react-codemirror/dist/src/lang-cypher/lintWorker.mjs`
- `react-codemirror/src/lang-cypher/lintWorker.mjs` (checked into src!)
- `vscode-extension/dist/lintWorker.cjs`

Consider making lint-worker a proper runtime dependency that gets resolved at
import time rather than copied at build time. If that's not possible (e.g.
worker thread constraints), at least remove the copy into `src/`.

---

## 10. Replace `lodash.debounce` with a tiny inline (quick win)

**Packages:** language-server, react-codemirror

`lodash.debounce` pulls in the full lodash internal dependency tree at
install time. A 10-line debounce utility (or the native `scheduler` API) would
eliminate the dependency entirely. The react-codemirror package also has the
full `lodash` package in devDeps.

---

## 11. Investigate the 4.9 MB `semanticAnalysis.js` blob (medium)

**File:** `packages/language-support/src/syntaxValidation/semanticAnalysis.js`

This is a 4.9 MB minified JavaScript file compiled from Java (likely via TeaVM).
It's copied as-is into the ESM build output and gets bundled into the language
server and VS Code extension. At nearly 5 MB it dominates the bundle size.

Ideas:
- **Compress + lazy-load:** gzip the file and decompress at first use (~1 MB
  compressed).
- **Move to WASM:** If the Java source is available, compile to WASM instead —
  typically smaller and faster.
- **Lazy-import:** If semantic analysis isn't needed immediately on editor open,
  defer loading it until after the first parse completes.

---

## 12. Evaluate switching from `antlr4` JS runtime to a WASM parser (long-term)

The `antlr4` npm package (used at runtime for parsing Cypher) is a large,
general-purpose JS parser runtime. For a language with a stable grammar, a
purpose-built WASM parser (e.g. tree-sitter-cypher or a Rust-based parser
compiled to WASM) would be significantly faster at parse time and smaller in
bundle size. This is a large effort but would have the biggest impact on
end-user latency in the editor.

---

## 13. Add `sideEffects: false` to query-tools (quick win)

**File:** `packages/query-tools/package.json`

`language-support`, `lint-worker`, and `react-codemirror` all have
`"sideEffects": false` to enable tree-shaking. `query-tools` is missing it.

---

## 14. Use Vitest workspace-level `run` more aggressively (quick win)

**File:** `vitest.workspace.ts`

Currently `pnpm test` runs `vitest run` per-package via pnpm's `--recursive
--parallel`. Using `vitest --workspace` from the root would let Vitest share
setup overhead, reuse the module graph, and provide a single summary. This can
cut 2-5s of startup overhead per package.

---

## 15. Pin the lint-worker's old language-support dependency (cleanup)

**File:** `packages/lint-worker/package.json`

```json
"languageSupport-next.13": "npm:@neo4j-cypher/language-support@2.0.0-next.13"
```

This pins an old published version alongside the `workspace:*` current version.
If it's still needed for multi-version linting, consider lazy-loading it. If
not, removing it shrinks install time and avoids bundling duplicate parser code.

---

## Summary by Effort

| Effort     | Items |
|------------|-------|
| Quick wins | 1, 2, 3, 4, 6, 10, 13, 14 |
| Medium     | 5, 7, 8, 9, 11, 15 |
| Long-term  | 12 |
