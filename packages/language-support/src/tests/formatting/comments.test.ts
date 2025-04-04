import { verifyFormatting } from './testutil';

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

  test('basic inline comments', () => {
    const inlinecomments = `
MERGE (n) ON CREATE SET n.prop = 0 // Ensure 'n' exists and initialize 'prop' to 0 if created
MERGE (a:A)-[:T]->(b:B)           // Create or match a relationship from 'a:A' to 'b:B'
ON MATCH SET b.name = 'you'       // If 'b' already exists, set its 'name' to 'you'
ON CREATE SET a.name = 'me'       // If 'a' is created, set its 'name' to 'me'
RETURN a.prop                     // Return the 'prop' of 'a'
`;
    const expected = `
MERGE (n)
  ON CREATE SET n.prop = 0 // Ensure 'n' exists and initialize 'prop' to 0 if created
MERGE (a:A)-[:T]->(b:B) // Create or match a relationship from 'a:A' to 'b:B'
  ON MATCH SET b.name = 'you' // If 'b' already exists, set its 'name' to 'you'
  ON CREATE SET a.name = 'me' // If 'a' is created, set its 'name' to 'me'
RETURN a.prop // Return the 'prop' of 'a'`.trim();
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
MERGE
  (a:A)- /* Create or match 'a:A' */
    [:T]->
  (b:B) /* Link 'a' to 'b' */
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
RETURN
  1,
  // Comment
  2,
  // Second comment
  3`.trim();
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

describe('tests for line breaks with comments', () => {
  test('handles comments within long pattern lists gracefully', () => {
    const query = `CREATE 
(qwer_tyuiopa_zxcvbnmasdfg)-[:abcdefgh]->(qwertyu),
(qwertyu)-[:HIJKLMN_OP]->(asdfghj_klzxcvbnmop),
(asdfghj_klzxcvbnmop)-[:QRSTUVWX]->(qazwsxedc_rfvgt),
(mnbvcxzasdfghj_poiuytrewq)-[:YZABCDF]->(qwertyu),
(mnbvcxzasdfghj_poiuytrewq)-[:GHIJKLMN]->(zxcvbnmlkjhgfd_asdfjkl),
(zxcvbnmlkjhgfd_asdfjkl)-[:OPQRS_TU]->(qwertyu),
(qwert_yuiopasdfg)-[:OPQRS_TU]->(qwertyu),

// this is a loooooooooooooooooooong comment
(hjklmno)-[:OPQRS_TU]->(zxcvbn_mnb_lkjhgfdsa),
(zxcvbn_mnb_lkjhgfdsa)-[:OPQRS_TU]->(poiuzxcv),
(poiuzxcv)-[:OPQRS_TU]->(asdfghjk_qwe),
(asdfghjk_qwe)-[:OPQRS_TU]->(zxcvbnmop),
(zxcvbnmop)-[:OPQRS_TU]->(qwertyu),
(zxcvbnmop)-[:VWXYZABC]->(qwertyuiopa_sdfghjklz),

// this is a loooooooooooooooooooong comment
(mnbvcxzlkj)-[:VWXYZABC]->(asdfg_hjkltyui),
(mnbvcxzlkj)-[:VWXYZABC]->(qwertyuiopa_sdfghjklz),

// this is a loooooooooooooooooooong comment
(mnbvcxzasdfghj_poiuytrewq)-[:YZABCDF]->(asdfghj_klzxcvbnmop),
(mnbvcxzasdfghj_poiuytrewq)-[:DEFHIJKL]->(qazwsxedc_rfvgt),
(mnbvcxzasdfghj_poiuytrewq)-[:MNOPQRST]->(qwert_yuiopasdfg);`;
    const expected = `
CREATE
  (qwer_tyuiopa_zxcvbnmasdfg)-[:abcdefgh]->(qwertyu),
  (qwertyu)-[:HIJKLMN_OP]->(asdfghj_klzxcvbnmop),
  (asdfghj_klzxcvbnmop)-[:QRSTUVWX]->(qazwsxedc_rfvgt),
  (mnbvcxzasdfghj_poiuytrewq)-[:YZABCDF]->(qwertyu),
  (mnbvcxzasdfghj_poiuytrewq)-[:GHIJKLMN]->(zxcvbnmlkjhgfd_asdfjkl),
  (zxcvbnmlkjhgfd_asdfjkl)-[:OPQRS_TU]->(qwertyu),
  (qwert_yuiopasdfg)-[:OPQRS_TU]->(qwertyu),

  // this is a loooooooooooooooooooong comment
  (hjklmno)-[:OPQRS_TU]->(zxcvbn_mnb_lkjhgfdsa),
  (zxcvbn_mnb_lkjhgfdsa)-[:OPQRS_TU]->(poiuzxcv),
  (poiuzxcv)-[:OPQRS_TU]->(asdfghjk_qwe),
  (asdfghjk_qwe)-[:OPQRS_TU]->(zxcvbnmop),
  (zxcvbnmop)-[:OPQRS_TU]->(qwertyu),
  (zxcvbnmop)-[:VWXYZABC]->(qwertyuiopa_sdfghjklz),

  // this is a loooooooooooooooooooong comment
  (mnbvcxzlkj)-[:VWXYZABC]->(asdfg_hjkltyui),
  (mnbvcxzlkj)-[:VWXYZABC]->(qwertyuiopa_sdfghjklz),

  // this is a loooooooooooooooooooong comment
  (mnbvcxzasdfghj_poiuytrewq)-[:YZABCDF]->(asdfghj_klzxcvbnmop),
  (mnbvcxzasdfghj_poiuytrewq)-[:DEFHIJKL]->(qazwsxedc_rfvgt),
  (mnbvcxzasdfghj_poiuytrewq)-[:MNOPQRST]->(qwert_yuiopasdfg);`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should not put the arrow on a newline for no reason', () => {
    const query = `MATCH (z:Cccccccc {aaa_id: "T1M3wiuA"})-[:aaaaaaaaaaaaaaa]-(i)
MATCH (i:IIIIIIIIIII:JJJJJJJJ)-[:HHHHHHHHHH]->(t)
//MATCH (t:TTTTTT)-[:BBBBBBBBBB]->(s)
RETURN z`;
    const expected = `MATCH (z:Cccccccc {aaa_id: "T1M3wiuA"})-[:aaaaaaaaaaaaaaa]-(i)
MATCH (i:IIIIIIIIIII:JJJJJJJJ)-[:HHHHHHHHHH]->(t)
//MATCH (t:TTTTTT)-[:BBBBBBBBBB]->(s)
RETURN z`;
    verifyFormatting(query, expected);
  });

  test('this query should be idempotent', () => {
    const bad = `
with "Nc3yUa7F" as vessel_type_code /*This is a comment in an inconvenient place */
   // detail
   , ["AbQk1wMr","PmA6udnt"] as detail_seq
UNWIND range("P4zZV7Fe", size(detail_seq)-"7MZn3aLx") AS idx
return *;`;
    const expected = `
WITH
  "Nc3yUa7F" AS vessel_type_code, /*This is a comment in an inconvenient place */
  // detail
  ["AbQk1wMr", "PmA6udnt"] AS detail_seq
UNWIND range("P4zZV7Fe", size(detail_seq) - "7MZn3aLx") AS idx
RETURN *;`.trim();
    verifyFormatting(bad, expected);
  });

  test('aligns the next line even if the comment breaks the expression', () => {
    const query = `MATCH (n)
RETURN n.salary + // Add bonus value
       1000 AS totalCompensation;`;
    const expected = `MATCH (n)
RETURN
  n.salary + // Add bonus value
  1000 AS totalCompensation;`;
    verifyFormatting(query, expected);
  });

  test('allTokenTypes example from codemirror demo', () => {
    const query = `MATCH (variable :Label)-[:REL_TYPE]->()
WHERE variable.property = "String"
    OR namespaced.function() = false
    // comment
    OR $parameter > 2
RETURN variable;`;
    const expected = `MATCH (variable:Label)-[:REL_TYPE]->()
WHERE
  variable.property = "String" OR namespaced.function() = false
  // comment
  OR $parameter > 2
RETURN variable;`;
    verifyFormatting(query, expected);
  });

  test('function call interrupted by comment', () => {
    const query = `MATCH (n)
WHERE n.prop > 100000 AND function(1241241, 1241241, // Why is there a comment here?
"asdfklsjdf")
RETURN n`;
    const expected = `MATCH (n)
WHERE
  n.prop > 100000 AND
  function(
    1241241,
    1241241, // Why is there a comment here?
    "asdfklsjdf"
  )
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('function call interrupted by hard break comment', () => {
    const query = `MATCH (n)
WHERE n.prop > 100000 AND function(1241241, 1241241, // Why is there a comment here?
// This is a hard break comment
"asdfklsjdf")
RETURN n`;
    const expected = `MATCH (n)
WHERE
  n.prop > 100000 AND
  function(
    1241241,
    1241241, // Why is there a comment here?
    // This is a hard break comment
    "asdfklsjdf"
  )
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('should keep the second return item aligned', () => {
    const query = `
MATCH (a:Node) // first match
WITH a, /* intermediate comment */ a.property AS prop
RETURN prop; // final return`;
    const expected = `MATCH (a:Node) // first match
WITH
  a, /* intermediate comment */
  a.property AS prop
RETURN prop; // final return`;
    verifyFormatting(query, expected);
  });

  test('should remember the outermost alignment for the AND', () => {
    const query = `// This query demonstrates inline and block comments during data retrieval.
MATCH (user:User)-[:LIKES]->(post:Post)
WHERE user.active = true
// Inline comment: Only consider posts with significant engagement
// Inline comment: Only consider posts with significant engagement
// Inline comment: Only consider posts with significant engagement
// Inline comment: Only consider posts with significant engagement
AND post.likes >= 50
/* The following block comment elaborates:
   - Posts with less than 50 likes are considered low impact.
   - Adjust the threshold based on campaign feedback.
*/
RETURN user.username, post.title, post.likes;`;
    const expected = `// This query demonstrates inline and block comments during data retrieval.
MATCH (user:User)-[:LIKES]->(post:Post)
WHERE
  user.active = true
  // Inline comment: Only consider posts with significant engagement
  // Inline comment: Only consider posts with significant engagement
  // Inline comment: Only consider posts with significant engagement
  // Inline comment: Only consider posts with significant engagement
  AND post.likes >= 50
/* The following block comment elaborates:
   - Posts with less than 50 likes are considered low impact.
   - Adjust the threshold based on campaign feedback.
*/
RETURN user.username, post.title, post.likes;`;
    verifyFormatting(query, expected);
  });

  test('should not let the comments dictate the alignment like this', () => {
    const query = `MATCH (p:Product)
WHERE p.price > 100 // price threshold for premium items
      AND p.stock < 50 // low stock warning
          OR
      p.discount > 0 // consider discounted products even if stock is high
RETURN p.name, p.price, p.stock, p.discount;`;
    const expected = `MATCH (p:Product)
WHERE
  p.price > 100 AND // price threshold for premium items
  p.stock < 50 OR // low stock warning
  p.discount > 0 // consider discounted products even if stock is high
RETURN p.name, p.price, p.stock, p.discount;`;
    verifyFormatting(query, expected);
  });

  test('should handle these comments in the middle of a long pattern', () => {
    const query = `CREATE (a:Person {name: 'AlexanderTheGreat'})-
// This is a very long comment that explains the dash here is used to initiate a relationship operator and deliberately stretches well beyond the usual 80 characters to test the formatter's wrapping capabilities.
/* The following arrow operator [ :CONQUERED_BY ] is annotated with an equally verbose comment that spans multiple lines to provide historical context, detail ancient battles, and ensure that every nuance of the relationship is captured in excess of the typical line length. */
       ->(b:Person {name: 'DariusIII'}), (b:Person {name: 'DariusIII'})-
// Additional comment indicating that the relationship continues with further details on historical events, legacies, and the long-lasting impact of conquests that also exceeds standard line width.
/* Note: The relationship type [ :RESPECTED_BY ] implies admiration and acknowledgement that is historically documented and critically analyzed by historians, with commentary that is purposefully overextended to challenge the formatter. */
                                         ->(c:Person {name: 'CleopatraTheQueen'
                                           });`;
    const expected = `
CREATE
  (a:Person {name: 'AlexanderTheGreat'})-->
  // This is a very long comment that explains the dash here is used to initiate a relationship operator and deliberately stretches well beyond the usual 80 characters to test the formatter's wrapping capabilities.
  /* The following arrow operator [ :CONQUERED_BY ] is annotated with an equally verbose comment that spans multiple lines to provide historical context, detail ancient battles, and ensure that every nuance of the relationship is captured in excess of the typical line length. */
  (b:Person {name: 'DariusIII'}),
  (b:Person {name: 'DariusIII'})-->
  // Additional comment indicating that the relationship continues with further details on historical events, legacies, and the long-lasting impact of conquests that also exceeds standard line width.
  /* Note: The relationship type [ :RESPECTED_BY ] implies admiration and acknowledgement that is historically documented and critically analyzed by historians, with commentary that is purposefully overextended to challenge the formatter. */
  (c:Person {name: 'CleopatraTheQueen'});`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should put the QPP in the right place despite comments', () => {
    const query = `MATCH pth = (u:User)-[:USER_EVENT]->(e:GeneratedQuery)
    (()--(:GeneratedQuery) // Optionally successive
    ) * (()-->(:RanCommand)-->(:RanCypher) // One or more chains of RanCommand + RanCypher
    ) + (()-->(:GeneratedQuery) // Optionally successive repeated calls of GeneratedQuery
    ) + (()-->(:RanCommand)-->(:RanCypher) // One or more chains of RanCommand + RanCypher
    ) *
RETURN pth ORDER BY length(pth) DESC
LIMIT 10000;`;
    const expected = `
MATCH
  pth =
    (u:User)-[:USER_EVENT]->
    (e:GeneratedQuery)
    (()--(:GeneratedQuery))* // Optionally successive
    (()-->(:RanCommand)-->(:RanCypher))+ // One or more chains of RanCommand + RanCypher
    (()-->(:GeneratedQuery))+ // Optionally successive repeated calls of GeneratedQuery
    (()-->(:RanCommand)-->(:RanCypher))* // One or more chains of RanCommand + RanCypher
RETURN pth
ORDER BY length(pth) DESC
LIMIT 10000;`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should keep the arrows before the split even if there are comments', () => {
    const query = `
MATCH (a:Account)
      // Starting at an account node
      -[:OWNED_BY]->(p:Person)
      // The person who owns the account
      <-[:SHARED_WITH]-(anotherAccount:Account)
      // Another account that is shared with the same person
      -[:HAS_TRANSACTIONS]->(t:Transaction)
      // Transactions belong to the second account
      -[:CATEGORY]->(c:Category)
RETURN a.id AS accountId, anotherAccount.id AS sharedAccountId, t.amount,
       c.name AS category;`;
    const expected = `
MATCH
  (a:Account)-
    // Starting at an account node
    [:OWNED_BY]->
  (p:Person)<-
    // The person who owns the account
    [:SHARED_WITH]-
  (anotherAccount:Account)-
    // Another account that is shared with the same person
    [:HAS_TRANSACTIONS]->
  (t:Transaction)-
    // Transactions belong to the second account
    [:CATEGORY]->
  (c:Category)
RETURN
  a.id AS accountId,
  anotherAccount.id AS sharedAccountId,
  t.amount,
  c.name AS category;`.trimStart();
    verifyFormatting(query, expected);
  });

  test('handles longer indentation like with OPTIONAL MATCH', () => {
    const query = `MATCH (p:Project)
// A project might have multiple owners
      -[:OWNED_BY]->(user:User)
// The same user might be linked to tasks
OPTIONAL MATCH (user)-[:ASSIGNED_TO]->(task:Task)
// A single user can have multiple tasks in the same project
                                      -[:BELONGS_TO]->(p)
RETURN p.name AS projectName, user.username, task.name AS taskName;`;
    const expected = `
MATCH
  (p:Project)-
    // A project might have multiple owners
    [:OWNED_BY]->
  (user:User)
// The same user might be linked to tasks
OPTIONAL MATCH
  (user)-[:ASSIGNED_TO]->
  (task:Task)-
    // A single user can have multiple tasks in the same project
    [:BELONGS_TO]->
  (p)
RETURN p.name AS projectName, user.username, task.name AS taskName;`.trim();
    verifyFormatting(query, expected);
  });

  test('should not break idempotency because the last comment is not part of the return', () => {
    const query = `MATCH (s:Item)-[r:\`REFERENCED_BY\`]->(t:Item)
WHERE s.format = "LVDcQiqo"
AND t.format = "h5dIgvA4"
//SET r.flowType = 'BOOLEAN=>NUMBER'
RETURN
s.format
//, s.formatMetadata
, t.format;
//, t.formatMetadata;`;
    const expected = `MATCH (s:Item)-[r:\`REFERENCED_BY\`]->(t:Item)
WHERE s.format = "LVDcQiqo" AND t.format = "h5dIgvA4"
//SET r.flowType = 'BOOLEAN=>NUMBER'
RETURN
  s.format,
  //, s.formatMetadata
  t.format;
//, t.formatMetadata;`;
    verifyFormatting(query, expected);
  });

  test('should not associate a comment at the end of a clause with the next', () => {
    const query = `
WITH p
     // This comment should not get indented with the WITH clause
MATCH (a)`;
    const expected = `
WITH p
// This comment should not get indented with the WITH clause
MATCH (a)`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should not put this comment on a new line', () => {
    const query = `WITH abcde_fghi, abcdef_ghij, klmnop_qrstu, abcde_fghijkl.value AS nopqrs_tuvwx // Comment starting at 81
RETURN abcde_fghi`;
    const expected = `WITH abcde_fghi, abcdef_ghij, klmnop_qrstu, abcde_fghijkl.value AS nopqrs_tuvwx // Comment starting at 81
RETURN abcde_fghi`;
    verifyFormatting(query, expected);
  });

  test('this query shold not lose idempotency because of the trailling ;', () => {
    const query = `MERGE (t)
  ON MATCH SET
  t.trend = 5
// This comment is in an awkward place
;`;
    const expected = `MERGE (t)
  ON MATCH SET t.trend = 5;
// This comment is in an awkward place`;
    verifyFormatting(query, expected);
  });

  test('the comments here should not stay indented as they have no reason to do so', () => {
    const query = `MATCH (n)
RETURN *
       // return count(p)
       // return p.prop,  count(p.prop)
LIMIT "6pkMe6Kx"`;
    const expected = `MATCH (n)
RETURN *
// return count(p)
// return p.prop,  count(p.prop)
LIMIT "6pkMe6Kx"`;
    verifyFormatting(query, expected);
  });

  test('comment directly after outermost group should not break alignment for clauses', () => {
    const query = `
USE graph // Specifies the graph or database to use
MATCH (m)-[:RELATION]->(n) // Matches patterns in the graph
MERGE (p:Person {name: "Alice"}) // Ensures a pattern exists in the graph
CREATE (q:Person {name: "Bob"})-[:KNOWS]->(p) // Creates new nodes or relationships
DELETE r // Deletes nodes or relationships
WITH p, q // Passes results to the next clause
UNWIND [1, 2, 3] AS num; // Expands lists into multiple rows`.trimStart();
    const expected = query.trim();
    verifyFormatting(query, expected);
  });

  test('two comments after a clause should not break alignment', () => {
    const query = `
MATCH // One comment.
  // Another comment. Really?
  (m)-[:RELATION]->(n)
RETURN m, n`.trim();
    const expected = query;
    verifyFormatting(query, expected);
  });
});
