# Lint Worker

This package contains the Cypher lint worker used in both the language server and react-codemirror. For compatability with the vscode API it is compiled to CommonJS and for react-codemirror it is compiled to ESM.

Since the TeaVM 0.13.0 update, the bundle minification is broken for older versions of esbuild. >= 0.27.0 works