# Parameters test

```cypher
MATCH
   // Test with and without spaces
   // This is here because at some point param maps inside labels where not picked up correctly
   (n:Label {one : $param1, two: $param2, three:$param3}),
   (m:Label {one: $param1})
RETURN $param1, $param2, n, m, {key:$value}
```
