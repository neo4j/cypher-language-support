# Neo4j Cypher LSP support for IntelliJ

## Build and run

Run through the [prerequisites](../../CONTRIBUTING.md#building-the-project).

You can choose to build the plugin via `gradle`:

```
intellij-extension$ ./gradlew buildPlugin
```

Or you can use [`turbo`](https://turbo.build) from the project root:

```
cypher-language-support$ npx turbo build:intellij
```

## Manual testing

If you want to test the plugin during a development workflow, you can spin up a temporary copy
of IntelliJ right from within the project. Simply run either the gradle target directly:

```
intellij-extension$ ./gradlew runIde
```

Or, from the project root:

```
cypher-language-support$ npx turbo run:intellij
```

## Installing the plugin

From IntelliJ, open Settings > Plugins > (cog icon) > Install Plugin from disk, and browse to the jar file
located in `packages/intellij-extension/build/distributions`.