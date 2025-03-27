import { verifyFormatting } from './testutil';

describe('styleguide examples', () => {
  // NOTE: We do not swap the order of ON MATCH and ON CREATE since
  // we feel that it falls outside the responsbilities of a formatter.
  test('on match indentation example', () => {
    const query = `MERGE (n) ON CREATE SET n.prop = 0
MERGE (a:A)-[:T]->(b:B)
ON MATCH SET b.name = 'you'
ON CREATE SET a.name = 'me'
RETURN a.prop`;
    const expected = `MERGE (n)
  ON CREATE SET n.prop = 0
MERGE (a:A)-[:T]->(b:B)
  ON MATCH SET b.name = 'you'
  ON CREATE SET a.name = 'me'
RETURN a.prop`;
    verifyFormatting(query, expected);
  });

  test('on where exists regular subquery', () => {
    const query = `MATCH (a:A) WHERE EXISTS {MATCH (a)-->(b:B) WHERE b.prop = 'yellow'} RETURN a.foo`;

    const expected = `MATCH (a:A)
WHERE EXISTS {
  MATCH (a)-->(b:B)
  WHERE b.prop = 'yellow'
}
RETURN a.foo`;
    verifyFormatting(query, expected);
  });

  test('on where exists regular simplified subquery', () => {
    const query = `MATCH (a:A)
WHERE EXISTS {
  (a)-->(b:B)
}
RETURN a.prop`;

    const expected = `MATCH (a:A)
WHERE EXISTS { (a)-->(b:B) }
RETURN a.prop`;
    verifyFormatting(query, expected);
  });

  test('Using wrapper space around operators', () => {
    const query = `MATCH p=(s)-->(e)
WHERE s.name<>e.name
RETURN length(p)`;

    const expected = `MATCH p = (s)-->(e)
WHERE s.name <> e.name
RETURN length(p)`;
    verifyFormatting(query, expected);
  });

  test('formats maps properly', () => {
    const query = `WITH { key1 :'value' ,key2  :  42 } AS map RETURN map`;
    const expected = `WITH {key1: 'value', key2: 42} AS map
RETURN map`;
    verifyFormatting(query, expected);
  });

  test('no padding space within function call parentheses', () => {
    const query = `RETURN split( 'original', 'i' )`;
    const expected = `RETURN split('original', 'i')`;
    verifyFormatting(query, expected);
  });

  test('should format call subqueries', () => {
    const query = `UNWIND range(1,100) as _ CALL { MATCH (source:object)
  MATCH (target:object) WITH *, count(target) AS workspaceCount
  WITH * RETURN source, target } RETURN count('*')`;
    const expected = `UNWIND range(1, 100) AS _
CALL {
  MATCH (source:object)
  MATCH (target:object)
  WITH *, count(target) AS workspaceCount
  WITH *
  RETURN source, target
}
RETURN count('*')`;
    verifyFormatting(query, expected);
  });

  test('should format call subqueries with ()', () => {
    const query = `CALL () { RETURN 'hello' AS innerReturn }`;
    const expected = `CALL () {
  RETURN 'hello' AS innerReturn
}`;
    verifyFormatting(query, expected);
  });

  test('no space in label predicates', () => {
    const query = `MATCH (person    : Person  :  Owner  )
RETURN person.name`;
    const expected = `MATCH (person:Person:Owner)
RETURN person.name`;
    verifyFormatting(query, expected);
  });
});

