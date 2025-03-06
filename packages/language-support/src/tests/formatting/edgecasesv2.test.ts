/*
 * This file is a WIP of the next iteration of the cypher-formatter.
 * It's being kept as a separate file to enable having two separate version at once
 * since it would be difficult to consolidate the new and the old version
 */

import { verifyFormatting } from './testutilv2';

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
  // TODO
  test('does not concatenate IS X', () => {
    const query = `MATCH (n)
WHERE CASE WHEN n["asdf"] IS STRING THEN n.prop ELSE 'default' END
return n`;
    const expected = `MATCH (n)
WHERE
CASE
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

  test('comments should not start replicating themselves', () => {
    const query = `CALL gds.graph.project(
    "qk5jpmGl",           // Name of the projected graph
    ["TB4Tvv6q", "2iCI1Rll", "kaLEqBxX"], // Node labels to include
    {
        connection: {
            type: "R3e8WLkh",            // Include all relationships
            orientation: "weFW44Gy" // Treat relationships as undirected
        }
    }
)
YIELD graphName, nodeCount, relationshipCount, createMillis
RETURN graphName, nodeCount, relationshipCount, createMillis;`;
    const expected = `CALL gds.graph.project("qk5jpmGl", // Name of the projected graph
                       ["TB4Tvv6q", "2iCI1Rll", "kaLEqBxX"], // Node labels to include
                       {connection: {type: "R3e8WLkh", // Include all relationships
                                     orientation: "weFW44Gy"}}) // Treat relationships as undirected
YIELD graphName, nodeCount, relationshipCount, createMillis
RETURN graphName, nodeCount, relationshipCount, createMillis;`;
    verifyFormatting(query, expected);
  });

  test('comment should not disappear in this query', () => {
    const query = `MATCH (n)
WITH *, n.prop, // This comment should not disappear
     n.otherprop
RETURN n`;
    const expected = `MATCH (n)
WITH *, n.prop, // This comment should not disappear
     n.otherprop
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('should not find the wrong comma here', () => {
    const query = `CALL gds.nodeSimilarity.filtered.stream(
    "N5j8G3h2",
    {
        A3f7R: "Z2w8Q",
        L9t4P: "Y3s1D"
    }
) YIELD *`;
    const expected = `CALL gds.nodeSimilarity.filtered.stream("N5j8G3h2",
                                        {A3f7R: "Z2w8Q", L9t4P: "Y3s1D"})
YIELD *`;
    verifyFormatting(query, expected);
  });

  test('should not leave dangling bracket', () => {
    const query = `CREATE (company:Company
       {name: "mrUJWq6A", krs: "Yuu9Wl7d", registration_date: date("FrA1uHGX")
       });`;
    const expected = `CREATE (company:Company {name: "mrUJWq6A", krs: "Yuu9Wl7d",
                         registration_date: date("FrA1uHGX")});`;
    verifyFormatting(query, expected);
  });

  test('should align with list predicate', () => {
    const query = `MATCH (f:Frequency)
WHERE f.value > "WhbRf4O4" AND
      ALL(x IN RANGE("gemqfwmW", TOINTEGER(FLOOR(SQRT(f.value)))) WHERE f.value
      % x <> "5DOeV3TE")
SET f.prime = "zt01uZOH"
RETURN f`;
    const expected = `MATCH (f:Frequency)
WHERE f.value > "WhbRf4O4" AND
      ALL(x IN RANGE("gemqfwmW", TOINTEGER(FLOOR(SQRT(f.value)))) WHERE f.value
          % x <> "5DOeV3TE")
SET f.prime = "zt01uZOH"
RETURN f`;
    verifyFormatting(query, expected);
  });

  test('map projections should line up like maps 1', () => {
    const query = `MATCH (p:Person {name: "Alice"})
RETURN p {.name, .age, .email, .phone, .address, .occupation, .nationality,
       .birthdate, .gender} AS personInfo`;
    const expected = `MATCH (p:Person {name: "Alice"})
RETURN p {.name, .age, .email, .phone, .address, .occupation, .nationality,
          .birthdate, .gender} AS personInfo`;
    verifyFormatting(query, expected);
  });

  test('map projections should line up like maps 1', () => {
    const query = `MATCH (p:Person {name: "Alice"})-[:LIVES_IN]->(c:City)
RETURN p {.name, .age, .email, .phone, address:
    {street: p.street, city: c.name, zip: p.zip}, .occupation, .nationality,
    .birthdate, .gender} AS personInfo`;
    const expected = `MATCH (p:Person {name: "Alice"})-[:LIVES_IN]->(c:City)
RETURN p {.name, .age, .email, .phone,
          address: {street: p.street, city: c.name, zip: p.zip}, .occupation,
          .nationality, .birthdate, .gender} AS personInfo`;
    verifyFormatting(query, expected);
  });
});
