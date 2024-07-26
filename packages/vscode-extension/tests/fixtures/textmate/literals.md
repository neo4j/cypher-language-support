# Literals test

```cypher
// At some point it was colouring the () inside strings,
// which it shouldn't hence why those are included in here
RETURN "double quoted string ()" AS a,
       'single quoted string ()' AS b;


RETURN 5 + 12345 + 3.123 + .123 ;
RETURN TRUE, false, true, false;
```
