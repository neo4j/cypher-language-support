# Complex match test

```cypher
/* This is a
multiline comment
*/
MATCH (u1:CommerceUser{user_id:$seller_id}),
      (u2:CommerceUser{user_id:$customer_id}),
    p = allShortestPaths((u1)-[:PURCHASE*..10]->(u2))
WHERE u1 <> u2
WITH
    // This is a single line comment
    reduce(output = [], n IN relationships(p) | output + n.create_time.epochMillis ) as relsDate,
    reduce(output = [], n IN nodes(p) | output + n ) as nodes,
    "double quoted string" as a,
    'single quoted string' as b
RETURN relsDate, nodes
LIMIT $limit
```
