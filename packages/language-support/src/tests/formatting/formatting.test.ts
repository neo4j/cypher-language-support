import { formatQuery } from '../../formatting/formatting';
import { standardizeQuery } from '../../formatting/standardizer';

function verifyFormatting(query: string, expected: string): void {
  const formatted = formatQuery(query);
  expect(formatted).toEqual(expected);
  const queryStandardized = standardizeQuery(query);
  const formattedStandardized = standardizeQuery(formatted);
  // AST integrity check
  if (formattedStandardized !== queryStandardized) {
    throw new Error(
      `Standardized query does not match standardized formatted query`,
    );
  }
  // Idempotency check
  const formattedTwice = formatQuery(formatted);
  expect(formattedTwice).toEqual(formatted);
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
  MATCH (target:object) RETURN source, target } RETURN count('*')`;
    const expected = `UNWIND range(1, 100) AS _
CALL {
  MATCH (source:object)
  MATCH (target:object)
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
    const expected = `MATCH (n)
RETURN n. // comment
prop`;
    verifyFormatting(propertycomments, expected);
  });

  test('basic inline comments', () => {
    // Whitespace after the comment lines is intentional. It should be removed
    const inlinecomments = `
MERGE (n) ON CREATE SET n.prop = 0 // Ensure 'n' exists and initialize 'prop' to 0 if created   
MERGE (a:A)-[:T]->(b:B)           // Create or match a relationship from 'a:A' to 'b:B'     
ON MATCH SET b.name = 'you'       // If 'b' already exists, set its 'name' to 'you'       
ON CREATE SET a.name = 'me'       // If 'a' is created, set its 'name' to 'me'       
RETURN a.prop                     // Return the 'prop' of 'a'       
`;
    const expected = `MERGE (n)
  ON CREATE SET n.prop = 0 // Ensure 'n' exists and initialize 'prop' to 0 if created
MERGE (a:A)-[:T]->(b:B) // Create or match a relationship from 'a:A' to 'b:B'
  ON CREATE SET a.name = 'me' // If 'a' is created, set its 'name' to 'me'
  ON MATCH SET b.name = 'you' // If 'b' already exists, set its 'name' to 'you'
RETURN a.prop // Return the 'prop' of 'a'`;
    verifyFormatting(inlinecomments, expected);
  });

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

  test('multiple comments should not be moved to the previous line', () => {
    const query = `
MATCH (n)
// One comment about the return
// Another comment about the return
return n;`;
    const expected = `
MATCH (n)
// One comment about the return
// Another comment about the return
RETURN n;`.trim();
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
    const expected =
      'CREATE (`complex name with special@chars`)\nRETURN `complex name with special@chars`';
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
    const expected1 = 'MATCH (NULL)\nRETURN null';
    verifyFormatting(query1, expected1);

    const query2 = 'MATCH (NAN) RETURN NAN';
    const expected2 = 'MATCH (NAN)\nRETURN NAN';
    verifyFormatting(query2, expected2);

    const query3 = 'MATCH (INF) RETURN INF';
    const expected3 = 'MATCH (INF)\nRETURN INF';
    verifyFormatting(query3, expected3);
  });

  test('puts one space between label/type predicates and property predicates in patterns', () => {
    const query = `MATCH (p:Person{property:-1})-[:KNOWS{since: 2016}]->() RETURN p.name`;
    const expected = `MATCH (p:Person {property: -1})-[:KNOWS {since: 2016}]->()\nRETURN p.name`;
    verifyFormatting(query, expected);
  });

  test('no space in patterns', () => {
    const query = 'MATCH (:Person) --> (:Vehicle) RETURN count(*)';
    const expected = 'MATCH (:Person)-->(:Vehicle)\nRETURN count(*)';
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
  test('formats LIMIT on new line', () => {
    const query = `CREATE (n)
RETURN n LIMIT 0`;
    const expected = `CREATE (n)
RETURN n
LIMIT 0`;
    verifyFormatting(query, expected);
  });
});

describe('various edgecases', () => {
  test('multiple queries', () => {
    const multiquery = 'RETURN 1; RETURN 2; RETURN 3;';
    const expectedMultiquery = 'RETURN 1;\nRETURN 2;\nRETURN 3;';
    verifyFormatting(multiquery, expectedMultiquery);
  });

  test('should not add space for parameter access', () => {
    const query = 'RETURN $param';
    const expected = 'RETURN $param';
    verifyFormatting(query, expected);
  });

  test('syntax error', () => {
    const query = 'MATCH (n) RETRUN n.prop,';
    expect(() => formatQuery(query)).toThrowError(
      `Could not format due to syntax error at line 1:10 near "RETRUN"`,
    );
  });

  test('apoc call, namespaced function', () => {
    const query = `RETURN apoc.text.levenshteinSimilarity("Neo4j", "Neo4j") AS output;`;
    const expected = `RETURN apoc.text.levenshteinSimilarity("Neo4j", "Neo4j") AS output;`;
    verifyFormatting(query, expected);
  });

  test('path length in relationship pattern', () => {
    const query = `MATCH (p:Person)-[r:LOVES*]-()
RETURN e`;
    const expected = `MATCH (p:Person)-[r:LOVES*]-()
RETURN e`;
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

  test('test for function invocation', () => {
    const query = `MATCH (n)
RETURN count ( DISTINCT   n,a )`;
    const expected = `MATCH (n)
RETURN count(DISTINCT n, a)`;
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

  test('should remember all clauses in foreach', () => {
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

  test('weird label expression', () => {
    const query = `MATCH (n)-[:ACTED_IN|AMPLIFIES|:SCREAMS|OBSERVES|:ANALYZES]-(m)
RETURN n`;
    const expected = `MATCH (n)-[:ACTED_IN|AMPLIFIES|:SCREAMS|OBSERVES|:ANALYZES]-(m)
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('quantified path pattern spacing', () => {
    const query = `MATCH ((:Station {name: 'Denmark Hill'})-[l:LINK]-(s:Station)){ 1 , 4 }`;
    const expected = `MATCH ((:Station {name: 'Denmark Hill'})-[l:LINK]-(s:Station)){1,4}`;
    verifyFormatting(query, expected);
  });

  test('graph pattern matching spacing', () => {
    const query = `MATCH (m:(Adventure&Children) & ! (War&Crime))
RETURN m`;
    const expected = `MATCH (m:(Adventure&Children)&!(War&Crime))
RETURN m`;
    verifyFormatting(query, expected);
  });
});

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
LIMIT 12;`;
    const result = formatQuery(query, 56);
    expect(result.newCursorPos).toEqual(54);
  });

  test('cursor start of line with spaces newline', () => {
    const query = `UNWIND range(1,100) as _
CALL {
  MATCH (source:object) WHERE source.id= $id1
  MATCH (target:object) WHERE target.id= $id2
  MATCH path = (source)-[*1..10]->(target)
  WITH path, reduce(weight = 0, r IN relationships(path) | weight + r.weight) as Weight
  ORDER BY Weight LIMIT 3
  RETURN length(path) as l, Weight 
} 
RETURN count(*)`;
    const result = formatQuery(query, 124);
    expect(result.newCursorPos).toEqual(131);
  });

  test('cursor start of line without spaces', () => {
    const query = `MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    // comment
    OR $parameter > 2 
RETURN variable;`;
    const result = formatQuery(query, 133);
    expect(result.newCursorPos).toEqual(118);
  });
});
