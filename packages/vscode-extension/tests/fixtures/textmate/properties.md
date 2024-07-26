# Properties test

```cypher
MATCH p = (u1)-[]->(u2)
WHERE u1.foo.bar = 5 AND u2.foo = TRUE
WITH
    reduce(output = [], n IN relationships(p) | output + n.create_time.epochMillis ) as relsDate

// Note we want the .nodes and the .reduce to be coloured
// as variables, not keywords
RETURN relsDate, u1.nodes.reduce
```