describe('other styleguide recommendations', () => {
  test('order by', () => {
    const query = `RETURN user.id ORDER BY potential_reach, like_count;`;
    const expected = `RETURN user.id ORDER BY potential_reach, like_count;`;
    verifyFormatting(query, expected);
  });

  test('escaped names', () => {
    const query =
      'CREATE (`complex name with special@chars`) RETURN `complex name with special@chars`';
    const expected = `CREATE (\`complex name with special@chars\`)
RETURN \`complex name with special@chars\``;
    verifyFormatting(query, expected);
  });

  test('cases null and booleans properly', () => {
    const query = `WITH NULL as n1, Null as n2, False as f1, True as t1 RETURN NULL, TRUE, FALSE`;
    const expected = `WITH null AS n1, null AS n2, false AS f1, true AS t1
RETURN null, true, false`;
    verifyFormatting(query, expected);
  });

  test('can handle using keyword literal names in weird ways', () => {
    const query1 = 'MATCH (NULL) RETURN NULL';
    const expected1 = `MATCH (NULL)
RETURN null`;
    verifyFormatting(query1, expected1);

    const query2 = 'MATCH (NAN) RETURN NAN';
    const expected2 = `MATCH (NAN)
RETURN NAN`;
    verifyFormatting(query2, expected2);

    const query3 = 'MATCH (INF) RETURN INF';
    const expected3 = `MATCH (INF)
RETURN INF`;
    verifyFormatting(query3, expected3);
  });

  test('puts one space between label/type predicates and property predicates in patterns', () => {
    const query = `MATCH (p:Person{property:-1})-[:KNOWS{since: 2016}]->() RETURN p.name`;
    const expected = `MATCH (p:Person {property: -1})-[:KNOWS {since: 2016}]->()
RETURN p.name`;
    verifyFormatting(query, expected);
  });

  test('no space in patterns', () => {
    const query = 'MATCH (:Person) --> (:Vehicle) RETURN count(*)';
    const expected = `MATCH (:Person)-->(:Vehicle)
RETURN count(*)`;
    verifyFormatting(query, expected);
  });

  test('space after each comma in lists and enumerations', () => {
    const query = `MATCH (),()
WITH ['a','b',3.14] AS list
RETURN list,2,3,4`;
    const expected = `MATCH (), ()
WITH ['a', 'b', 3.14] AS list
RETURN list, 2, 3, 4`;
    verifyFormatting(query, expected);
  });

  test('handles empty list literals', () => {
    const query = `WITH [] AS emptyList RETURN emptyList`;
    const expected = `WITH [] AS emptyList
RETURN emptyList`;
    verifyFormatting(query, expected);
  });

  test('should not add space for negating minuses', () => {
    const query = 'RETURN -1, -2, -3';
    const expected = 'RETURN -1, -2, -3';
    verifyFormatting(query, expected);
  });

  test('parameter casing example', () => {
    const query = `CREATE (N:Label {Prop: 0}) WITH N, RAND()
AS Rand, $pArAm AS MAP RETURN Rand, MAP.property_key, count(N)`;
    const expected = `CREATE (N:Label {Prop: 0})
WITH N, RAND() AS Rand, $pArAm AS MAP
RETURN Rand, MAP.property_key, count(N)`;
    verifyFormatting(query, expected);
  });

  test('union example', () => {
    const query = `CREATE (jj:Person {name: "Jay-jay"})
RETURN count() AS count UNION MATCH (j:Person) WHERE j.name STARTS WITH "J"
RETURN count() AS count`;
    const expected = `CREATE (jj:Person {name: "Jay-jay"})
RETURN count() AS count
  UNION
MATCH (j:Person)
WHERE j.name STARTS WITH "J"
RETURN count() AS count`;
    verifyFormatting(query, expected);
  });

  test('union with ALL example', () => {
    // The docs write this a bit weirdly but I don't agree with it.
    const query = `CALL () {
  MATCH (a:Actor)
  RETURN a.name AS name
UNION
  ALL
  MATCH (m:Movie)
  RETURN m.title AS name
}
RETURN name, count(*) AS count ORDER BY count`;
    const expected = `CALL () {
  MATCH (a:Actor)
  RETURN a.name AS name
    UNION ALL
  MATCH (m:Movie)
  RETURN m.title AS name
}
RETURN name, count(*) AS count ORDER BY count`;
    verifyFormatting(query, expected);
  });

  test('union with DISTINCT example', () => {
    // The docs write this a bit weirdly but I don't agree with it.
    const query = `CALL () {
  MATCH (a:Actor)
  RETURN a.name AS name
UNION 
  DISTINCT
  MATCH (m:Movie)
  RETURN m.title AS name
}
RETURN name, count(*) AS count ORDER BY count`;
    const expected = `CALL () {
  MATCH (a:Actor)
  RETURN a.name AS name
    UNION DISTINCT
  MATCH (m:Movie)
  RETURN m.title AS name
}
RETURN name, count(*) AS count ORDER BY count`;
    verifyFormatting(query, expected);
  });

  test('generic case expression example', () => {
    const query = `MATCH (n:Person)
RETURN CASE
WHEN n.eyes = 'blue' THEN 1
WHEN n.age < 40      THEN 2
ELSE 3
END AS result, n.eyes, n.age`;
    const expected = `MATCH (n:Person)
RETURN
  CASE
    WHEN n.eyes = 'blue' THEN 1
    WHEN n.age < 40 THEN 2
    ELSE 3
  END AS result, n.eyes, n.age`;
    verifyFormatting(query, expected);
  });

  test('case expression with value example', () => {
    const query = `MATCH (n:Person)
RETURN n.name, CASE n.age WHEN = 0, = 1, = 2 THEN "Baby"
WHEN <= 13 THEN "Child"
WHEN < 20 THEN "Teenager"
WHEN < 30 THEN "Young Adult"
WHEN > 1000 THEN "Immortal"
ELSE "Adult"
END AS result`;
    const expected = `MATCH (n:Person)
RETURN n.name,
  CASE n.age
    WHEN = 0, = 1, = 2 THEN "Baby"
    WHEN <= 13 THEN "Child"
    WHEN < 20 THEN "Teenager"
    WHEN < 30 THEN "Young Adult"
    WHEN > 1000 THEN "Immortal"
    ELSE "Adult"
  END AS result`;
    verifyFormatting(query, expected);
  });

  test('should put nested FOREACH on newline', () => {
    const query = `MATCH (u:User)
MATCH (u)-[:USER_EVENT]->(e:Event)
WITH u, e ORDER BY e ASC
WITH u, collect(e) AS eventChain
FOREACH (i IN range(0, size(eventChain) - 2) |
FOREACH (node1 IN [eventChain [i]] |
FOREACH (node2 IN [eventChain [i + 1]] |
MERGE (node1)-[:NEXT_EVENT]->(node2))))`;
    const expected = `MATCH (u:User)
MATCH (u)-[:USER_EVENT]->(e:Event)
WITH u, e ORDER BY e ASC
WITH u, collect(e) AS eventChain
FOREACH (i IN range(0, size(eventChain) - 2) |
  FOREACH (node1 IN [eventChain[i]] |
    FOREACH (node2 IN [eventChain[i + 1]] |
      MERGE (node1)-[:NEXT_EVENT]->(node2)
    )
  )
)`;
    verifyFormatting(query, expected);
  });

  test('puts LIMIT on a new line', () => {
    const query = `CREATE (n)
RETURN n LIMIT 0`;
    const expected = `CREATE (n)
RETURN n
LIMIT 0`;
    verifyFormatting(query, expected);
  });

  test('call with IN CONCURRENT... at the end', () => {
    const query = `MATCH (c:Cuenta)-[:REALIZA]->(m:Movimiento)-[:HACIA]->(c2:Cuenta)
WHERE NOT EXISTS {MATCH (c)-[:TRANSFIERE]->(c2)}
WITH c, c2, count(m) as trxs, avg(m.monto) as avgTrx, sum(m.monto) as totalSum LIMIT 1000
CALL (c, c2, trxs, avgTrx, totalSum) {
    MERGE (c)-[r:TRANSFIERE]->(c2)
    ON CREATE SET r.totalTrx = trxs, r.avgTrx = avgTrx, r.total = totalSum
    ON MATCH SET r.totalTrx = trxs, r.avgTrx = avgTrx, r.total = totalSum
} IN 10 CONCURRENT TRANSACTIONS OF 25 ROWS

;`;
    const expected = `MATCH (c:Cuenta)-[:REALIZA]->(m:Movimiento)-[:HACIA]->(c2:Cuenta)
WHERE NOT EXISTS {
  MATCH (c)-[:TRANSFIERE]->(c2)
}
WITH c, c2, count(m) AS trxs, avg(m.monto) AS avgTrx, sum(m.monto) AS totalSum
LIMIT 1000
CALL (c, c2, trxs, avgTrx, totalSum) {
  MERGE (c)-[r:TRANSFIERE]->(c2)
    ON CREATE SET r.totalTrx = trxs, r.avgTrx = avgTrx, r.total = totalSum
    ON MATCH SET r.totalTrx = trxs, r.avgTrx = avgTrx, r.total = totalSum
} IN 10 CONCURRENT TRANSACTIONS OF 25 ROWS;`;
    verifyFormatting(query, expected);
  });
});
