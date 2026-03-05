# ESM Migration Analysis for cypher-language-support

## Executive Summary

Going fully ESM-only across this monorepo is **not yet feasible** due to the VS Code extension's hard requirement for CommonJS. However, there are meaningful modernization steps we can take today, and a clear path forward as the ecosystem evolves.

---

## The VS Code Extension Blocker

### Current State (March 2026)

**VS Code still requires extensions to use CommonJS.** This has not changed. The tracking issue ([microsoft/vscode#130367](https://github.com/microsoft/vscode/issues/130367), opened August 2021, 138+ comments) remains open and is in the **Backlog** milestone with no ETA.

Key facts:
- VS Code itself migrated to ESM internally in v1.94 (October 2024), gaining significant startup performance
- Extensions are **still loaded as CommonJS** by the extension host
- Setting `"type": "module"` in an extension's `package.json` breaks the extension
- `require.main` is `undefined` since v1.94 (minor breaking change for extensions relying on it)
- The VS Code team has assigned the issue but has not committed to a timeline

### Workaround: CJS Shim Pattern

A known workaround (documented in early 2025) uses a thin CommonJS wrapper:

```javascript
// extension.cjs (entry point for VS Code)
module.exports.activate = async function activate(context) {
  const { activate } = await import('./extension.mjs');
  return activate(context);
};
module.exports.deactivate = async function deactivate() {
  const { deactivate } = await import('./extension.mjs');
  return deactivate();
};
```

**However**, this is risky because:
- It relies on VS Code's Node.js runtime supporting dynamic `import()` from a CJS context
- The `activate` function becomes async in a way VS Code may not fully support
- Error handling and lifecycle management become more complex
- Not officially endorsed by the VS Code team

---

## Current Module System Inventory

### Packages and Their Module Format

| Package | `"type"` field | Builds CJS? | Builds ESM? | Bundler |
|---------|---------------|-------------|-------------|---------|
| `language-support` | `"module"` | Yes (esbuild → `.cjs`) | Yes (tsc) | esbuild + tsc |
| `language-server` | _(none)_ | Yes (esbuild) | No | esbuild |
| `query-tools` | _(none)_ | Yes (tsc) | Yes (tsc) | tsc |
| `react-codemirror` | `"module"` | No | Yes (tsc) | tsc + Vite (tests) |
| `lint-worker` | _(none)_ | Yes (esbuild → `.cjs`) | Yes (esbuild → `.mjs`) | esbuild |
| `vscode-extension` | _(none)_ | Yes (esbuild) | No | esbuild |
| `react-codemirror-playground` | `"module"` | No | Yes (Vite) | Vite |
| `antlr4-c3` (vendor) | `"module"` | Yes (tsc) | Yes (tsc) | tsc |

### TypeScript Configuration

- **Base tsconfig**: `"module": "commonjs"`, `"moduleResolution": "node"`
- Several packages override to `"module": "esnext"` in their own tsconfig
- All source code is written using ES `import`/`export` syntax (no `require()` in source)

### CommonJS-Specific Code Patterns

1. **`__dirname` usage** (won't work in ESM without polyfill):
   - `packages/language-server/src/server.ts` — worker path resolution
   - `packages/language-server/src/linting.ts` — worker path resolution
   - `packages/vscode-extension/src/treeviews/` — SVG resource loading
   - Various test files

2. **Worker pool (workerpool)**: Loads `.cjs` worker files by path using `__dirname`

3. **esbuild conditions**: VS Code extension and language server both use `--conditions=require`

---

## Modernization Options

### Option 1: Full ESM (Not Recommended Today)

Convert everything to ESM, including the VS Code extension.

**Pros:**
- Cleanest architecture, tree-shaking everywhere
- Single module format to maintain

**Cons:**
- VS Code extension would break without the CJS shim workaround
- The shim workaround is fragile and unofficial
- All `__dirname`/`__filename` usage must be replaced with `import.meta.url` + `fileURLToPath`
- `workerpool` may have ESM compatibility issues

**Verdict:** Wait until VS Code officially supports ESM extensions.

### Option 2: ESM-First with CJS Bundled Outputs (Recommended)

Keep source as ESM, continue bundling CJS where needed, but modernize the configuration.

**What this looks like:**

1. **Update base tsconfig** to use modern settings:
   ```json
   {
     "module": "NodeNext",
     "moduleResolution": "NodeNext"
   }
   ```
   This gives proper ESM semantics during type-checking while still allowing CJS output via bundlers.

2. **Add `"type": "module"` to remaining packages** (`language-server`, `query-tools`, `lint-worker`) — their published entry points already use conditional exports with `import`/`require` conditions.

3. **Replace `__dirname` with `import.meta` equivalents** in source code:
   ```typescript
   import { fileURLToPath } from 'node:url';
   import { dirname, join } from 'node:path';
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);
   ```
   Note: This is moot for bundled code (esbuild replaces these), but it's good practice for source.

4. **Simplify dual builds** — some packages produce both CJS and ESM via separate `tsc` invocations. Consider using esbuild for the CJS bundle (as `language-support` already does) to simplify build scripts.

5. **Drop CJS exports from packages that don't need them** — `react-codemirror` already only exports ESM. Evaluate whether other packages truly need CJS consumers.

**Pros:**
- Modernizes configuration without breaking anything
- Reduces maintenance burden of dual builds where possible
- Positions the project to drop CJS easily when VS Code adds ESM support

**Cons:**
- Still maintaining some CJS outputs
- `moduleResolution: "NodeNext"` requires explicit `.js` extensions in imports (significant refactor)

### Option 3: Incremental — Modernize Non-VS-Code Packages Only (Pragmatic)

Only modernize the library packages that don't feed into the VS Code extension.

**Specifically:**
- `react-codemirror` → Already ESM-only, no changes needed
- `react-codemirror-playground` → Already ESM-only (Vite)
- `language-support` → Could drop CJS export if `react-codemirror` is the only ESM consumer (but `language-server` and `vscode-extension` need it via bundler)
- `query-tools` → Keep dual for now (consumed by `language-server` → `vscode-extension`)

**Verdict:** Limited value since the VS Code dependency chain pulls most packages into CJS anyway.

---

## Recommended Approach

**Short-term (now):**
1. Ensure all source code uses ESM syntax (already the case ✅)
2. Add `"type": "module"` to packages missing it where conditional exports already handle CJS consumers
3. Keep esbuild bundling CJS for VS Code extension and language server
4. Consider moving `tsconfig.base.json` from `"moduleResolution": "node"` to `"bundler"` — this is the modern equivalent that works well with esbuild/Vite without requiring `.js` extensions in imports

**Medium-term (when VS Code adds ESM support):**
1. Remove CJS shim from VS Code extension esbuild config (change `format: "cjs"` → `format: "esm"`)
2. Replace `__dirname` usage with `import.meta.url` patterns
3. Drop CJS conditional exports from all packages
4. Set `"type": "module"` everywhere, remove `.cjs`/`.mjs` extensions

**What to watch:**
- [microsoft/vscode#130367](https://github.com/microsoft/vscode/issues/130367) — the canonical tracking issue
- [VS Code ESM discussion #1612](https://github.com/microsoft/vscode-discussions/discussions/1612) — broader migration discussion
- Node.js `require(esm)` stabilization (available since Node 22) — may influence VS Code's approach

---

## Summary

| Question | Answer |
|----------|--------|
| Can we go ESM-only today? | **No** — VS Code extension requires CJS |
| Is the situation improving? | **Yes** — VS Code itself is ESM, Node.js supports `require(esm)` |
| Is there an ETA for VS Code ESM extensions? | **No** — still in Backlog |
| What should we do now? | Modernize tsconfig, keep ESM source + CJS bundles |
| How much work to switch when ready? | **Low** — mostly config changes + `__dirname` replacements |

---

## References

- [VS Code ESM Extension Issue #130367](https://github.com/microsoft/vscode/issues/130367)
- [VS Code ESM Migration Discussion #1612](https://github.com/microsoft/vscode-discussions/discussions/1612)
- [Writing a VS Code extension in ES modules (March 2025)](https://jan.miksovsky.com/posts/2025/03-17-vs-code-extension)
- [VS Code 1.94 ESM migration announcement](https://devclass.com/2024/10/14/vs-code-migration-to-ecmascript-modules-massively-improves-startup-performance-but-extensions-left-behind-for-now/)
