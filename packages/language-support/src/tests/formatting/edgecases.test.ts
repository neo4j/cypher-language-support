import { verifyFormatting } from './testutil';

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
WHERE
  CASE
    WHEN n["asdf"] IS STRING THEN n.prop
    ELSE 'default'
  END
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('multiple case statments after each other', () => {
    const query = `RETURN {Node: p.Node, description:CASE
WHEN p.Description IS NULL OR size(p.Description) = "TxWb1jb3" THEN []
ELSE p.Description[.. "VM6fSkTL"]
END} AS node, r, {Node: b.Node, description:
CASE
WHEN b.Description IS NULL OR size(b.Description) = "wnBMZdOC" THEN []
ELSE b.Description[.. "NHIwucAy"]
END} AS endNode;`;
    const expected = `RETURN {Node: p.Node, description:
  CASE
    WHEN p.Description IS NULL OR size(p.Description) = "TxWb1jb3" THEN []
    ELSE p.Description[.. "VM6fSkTL"]
  END} AS node, r, {Node: b.Node, description:
  CASE
    WHEN b.Description IS NULL OR size(b.Description) = "wnBMZdOC" THEN []
    ELSE b.Description[.. "NHIwucAy"]
  END} AS endNode;`;
    verifyFormatting(query, expected);
  });

  test('multiple case statements with extended case', () => {
    const query = `RETURN {Node: p.Node, description:CASE p.age
    WHEN p.Description IS NULL OR size(p.Description) = "TxWb1jb3" THEN []
    ELSE p.Description[.. "VM6fSkTL"]
    END} AS node, r, {Node: b.Node, description:
    CASE p.age
    WHEN b.Description IS NULL OR size(b.Description) = "wnBMZdOC" THEN []
    ELSE b.Description[.. "NHIwucAy"]
    END} AS endNode;`;
    const expected = `RETURN {Node: p.Node, description:
  CASE p.age
    WHEN p.Description IS NULL OR size(p.Description) = "TxWb1jb3" THEN []
    ELSE p.Description[.. "VM6fSkTL"]
  END} AS node, r, {Node: b.Node, description:
  CASE p.age
    WHEN b.Description IS NULL OR size(b.Description) = "wnBMZdOC" THEN []
    ELSE b.Description[.. "NHIwucAy"]
  END} AS endNode;`;
    verifyFormatting(query, expected);
  });

  test('case statements where wrapping line occurs in a when statement', () => {
    const query = `RETURN 
    CASE 
        WHEN SUM(product.price) >= 100 AND SUM(product.price) < 500 THEN 'Medium Spender'
        WHEN SUM(product.price) >= 500 AND SUM(product.price) < 1000 AND SUM(product.price) < 1000 AND SUM(product.price) < 1000  THEN 'High Spender'
        ELSE 'VIP Customer'
    END AS CustomerCategory`;
    const expected = `RETURN
  CASE
    WHEN SUM(product.price) >= 100 AND SUM(product.price) < 500
         THEN 'Medium Spender'
    WHEN SUM(product.price) >= 500 AND
         SUM(product.price) < 1000 AND
         SUM(product.price) < 1000 AND
         SUM(product.price) < 1000
         THEN 'High Spender'
    ELSE 'VIP Customer'
  END AS CustomerCategory`;
    verifyFormatting(query, expected);
  });

  test('extended case statements where wrapping line occurs in a when statement', () => {
    const query = `RETURN 
    CASE p.age
        WHEN SUM(product.price) >= 100 AND SUM(product.price) < 500 THEN 'Medium Spender'
        WHEN SUM(product.price) >= 500 AND SUM(product.price) < 1000 AND SUM(product.price) < 1000 AND SUM(product.price) < 1000  THEN 'High Spender'
        ELSE 'VIP Customer'
    END AS CustomerCategory`;
    const expected = `RETURN
  CASE p.age
    WHEN SUM(product.price) >= 100 AND SUM(product.price) < 500
         THEN 'Medium Spender'
    WHEN SUM(product.price) >= 500 AND
         SUM(product.price) < 1000 AND
         SUM(product.price) < 1000 AND
         SUM(product.price) < 1000
         THEN 'High Spender'
    ELSE 'VIP Customer'
  END AS CustomerCategory`;
    verifyFormatting(query, expected);
  });

  test('deeply nested case', () => {
    const query = `
WITH s,
    t.name as tableName,
    collect({name: c.name,
            pk: CASE (not pk is null and $printKeyInfo) WHEN True AND TRUE AND 
TRUE AND TRUE AND TRUE AND TRUE AND TRUE AND TRUE AND TRUE THEN "(PK)" ELSE "" END,
            fk: CASE  WHEN True AND TRUE AND TRUE AND TRUE AND TRUE
 AND TRUE AND TRUE AND TRUE AND TRUE AND TRUE AND TRUE AND TRUE 
AND TRUE AND TRUE AND TRUE AND TRUE AND TRUE AND TRUE AND TRUE THEN "(FK)" ELSE "" END
    }) as columns`;
    const expected = `WITH s, t.name AS tableName, collect({name: c.name, pk:
  CASE (NOT pk IS NULL AND $printKeyInfo)
    WHEN
      true AND true AND true AND true AND true AND true AND true AND true AND true
      THEN "(PK)"
    ELSE ""
  END, fk:
  CASE
    WHEN
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true AND
      true
      THEN "(FK)"
    ELSE ""
  END}) AS columns`;
    verifyFormatting(query, expected);
  });

  test('nesting case statement inside case statements', () => {
    const query = `MATCH (p:Person)
RETURN p.name,
       p.age,
       p.occupation,
       CASE 
           WHEN p.age < 18 THEN 'Minor'
           WHEN p.age >= 18 AND p.age < 65 THEN 
               CASE
                   WHEN p.occupation = 'Student' THEN 'Student (Adult)'
                   WHEN p.occupation = 'Engineer' THEN 
                       CASE 
                           WHEN p.experienceYears < 5 THEN 'Junior Engineer'
                           WHEN p.experienceYears >= 5 AND p.experienceYears < 10 THEN 'Mid-level Engineer'
                           ELSE 'Senior Engineer'
                       END
                   WHEN p.occupation = 'Doctor' THEN 
                       CASE
                           WHEN p.specialty = 'Pediatrics' THEN 'Pediatrician'
                           WHEN p.specialty = 'Cardiology' THEN 'Cardiologist'
                           ELSE 'Medical Doctor'
                       END
                   ELSE 'Working Adult'
               END
           ELSE 'Senior'
       END AS status,
       CASE
           WHEN p.salary IS NULL THEN 'No Income Data'
           ELSE
               CASE
                   WHEN p.salary < 30000 THEN 'Low Income'
                   WHEN p.salary >= 30000 AND p.salary < 75000 THEN 'Middle Income'
                   WHEN p.salary >= 75000 AND p.salary < 150000 THEN 'Upper Middle Income'
                   ELSE 'High Income'
               END
       END AS incomeCategory
ORDER BY p.age DESC`;
    const expected = `MATCH (p:Person)
RETURN p.name, p.age, p.occupation,
  CASE
    WHEN p.age < 18 THEN 'Minor'
    WHEN p.age >= 18 AND p.age < 65 THEN
      CASE
        WHEN p.occupation = 'Student' THEN 'Student (Adult)'
        WHEN p.occupation = 'Engineer' THEN
          CASE
            WHEN p.experienceYears < 5 THEN 'Junior Engineer'
            WHEN p.experienceYears >= 5 AND p.experienceYears < 10
              THEN 'Mid-level Engineer'
            ELSE 'Senior Engineer'
          END
        WHEN p.occupation = 'Doctor' THEN
          CASE
            WHEN p.specialty = 'Pediatrics' THEN 'Pediatrician'
            WHEN p.specialty = 'Cardiology' THEN 'Cardiologist'
            ELSE 'Medical Doctor'
          END
        ELSE 'Working Adult'
      END
    ELSE 'Senior'
  END AS status,
  CASE
    WHEN p.salary IS NULL THEN 'No Income Data'
    ELSE
      CASE
        WHEN p.salary < 30000 THEN 'Low Income'
        WHEN p.salary >= 30000 AND p.salary < 75000 THEN 'Middle Income'
        WHEN p.salary >= 75000 AND p.salary < 150000 THEN 'Upper Middle Income'
        ELSE 'High Income'
      END
  END AS incomeCategory ORDER BY p.age DESC`;
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

  test('QPP with only a number', () => {
    const query = `MATCH (n)-->{4}(m)
RETURN n`;
    const expected = query;
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

  test('aligns and breaks long namespaced functions well 1', () => {
    const query = `MATCH (u:User)
WITH u, apoc.util.validate(u.status <> 'active', 'User ' + u.username + ' does not have an active status which is required for processing the requested operation. ' + 'Please check the user account settings for further details.', [u.id, u.username]) AS validation
RETURN u;`;
    const expected = `MATCH (u:User)
WITH
  u,
  apoc.util.validate(
    u.status <> 'active',
    'User ' +
    u.username +
    ' does not have an active status which is required for processing the requested operation. ' +
    'Please check the user account settings for further details.',
    [u.id, u.username]
  )
  AS validation
RETURN u;`;
    verifyFormatting(query, expected);
  });

  test('aligns and breaks long namespaced functions well 2', () => {
    const query = `MATCH (userAccountInfo:UserAccountInformation)
WITH
  userAccountInfo,
  apoc.util.validate(
    NOT userAccountInfo.isVerified,
    'Verification Error: The user account with unique identifier ' +
    userAccountInfo.accountUniqueIdentifier +
    ' has not completed the mandatory ' +
    'verification process required for accessing premium features. ' +
    'Please review your verification email and follow the provided instructions to secure your account.',
    [userAccountInfo.accountUniqueIdentifier, userAccountInfo.emailAddress]
  )
  AS verificationStatus
RETURN userAccountInfo;`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('aligns and breaks long namespaced functions well 3', () => {
    const query = `MATCH (inventoryRecord:ProductInventoryTrackingInformation)
WITH inventoryRecord,
     apoc.util.
     validate(inventoryRecord.currentStock
              < inventoryRecord.criticalThresholdStock,
              'Alert: The inventory record for product SKU '
              + inventoryRecord.productSKU
              + ' indicates a current stock level of '
              + toString(inventoryRecord.currentStock)
              + ', which is below the critical threshold of ' +
              toString(inventoryRecord.criticalThresholdStock) +
              '. Immediate replenishment is required to avoid stockouts and maintain supply chain stability.',
              [inventoryRecord.productSKU, inventoryRecord.currentStock])
     AS stockValidation
RETURN inventoryRecord;`;
    const expected = `MATCH (inventoryRecord:ProductInventoryTrackingInformation)
WITH
  inventoryRecord,
  apoc.util.validate(
    inventoryRecord.currentStock < inventoryRecord.criticalThresholdStock,
    'Alert: The inventory record for product SKU ' +
    inventoryRecord.productSKU +
    ' indicates a current stock level of ' +
    toString(inventoryRecord.currentStock) +
    ', which is below the critical threshold of ' +
    toString(inventoryRecord.criticalThresholdStock) +
    '. Immediate replenishment is required to avoid stockouts and maintain supply chain stability.',
    [inventoryRecord.productSKU, inventoryRecord.currentStock]
  )
  AS stockValidation
RETURN inventoryRecord;`;
    verifyFormatting(query, expected);
  });

  test('should not leave dangling bracket', () => {
    const query = `CREATE (company:Company
       {name: "mrUJWq6A", krs: "Yuu9Wl7d", registration_date: date("FrA1uHGX")
       });`;
    const expected = `
CREATE
  (company:Company
    {name: "mrUJWq6A", krs: "Yuu9Wl7d", registration_date: date("FrA1uHGX")});`.trimStart();
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
WHERE
  f.value > "WhbRf4O4" AND
  ALL(
    x
    IN RANGE("gemqfwmW", TOINTEGER(FLOOR(SQRT(f.value))))
    WHERE f.value % x <> "5DOeV3TE"
  )
SET f.prime = "zt01uZOH"
RETURN f`;
    verifyFormatting(query, expected);
  });

  test('map projections should line up like maps 1', () => {
    const query = `MATCH (p:Person {name: "Alice"})
RETURN p {.name, .age, .email, .phone, .address, .occupation, .nationality,
       .birthdate, .gender} AS personInfo`;
    const expected = `MATCH (p:Person {name: "Alice"})
RETURN
  p {
    .name,
    .age,
    .email,
    .phone,
    .address,
    .occupation,
    .nationality,
    .birthdate,
    .gender
  }
  AS personInfo`;
    verifyFormatting(query, expected);
  });

  test('map projections should line up like maps 2', () => {
    const query = `MATCH (p:Person {name: "Alice"})-[:LIVES_IN]->(c:City)
RETURN p {.name, .age, .email, .phone, address:
    {street: p.street, city: c.name, zip: p.zip}, .occupation, .nationality,
    .birthdate, .gender} AS personInfo`;
    const expected = `MATCH (p:Person {name: "Alice"})-[:LIVES_IN]->(c:City)
RETURN
  p {
    .name,
    .age,
    .email,
    .phone,
    address: {street: p.street, city: c.name, zip: p.zip},
    .occupation,
    .nationality,
    .birthdate,
    .gender
  }
  AS personInfo`;
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

  test('relation with IS CONNECTED should not concatenate to ISCONNECTED', () => {
    const query = `MATCH (n)-[IS CONNECTED]->(m)
RETURN n, m`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('should not treat the trim function as a keyword', () => {
    const query = `MATCH (v)
WHERE trim(v.authors) <> ''
RETURN v`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('trim with leading/trailling/both', () => {
    let query = `MATCH (n)
WHERE trim(LEADING ' ' FROM n.name) = 'Neo'
RETURN n`;
    let expected = query;
    verifyFormatting(query, expected);
    query = `MATCH (n)
WHERE trim(TRAILING ' ' FROM n.name) = 'Neo'
RETURN n`;
    expected = query;
    verifyFormatting(query, expected);
    query = `MATCH (n)
WHERE trim(BOTH ' ' FROM n.name) = 'Neo'
RETURN n`;
    expected = query;
    verifyFormatting(query, expected);
  });

  test('should not treat the normalize function as a keyword', () => {
    const query = `RETURN normalize('Café') AS normalizedDefault`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('should not forget about the second argument in normalize', () => {
    const query = `RETURN normalize('Café', NFD) AS normalizedNFD`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('case within exists expression', () => {
    const query = `MATCH (n)
RETURN
CASE
WHEN EXISTS {
MATCH (person)-[:HAS_DOG]->(dog:Dog)
WHERE person.name = 'Chris'
WITH dog
RETURN
CASE
WHEN dog.name = 'Ozzy' THEN true
ELSE false
END
} THEN 'Relationship'
END`;
    const expected = `
MATCH (n)
RETURN
  CASE
    WHEN EXISTS {
      MATCH (person)-[:HAS_DOG]->(dog:Dog)
      WHERE person.name = 'Chris'
      WITH dog
      RETURN
        CASE
          WHEN dog.name = 'Ozzy' THEN true
          ELSE false
        END
    } THEN 'Relationship'
  END`.trimStart();
    verifyFormatting(query, expected);
  });

  test('exists expression within a case clause', () => {
    const query = `
MATCH (n)
RETURN
CASE
WHEN EXISTS {
MATCH (person)-[:HAS_DOG]->(dog:Dog)
WHERE person.name = 'Chris'
WITH dog
RETURN CASE WHEN dog.name = 'Ozzy' THEN true ELSE false END
} THEN 'Relationship'
END
`.trimStart();
    const expected = `
MATCH (n)
RETURN
  CASE
    WHEN EXISTS {
      MATCH (person)-[:HAS_DOG]->(dog:Dog)
      WHERE person.name = 'Chris'
      WITH dog
      RETURN
        CASE
          WHEN dog.name = 'Ozzy' THEN true
          ELSE false
        END
    } THEN 'Relationship'
  END`.trimStart();
    verifyFormatting(query, expected);
  });

  test('extremely complex expressions with nested exist and case', () => {
    const query = `
MATCH (n)
RETURN 5 +
CASE
WHEN (n)--() THEN
CASE
WHEN EXISTS {
MATCH (person)-[:HAS_DOG]->(dog:Dog)
WHERE person.name = 'Chris' OR person.name = 'Chris' OR person.name = 'Chris' OR person.name = 'Chris' OR person.name = 'Chris' OR person.name = 'Chris'
WITH dog
WHERE dog.name = 'Ozzy'
} THEN 'Relationship'
WHEN (n {prop: 42}) THEN
CASE
WHEN (n)--() OR (n)--() OR (n)--() OR (n)--() OR (n)--() OR (n)--() OR (n)--() OR (n)--() OR (n)--() OR (n)--() OR (n)--() OR (n)--()  THEN 'Relationship'
WHEN (n {prop: 42}) THEN
CASE
WHEN EXISTS {
MATCH (person)-[:HAS_DOG]->(dog:Dog)
WHERE person.name = 'Chris'
WITH dog
WHERE dog.name = 'Ozzy'
} THEN 'Relationship'
WHEN (n {prop: 42}) THEN 'Node'
END
END
END
WHEN (n {prop: 42}) THEN
CASE
WHEN (n)--() THEN 'Relationship'
WHEN (n {prop: 42}) THEN 'Node'
END
END`.trimStart();
    const expected = `
MATCH (n)
RETURN 5 +
  CASE
    WHEN (n)--() THEN
      CASE
        WHEN EXISTS {
          MATCH (person)-[:HAS_DOG]->(dog:Dog)
          WHERE person.name = 'Chris' OR
                person.name = 'Chris' OR
                person.name = 'Chris' OR
                person.name = 'Chris' OR
                person.name = 'Chris' OR
                person.name = 'Chris'
          WITH dog
          WHERE dog.name = 'Ozzy'
        } THEN 'Relationship'
        WHEN (n {prop: 42}) THEN
          CASE
            WHEN (n)--() OR
                 (n)--() OR
                 (n)--() OR
                 (n)--() OR
                 (n)--() OR
                 (n)--() OR
                 (n)--() OR
                 (n)--() OR
                 (n)--() OR
                 (n)--() OR
                 (n)--() OR
                 (n)--()
                 THEN 'Relationship'
            WHEN (n {prop: 42}) THEN
              CASE
                WHEN EXISTS {
                  MATCH (person)-[:HAS_DOG]->(dog:Dog)
                  WHERE person.name = 'Chris'
                  WITH dog
                  WHERE dog.name = 'Ozzy'
                } THEN 'Relationship'
                WHEN (n {prop: 42}) THEN 'Node'
              END
          END
      END
    WHEN (n {prop: 42}) THEN
      CASE
        WHEN (n)--() THEN 'Relationship'
        WHEN (n {prop: 42}) THEN 'Node'
      END
  END`.trimStart();
    verifyFormatting(query, expected);
  });
  test('else statements for CASE needs to align its expression', () => {
    const query = `MATCH (u:User)
WITH u,
     count((u)-[:LIKES]->()) AS likeCount,
     collect(DISTINCT u.interests) AS interestList
RETURN
  CASE
    WHEN EXISTS {
      MATCH (u)-[:OWNS]->(:Device {type: 'Smartphone'})
    } AND likeCount > 10 THEN
      CASE p.name
        WHEN size(interestList)
             > 3 THEN 'Active smartphone user with diverse interests: ' +
                 toString(interestList)
        ELSE 'Active smartphone user with few interests: ' +
        toString(interestList)
      END
    ELSE
      CASE
        WHEN NOT EXISTS {
          MATCH (u)-[:OWNS]->(:Device {type: 'Smartphone'})
        } AND likeCount <= 10
        THEN 'Less active user without a smartphone, interests: ' +
        toString(interestList)
        ELSE 'User with moderate activity, ' + toString(likeCount) +
        ' likes and interests: ' + toString(interestList)
      END
  END AS userProfile;`;
    const expected = `MATCH (u:User)
WITH u,
     count((u)-[:LIKES]->()) AS likeCount,
     collect(DISTINCT u.interests) AS interestList
RETURN
  CASE
    WHEN EXISTS {
      MATCH (u)-[:OWNS]->(:Device {type: 'Smartphone'})
    } AND likeCount > 10 THEN
      CASE p.name
        WHEN size(interestList) > 3
             THEN 'Active smartphone user with diverse interests: ' +
                  toString(interestList)
        ELSE 'Active smartphone user with few interests: ' +
             toString(interestList)
      END
    ELSE
      CASE
        WHEN NOT EXISTS {
          MATCH (u)-[:OWNS]->(:Device {type: 'Smartphone'})
        } AND likeCount <= 10
        THEN 'Less active user without a smartphone, interests: ' +
             toString(interestList)
        ELSE 'User with moderate activity, ' +
             toString(likeCount) +
             ' likes and interests: ' +
             toString(interestList)
      END
  END AS userProfile;`;
    verifyFormatting(query, expected);
  });

  test('CASE expression inside a CALL clause', () => {
    const query = `MATCH (u:User)
CALL {
    WITH u
    OPTIONAL MATCH (u)-[:PURCHASED]->(:Product)
    WITH u, COUNT(*) AS purchaseCount
    RETURN 
    CASE 
    WHEN purchaseCount > 0 THEN 'Active' 
    ELSE 'Inactive' 
    END AS status
}
RETURN u.name, status;`;
    const expected = `
MATCH (u:User)
CALL {
  WITH u
  OPTIONAL MATCH (u)-[:PURCHASED]->(:Product)
  WITH u, COUNT(*) AS purchaseCount
  RETURN
    CASE
      WHEN purchaseCount > 0 THEN 'Active'
      ELSE 'Inactive'
    END AS status
}
RETURN u.name, status;`.trimStart();
    verifyFormatting(query, expected);
  });

  test('string that contains <missing', () => {
    const query = `return "<missing>"`;
    const expected = `RETURN "<missing>"`;
    verifyFormatting(query, expected);
  });
});
