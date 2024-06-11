# Procedures test

```cypher
CALL apoc.periodic.iterate(
  "MATCH (p:Person) RETURN p",
  // Extract `p` variable using list comprehension
  "CALL apoc.nodes.delete([item in $_batch | item.p], size($_batch))",
  {batchMode: "BATCH_SINGLE", batchSize: 100}
)
YIELD batch, operations;

CALL apoc.coll.elements() 
CALL apoc   . coll . elements()
CALL `apoc` . coll . `elements`()
CALL `apoc.coll.elements`()

CALL `apoc.
coll.
elements`()

CALL apoc
.coll
.elements()

CALL `apoc`
.`coll`
.`elements`()
```
