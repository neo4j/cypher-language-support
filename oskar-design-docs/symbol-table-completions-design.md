# Schema-Aware Completions

Currently all labels and relationship types are suggested regardless of the schemas. We'd like for example: `MATCH (person:Person)-[r:` to only suggest relationships that are valid for Person nodes. To implement the above example, we need:

- Type information (What's the node type that `r` originates from?)
- Schema information (What relationstypes are valid for that `person` node?)

Let's adress them one at a time:

## Type information

We have access to a symbol table from the transpiled semantic analysis, which we use for property key completions, but it has two issues that need to be adressed:

- Speed (It's too slow to be ready in time for the completion)
- Accuracy (It only tells us we have a "Node" not it's labels)

### Speed

Running the semantic analysis can be quite expensive and to keep the editor responsive, we run the semantic analysis in a separate worker thread and we don't kick off a job until the user has stopped typing for ~500ms. This means that a user typing the below example:

```cypher
MATCH (n:Person)-[:
```

will not get completions after `:` that use the symbol table, unless they take a 500ms+ pause in their typing. For codemirror this is built-in behaviour and for VSCode we've implemented it ourselves.

To get an up to date symbol table, we'd need to start a semantic analysis job while the user is still typing. Running the semantic anaylsis for every key stroke will consume a lot of resources and will in most cases not finish computing one table before the new computation start.

Another reason we don't run the semantic analysis until the user has stopped typing, is that we don't want to show outdated warning, many of which only make sense after the user is finished typing (like missing a RETURN for example).

These diverging requirements between linting and the symbol table, makes me think we should crate one thread dedicated to linting and one to get the symbol table. Since we don't want to run the thread to get the symbol table on every keystroke, we need to determine a heuristic on when to kick off a job to get a new symbol table.

This is a good area for experimentation, the first idea that comes to mind for me is to use the fast ANTLR4 parse has found a new variable that's not in the symbol table. We collect variable definitions already in the `collectedVariables` field for use in completion of variables.

Addressing this speed question will also improve the existing use of the symbol table for the property key completions.

### Accuracy

The symbol table currently does not contain label or relation type information, but the core db would like to include them. Greg & Valerio to have a conversation about time lines for that, see slack thread[here](https://neo4j.slack.com/archives/C02JR6LSJ/p1753883403547679).

We can either wait for that to be implemented, or we could cover the most basic cases (single/mulitple label (n:Person:Actor) not label expressions (:A | B) nor variables (MATCH (a:Person) WITH n as b) ourselves. We'd do this by using the existing symbol tables `definitionPosition` field and then traversing our CST to find the label.

### Alternatives to the symbol table

We could implement client-side semantic analysis instead of relying on the transpiled version. This would lead us down a costly road, complex type inference is hard, differences/bugs between our and the main semantic analysis would be very confusing and we would incur significant maintenance costs.

> Realistically this is a non-starter given the complexity of semantic analysis.

Alternatively, we could take a parser only approach, trying to infer the simple cases types from just the CST/AST without semantic analysis by parsing variable definitions directly from syntax and track only simple patterns like `(n:Person)`.

This would likely work for basic cases but would I'd like us to investigate other avenues first, ideally we can get at least the variable definition location and scope rules from the existing symbol table.

## Schema information

### Schemas in Neo4j

For schema-aware completions, we need to know which relationships actually connect which node labels. As Neo4j is (more or less) a schema-less database, there's no strict definition of the graph schema in the database. Procedures that return a "schema" are not give something the user defined up front via configuration, but rather a summary snapshot of what the database looked like at the time. This snapshot can be created by scanning/sampling the database and/or by using the statistics the database keeps for performance reasons.

### What information is needed?

Currently the language support only has access to a flat lists of labels and relationship types, so we'd need information about how these relate to each other. To know how much schema informatino we need, let's first deceide how much context to take into account, take for example below query:

```cypher
MATCH (n1:Person)-[:KNOWS]->(n2:
```

The simplest approach is to only consider outgoing nodes of `:KNOWS` relationship types when completing labels for `n2`. Alternatively, we can take the more hops into account (or an arbitrary lenght path) into account, and given perfect schema information, we may know that there's a relationship that's only valid if the first node is a `:Person`.

The problem with including the full context, is that we'd need to implement a full client side understanding of any given path expression. My suggestion would be that we limit the context to only the previous Label or Relationship type and at most consider a single hop context in the future. This is not only due to the extra complexity, but also because it's it's very hard to know which paths exist in Neo4j (given the challenges around schema in the above section).

For reference, the statistics available look something like this:

```JSON
{
  "nodes": [
    { "count": 173 },
    { "count": 38, "label": "Movie" },
    { "count": 133, "label": "Person" },
    { "count": 1, "label": "Oskar" }
  ],
  "relationships": [
    { "count": 253 },
    { "relationshipType": "ACTED_IN", "count": 172 },
    { "relationshipType": "ACTED_IN", "count": 172, "endLabel": "Movie" },
    { "startLabel": "Person", "relationshipType": "ACTED_IN", "count": 172 },

    { "relationshipType": "DIRECTED", "count": 44 },
    { "relationshipType": "DIRECTED", "count": 44, "endLabel": "Movie" },
    { "startLabel": "Person", "relationshipType": "DIRECTED", "count": 44 },

    { "relationshipType": "PRODUCED", "count": 15 },
    { "relationshipType": "PRODUCED", "count": 15, "endLabel": "Movie" },
    { "startLabel": "Person", "relationshipType": "PRODUCED", "count": 15 },

    { "relationshipType": "WROTE", "count": 10 },
    { "relationshipType": "WROTE", "count": 10, "endLabel": "Movie" },
    { "startLabel": "Person", "relationshipType": "WROTE", "count": 10 },

    { "relationshipType": "FOLLOWS", "count": 3 },
    { "startLabel": "Person", "relationshipType": "FOLLOWS", "count": 3 },
    { "relationshipType": "FOLLOWS", "count": 3, "endLabel": "Person" },

    { "relationshipType": "REVIEWED", "count": 9 },
    { "relationshipType": "REVIEWED", "count": 9, "endLabel": "Movie" },
    { "startLabel": "Person", "relationshipType": "REVIEWED", "count": 9 }
  ]
}
```

This means we can know that `(:Person)-[:DIRECTED]->` exist and that `-[:DIRECTED]->(:Movie)` exist, but it does not guarantee that `(:Person)-[:DIRECTED]->(:Movie)` exists in the general case, as there could be a node in between in `(:Person)-[:DIRECTED]->(:ExtraNode)-[:DIRECTED]->(:Movie)`. This means when looking at a summary of the schema based on the count store, there can be "ghost paths" that don't actually exist in the data.

### What mechanisms to use for getting schema information

For our use cases, I think `db.schema.visualization` will give us what we need. It's everywhere, fast and the drawback of "ghost paths" don't come into play unless we take the path into account for completions. An argument for `apoc.meta.schema` is that it has more data about properties included as well.

**db.schema.visualization()**
An aggregate visualization of the "schema" based on the count store.

- Fast (just using lookups)
- Available everywhere
- All users can run it (no admin priveledges required)
- Has the "Ghost path" problem

**apoc.meta.schema()**

- Samples (1000 nodes by default)
  - This means it may not have 100% accurate data
  - Performance implications of polling the database for node data, rather than doing lookups
- Available on aura, otherwise requires apoc install

**db.stats.retrieve('GRAPH COUNTS')**
Manually retrieves the counts from the count store, which includes all the data in the above example.

- Very detailed information including counts (also includes indexes / constraints as a bonus)
- Admin access required, originally built as a debugging tool for customer support issues (I think).

**Custom queries**

- Available everywhere
- Need work in how to write them, and is essentally re-implementing `apoc.meta.schema`
- Many performance considerations

**Note there may be other procedures that I'm unaware of**

#### Sidenote: Property key schema information

**SHOW CONTRAINTS**
In the future, this may contain information about the graph, as we add constraints about which labels must be connected to which relateionsihps etc. Right now though we can use it to show better completions. Say if a node with label `:Person` must have name, we should complete name with priority.

**db.schema.nodeTypeProperties() and db.schema.relTypeProperties()**
They give an overview of the database, however they do it via a full database scan. This is far too expensive for us to do without explicit user consent.

## Discussion points

- Do we wait for labels / rels or try out my tree walking suggestion?
- Single vs Multihop context
- `db.schema.visualization` vs. `apoc.meta.schema`
