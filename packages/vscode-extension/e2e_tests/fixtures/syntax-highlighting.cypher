MATCH (u1:CommerceUser{user_id:$seller_id}),
      (u2:CommerceUser{user_id:$customer_id}), 
    p = allShortestPaths((u1)-[:PURCHASE*..{{depth}}]->(u2))
WHERE u1 <> u2
WITH 
    reduce(output = [], n IN relationships(p) | output + n.create_time.epochMillis ) as relsDate,
    reduce(output = [], n IN nodes(p) | output + n ) as nodes

RETURN relsDate, nodes 
LIMIT $limit