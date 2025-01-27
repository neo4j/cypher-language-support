import { formatQuery } from '../formatting/../../formatting/formatting';

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
    expect(formatQuery(query)).toEqual(expected);
  });

  test('on where exists regular subquery', () => {
    const query = `MATCH (a:A) WHERE EXISTS {MATCH (a)-->(b:B) WHERE b.prop = 'yellow'} RETURN a.foo`;

    const expected = `MATCH (a:A)
WHERE EXISTS {
  MATCH (a)-->(b:B)
  WHERE b.prop = 'yellow'
}
RETURN a.foo`;
    expect(formatQuery(query)).toEqual(expected);
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
    expect(formatQuery(query)).toEqual(expected);
  });

  test('Using wrapper space around operators', () => {
    const query = `MATCH p=(s)-->(e)
WHERE s.name<>e.name
RETURN length(p)`;

    const expected = `MATCH p = (s)-->(e)
WHERE s.name <> e.name
RETURN length(p)`;
    expect(formatQuery(query)).toEqual(expected);
  });

  test('formats maps properly', () => {
    const query = `WITH { key1 :'value' ,key2  :  42 } AS map RETURN map`;
    const expected = `WITH {key1: 'value', key2: 42} AS map
RETURN map`;
    expect(formatQuery(query)).toEqual(expected);
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
    expect(formatQuery(propertycomments)).toEqual(expected);
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
    expect(formatQuery(inlinecomments)).toEqual(expected);
  });

  test('comments before the query', () => {
    const inlinecommentbefore = `// This is a comment before everything
MATCH (n) return n`;
    const expected = `// This is a comment before everything
MATCH (n)
RETURN n`;
    expect(formatQuery(inlinecommentbefore)).toEqual(expected);

    const multilinecommentbefore = `/* This is a comment before everything
And it spans multiple lines */
MATCH (n) return n`;
    const expected2 = `/* This is a comment before everything
And it spans multiple lines */
MATCH (n)
RETURN n`;
    expect(formatQuery(multilinecommentbefore)).toEqual(expected2);
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
    expect(formatQuery(inlinemultiline)).toEqual(expected);
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
    expect(formatQuery(inlineandmultiline)).toEqual(expected);
  });
});

describe('other styleguide recommendations', () => {
  test('order by', () => {
    const query = `RETURN user.id ORDER BY potential_reach, like_count;`;
    const expected = `RETURN user.id ORDER BY potential_reach, like_count;`;
    expect(formatQuery(query)).toEqual(expected);
  });

  test('escaped names', () => {
    const query =
      'CREATE (`complex name with special@chars`) RETURN `complex name with special@chars`';
    const expected =
      'CREATE (`complex name with special@chars`)\nRETURN `complex name with special@chars`';
    expect(formatQuery(query)).toEqual(expected);
  });

  test('cases null and booleans properly', () => {
    const query = `WITH NULL as n1, Null as n2, False as f1, True as t1 RETURN NULL, TRUE, FALSE`;
    const expected = `WITH null AS n1, null AS n2, false AS f1, true AS t1
RETURN null, true, false`;
    expect(formatQuery(query)).toEqual(expected);
  });

  test('can handle using keyword literal names in weird ways', () => {
    const query1 = 'MATCH (NULL) RETURN NULL';
    const expected1 = 'MATCH (NULL)\nRETURN null';
    expect(formatQuery(query1)).toEqual(expected1);

    const query2 = 'MATCH (NAN) RETURN NAN';
    const expected2 = 'MATCH (NAN)\nRETURN NAN';
    expect(formatQuery(query2)).toEqual(expected2);

    const query3 = 'MATCH (INF) RETURN INF';
    const expected3 = 'MATCH (INF)\nRETURN INF';
    expect(formatQuery(query3)).toEqual(expected3);
  });

  test('puts one space between label/type predicates and property predicates in patterns', () => {
    const query = `MATCH (p:Person{property:-1})-[:KNOWS{since: 2016}]->() RETURN p.name`;
    const expected = `MATCH (p:Person {property: -1})-[:KNOWS {since: 2016}]->()\nRETURN p.name`;
    expect(formatQuery(query)).toEqual(expected);
  });

  test('no space in patterns', () => {
    const query = 'MATCH (:Person) --> (:Vehicle) RETURN count(*)';
    const expected = 'MATCH (:Person)-->(:Vehicle)\nRETURN count(*)';
    expect(formatQuery(query)).toEqual(expected);
  });

  test('space after each comma in lists and enumerations', () => {
    const query = `MATCH (),()
WITH ['a','b',3.14] AS list
RETURN list,2,3,4`;
    const expected = `MATCH (), ()
WITH ['a', 'b', 3.14] AS list
RETURN list, 2, 3, 4`;
    expect(formatQuery(query)).toEqual(expected);
  });

  test('handles empty list literals', () => {
    const query = `WITH [] AS emptyList RETURN emptyList`;
    const expected = `WITH [] AS emptyList
RETURN emptyList`;
    expect(formatQuery(query)).toEqual(expected);
  });

  test('should not add space for negating minuses', () => {
    const query = 'RETURN -1, -2, -3';
    const expected = 'RETURN -1, -2, -3';
    expect(formatQuery(query)).toEqual(expected);
  });
});

describe('various edgecases', () => {
  test('multiple queries', () => {
    const multiquery = 'RETURN 1; RETURN 2; RETURN 3;';
    const expectedMultiquery = 'RETURN 1;\nRETURN 2;\nRETURN 3;';
    expect(formatQuery(multiquery)).toEqual(expectedMultiquery);
  });
});
