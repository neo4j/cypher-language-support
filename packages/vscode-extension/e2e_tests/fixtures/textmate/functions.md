# Functions test

```cypher
RETURN apoc.agg.first(apoc.agg.first([1,3,5]))

CALL some.procedure(function(), other())

RETURN apoc.coll.elements() 
RETURN apoc   . coll . elements()
RETURN `apoc` . coll . `elements`()
RETURN `apoc.coll.elements`()
```
