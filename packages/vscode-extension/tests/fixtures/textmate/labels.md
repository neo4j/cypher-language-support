# Labels test

```cypher
MATCH
(n:Label), 
(m:Label1&Label2), (k:(Label1 | (Label2&Label3 & !Label4)));

MATCH (n:(AAA & (BBB & CCC) | AAA), (m: Label1&Label2), (k:Label1|Label2&Label3);

MATCH (n:(`AAA` & (`BBB & CCC`) | AAA)), (m: (AAA | (BBB & CCC) | DDD)) RETURN n

MATCH (n: AAA : BBB : CCC)

```
