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
    expect(result.newCursorPos).toEqual(55);
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
    expect(result.newCursorPos).toEqual(126);
  });

  test('cursor start of line without spaces', () => {
    const query = `MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    // comment
    OR $parameter > 2 
RETURN variable;`;
    const result = formatQuery(query, 133);
    expect(result.newCursorPos).toEqual(119);
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
SET s.schemaDescription=schemaDescription`
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
RETURN count(*)`
  //allTokenTypes example
  const q13 = `MATCH (variable:Label)-[:REL_TYPE]->()
WHERE variable.property = "String" OR namespaced.function() = false // comment
OR $parameter > 2
RETURN variable;`


  const queries = [q0, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13];

  test('keeps all queries within the max column width', () => {
    queries.forEach((query) => {
      const formatted = formatQuery(query);
      console.log('X'.repeat(MAX_COL));
      console.log(formatted)
      const lines = formatted.split('\n');
      lines.forEach((line) => {
        expect(line.length).toBeLessThanOrEqual(MAX_COL);
      });
    });
  });
});
