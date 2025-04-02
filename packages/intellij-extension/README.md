# Neo4j Cypher LSP support for IntelliJ

## Build and run

Run through the [prerequisites](../../CONTRIBUTING.md#building-the-project).

You can build the plugin from the project root using [`turbo`](https://turbo.build):

```
$ npx turbo neo4j-for-intellij#build
```

`gradle` is also an option (and can be used from within IntelliJ):

```
$ cd packages/intellij-extension && ./gradlew buildPlugin
```

## Develop and test

If you want to test the plugin during a development workflow, you can spin up a temporary copy
of IntelliJ that runs with a freshly built version enabled by default:

```
$ npx turbo neo4j-for-intellij#runIde
```

...this target also exists in `gradle`:

```
$ cd packages/intellij-extension && ./gradlew runIde
```

## Installing the plugin manually

From IntelliJ, open Settings > Plugins > (cog icon) > Install Plugin from disk, and browse to the jar file
located in `packages/intellij-extension/build/distributions`.