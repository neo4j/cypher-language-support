# Call subquery tests

```cypher
CALL {
  CALL {
      UNWIND range(1,4) AS direction
      MATCH p = (start:Cell)(()-[r WHERE r.direction = direction]->()){4}(end)
      OPTIONAL MATCH (before_start)-[r0]->(start)
          WHERE r0.direction = direction
      OPTIONAL MATCH (end)-[r5]->(after_end)
          WHERE r5.direction = direction
      RETURN p, before_start, start, end, after_end, direction
  } // -- all valid paths
}
```
