/*
 * This file is a WIP of the next iteration of the cypher-formatter.
 * It's being kept as a separate file to enable having two separate version at once
 * since it would be difficult to consolidate the new and the old version
 */

import { MAX_COL } from '../../formatting/formattingHelpersv2';
import { formatQuery } from '../../formatting/formattingv2';
import { standardizeQuery } from '../../formatting/standardizer';

function verifyFormatting(query: string, expected: string): void {
  const formatted = formatQuery(query);
  expect(formatted).toEqual(expected);
  const queryStandardized = standardizeQuery(query);
  const formattedStandardized = standardizeQuery(formatted);
  if (formattedStandardized !== queryStandardized) {
    throw new Error(
      `Standardized query does not match standardized formatted query`,
    );
  }
}

describe('styleguide examples', () => {
  test('on match indentation example', () => {
    const query = `MERGE (n) ON CREATE SET n.prop = 0
MERGE (a:A)-[:T]->(b:B)
ON MATCH SET b.name = 'you'
ON CREATE SET a.name = 'me'
RETURN a.prop`;
    const expected = `MERGE (n)
  ON CREATE SET n.prop = 0
MERGE (a:A)-[:T]->(b:B)
  ON CREATE SET a.name = 'me'
  ON MATCH SET b.name = 'you'
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

describe('should not forget to include all comments', () => {
  test('property comments', () => {
    const propertycomments = `match (n)
return n. // comment
prop`;
    // Explicitly keep property access in the same chunk as its owner
    const expected = `MATCH (n)
RETURN n.prop // comment`;
    verifyFormatting(propertycomments, expected);
  });

  // TODO: Does not work yet since the long comment goes on a new line
  //  test('basic inline comments', () => {
  //    // Whitespace after the comment lines is intentional. It should be removed
  //    const inlinecomments = `
  //MERGE (n) ON CREATE SET n.prop = 0 // Ensure 'n' exists and initialize 'prop' to 0 if created
  //MERGE (a:A)-[:T]->(b:B)           // Create or match a relationship from 'a:A' to 'b:B'
  //ON MATCH SET b.name = 'you'       // If 'b' already exists, set its 'name' to 'you'
  //ON CREATE SET a.name = 'me'       // If 'a' is created, set its 'name' to 'me'
  //RETURN a.prop                     // Return the 'prop' of 'a'
  //`;
  //    const expected = `MERGE (n)
  //  ON CREATE SET n.prop = 0 // Ensure 'n' exists and initialize 'prop' to 0 if created
  //MERGE (a:A)-[:T]->(b:B) // Create or match a relationship from 'a:A' to 'b:B'
  //  ON CREATE SET a.name = 'me' // If 'a' is created, set its 'name' to 'me'
  //  ON MATCH SET b.name = 'you' // If 'b' already exists, set its 'name' to 'you'
  //RETURN a.prop // Return the 'prop' of 'a'`;
  //    verifyFormatting(inlinecomments, expected);
  //  });

  test('comments before the query', () => {
    const inlinecommentbefore = `// This is a comment before everything
MATCH (n) return n`;
    const expected = `// This is a comment before everything
MATCH (n)
RETURN n`;
    verifyFormatting(inlinecommentbefore, expected);

    const multilinecommentbefore = `/* This is a comment before everything
And it spans multiple lines */
MATCH (n) return n`;
    const expected2 = `/* This is a comment before everything
And it spans multiple lines */
MATCH (n)
RETURN n`;
    verifyFormatting(multilinecommentbefore, expected2);
  });

  test('weird inline comments', () => {
    const inlinemultiline = `MERGE (n) /* Ensuring the node exists */ 
  ON CREATE SET n.prop = 0 /* Set default property */
MERGE (a:A) /* Create or match 'a:A' */ 
  -[:T]-> (b:B) /* Link 'a' to 'b' */
RETURN a.prop /* Return the property of 'a' */
`;
    const expected = `MERGE (n) /* Ensuring the node exists */
  ON CREATE SET n.prop = 0 /* Set default property */
MERGE (a:A) /* Create or match 'a:A' */
      -[:T]->(b:B) /* Link 'a' to 'b' */
RETURN a.prop /* Return the property of 'a' */`;
    verifyFormatting(inlinemultiline, expected);
  });

  test('multiple comments after one token', () => {
    const query = `MATCH (n) // comment1
// comment2
/* comment3 */
// comment4
// comment5
RETURN n`;
    const expected = `MATCH (n) // comment1
// comment2
/* comment3 */
// comment4
// comment5
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('multiple comments before one token', () => {
    const query = `// Comment 1
/* Comment 2 */
// Comment 3
/* Comment 4*/
MATCH (n)
RETURN n`;
    const expected = `// Comment 1
/* Comment 2 */
// Comment 3
/* Comment 4*/
MATCH (n)
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('weird inline and multiline comments', () => {
    const inlineandmultiline = `MERGE (n) // Ensure node exists
ON CREATE SET n.prop = 0 /* Default value */
/* Match or create a relationship
   and update properties as needed */    
MERGE (a:A) -[:T]-> (b:B)
ON CREATE SET a.name='me'// Name set during creation
ON MATCH SET b.name='you' /* Update name if matched */
RETURN a.prop// Output the result`;
    const expected = `MERGE (n) // Ensure node exists
  ON CREATE SET n.prop = 0 /* Default value */
  /* Match or create a relationship
   and update properties as needed */
MERGE (a:A)-[:T]->(b:B)
  ON CREATE SET a.name = 'me' // Name set during creation
  ON MATCH SET b.name = 'you' /* Update name if matched */
RETURN a.prop // Output the result`;
    verifyFormatting(inlineandmultiline, expected);
  });

  test('should not put the second comment on the previous line', () => {
    const query = `
RETURN 1,
// Comment
       2,
// Second comment
       3`;
    const expected = `
RETURN 1,
// Comment
       2,
// Second comment
       3`.trim();
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
RETURN CASE
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
RETURN n.name, CASE n.age
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

describe('various edgecases', () => {
  test('Should be space in between', () => {
    const query = 'Call call';
    const expected = 'CALL call';
    verifyFormatting(query, expected);
  });

  test('multiple queries', () => {
    const multiquery = 'RETURN 1; RETURN 2; RETURN 3;';
    const expectedMultiquery = `RETURN 1;
RETURN 2;
RETURN 3;`;
    verifyFormatting(multiquery, expectedMultiquery);
  });

  test('should not add space for parameter access', () => {
    const query = 'RETURN $param';
    const expected = 'RETURN $param';
    verifyFormatting(query, expected);
  });

  test('apoc call, namespaced function', () => {
    const query = `RETURN apoc.text.levenshteinSimilarity("Neo4j", "Neo4j") AS output;`;
    const expected = `RETURN apoc.text.levenshteinSimilarity("Neo4j", "Neo4j") AS output;`;
    verifyFormatting(query, expected);
  });

  test('function calls with one or more args', () => {
    const query1 = `RETURN split('original')`;
    const expected1 = `RETURN split('original')`;
    verifyFormatting(query1, expected1);
    const query2 = `RETURN split('original', 'i')`;
    const expected2 = `RETURN split('original', 'i')`;
    verifyFormatting(query2, expected2);
    const query3 = `RETURN coalesce('original', 'i', 'j', 'k')`;
    const expected3 = `RETURN coalesce('original', 'i', 'j', 'k')`;
    verifyFormatting(query3, expected3);
  });

  test('test for function invocation', () => {
    const query = `MATCH (n)
RETURN count( DISTINCT   n,a )`;
    const expected = `MATCH (n)
RETURN count(DISTINCT n, a)`;
    verifyFormatting(query, expected);
  });

  test('map projections', () => {
    const query = `RETURN this {.id,.title} AS this`;
    const expected = `RETURN this {.id, .title} AS this`;
    verifyFormatting(query, expected);
  });

  test('path length with specific length', () => {
    const query = `MATCH (p:Person)-[r:LOVES*5]-()
RETURN e`;
    const expected = `MATCH (p:Person)-[r:LOVES*5]-()
RETURN e`;
    verifyFormatting(query, expected);
  });

  test('path length with different length ranges', () => {
    const fromquery = `MATCH (p:Person)-[r:LOVES*1..]-()
RETURN e`;
    const fromexpected = `MATCH (p:Person)-[r:LOVES*1..]-()
RETURN e`;
    const toquery = `MATCH (p:Person)-[r:LOVES*..10]-()
RETURN e`;
    const toexpected = `MATCH (p:Person)-[r:LOVES*..10]-()
RETURN e`;
    const bothquery = `MATCH (p:Person)-[r:LOVES*1..10]-()
RETURN e`;
    const bothexpected = `MATCH (p:Person)-[r:LOVES*1..10]-()
RETURN e`;
    verifyFormatting(fromquery, fromexpected);
    verifyFormatting(toquery, toexpected);
    verifyFormatting(bothquery, bothexpected);
  });

  test('IS FLOAT and IS INTEGER should not be broken', () => {
    const query = `MATCH (n)
WITH n, [k IN keys(n)] as list
UNWIND list as listItem
WITH n, listItem
WHERE (n[listItem] IS FLOAT OR n[listItem] IS INTEGER)
RETURN n`;
    const expected = `MATCH (n)
WITH n, [k IN keys(n)] AS list
UNWIND list AS listItem
WITH n, listItem
WHERE (n[listItem] IS FLOAT OR n[listItem] IS INTEGER)
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('does not remove empty function call parentheses', () => {
    const query = `CALL apoc.meta.stats() YIELD labels`;
    const expected = `CALL apoc.meta.stats() YIELD labels`;
    verifyFormatting(query, expected);
  });

  test('does not crash if empty call function', () => {
    const query = `CALL apoc.periodic`;
    const expected = `CALL apoc.periodic`;
    verifyFormatting(query, expected);
  });

  test('should not forget about multiple clauses in foreach', () => {
    const query = `
MATCH (n)
UNWIND n.list as items
FOREACH (item in items |
  CREATE (p:Product {name: item})
  CREATE (n)-[:CONTAINS]->(p)
)
RETURN n`;
    const expected = `MATCH (n)
UNWIND n.list AS items
FOREACH (item IN items |
  CREATE (p:Product {name: item})
  CREATE (n)-[:CONTAINS]->(p)
)
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('keeps path length and relationship type together', () => {
    const simplePath = `MATCH path = ()-[:type  *]->()`;
    const simplePathExpected = `MATCH path = ()-[:type*]->()`;
    verifyFormatting(simplePath, simplePathExpected);

    const complicatedPath = `MATCH path = ()-[:type  *1..10]->()`;
    const complicatedPathExpected = `MATCH path = ()-[:type*1..10]->()`;
    verifyFormatting(complicatedPath, complicatedPathExpected);

    const halfFilledPath = `MATCH path = ()-[:type  * .. 10]->()`;
    const halfFilledPathExpected = `MATCH path = ()-[:type*..10]->()`;
    verifyFormatting(halfFilledPath, halfFilledPathExpected);
  });

  test('can handle weird minuses', () => {
    const query = `EXPLAIN MATCH (u:User)-[:WROTE]-> (r:Review)–[]–> (b:Business)-[:IN]-> (c:Category)
WHERE b.name = "XGyhUMQO"
RETURN u, r, b, c`;
    const expected = `EXPLAIN
MATCH (u:User)-[:WROTE]->(r:Review)–[]–>(b:Business)-[:IN]->(c:Category)
WHERE b.name = "XGyhUMQO"
RETURN u, r, b, c`;
    verifyFormatting(query, expected);
  });

  test('does not concatenate IS X', () => {
    const query = `MATCH (n)
WHERE CASE WHEN n["asdf"] IS STRING THEN n.prop ELSE 'default' END
return n`;
    const expected = `MATCH (n)
WHERE CASE
        WHEN n["asdf"] IS STRING THEN n.prop
        ELSE 'default'
      END
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('does not break CALL YIELD', () => {
    const query = `CALL dbms.procedures YIELD name, signature, description`;
    const expected = `CALL dbms.procedures YIELD name, signature, description`;
    verifyFormatting(query, expected);
  });

  test('handles CALL YIELD with no args gracefully', () => {
    const query = `call dbms.components() yield *`;
    const expected = `CALL dbms.components() YIELD *`;
    verifyFormatting(query, expected);
  });

  test('handles CALL YIELD case with one arg gracefully', () => {
    const query = `call dbms.components(1) yield *`;
    const expected = `CALL dbms.components(1) YIELD *`;
    verifyFormatting(query, expected);
  });

  test('does not move explicitly newlined comments to the line before', () => {
    const query = `MATCH (n)
// filter out to only the right name
WHERE n.name = 'Tomas'
RETURN n`;
    const expected = `MATCH (n)
// filter out to only the right name
WHERE n.name = 'Tomas'
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('graph pattern matching spacing', () => {
    const query = `MATCH (m:(Adventure&Children) & ! (War&Crime))
RETURN m`;
    const expected = `MATCH (m:(Adventure&Children)&!(War&Crime))
RETURN m`;
    verifyFormatting(query, expected);
  });

  test('quantified path pattern spacing', () => {
    const query = `MATCH ((:Station {name: 'Denmark Hill'})-[l:LINK]-(s:Station)){ 1 , 4 }`;
    const expected = `MATCH ((:Station {name: 'Denmark Hill'})-[l:LINK]-(s:Station)){1,4}`;
    verifyFormatting(query, expected);
  });

  // Example 1 by Finbar
  test('QPP spacing with star', () => {
    const query = `
MATCH (p:Person)-[:ACTED_IN | DIRECTED]->   * (q)
RETURN q`;
    const expected = `MATCH (p:Person)-[:ACTED_IN|DIRECTED]->*(q)
RETURN q`;
    verifyFormatting(query, expected);
  });

  // Example 2 by Finbar
  test('QPP spacing with unspecified start', () => {
    const query = `MATCH SHORTEST 1(p:Person)-->{, 3}(q)
RETURN q;`;
    const expected = `MATCH SHORTEST 1 (p:Person)-->{ ,3}(q)
RETURN q;`;
    verifyFormatting(query, expected);
  });

  // Example 3 by Finbar
  test('QPP spacing with unspecified end', () => {
    const query = `MATCH (p:(!  Movie | !(Director & ! Actor)))-->{1, }(q)
RETURN *;`;
    const expected = `MATCH (p:(!Movie|!(Director&!Actor)))-->{1, }(q)
RETURN *;`;
    verifyFormatting(query, expected);
  });

  test('all should not get capitalized here', () => {
    const query = `MATCH path=(:Station&Western)(()-[:NEXT]->()){1,}(:Station&Western)
WHERE all(x IN nodes(path) WHERE x:Station&Western)
RETURN path`;
    const expected = `MATCH path = (:Station&Western) (()-[:NEXT]->()){1, }(:Station&Western)
WHERE all(x IN nodes(path) WHERE x:Station&Western)
RETURN path`;
    verifyFormatting(query, expected);
  });

  test('weird label expression', () => {
    const query = `MATCH (n)-[:ACTED_IN|AMPLIFIES|:SCREAMS|OBSERVES|:ANALYZES]-(m)
RETURN n`;
    const expected = `MATCH (n)-[:ACTED_IN|AMPLIFIES|:SCREAMS|OBSERVES|:ANALYZES]-(m)
RETURN n`;
    verifyFormatting(query, expected);
  });
});

// The @ represents the position of the cursor
describe('tests for correct cursor position', () => {
  test('cursor at beginning', () => {
    const query = 'RETURN -1, -2, -3';
    const result = formatQuery(query, 0);
    expect(result.newCursorPos).toEqual(0);
  });
  test('cursor at end', () => {
    const query = 'RETURN -1, -2, -3';
    const result = formatQuery(query, query.length - 1);
    expect(result.newCursorPos).toEqual(result.formattedString.length - 1);
  });
  test('cursor at newline', () => {
    const query = `MATCH (n:Person)
WHERE n.name = "Steve" 
RETURN n 
@LIMIT 12;`;
    const cursorPos = query.search('@');
    const result = formatQuery(query.replace('@', ''), cursorPos);
    const formated = `MATCH (n:Person)
WHERE n.name = "Steve" 
RETURN n@LIMIT 12;`;
    expect(result.newCursorPos).toEqual(formated.search('@'));
  });

  test('cursor start of line with spaces newline', () => {
    const query = `UNWIND range(1,100) as _
CALL {
  MATCH (source:object) WHERE source.id= $id1
  MATCH (target:object) WHERE target.id= $id2
  @MATCH path = (source)-[*1..10]->(target)
  WITH path, reduce(weight = 0, r IN relationships(path) | weight + r.weight) as Weight
  ORDER BY Weight LIMIT 3
  RETURN length(path) as l, Weight 
} 
RETURN count(*)`;
    const cursorPos = query.search('@');
    const result = formatQuery(query.replace('@', ''), cursorPos);
    const formated = `UNWIND range(1, 100) AS _
CALL {
  MATCH (source:object)
  WHERE source.id = $id1
  MATCH (target:object)
  WHERE target.id = $id2
  @MATCH path = (source)-[*1..10]->(target)
  WITH path, REDUCE (weight = 0, r IN relationships(path) | weight + r.weight)
             AS Weight ORDER BY Weight LIMIT 3
  RETURN length(path) AS l, Weight
}
RETURN count(*)`;
    expect(result.newCursorPos).toEqual(formated.search('@'));
  });

  test('cursor start of line without spaces', () => {
    const query = `MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    OR $para@meter > 2 
RETURN variable;`;
    const cursorPos = query.search('@');
    const result = formatQuery(query.replace('@', ''), cursorPos);
    const formated = `MATCH (variable:Label)-[:REL_TYPE]->()
WHERE variable.property = "String" OR namespaced.function() = false OR
      $para@meter > 2
RETURN variable;`;
    expect(result.newCursorPos).toEqual(formated.search('@'));
  });
});

describe('tests for line breaks', () => {
  const q0 = `
match (n)
where n.age > 10 and n.born > 10 and n.prop > 15 and n.otherprop > 20 and n.thirdprop > 50
return n`;
  const q1 = `MATCH (p:Person)
WHERE p.name STARTS WITH 'A' OR p.name STARTS WITH 'B' OR p.name STARTS WITH 'C' OR p.age > 30 OR p.salary > 50000 OR p.experience > 10 OR p.position = 'Manager'
RETURN p`;
  const q2 = `MATCH (e:Employee)
RETURN 
  CASE 
    WHEN e.salary > 100000 THEN 'High'
    WHEN e.salary > 50000 THEN 'Medium'
    WHEN e.salary > 30000 THEN 
      CASE 
        WHEN e.experience > 5 THEN 'Mid-Level'
        ELSE 'Low'
      END
    ELSE 'Entry-Level'
  END AS SalaryCategory`;
  const q3 = `MATCH (o:Order)-[:CONTAINS]->(p:Product)
WITH o, p, COUNT(p) AS productCount, SUM(p.price) AS totalValue, AVG(p.discount) AS avgDiscount, MIN(p.price) AS minPrice, MAX(p.price) AS maxPrice
WHERE totalValue > 1000 AND productCount > 5
RETURN o, totalValue, avgDiscount`;
  const q4 = `MATCH (c:Customer)-[:PURCHASED]->(o:Order)-[:CONTAINS]->(p:Product)
RETURN c.name, COLLECT({orderId: o.id, items: COLLECT({product: p.name, price: p.price, discount: p.discount})}) AS orderSummary, c.someOtherPrettyLongProperty AS otherLongProperty`;
  const q5 = `MATCH (a:Author)-[:WROTE]->(b:Book)-[:TRANSLATED_TO]->(t:Translation)-[:PUBLISHED_BY]->(p:Publisher)-[:LOCATED_IN]->(c:Country)
WHERE b.genre = 'Sci-Fi' AND p.name STARTS WITH 'P' AND c.region = 'Europe'
RETURN a.name, b.title, t.language, p.name, c.name`;
  const q6 = `MATCH (c:Customer)
CALL {
  WITH c
  MATCH (c)-[:PURCHASED]->(o:Order)-[:CONTAINS]->(p:Product)
  RETURN COUNT(o) AS totalOrders, SUM(p.price) AS totalSpent, AVG(p.price) AS avgPrice, MAX(p.price) AS mostExpensiveItem
}
RETURN c.name, totalOrders, totalSpent, avgPrice, mostExpensiveItem`;
  const q7 = `MATCH (c:Company)-[:EMPLOYS]->(e:Employee)
UNWIND e.projects AS project
UNWIND project.tasks AS task
RETURN c.name, e.name, task.name, COUNT(task.subtasks) AS totalSubtasks, SUM(task.hoursSpent) AS totalHours, AVG(task.complexity) AS avgComplexity`;
  const q8 = `MATCH (p:Product)
WHERE p.category IN ['Electronics', 'Furniture', 'Clothing', 'Toys', 'Books', 'Appliances', 'Jewelry', 'Automotive', 'Beauty', 'Garden']
RETURN p`;
  const q9 = `MERGE (a:Author {name: 'J.K. Rowling'})
ON CREATE SET a.birthYear = 1965, a.nationality = 'British', a.booksWritten = 7, a.netWorth = 1000000000, a.genre = 'Fantasy'
MERGE (b:Book {title: 'Harry Potter and the Sorcerers Stone'})
ON CREATE SET b.publishedYear = 1997, b.sales = 120000000, b.rating = 4.8, b.genre = 'Fantasy'
MERGE (a)-[:WROTE]->(b)
RETURN a, b`;
  const q10 = `MATCH (p:Person)
WHERE p.name = 'Alberta' OR p.name = 'Berta' OR p.name = 'C' OR p.age > 30 OR p.salary > 50000 OR p.experience > 10 OR p.position = 'Manager'
RETURN p`;
  // Greg query
  const q11 = `MATCH (s:Schema)
// Find a schema which has at least 2 tables and at least PK and one FK
WHERE (s)-->(:Table)-->(:Column)-[:FK_COLUMN]-()
    AND
    (s)-->(:Table)-->(:Column)-[:PK_COLUMN]-()
    AND
    count { (s)-->() } > 1
// WITH collect(s) as schemas
// MATCH (s)|
WITH s
MATCH (s)-[:CONTAINS_TABLE]->(t:Table)-[:HAS_COLUMN]->(c:Column)
OPTIONAL MATCH (c)<-[:PK_COLUMN]-(pk:PrimaryKey)
OPTIONAL MATCH (c)<-[:FK_COLUMN]-(fk:ForeignKey)
WITH s,
    t.name as tableName,
    collect({name: c.name,
            pk: CASE (not pk is null and $printKeyInfo) WHEN True THEN "(PK)" ELSE "" END,
            fk: CASE (not fk is null and $printKeyInfo) WHEN True THEN "(FK)" ELSE "" END
    }) as columns
WITH s, tableName, [x in columns | x.name + x.fk + x.pk] as columns
WITH s, "Table " + tableName + " has columns:" + apoc.text.join(columns,'') as tableDescriptions
WITH s, apoc.text.join(collect(tableDescriptions),'------------------------') as schemaDescription
SET s.schemaDescription=schemaDescription`;
  // subqueries example
  const q12 = `UNWIND range(1,100) as _
CALL {
  MATCH (source:object) WHERE source.id= $id1
  MATCH (target:object) WHERE target.id= $id2
  MATCH path = (source)-[*1..10]->(target)
  WITH path, reduce(weight = 0, r IN relationships(path) | weight + r.weight) as Weight
  ORDER BY Weight LIMIT 3
  RETURN length(path) as l, Weight
}
RETURN count(*)`;
  //allTokenTypes example
  const q13 = `MATCH (variable:Label)-[:REL_TYPE]->()
WHERE variable.property = "String" OR namespaced.function() = false // comment
OR $parameter > 2
RETURN variable;`;

  const q14 = `MATCH (p:Product) WHERE p.price > 1000 AND p.stock > 50 AND p.category IN ['Electronics','Home Appliances','Garden Tools','Sports Equipment','Automotive Parts','Fashion Accessories','Books','Toys','Jewelry','Musical Instruments','Art Supplies','Office Supplies'] AND (CASE WHEN p.discount IS NULL THEN 0 ELSE p.discount END) > 0.15 AND (p.sold - (CASE WHEN p.reserved IS NULL THEN 0 ELSE p.reserved END)) > 20 AND (p.rating * (CASE WHEN p.reviews IS NULL THEN 1 ELSE p.reviews END)) > 3000 RETURN p`;

  const q15 = `MATCH (o:Order)-[:CONTAINS]->(p:Product) WITH o, COUNT(p) AS itemCount, SUM(p.price * (1 - p.discount)) AS totalRevenue, AVG(p.rating) AS avgRating, MIN(p.price) AS minPrice, MAX(p.price) AS maxPrice, COLLECT({name: p.name, category: p.category, price: p.price, discount: p.discount, rating: p.rating, stock: p.stock, supplier: p.supplier, warranty: p.warranty, features: p.features}) AS productDetails WHERE totalRevenue > 10000 AND itemCount > 5 AND avgRating > 3.5 AND minPrice < 50 AND maxPrice < 1000 RETURN o, itemCount, totalRevenue, avgRating, minPrice, maxPrice, productDetails`;

  const q16 = `MATCH (p:Product) WHERE p.sku IN ['SKU0001','SKU0002','SKU0003','SKU0004','SKU0005','SKU0006','SKU0007','SKU0008','SKU0009','SKU0010','SKU0011','SKU0012','SKU0013','SKU0014','SKU0015','SKU0016','SKU0017','SKU0018','SKU0019','SKU0020','SKU0021','SKU0022','SKU0023','SKU0024','SKU0025'] AND (p.price > 20 OR p.rating >= 4.0) AND (CASE WHEN p.discount IS NOT NULL THEN p.discount ELSE 0 END) < 0.25 RETURN p`;

  const q17 = `MATCH (c:Customer)-[:HAS_INTEREST]->(i:Interest) UNWIND i.tags AS tag UNWIND ['Sports','Music','Travel','Technology','Fashion','Cooking','Gaming','Fitness','Art','Science','History','Literature','Movies','Theater','Photography','Nature','Automotive','Business','Health','Education'] AS popularTag WITH c, i, tag, popularTag, CASE WHEN tag = popularTag THEN 1 ELSE 0 END AS tagMatchScore, SIZE(i.tags) AS tagCount, (CASE WHEN SIZE(i.tags)=0 THEN 0 ELSE tagMatchScore * 100.0 / SIZE(i.tags) END) AS matchPercentage WHERE matchPercentage > 50 AND i.confidence > 0.7 RETURN c, i, tag, popularTag, tagMatchScore, matchPercentage`;

  const q18 = `MATCH (m:Movie) RETURN m.title, m.releaseYear, CASE WHEN m.rating >= 9.0 THEN 'Masterpiece' WHEN m.rating >= 8.0 THEN 'Excellent' WHEN m.rating >= 7.0 THEN 'Great' WHEN m.rating >= 6.0 THEN 'Good' WHEN m.rating >= 5.0 THEN 'Average' WHEN m.rating >= 4.0 THEN 'Below Average' WHEN m.rating >= 3.0 THEN 'Poor' WHEN m.rating >= 2.0 THEN 'Very Poor' ELSE 'Unwatchable' END AS review, CASE WHEN m.genres CONTAINS 'Drama' AND m.genres CONTAINS 'Historical' THEN 'Epic' WHEN m.genres CONTAINS 'Comedy' AND m.genres CONTAINS 'Romance' THEN 'Charming' ELSE 'Mixed' END AS styleCategory`;

  const q19 = `MATCH (p:Person)-[:KNOWS]->(friend:Person) OPTIONAL MATCH (friend)-[:WORKS_AT]->(c:Company) OPTIONAL MATCH (friend)-[:LIVES_IN]->(city:City) WITH p, friend, c, city, CASE WHEN c.name IS NULL THEN 'Unemployed' ELSE c.industry END AS jobIndustry, CASE WHEN city.population > 1000000 THEN 'Metropolitan' WHEN city.population > 500000 THEN 'Urban' ELSE 'Small Town' END AS citySize WHERE (p.age > 30 OR friend.age > 30) AND (jobIndustry IN ['Technology','Finance','Healthcare','Education','Entertainment']) RETURN p.name, friend.name, jobIndustry, city.name, citySize`;

  const q20 = `MATCH (s:Session) CALL { WITH s MATCH (s)-[:HAS_EVENT]->(e:Event) WHERE (e.timestamp >= datetime('2025-01-01T00:00:00Z') AND e.timestamp <= datetime('2025-12-31T23:59:59Z')) AND e.type IN ['Click','View','Purchase','Signup','Logout','Login','Share','Comment','Like','Dislike','Subscribe','Unsubscribe'] WITH e, CASE WHEN e.value > 1000 THEN 'High' WHEN e.value > 500 THEN 'Medium' ELSE 'Low' END AS eventValue RETURN COLLECT({eventId: e.id, type: e.type, value: e.value, category: eventValue, extra: e.extraData}) AS events } WITH s, SIZE(events) AS eventCount WHERE eventCount > 5 RETURN s, eventCount, events`;

  const q21 = `MATCH path = (m1:loooooooongrelationtypename {code: "mFG66X9v"})-[
r:verylongrelationtypename]->(m2:anotherverylongrelationtypename)
RETURN path`;
  const q24 = `CALL apoc.periodic.iterate ("eZ0sadadawdawdsdsdsdq", "1p7sdsdsasdwasddsdEsdsd", {baisdsdadadze: "v0Asdsdsdadadadsdsdp", paladadadel: "UsdssdsdsddUg"})`;

  const queries = [
    q0,
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    q9,
    q10,
    q11,
    q12,
    q13,
    q14,
    q15,
    q16,
    q17,
    q18,
    q19,
    q20,
    q21,
    q24,
  ];

  test('keeps all queries within the max column width', () => {
    queries.forEach((query) => {
      const formatted = formatQuery(query);
      const lines = formatted.split('\n');
      lines.forEach((line) => {
        expect(line.length).toBeLessThanOrEqual(MAX_COL);
      });
    });
  });

  test('does not split in the middle of a relation', () => {
    const expected = `
MATCH path = (m1:loooooooongrelationtypename {code: "mFG66X9v"})-
             [r:verylongrelationtypename]->(m2:anotherverylongrelationtypename)
RETURN path`.trimStart();
    verifyFormatting(q21, expected);
  });

  test('does not split the $ and the parameter name', () => {
    const query =
      'RETURN $paraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaam';
    const expected =
      'RETURN $paraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaam';
    verifyFormatting(query, expected);
  });

  test('aligns split node pattern', () => {
    const query = `MERGE (veeeeeerylongnodenameeeeeeeee:ZjFYQFrVDTVsA
    {name: $veeeeeeeeerylongparaaaaaaaaaaaaaaam})`;
    const expected = `
MERGE (veeeeeerylongnodenameeeeeeeee:ZjFYQFrVDTVsA
      {name: $veeeeeeeeerylongparaaaaaaaaaaaaaaam})`.trimStart();
    verifyFormatting(query, expected);
  });

  test('aligns nested parentheses well', () => {
    const query = `MATCH (n)
  WHERE ((($param1 IS NOT NULL AND this1.title = $param1) AND this1:WaFQynNy) AND (this1:WaFQynNy OR this1:hyztnnwg OR this1:QpLckJcy))`;
    const expected = `MATCH (n)
WHERE ((($param1 IS NOT NULL AND this1.title = $param1) AND this1:WaFQynNy) AND
       (this1:WaFQynNy OR this1:hyztnnwg OR this1:QpLckJcy))`;
    verifyFormatting(query, expected);
  });

  test('aligns large maps one further than the opening brace', () => {
    const query = `RETURN {looooooooooooooooooooooongkey:value, loooooooooooooooooooongkeeeyyyyyyyy:value2, looooooooooooooongkeeey:value3}`;
    const expected = `
RETURN {looooooooooooooooooooooongkey: value,
        loooooooooooooooooooongkeeeyyyyyyyy: value2,
        looooooooooooooongkeeey: value3}`.trimStart();
    verifyFormatting(query, expected);
  });

  test('long list should not break after the opening brace leaving it alone', () => {
    const query = `MATCH (p:Product)
WHERE p.article_number IN [
      "OCj0AswA", "dFRbj1s3", "oMbdvgm7", "L4Vey8xn", "GNgeDIkA", "pU4RE0lM",
      "M6XNVJsO", "NcdW0tuB", "Pf6RIuP4", "6tKStKwl", "HfvahDu5", "gJoq3HnU",
      "g7LjxbGD"]
RETURN p`;
    const expected = `MATCH (p:Product)
WHERE p.article_number IN
      ["OCj0AswA", "dFRbj1s3", "oMbdvgm7", "L4Vey8xn", "GNgeDIkA", "pU4RE0lM",
       "M6XNVJsO", "NcdW0tuB", "Pf6RIuP4", "6tKStKwl", "HfvahDu5", "gJoq3HnU",
       "g7LjxbGD"]
RETURN p`;
    verifyFormatting(query, expected);
  });

  test('should prefer breaking pattern list on commas', () => {
    const query = `EXPLAIN
MATCH (eq:loooooongtype {keeeey: "sAGhmzsL"})-[]-(m:tyyyyype), (m)-[l1]-
      (eqa:EquipoEmpresa)
WHERE eqa.prop <> "Aq0kC1bX"
RETURN eq`;
    const expected = `EXPLAIN
MATCH (eq:loooooongtype {keeeey: "sAGhmzsL"})-[]-(m:tyyyyype),
      (m)-[l1]-(eqa:EquipoEmpresa)
WHERE eqa.prop <> "Aq0kC1bX"
RETURN eq`;
    verifyFormatting(query, expected);
  });

  test('should prefer to put ORDER BY etc together', () => {
    const query = `MATCH (p:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(Kevin:Person {name: "HEZDAAhT"})
WHERE p.name <> "nnwAPHJg"
RETURN p.name AS Name, p.born AS BirthYear, m.title AS MovieTitle
ORDER BY Name ASC
LIMIT "ZTWWLgIq"`;
    const expected = `MATCH (p:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-
      (Kevin:Person {name: "HEZDAAhT"})
WHERE p.name <> "nnwAPHJg"
RETURN p.name AS Name, p.born AS BirthYear, m.title AS MovieTitle
       ORDER BY Name ASC
LIMIT "ZTWWLgIq"`;
    verifyFormatting(query, expected);
  });

  test('paths should be aligned after the =', () => {
    const query = `MATCH p1 = (i:tyyyype {keeeeeeeey: "1QwLfE5M"})--
      (il:nodetyyyype {type: "58vomdG0"})
RETURN i, apoc.map.removeKeys(il, ["TT6hUzUE"]) AS props`;
    const expected = `
MATCH p1 = (i:tyyyype {keeeeeeeey: "1QwLfE5M"})--
           (il:nodetyyyype {type: "58vomdG0"})
RETURN i, apoc.map.removeKeys(il, ["TT6hUzUE"]) AS props`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should fit this whole node on one line', () => {
    const query = `MATCH (i:tyyyyyyyype {createdAt: datetime("V3bzb8bX"), description: "UM706WRV"})
RETURN i`;
    const expected = `MATCH (i:tyyyyyyyype {createdAt: datetime("V3bzb8bX"), description: "UM706WRV"})
RETURN i`;
    verifyFormatting(query, expected);
  });

  test('should not have weird alignment for multiple node creation', () => {
    const query = `
CREATE (:actor {name: "jEmtGrSI"}),
       (:actor {name: "HqFUar0i"}),
       (:actor {name: "ZAvjBFt6"}),
       (:actor {name: "7hbDfMOa"}),
       (:actor {name: "AXhPvCyh"})`;
    const expected = `
CREATE (:actor {name: "jEmtGrSI"}), (:actor {name: "HqFUar0i"}),
       (:actor {name: "ZAvjBFt6"}), (:actor {name: "7hbDfMOa"}),
       (:actor {name: "AXhPvCyh"})`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should align lists by the first element, not the bracket', () => {
    const query = `MATCH (p:Product)
WHERE p.price > 1000 AND p.stock > 50 AND
      p.category IN ['Electronics', 'Home Appliances', 'Garden Tools',
                    'Sports Equipment', 'Automotive Parts',
                    'Fashion Accessories', 'Books', 'Toys', 'Jewelry',
                    'Musical Instruments', 'Art Supplies', 'Office Supplies']
RETURN p`;
    const expected = `MATCH (p:Product)
WHERE p.price > 1000 AND p.stock > 50 AND
      p.category IN ['Electronics', 'Home Appliances', 'Garden Tools',
                     'Sports Equipment', 'Automotive Parts',
                     'Fashion Accessories', 'Books', 'Toys', 'Jewelry',
                     'Musical Instruments', 'Art Supplies', 'Office Supplies']
RETURN p`;
    verifyFormatting(query, expected);
  });

  test('should not align long create statements weirdly', () => {
    const query = `CREATE
    (a:Location {name: "DXe5KhL3"}),
    (b:Location {name: "v2BpdkOj"}),
    (c:Location {name: "Fi5CMJ9Y"}),
    (d:Location {name: "S31K3X1o"}),
    (a)-[:ROUTE_TO {distance: "zjisNPKv", duration: "ivAC2TGF"}]->(b),
    (b)-[:ROUTE_TO {distance: "Irogkqf1", duration: "QsCt67v1"}]->(c),
    (c)-[:ROUTE_TO {distance: "Y53yoQwn", duration: "X41tnMDd"}]->(d);`;
    const expected = `CREATE (a:Location {name: "DXe5KhL3"}), (b:Location {name: "v2BpdkOj"}),
       (c:Location {name: "Fi5CMJ9Y"}), (d:Location {name: "S31K3X1o"}),
       (a)-[:ROUTE_TO {distance: "zjisNPKv", duration: "ivAC2TGF"}]->(b),
       (b)-[:ROUTE_TO {distance: "Irogkqf1", duration: "QsCt67v1"}]->(c),
       (c)-[:ROUTE_TO {distance: "Y53yoQwn", duration: "X41tnMDd"}]->(d);`;
    verifyFormatting(query, expected);
  });
  test('should align arguments of function invocation after opening bracket', () => {
    const query = `RETURN collect(create_this1 { datetime: apoc.date.convertFormat(toString(create_this1.datetime), "OZQvXyoU", "EhpkDy8g") }) AS data`;
    const expected = `RETURN collect(create_this1 {datetime: apoc.date.convertFormat(
               toString(create_this1.datetime), "OZQvXyoU", "EhpkDy8g")})
       AS data`;
    verifyFormatting(query, expected);
  });

  test('should not forget about alignment for unwind clause', () => {
    const query = `UNWIND [{_id:"MiltPFxk", properties:{name:"5nIou0gC", id:"ha44MrBy", value:"6o5lzHd6"}}, {_id:"2uMA2cW8", properties:{name:"WOsBC4Ks", id:"bP526OzE", value:"WhYP4dxd"}}] AS row RETURN row`;
    const expected = `
UNWIND [{_id: "MiltPFxk",
         properties: {name: "5nIou0gC", id: "ha44MrBy", value: "6o5lzHd6"}},
        {_id: "2uMA2cW8",
         properties: {name: "WOsBC4Ks", id: "bP526OzE", value: "WhYP4dxd"}}]
       AS row
RETURN row`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should not want to split in the middle of AS here', () => {
    const query = `EXPLAIN
MATCH (p:Person)-[:HAS_ACCOUNT]->(s:Platform)
WHERE s.deactivated = "k1fU0uk0" AND
      NOT (toLower(s.name) CONTAINS "ki9c1rU8") AND p.networkDbId IS NOT NULL
WITH p, COLLECT({platfId: s.platfId, name: s.name, numMsgs: s.deactivated}) AS
        platfs, COUNT(s) AS numplatf
WHERE numplatf >= "gkLi0qvW"
RETURN DISTINCT p.networkDbId, p.name, platfs`;
    const expected = `EXPLAIN
MATCH (p:Person)-[:HAS_ACCOUNT]->(s:Platform)
WHERE s.deactivated = "k1fU0uk0" AND
      NOT (toLower(s.name) CONTAINS "ki9c1rU8") AND p.networkDbId IS NOT NULL
WITH p, COLLECT({platfId: s.platfId, name: s.name, numMsgs: s.deactivated})
        AS platfs, COUNT(s) AS numplatf
WHERE numplatf >= "gkLi0qvW"
RETURN DISTINCT p.networkDbId, p.name, platfs`;
    verifyFormatting(query, expected);
  });

  test('no splits within an arrow', () => {
    const query = `MERGE (naame)-[:tyyyyyyyyyype {keeeeeeeey: "dFTkCNlb", keey: "rmmCQGIb"}]->(naaaaame);`;
    const expected = `
MERGE (naame)-[:tyyyyyyyyyype {keeeeeeeey: "dFTkCNlb", keey: "rmmCQGIb"}]->
      (naaaaame);`.trimStart();
    verifyFormatting(query, expected);
  });

  test('function arguments should align', () => {
    const query = `CALL apoc.periodic.iterate("eZQB0P0q", "1p7EFkyE", {batchSize: "v0Ap5F8F", parallel: "UUc75lVg"}) YIELD batches, total, timeTaken, committedOperations, failedOperations`;
    const expected = `
CALL apoc.periodic.iterate("eZQB0P0q", "1p7EFkyE",
                           {batchSize: "v0Ap5F8F", parallel: "UUc75lVg"})
YIELD batches, total, timeTaken, committedOperations, failedOperations`.trimStart();
    verifyFormatting(query, expected);
  });

  test('does not split weird parenthesized expressions in an odd way', () => {
    const query = `MATCH (p:Product)--(o:Order)
WHERE (p.priiiiiiiiiiiiiiiiiiice + o.siiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiize)
RETURN p;`;
    const expected = `MATCH (p:Product)--(o:Order)
WHERE (p.priiiiiiiiiiiiiiiiiiice +
       o.siiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiize)
RETURN p;`;
    verifyFormatting(query, expected);
  });

  test('complicated QPP', () => {
    const query = `
MATCH (dmk:Station {name: 'Denmark Hill'})<-[:CALLS_AT]-(l1a:CallingPoint)-[:NEXT]->+
        (l1b)-[:CALLS_AT]->(x:Station)<-[:CALLS_AT]-(l2a:CallingPoint)-[:NEXT]->*
        (l2b)-[:CALLS_AT]->(gtw:Station {name: 'Gatwick Airport'})
RETURN dmk`;
    const expected = `
MATCH (dmk:Station {name: 'Denmark Hill'})<-[:CALLS_AT]-(l1a:CallingPoint)-
      [:NEXT]->+(l1b)-[:CALLS_AT]->(x:Station)<-[:CALLS_AT]-(l2a:CallingPoint)-
      [:NEXT]->*(l2b)-[:CALLS_AT]->(gtw:Station {name: 'Gatwick Airport'})
RETURN dmk`.trim();
    verifyFormatting(query, expected);
  });
});
