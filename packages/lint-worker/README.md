# Lint Worker

The Cypher lint worker is used in both the language server and react-codemirror. It is a Javascript worker file used to run linting in parallel with other functionality. 

The majority of the logic comes from the transpiled (with TeaVM) semanticAnalysis.js file. Since the TeaVM 0.13.0 update, the bundle minification is broken for older versions of esbuild. >= 0.27.0 works

Every month in sync with neo4j server releases one of these is created as part of our monthly artifact update (see [this workflow](https://github.com/neo4j/cypher-language-support/blob/main/.github/workflows/fetch-dev-artifacts.yaml)) + npm releases workflow. 

Since version 2025.09 the linter also produces our symbol tables, used to provide information such as variable type and node label for completions, hover information etc.

For compatibility with the vscode API the worker is compiled to CommonJS and for react-codemirror it is compiled to ESM.