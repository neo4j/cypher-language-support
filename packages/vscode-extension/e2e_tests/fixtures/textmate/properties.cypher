MATCH p = allShortestPaths((u1)-[:PURCHASE*..5]->(u2))
WITH
    reduce(output = [], n IN relationships(p) | output + n.create_time.epochMillis ) as relsDate
RETURN relsDate, nodes.foo.bar