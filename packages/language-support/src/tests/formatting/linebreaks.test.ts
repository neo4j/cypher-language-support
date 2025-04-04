import { formatQuery } from '../../formatting/formatting';
import { MAX_COL } from '../../formatting/formattingHelpers';
import { verifyFormatting } from './testutil';

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

  const q22 = `MATCH (e:Employee) RETURN e.name, CASE WHEN e.salary > 150000 AND e.experience > 10 THEN 'Senior ' + (CASE WHEN e.department = 'Engineering' THEN 'Engineer' WHEN e.department = 'Sales' THEN 'Sales Leader' ELSE 'Manager' END) WHEN e.salary > 100000 AND e.experience > 7 THEN 'Experienced ' + (CASE WHEN e.department = 'Engineering' THEN 'Developer' WHEN e.department = 'HR' THEN 'HR Specialist' ELSE 'Associate' END) WHEN e.salary > 75000 AND e.experience > 5 THEN 'Mid-Level ' + (CASE WHEN e.department = 'Engineering' THEN 'Engineer' ELSE 'Professional' END) ELSE 'Junior ' + (CASE WHEN e.department = 'Engineering' THEN 'Engineer' ELSE 'Staff' END) END AS jobTitle`;

  const q23 = `MATCH (u:User) CALL { WITH u MATCH (u)-[:PURCHASED]->(o:Order)-[:CONTAINS]->(p:Product) WHERE p.price > 100 AND p.category IN ['Electronics','Computers','Smartphones','Accessories','Gaming','Wearables','Home Automation','Networking','Audio','Video','Software','Peripherals'] WITH u, o, p, p.price * (1 - COALESCE(p.discount,0)) AS netPrice, CASE WHEN p.rating > 4.5 THEN 'Excellent' WHEN p.rating > 3.5 THEN 'Good' WHEN p.rating > 2.5 THEN 'Average' ELSE 'Poor' END AS qualityRating RETURN o, COLLECT({product: p.name, netPrice: netPrice, qualityRating: qualityRating, features: p.features, warranty: p.warranty, stock: p.stock, supplier: p.supplier}) AS orderProducts } WITH u, COUNT(o) AS totalOrders, SUM([x IN COLLECT(o) | x.total]) AS totalSpent WHERE totalOrders > 3 RETURN u, totalOrders, totalSpent`;

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
    q22,
    q23,
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
MATCH
  path =
    (m1:loooooooongrelationtypename {code: "mFG66X9v"})-
      [r:verylongrelationtypename]->
    (m2:anotherverylongrelationtypename)
RETURN path`.trimStart();
    verifyFormatting(q21, expected);
  });

  test('does not split the $ and the parameter name', () => {
    const query =
      'RETURN $paraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaam';
    const expected = `
RETURN
  $paraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaam`.trimStart();
    verifyFormatting(query, expected);
  });

  test('aligns split node pattern', () => {
    const query = `MERGE (veeeeeerylongnodenameeeeeeeee:ZjFYQFrVDTVsA
    {name: $veeeeeeeeerylongparaaaaaaaaaaaaaaam})`;
    const expected = `
MERGE
  (veeeeeerylongnodenameeeeeeeee:ZjFYQFrVDTVsA
    {name: $veeeeeeeeerylongparaaaaaaaaaaaaaaam})`.trimStart();
    verifyFormatting(query, expected);
  });
  test('aligns nested parentheses well', () => {
    const query = `MATCH (n)
  WHERE ((($param1 IS NOT NULL AND this1.title = $param1) AND this1:WaFQynNy) AND (this1:WaFQynNy OR this1:hyztnnwg OR this1:QpLckJcy))`;
    const expected = `MATCH (n)
WHERE
  ((($param1 IS NOT NULL AND this1.title = $param1) AND this1:WaFQynNy) AND
    (this1:WaFQynNy OR this1:hyztnnwg OR this1:QpLckJcy))`;
    verifyFormatting(query, expected);
  });

  test('aligns large maps one further than the opening brace', () => {
    const query = `RETURN {looooooooooooooooooooooongkey:value, loooooooooooooooooooongkeeeyyyyyyyy:value2, looooooooooooooongkeeey:value3}`;
    const expected = `
RETURN
  {
    looooooooooooooooooooooongkey: value,
    loooooooooooooooooooongkeeeyyyyyyyy: value2,
    looooooooooooooongkeeey: value3
  }`.trimStart();
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
WHERE
  p.article_number IN
  [
    "OCj0AswA",
    "dFRbj1s3",
    "oMbdvgm7",
    "L4Vey8xn",
    "GNgeDIkA",
    "pU4RE0lM",
    "M6XNVJsO",
    "NcdW0tuB",
    "Pf6RIuP4",
    "6tKStKwl",
    "HfvahDu5",
    "gJoq3HnU",
    "g7LjxbGD"
  ]
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
MATCH
  (eq:loooooongtype {keeeey: "sAGhmzsL"})-[]-(m:tyyyyype),
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
    const expected = `
MATCH
  (p:Person)-[:ACTED_IN]->
  (m:Movie)<-[:ACTED_IN]-
  (Kevin:Person {name: "HEZDAAhT"})
WHERE p.name <> "nnwAPHJg"
RETURN p.name AS Name, p.born AS BirthYear, m.title AS MovieTitle
ORDER BY Name ASC
LIMIT "ZTWWLgIq"`.trimStart();
    verifyFormatting(query, expected);
  });

  test('paths should be aligned after the =', () => {
    const query = `MATCH p1 = (i:tyyyype {keeeeeeeey: "1QwLfE5M"})--
      (il:nodetyyyype {type: "58vomdG0"})
RETURN i, apoc.map.removeKeys(il, ["TT6hUzUE"]) AS props`;
    const expected = `
MATCH
  p1 = (i:tyyyype {keeeeeeeey: "1QwLfE5M"})--(il:nodetyyyype {type: "58vomdG0"})
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
CREATE
  (:actor {name: "jEmtGrSI"}),
  (:actor {name: "HqFUar0i"}),
  (:actor {name: "ZAvjBFt6"}),
  (:actor {name: "7hbDfMOa"}),
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
WHERE
  p.price > 1000 AND
  p.stock > 50 AND
  p.category IN
  [
    'Electronics',
    'Home Appliances',
    'Garden Tools',
    'Sports Equipment',
    'Automotive Parts',
    'Fashion Accessories',
    'Books',
    'Toys',
    'Jewelry',
    'Musical Instruments',
    'Art Supplies',
    'Office Supplies'
  ]
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
    const expected = `CREATE
  (a:Location {name: "DXe5KhL3"}),
  (b:Location {name: "v2BpdkOj"}),
  (c:Location {name: "Fi5CMJ9Y"}),
  (d:Location {name: "S31K3X1o"}),
  (a)-[:ROUTE_TO {distance: "zjisNPKv", duration: "ivAC2TGF"}]->(b),
  (b)-[:ROUTE_TO {distance: "Irogkqf1", duration: "QsCt67v1"}]->(c),
  (c)-[:ROUTE_TO {distance: "Y53yoQwn", duration: "X41tnMDd"}]->(d);`;
    verifyFormatting(query, expected);
  });
  test('should align arguments of function invocation after opening bracket', () => {
    const query = `RETURN collect(create_this1 { datetime: apoc.date.convertFormat(toString(create_this1.datetime), "OZQvXyoU", "EhpkDy8g") }) AS data`;
    const expected = `RETURN
  collect(
    create_this1 {
      datetime:
        apoc.date.convertFormat(
          toString(create_this1.datetime),
          "OZQvXyoU",
          "EhpkDy8g"
        )
    }
  ) AS data`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should not forget about alignment for unwind clause', () => {
    const query = `UNWIND [{_id:"MiltPFxk", properties:{name:"5nIou0gC", id:"ha44MrBy", value:"6o5lzHd6"}}, {_id:"2uMA2cW8", properties:{name:"WOsBC4Ks", id:"bP526OzE", value:"WhYP4dxd"}}] AS row RETURN row`;
    const expected = `UNWIND
  [
    {
      _id: "MiltPFxk",
      properties: {name: "5nIou0gC", id: "ha44MrBy", value: "6o5lzHd6"}
    },
    {
      _id: "2uMA2cW8",
      properties: {name: "WOsBC4Ks", id: "bP526OzE", value: "WhYP4dxd"}
    }
  ] AS row
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
WHERE
  s.deactivated = "k1fU0uk0" AND
  NOT (toLower(s.name) CONTAINS "ki9c1rU8") AND
  p.networkDbId IS NOT NULL
WITH
  p,
  COLLECT({platfId: s.platfId, name: s.name, numMsgs: s.deactivated}) AS platfs,
  COUNT(s) AS numplatf
WHERE numplatf >= "gkLi0qvW"
RETURN DISTINCT p.networkDbId, p.name, platfs`;
    verifyFormatting(query, expected);
  });

  test('no splits within an arrow', () => {
    const query = `MERGE (naame)-[:tyyyyyyyyyype {keeeeeeeey: "dFTkCNlb", keey: "rmmCQGIb"}]->(naaaaame);`;
    const expected = `
MERGE
  (naame)-[:tyyyyyyyyyype {keeeeeeeey: "dFTkCNlb", keey: "rmmCQGIb"}]->
  (naaaaame);`.trimStart();
    verifyFormatting(query, expected);
  });

  test('function arguments should align', () => {
    const query = `CALL apoc.periodic.iterate("eZQB0P0q", "1p7EFkyE", {batchSize: "v0Ap5F8F", parallel: "UUc75lVg"}) YIELD batches, total, timeTaken, committedOperations, failedOperations`;
    const expected = `CALL
  apoc.periodic.iterate(
    "eZQB0P0q",
    "1p7EFkyE",
    {batchSize: "v0Ap5F8F", parallel: "UUc75lVg"}
  )
  YIELD batches, total, timeTaken, committedOperations, failedOperations`.trimStart();
    verifyFormatting(query, expected);
  });

  test('does not split weird parenthesized expressions in an odd way', () => {
    const query = `MATCH (p:Product)--(o:Order)
WHERE (p.priiiiiiiiiiiiiiiiiiice + o.siiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiize)
RETURN p;`;
    const expected = `MATCH (p:Product)--(o:Order)
WHERE
  (p.priiiiiiiiiiiiiiiiiiice + o.siiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiize)
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
MATCH
  (dmk:Station {name: 'Denmark Hill'})<-[:CALLS_AT]-
  (l1a:CallingPoint)-[:NEXT]->+
  (l1b)-[:CALLS_AT]->
  (x:Station)<-[:CALLS_AT]-
  (l2a:CallingPoint)-[:NEXT]->*
  (l2b)-[:CALLS_AT]->
  (gtw:Station {name: 'Gatwick Airport'})
RETURN dmk`.trim();
    verifyFormatting(query, expected);
  });

  test('should break after DISTINCT that follows RETURN', () => {
    const query = `MATCH (abcde:wxyz)-[]->(fgh:wxyz)-[]->(ijk:wxyz)-[]->(lm:wxyz)
WHERE abcde.zxcvbnml = "XyZpQ8Rt"
RETURN DISTINCT
abcde.qwertyuiopa, abcde.zxcvbnmasdfgh, abcde.zxcvbnml, fgh.qwertyuiopa,
fgh.zxcvbnmasdfgh, fgh.zxcvbnml, ijk.qwertyuiopa, ijk.zxcvbnmasdfgh,
ijk.zxcvbnml, lm.qwertyuiopa, lm.zxcvbnmasdfgh, lm.zxcvbnml, lm.lkjhgfdswert
ORDER BY lm.lkjhgfdswert ASC`;
    const expected = `MATCH (abcde:wxyz)-[]->(fgh:wxyz)-[]->(ijk:wxyz)-[]->(lm:wxyz)
WHERE abcde.zxcvbnml = "XyZpQ8Rt"
RETURN DISTINCT
  abcde.qwertyuiopa,
  abcde.zxcvbnmasdfgh,
  abcde.zxcvbnml,
  fgh.qwertyuiopa,
  fgh.zxcvbnmasdfgh,
  fgh.zxcvbnml,
  ijk.qwertyuiopa,
  ijk.zxcvbnmasdfgh,
  ijk.zxcvbnml,
  lm.qwertyuiopa,
  lm.zxcvbnmasdfgh,
  lm.zxcvbnml,
  lm.lkjhgfdswert
ORDER BY lm.lkjhgfdswert ASC`;
    verifyFormatting(query, expected);
  });

  test('should break after distinct but not the alphabet', () => {
    const query = `return distinct
  a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w`;
    const expected = `
RETURN DISTINCT
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  k,
  l,
  m,
  n,
  o,
  p,
  q,
  r,
  s,
  t,
  u,
  v,
  w`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should not  break after distinct', () => {
    const query = `return distinct
  a, b, c, d, e, f`;
    const expected = `RETURN DISTINCT a, b, c, d, e, f`;
    verifyFormatting(query, expected);
  });

  test('simple selector example', () => {
    const query = `MATCH SHORTEST 1
  (:Station {name: 'Hartlebury'})
  (()--(n))+
  (:Station {name: 'Cheltenham Spa'})
RETURN [stop in n[..-1] | stop.name] AS stops`;
    const expected = `
MATCH
  SHORTEST 1
  (:Station {name: 'Hartlebury'}) (()--(n))+(:Station {name: 'Cheltenham Spa'})
RETURN [stop IN n[.. -1] | stop.name] AS stops`.trimStart();
    verifyFormatting(query, expected);
  });

  test('complex selector example', () => {
    const query = `MATCH SHORTEST 1 ((:Station {name: 'Hartlebury'}) (()--(n:Station))+
                 (:Station {name: 'Cheltenham Spa'}) WHERE none(
                 stop IN n[.. -1] WHERE stop.name = 'Bromsgrove'))
RETURN [stop IN n[.. -1] | stop.name] AS stops`;
    const expected = `
MATCH
  SHORTEST 1
  ((:Station {name: 'Hartlebury'})
    (()--(n:Station))+
    (:Station {name: 'Cheltenham Spa'})
    WHERE none(stop IN n[.. -1] WHERE stop.name = 'Bromsgrove'))
RETURN [stop IN n[.. -1] | stop.name] AS stops`.trimStart();
    verifyFormatting(query, expected);
  });

  test('complex selector example with long bromsgrove', () => {
    const query = `MATCH SHORTEST 1 ((:Station {name: 'Hartlebury'}) (()--(n:Station))+
                 (:Station {name: 'Cheltenham Spa'}) WHERE none(
                 stop IN n[.. -1] WHERE stop.name = 'Bromsgroveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'))
RETURN [stop IN n[.. -1] | stop.name] AS stops`;
    // TODO: should the parenthesis ending after none be indented less? since the one after it
    // belongs to the one wrapping the whole expr
    const expected = `
MATCH
  SHORTEST 1
  ((:Station {name: 'Hartlebury'})
    (()--(n:Station))+
    (:Station {name: 'Cheltenham Spa'})
    WHERE
      none(
        stop IN n[.. -1]
        WHERE stop.name = 'Bromsgroveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      ))
RETURN [stop IN n[.. -1] | stop.name] AS stops`.trimStart();
    verifyFormatting(query, expected);
  });

  test('selector example with path', () => {
    const query = `MATCH p = SHORTEST 1 ((:Station {name: 'Thisisanabsurdlylongnametomakeitawkward'})
           (()--(n:Station))+(:Station {name: 'Cheltenham Spa'}) WHERE
           none(stop IN n[.. -1] WHERE stop.name = 'Bromsgrove'))
RETURN [stop IN n[.. -1] | stop.name] AS stops`;
    const expected = `
MATCH
  p =
    SHORTEST 1
    ((:Station {name: 'Thisisanabsurdlylongnametomakeitawkward'})
      (()--(n:Station))+
      (:Station {name: 'Cheltenham Spa'})
      WHERE none(stop IN n[.. -1] WHERE stop.name = 'Bromsgrove'))
RETURN [stop IN n[.. -1] | stop.name] AS stops`.trimStart();
    verifyFormatting(query, expected);
  });

  test('selector and quantifier example', () => {
    const query = `MATCH path = ANY
  (:Station {name: 'Pershore'})-[l:LINK WHERE l.distance < 10]-+(b:Station {name: 'Bromsgrove'})
RETURN [r IN relationships(path) | r.distance] AS distances`;
    const expected = `
MATCH
  path =
    ANY
    (:Station {name: 'Pershore'})-[l:LINK WHERE l.distance < 10]-+
    (b:Station {name: 'Bromsgrove'})
RETURN [r IN relationships(path) | r.distance] AS distances`.trimStart();
    verifyFormatting(query, expected);
  });

  test('test for nested exists cases', () => {
    const query = `MATCH (user:Actor {actor_type:"EFXxFHob"})
WHERE(
(size(apoc.coll.intersection(labels(user),idp_label_list))="3INQ6teR" OR user.service_type="UlAAMmmD")AND NOT EXISTS{
MATCH(user)-[:PART_OF]->(group:Actor{actor_type:"A0cFHwrB"})
WITH group,apoc.coll.intersection(labels(group),idp_label_list)AS group_idp_labels
WHERE(size(group_idp_labels)="7SOM63mX" OR group.service_type="11gaOJfr")AND EXISTS{
MATCH(group)-[:HAS_ACCESS]->(resource:Resource)
WHERE resource.sensitivity>7 AND NOT EXISTS{
MATCH(resource)-[:PROTECTED_BY]->(policy:Policy)
WHERE policy.enforcement="strict"
}AND resource.type IN["confidential","restricted"]
}OR group.created_at<datetime("2023-01-01") 
OR group.created_at<datetime("2023-01-01")
OR group.created_at<datetime("2023-01-01")
}
)OR(
user.active=true AND EXISTS{
MATCH(user)-[:HAS_ROLE]->(role:Role)
WHERE role.type IN role_types AND NOT EXISTS{
MATCH(role)-[:REQUIRES]->(approval:Approval)
WHERE approval.status<>"granted"
}AND(role.expiry_date>datetime()OR role.permanent=true)
}AND user.last_login>datetime()-duration({days:30})
)`;
    const expected = `MATCH (user:Actor {actor_type: "EFXxFHob"})
WHERE ((size(apoc.coll.intersection(labels(user), idp_label_list)) = "3INQ6teR"
        OR user.service_type = "UlAAMmmD") AND NOT EXISTS {
        MATCH (user)-[:PART_OF]->(group:Actor {actor_type: "A0cFHwrB"})
        WITH group, apoc.coll.intersection(labels(group), idp_label_list)
                    AS group_idp_labels
        WHERE (size(group_idp_labels) = "7SOM63mX" OR
               group.service_type = "11gaOJfr") AND EXISTS {
                MATCH (group)-[:HAS_ACCESS]->(resource:Resource)
                WHERE resource.sensitivity > 7 AND NOT EXISTS {
                        MATCH (resource)-[:PROTECTED_BY]->(policy:Policy)
                        WHERE policy.enforcement = "strict"
                      } AND resource.type IN ["confidential", "restricted"]
              } OR group.created_at < datetime("2023-01-01") OR
              group.created_at < datetime("2023-01-01") OR
              group.created_at < datetime("2023-01-01")
      }) OR (user.active = true AND EXISTS {
        MATCH (user)-[:HAS_ROLE]->(role:Role)
        WHERE role.type IN role_types AND NOT EXISTS {
                MATCH (role)-[:REQUIRES]->(approval:Approval)
                WHERE approval.status <> "granted"
              } AND (role.expiry_date > datetime() OR role.permanent = true)
      } AND user.last_login > datetime() - duration({days: 30}))`;
    verifyFormatting(query, expected);
  });
  test('test that clause under collect gets properly indented', () => {
    const query = `MATCH (person:Person)
RETURN person.name AS name, COLLECT {
  MATCH (person)-[r:HAS_DOG]->(dog:Dog)
  WHERE r.since > 2017
  RETURN dog.name
} AS youngDogs`;
    const expected = query;
    verifyFormatting(query, expected);
  });
  test('count expression with only expression', () => {
    const query = `MATCH (person:Person)
WHERE COUNT { (person)-[:HAS_DOG]->(:Dog) } > 1
RETURN person.name AS name`;
    const expected = query;
    verifyFormatting(query, expected);
  });
  test('count expression with regular query', () => {
    const query = `MATCH (person:Person)
RETURN person.name AS name, COUNT {
  MATCH (person)-[:HAS_DOG]->(dog:Dog)
  RETURN dog.name AS petName
    UNION
  MATCH (person)-[:HAS_CAT]->(cat:Cat)
  RETURN cat.name AS petName
} AS numPets`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('should prefer to not split before a relation 1', () => {
    const query = `
MATCH (a:person {name: 'alice', age: 30})-[r:friend_of]->
      (b:person {name: 'bob'})-[s:colleague_of]->(c:person {name: 'carol'})-
      [t:partner_of]->(d:person {name: 'david'})-[u:mentor_and_friend_of]->
      (e:person {name: 'eve'})
RETURN a`;
    const expected = `
MATCH
  (a:person {name: 'alice', age: 30})-[r:friend_of]->
  (b:person {name: 'bob'})-[s:colleague_of]->
  (c:person {name: 'carol'})-[t:partner_of]->
  (d:person {name: 'david'})-[u:mentor_and_friend_of]->
  (e:person {name: 'eve'})
RETURN a`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should prefer to not split before a relation 2', () => {
    const query = `
MATCH (a:Person {name: 'Alice'})   -[r:KNOWS]->
      (b:Person {name: 'Bob'}) -[s:FRIEND_OF]->
      (c:Person {name: 'Charlie'})
RETURN a`;
    const expected = `
MATCH
  (a:Person {name: 'Alice'})-[r:KNOWS]->
  (b:Person {name: 'Bob'})-[s:FRIEND_OF]->
  (c:Person {name: 'Charlie'})
RETURN a`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should prefer to not split before a relation 3', () => {
    const query = `
MATCH (NOD01)-[REL01]->
      (NOD02)-[REL02]->
      (NOD03)-[REL03]->
      (NOD04)-[REL04]->
      (N)-[REL05]->
      (NOD06)-[REL06]->
      (NOD07)
RETURN NOD01`;
    // The node (N) would fit on the previous line but we prefer to split before nodes
    const expected = `
MATCH
  (NOD01)-[REL01]->
  (NOD02)-[REL02]->
  (NOD03)-[REL03]->
  (NOD04)-[REL04]->
  (N)-[REL05]->
  (NOD06)-[REL06]->
  (NOD07)
RETURN NOD01`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should prefer to not split before a relation 4', () => {
    const query = `
MATCH (Alice123:Person)-[FRND_REL:friendship]->
      (Bob:Indiv)-[COWORK_REL:colleagueRelationship]->
      (Carla55:EmployeeType)-[PARTNR:partner_of]->
      (Dave:Short)
RETURN Alice123`;
    const expected = `
MATCH
  (Alice123:Person)-[FRND_REL:friendship]->
  (Bob:Indiv)-[COWORK_REL:colleagueRelationship]->
  (Carla55:EmployeeType)-[PARTNR:partner_of]->
  (Dave:Short)
RETURN Alice123`.trimStart();
    verifyFormatting(query, expected);
  });

  test('long list in a return', () => {
    const query = `
RETURN ["OCj0AswA",
       "dFRbj1s3",
       "oMbdvgm7",
       "L4Vey8xn",
       "GNgeDIkA",
       "pU4RE0lM",
       "M6XNVJsO",
       "NcdW0tuB",
       "Pf6RIuP4",
       "6tKStKwl",
       "HfvahDu5",
       "gJoq3HnU",
       "g7LjxbGD"]
RETURN p`;
    const expected = `
RETURN
  [
    "OCj0AswA",
    "dFRbj1s3",
    "oMbdvgm7",
    "L4Vey8xn",
    "GNgeDIkA",
    "pU4RE0lM",
    "M6XNVJsO",
    "NcdW0tuB",
    "Pf6RIuP4",
    "6tKStKwl",
    "HfvahDu5",
    "gJoq3HnU",
    "g7LjxbGD"
  ]
RETURN p`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should indent and break ON CREAT SET clauses properly', () => {
    const query = `MERGE (a:Author {name: 'J.K. Rowling'})
  ON CREATE SET a.birthYear = 1965,
  a.nationality = 'British',
  a.booksWritten = 7,
  a.netWorth = 1000000000,
  a.genre = 'Fantasy'
MERGE (b:Book {title: 'Harry Potter and the Sorcerers Stone'})
  ON CREATE SET b.publishedYear = 1997,
  b.sales = 120000000,
  b.rating = 4.8,
  b.genre = 'Fantasy'
MERGE (a)-[:WROTE]->(b)
RETURN a, b`;
    const expected = `MERGE (a:Author {name: 'J.K. Rowling'})
  ON CREATE SET
    a.birthYear = 1965,
    a.nationality = 'British',
    a.booksWritten = 7,
    a.netWorth = 1000000000,
    a.genre = 'Fantasy'
MERGE (b:Book {title: 'Harry Potter and the Sorcerers Stone'})
  ON CREATE SET
    b.publishedYear = 1997,
    b.sales = 120000000,
    b.rating = 4.8,
    b.genre = 'Fantasy'
MERGE (a)-[:WROTE]->(b)
RETURN a, b`;
    verifyFormatting(query, expected);
  });

  /* TODO: this does not fully work yet since the parenthesized expr
 * adds too much indentation. Really, it should be the CASE taking 
 * responsibility for the indentation here. It's almost correct though.
  test('avoidbreak and mustbreak should cooperate', () => {
    const query = `MATCH (e:Employee)
RETURN
  e.name,
  CASE
    WHEN
      e.salary > 150000 AND e.experience > 10
      THEN
        'Senior ' +
        (
          CASE
            WHEN e.department = 'Engineering' THEN 'Engineer'
            WHEN e.department = 'Sales' THEN 'Sales Leader'
            ELSE 'Manager'
          END)
    WHEN
      e.salary > 100000 AND e.experience > 7
      THEN
        'Experienced ' +
        (
          CASE
            WHEN e.department = 'Engineering' THEN 'Developer'
            WHEN e.department = 'HR' THEN 'HR Specialist'
            ELSE 'Associate'
          END)
    WHEN
      e.salary > 75000 AND e.experience > 5
      THEN
        'Mid-Level ' +
        (
          CASE
            WHEN e.department = 'Engineering' THEN 'Engineer'
            ELSE 'Professional'
          END)
    ELSE
      'Junior ' +
      (
        CASE
          WHEN e.department = 'Engineering' THEN 'Engineer'
          ELSE 'Staff'
        END)
  END AS jobTitle`;
    const expected = `
MATCH (e:Employee)
RETURN
  e.name,
  CASE
    WHEN
      e.salary > 150000 AND e.experience > 10
      THEN
        'Senior ' +
        (CASE
           WHEN e.department = 'Engineering' THEN 'Engineer'
           WHEN e.department = 'Sales' THEN 'Sales Leader'
           ELSE 'Manager'
         END)
    WHEN
      e.salary > 100000 AND e.experience > 7
      THEN
        'Experienced ' +
        (CASE
           WHEN e.department = 'Engineering' THEN 'Developer'
           WHEN e.department = 'HR' THEN 'HR Specialist'
           ELSE 'Associate'
         END)
    WHEN
      e.salary > 75000 AND e.experience > 5
      THEN
        'Mid-Level ' +
        (CASE
           WHEN e.department = 'Engineering' THEN 'Engineer'
           ELSE 'Professional'
         END)
    ELSE
      'Junior ' +
      (CASE
         WHEN e.department = 'Engineering' THEN 'Engineer'
         ELSE 'Staff'
       END)
  END AS jobTitle`.trimStart();
    verifyFormatting(query, expected);
  })
*/

  test('NOT should stick together with the rest of the expr here', () => {
    const query = `MATCH (this:GkXPMxPR)
WHERE this.id = $param0

SET this.id = $param1
WITH this
WHERE
  apoc.util.validatePredicate(
    NOT
    ($paraaaaaaam3 = "6g4484AV" AND
      ($paraaam4 IS NOT NULL AND this.id = $paraaam4)),
    "QGo5iARQ",
    ["NZnJjL3p"]
  )
RETURN collect(DISTINCT this {.id}) AS data`;
    const expected = `MATCH (this:GkXPMxPR)
WHERE this.id = $param0

SET this.id = $param1
WITH this
WHERE
  apoc.util.validatePredicate(
    NOT ($paraaaaaaam3 = "6g4484AV" AND
      ($paraaam4 IS NOT NULL AND this.id = $paraaam4)),
    "QGo5iARQ",
    ["NZnJjL3p"]
  )
RETURN collect(DISTINCT this {.id}) AS data`;
    verifyFormatting(query, expected);
  });

  test('list comprehensions should split in a resonable way if they have to split', () => {
    const query = `WITH
  [
  r
  IN
  relationships
  WHERE
  (TYPE(r) = "rkeOtT3d" AND
    ANY(x IN labels(startNode(r)) WHERE x = "AeQQQ0q5") AND
    ANY(x IN labels(endNode(r)) WHERE x = "WTogmsn8")) OR
  (TYPE(r) = "ngSFntWa" AND
    ANY(x IN labels(startNode(r)) WHERE x = "YWbcqb1r") AND
    r.weight > "dbz3Z3ze") OR
  (TYPE(r) = "oxX2TYVT" AND
    ANY(x IN labels(endNode(r)) WHERE x = "kGlmMPOS") AND
    r.weight > "Vt3CDfcZ") OR
  ((startNode(r).id = p.id OR endNode(r).id = p.id) AND r.weight > "Glh7wLxH") OR
  (TYPE(r) = "QXD44TwO" AND r.weight > "Overcxkc")
  |
  r] AS relationships`;
    const expected = `WITH
  [
    r IN relationships
    WHERE
      (TYPE(r) = "rkeOtT3d" AND
        ANY(x IN labels(startNode(r)) WHERE x = "AeQQQ0q5") AND
        ANY(x IN labels(endNode(r)) WHERE x = "WTogmsn8")) OR
      (TYPE(r) = "ngSFntWa" AND
        ANY(x IN labels(startNode(r)) WHERE x = "YWbcqb1r") AND
        r.weight > "dbz3Z3ze") OR
      (TYPE(r) = "oxX2TYVT" AND
        ANY(x IN labels(endNode(r)) WHERE x = "kGlmMPOS") AND
        r.weight > "Vt3CDfcZ") OR
      ((startNode(r).id = p.id OR endNode(r).id = p.id) AND
        r.weight > "Glh7wLxH") OR
      (TYPE(r) = "QXD44TwO" AND r.weight > "Overcxkc")
    | r
  ] AS relationships`;
    verifyFormatting(query, expected);
  });

  test('pattern comprehensions should split in a resonable way if they have to split', () => {
    const query = `MATCH (n)
WHERE single(
                  this12
                  IN
                  [
                  (this11)<-
                  [:REPRESENTS]-
                  (this12:Identity)
                  WHERE
                  ($jwt.email IS NOT NULL AND this12.identity = $jwt.email)
                  |
                  "p4cI8VGS"]
                  WHERE "JWvpHXXN"
                )
return n`;
    const expected = `MATCH (n)
WHERE
  single(
    this12 IN
    [
      (this11)<-[:REPRESENTS]-(this12:Identity)
      WHERE ($jwt.email IS NOT NULL AND this12.identity = $jwt.email)
      | "p4cI8VGS"
    ]
    WHERE "JWvpHXXN"
  )
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('SET clause with equal sign should group the EQ', () => {
    const query = `      CALL {
        WITH connectedNodes, parentNodes
        UNWIND parentNodes AS this7
        UNWIND connectedNodes AS this7_sentence_connect0_node
        MERGE
          (this7)-[this7_sentence_connect0_relationship:resourceOf]->
          (this7_sentence_connect0_node)
        SET node[$aVeryLongProooooooooooooooooooopName] = $this7_sentence_connect0_relationship_namespace
        SET this7_sentence_connect0_relationship.namespace
        =
        $this7_sentence_connect0_relationship_namespace
        SET this7_sentence_connect0_relationship
        =
        $this7_sentence_connect0_relationship_locale
        SET this7_sentence_connect0_relationship
        +=
        $this7_sentence_connect0_relationship_locale
        RETURN count(*) AS _
      }`;
    const expected = `CALL {
  WITH connectedNodes, parentNodes
  UNWIND parentNodes AS this7
  UNWIND connectedNodes AS this7_sentence_connect0_node
  MERGE
    (this7)-[this7_sentence_connect0_relationship:resourceOf]->
    (this7_sentence_connect0_node)
  SET
    node[$aVeryLongProooooooooooooooooooopName] =
      $this7_sentence_connect0_relationship_namespace
  SET
    this7_sentence_connect0_relationship.namespace =
      $this7_sentence_connect0_relationship_namespace
  SET
    this7_sentence_connect0_relationship =
      $this7_sentence_connect0_relationship_locale
  SET
    this7_sentence_connect0_relationship +=
      $this7_sentence_connect0_relationship_locale
  RETURN count(*) AS _
}`;
    verifyFormatting(query, expected);
  });

  test('exists should break its expressions', () => {
    const query = `MATCH (i:Node)-[s:STREET ]->(j:Node)
where s.TrafDir = "K8c0Ceds"
and EXISTS {
  (i)-[x]-(j)
  where type(x) <> "laGrU2e1"
}
WITH i, j
MATCH p=(i)-[x]->(j)
where type(x) <> "vDCx6qeK"
and not x.to = left(j.node_STNAME, size(x.to))
return x.to,  left(j.node_STNAME, size(x.to))
limit "g68S0y7w";`;
    const expected = `MATCH (i:Node)-[s:STREET]->(j:Node)
WHERE s.TrafDir = "K8c0Ceds" AND EXISTS {
  (i)-[x]-(j)
  WHERE type(x) <> "laGrU2e1"
}
WITH i, j
MATCH p = (i)-[x]->(j)
WHERE type(x) <> "vDCx6qeK" AND NOT x.to = left(j.node_STNAME, size(x.to))
RETURN x.to, left(j.node_STNAME, size(x.to))
LIMIT "g68S0y7w";`;
    verifyFormatting(query, expected);
  });

  test('long relationship pattern should indent', () => {
    const query = `MATCH
  (n)-
    [r:\`BELONGS_TO\`
    |\`BELONGS_TO\`
    |\`CONTRIBUTES_TO\`
    |\`CONTRIBUTES_TO\`
    |\`DESCRIBED_BY\`
    |\`DESCRIBED_BY\`
    |\`HAS_FOOTNOTE\`
    |\`HAS_FOOTNOTE\`
    |\`REQUIRES_DNSH\`
    |\`REQUIRES_DNSH\`]-
  (m)`;
    const expected = `MATCH
  (n)-
    [r:\`BELONGS_TO\`
      |\`BELONGS_TO\`
      |\`CONTRIBUTES_TO\`
      |\`CONTRIBUTES_TO\`
      |\`DESCRIBED_BY\`
      |\`DESCRIBED_BY\`
      |\`HAS_FOOTNOTE\`
      |\`HAS_FOOTNOTE\`
      |\`REQUIRES_DNSH\`
      |\`REQUIRES_DNSH\`]-
  (m)`;
    verifyFormatting(query, expected);
  });

  test('With clause should break as list', () => {
    const query = `MATCH (n:Course {id: "fxmrRAfg"})-[r*]->(b)
WITH n, collect(n) AS duplicates
WHERE size(duplicates) > "zuEVCUOg"
WITH
  duplicates["2x5H4FCD"] AS keepNode, duplicates["oMXseK4u" ..] AS deleteNodes
RETURN deleteNodes`;
    const expected = `MATCH (n:Course {id: "fxmrRAfg"})-[r*]->(b)
WITH n, collect(n) AS duplicates
WHERE size(duplicates) > "zuEVCUOg"
WITH
  duplicates["2x5H4FCD"] AS keepNode,
  duplicates["oMXseK4u" ..] AS deleteNodes
RETURN deleteNodes`;
    verifyFormatting(query, expected);
  });
});

describe('tests for respcecting user line breaks', () => {
  test('multiple clauses', () => {
    const query = `MATCH (move:Item) WHERE move.name = $move
OPTIONAL MATCH (insertBefore:Item) WHERE insertBefore.name = $insertBefore

WITH move, insertBefore
WHERE (insertBefore IS NULL OR move <> insertBefore) AND
      (NOT EXISTS {(move)-[:NEXT]->(insertBefore)}) AND
      (insertBefore IS NOT NULL OR EXISTS{(move)-[:NEXT]->()})

OPTIONAL MATCH (beforeMove:Item)-[relBeforeMove:NEXT]->(move)
OPTIONAL MATCH (move)-[relAfterMove:NEXT]->(afterMove:Item)

DELETE relBeforeMove
DELETE relAfterMove

WITH move, insertBefore, beforeMove, afterMove
OPTIONAL MATCH (insertAfter:Item)-[oldRel:NEXT]->(insertBefore)

DELETE oldRel

WITH move, insertBefore, insertAfter, beforeMove, afterMove
CALL(beforeMove, afterMove) {
  WITH *
  WHERE beforeMove IS NOT NULL AND afterMove IS NOT NULL
  CREATE (beforeMove)-[:NEXT]->(afterMove)
}

CALL(move, insertBefore, insertAfter) {
  WITH *
  WHERE insertBefore IS NULL // insertAfter will always be NULL in this case
  MATCH (lastElement:Item)
  WHERE NOT (lastElement)-[:NEXT]->() AND lastElement <> move
  CREATE (lastElement)-[:NEXT]->(move)
}
CALL(move, insertBefore, insertAfter) {
  WITH *
  WHERE insertAfter IS NULL AND insertBefore IS NOT NULL
  CREATE (move)-[:NEXT]->(insertBefore)
}
CALL(move, insertBefore, insertAfter) {
  WITH *
  WHERE insertAfter IS NOT NULL AND insertBefore IS NOT NULL
  CREATE (insertAfter)-[:NEXT]->(move)
  CREATE (move)-[:NEXT]->(insertBefore)
}`;
    const expected = `MATCH (move:Item)
WHERE move.name = $move
OPTIONAL MATCH (insertBefore:Item)
WHERE insertBefore.name = $insertBefore

WITH move, insertBefore
WHERE
  (insertBefore IS NULL OR move <> insertBefore) AND
  (NOT EXISTS { (move)-[:NEXT]->(insertBefore) }) AND
  (insertBefore IS NOT NULL OR EXISTS { (move)-[:NEXT]->() })

OPTIONAL MATCH (beforeMove:Item)-[relBeforeMove:NEXT]->(move)
OPTIONAL MATCH (move)-[relAfterMove:NEXT]->(afterMove:Item)

DELETE relBeforeMove
DELETE relAfterMove

WITH move, insertBefore, beforeMove, afterMove
OPTIONAL MATCH (insertAfter:Item)-[oldRel:NEXT]->(insertBefore)

DELETE oldRel

WITH move, insertBefore, insertAfter, beforeMove, afterMove
CALL (beforeMove, afterMove) {
  WITH *
  WHERE beforeMove IS NOT NULL AND afterMove IS NOT NULL
  CREATE (beforeMove)-[:NEXT]->(afterMove)
}

CALL (move, insertBefore, insertAfter) {
  WITH *
  WHERE insertBefore IS NULL // insertAfter will always be NULL in this case
  MATCH (lastElement:Item)
  WHERE NOT (lastElement)-[:NEXT]->() AND lastElement <> move
  CREATE (lastElement)-[:NEXT]->(move)
}
CALL (move, insertBefore, insertAfter) {
  WITH *
  WHERE insertAfter IS NULL AND insertBefore IS NOT NULL
  CREATE (move)-[:NEXT]->(insertBefore)
}
CALL (move, insertBefore, insertAfter) {
  WITH *
  WHERE insertAfter IS NOT NULL AND insertBefore IS NOT NULL
  CREATE (insertAfter)-[:NEXT]->(move)
  CREATE (move)-[:NEXT]->(insertBefore)
}`;
    verifyFormatting(query, expected);
  });

  test('multiple clauses with comments', () => {
    const query = `
// Find the cell to move and the cell to insert it before (which may be null to insert at the end of the list)
MATCH (move:Item) WHERE move.name = $move
OPTIONAL MATCH (insertBefore:Item) WHERE insertBefore.name = $insertBefore

// If we ask to have it placed at the same position, don't do anything
WITH move, insertBefore
WHERE (insertBefore IS NULL OR move <> insertBefore) AND
      (NOT EXISTS {(move)-[:NEXT]->(insertBefore)}) AND
      (insertBefore IS NOT NULL OR EXISTS{(move)-[:NEXT]->()})

// Find the items before and after the item to move (if they exist)
OPTIONAL MATCH (beforeMove:Item)-[relBeforeMove:NEXT]->(move)
OPTIONAL MATCH (move)-[relAfterMove:NEXT]->(afterMove:Item)

// Disconnect the item to move
DELETE relBeforeMove
DELETE relAfterMove

// Now locate the item to insert it after (if any)
WITH move, insertBefore, beforeMove, afterMove
OPTIONAL MATCH (insertAfter:Item)-[oldRel:NEXT]->(insertBefore)

// Delete the old link to make place for the moved item
DELETE oldRel

// Now patch up the link where the item was removed (unless in start or end)
WITH move, insertBefore, insertAfter, beforeMove, afterMove
CALL(beforeMove, afterMove) {
  WITH *
  WHERE beforeMove IS NOT NULL AND afterMove IS NOT NULL
  CREATE (beforeMove)-[:NEXT]->(afterMove)
}

// Now we need to insert the moved item, but how we do that depends on where it goes
CALL(move, insertBefore, insertAfter) {
  WITH *
  WHERE insertBefore IS NULL // insertAfter will always be NULL in this case
  MATCH (lastElement:Item)
  WHERE NOT (lastElement)-[:NEXT]->() AND lastElement <> move
  CREATE (lastElement)-[:NEXT]->(move)
}
CALL(move, insertBefore, insertAfter) {
  WITH *
  WHERE insertAfter IS NULL AND insertBefore IS NOT NULL
  CREATE (move)-[:NEXT]->(insertBefore)
}
CALL(move, insertBefore, insertAfter) {
  WITH *
  WHERE insertAfter IS NOT NULL AND insertBefore IS NOT NULL
  CREATE (insertAfter)-[:NEXT]->(move)
  CREATE (move)-[:NEXT]->(insertBefore)
}`;
    const expected = `// Find the cell to move and the cell to insert it before (which may be null to insert at the end of the list)
MATCH (move:Item)
WHERE move.name = $move
OPTIONAL MATCH (insertBefore:Item)
WHERE insertBefore.name = $insertBefore

// If we ask to have it placed at the same position, don't do anything
WITH move, insertBefore
WHERE
  (insertBefore IS NULL OR move <> insertBefore) AND
  (NOT EXISTS { (move)-[:NEXT]->(insertBefore) }) AND
  (insertBefore IS NOT NULL OR EXISTS { (move)-[:NEXT]->() })

// Find the items before and after the item to move (if they exist)
OPTIONAL MATCH (beforeMove:Item)-[relBeforeMove:NEXT]->(move)
OPTIONAL MATCH (move)-[relAfterMove:NEXT]->(afterMove:Item)

// Disconnect the item to move
DELETE relBeforeMove
DELETE relAfterMove

// Now locate the item to insert it after (if any)
WITH move, insertBefore, beforeMove, afterMove
OPTIONAL MATCH (insertAfter:Item)-[oldRel:NEXT]->(insertBefore)

// Delete the old link to make place for the moved item
DELETE oldRel

// Now patch up the link where the item was removed (unless in start or end)
WITH move, insertBefore, insertAfter, beforeMove, afterMove
CALL (beforeMove, afterMove) {
  WITH *
  WHERE beforeMove IS NOT NULL AND afterMove IS NOT NULL
  CREATE (beforeMove)-[:NEXT]->(afterMove)
}

// Now we need to insert the moved item, but how we do that depends on where it goes
CALL (move, insertBefore, insertAfter) {
  WITH *
  WHERE insertBefore IS NULL // insertAfter will always be NULL in this case
  MATCH (lastElement:Item)
  WHERE NOT (lastElement)-[:NEXT]->() AND lastElement <> move
  CREATE (lastElement)-[:NEXT]->(move)
}
CALL (move, insertBefore, insertAfter) {
  WITH *
  WHERE insertAfter IS NULL AND insertBefore IS NOT NULL
  CREATE (move)-[:NEXT]->(insertBefore)
}
CALL (move, insertBefore, insertAfter) {
  WITH *
  WHERE insertAfter IS NOT NULL AND insertBefore IS NOT NULL
  CREATE (insertAfter)-[:NEXT]->(move)
  CREATE (move)-[:NEXT]->(insertBefore)
}`;
    verifyFormatting(query, expected);
  });

  test('simplest possible match return example', () => {
    const query = `
MATCH (n)

RETURN n`;
    const expected = `
MATCH (n)

RETURN n`.trimStart();
    verifyFormatting(query, expected);
  });

  test('simplest possible match return example with more than one break', () => {
    const query = `
MATCH (n)





RETURN n`;
    const expected = `
MATCH (n)

RETURN n`.trimStart();
    verifyFormatting(query, expected);
  });

  test('this comment should leave a newline before it', () => {
    const query = `
MATCH (n)

// Comment
RETURN n`.trimStart();
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('another long example with clauses and comments', () => {
    const query = `MERGE (qwerty:Abcdef {name: "ABCDEFGH"})
// Xyzzab qwe POIUYTREWQ poiuy rty uio MNBVCXZ
MERGE (A1B2C3D4E5:Qwert {name: "IJKLMNOP"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "abcdefgh"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "ijklmnop"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "qrstuvwx"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "yzABCDEF"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "GHIJKLMN"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "opqrstuv"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "wxyz0123"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "456789ab"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "cdefghij"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "klmnopqr"})
MERGE (A1B2C3D4E5)-[:QAZWSXEDCR]->(:Zxcvbn {name: "stuvwxyz"})
MERGE (qwerty)-[:PLMKOIJNBHUY]->(A1B2C3D4E5)

// Abcdef ghi ZxcvbnmQwertyz uiopa sdx fgh jklzxcv

MERGE (F6G7H8J9K0L1M2:Qwert {name: "ZXCVBNML"})
MERGE (F6G7H8J9K0L1M2)-[:QAZWSXEDCR]->(:Zxcvbn {name: "asdfghjk"})
MERGE (F6G7H8J9K0L1M2)-[:QAZWSXEDCR]->(:Zxcvbn {name: "poiuytre"})
MERGE (qwerty)-[:PLMKOIJNBHUY]->(F6G7H8J9K0L1M2)

MERGE (ZyXwVuTsr:Qwert {name: "lkjhgfds"})
MERGE (ZyXwVuTsr)-[:QAZWSXEDCR]->(:Zxcvbn {name: "mnbvcxza"})
MERGE (ZyXwVuTsr)-[:QAZWSXEDCR]->(:Zxcvbn {name: "qwertyui"})
MERGE (qwerty)-[:PLMKOIJNBHUY]->(ZyXwVuTsr)

// Fghijk lmn QWERTYUIOPASDFGHJ KJIHG QAZ WSX EDCRFVT
MERGE (QWERTYUIOPASDFGHJ:Qwert {name: "1234abcd"})
MERGE (QWERTYUIOPASDFGHJ)-[:QAZWSXEDCR]->(:Zxcvbn {name: "efghijkl"})
MERGE (QWERTYUIOPASDFGHJ)-[:QAZWSXEDCR]->(:Zxcvbn {name: "mnopqrst"})
MERGE (QWERTYUIOPASDFGHJ)-[:QAZWSXEDCR]->(:Zxcvbn {name: "uvwxYZ12"})
MERGE (QWERTYUIOPASDFGHJ)-[:QAZWSXEDCR]->(:Zxcvbn {name: "34567890"})
MERGE (qwerty)-[:PLMKOIJNBHUY]->(QWERTYUIOPASDFGHJ)

// Lmnopq rst UVWXYZABCDEFG NOPQR STU VWX YZABCDF

MERGE (LMNOPQRSTUVWX:Qwert {name: "zxvbnmlk"})
MERGE (LMNOPQRSTUVWX)-[:QAZWSXEDCR]->(:Zxcvbn {name: "opaslkdj"})
MERGE (LMNOPQRSTUVWX)-[:QAZWSXEDCR]->(:Zxcvbn {name: "qwerty12"})
MERGE (qwerty)-[:PLMKOIJNBHUY]->(LMNOPQRSTUVWX)

// uvwxyz efg lmno pqrstuvwxyzab

MERGE (pqr45:Qwer {name: "asdf1234", type: "zxcv5678"})
MERGE (LMNOPQRSTUVWX)-[:ZXCVB]->(pqr45)-[:ZXCVB]->(A1B2C3D4E5)
MERGE (qwerty)-[:ASDFGHJKL]->(pqr45)
MERGE (stu78:Qwer {name: "poiuy987", type: "lkjh6543"})
MERGE (A1B2C3D4E5)-[:ZXCVB]->(stu78)-[:ZXCVB]->(F6G7H8J9K0L1M2)
MERGE (qwerty)-[:ASDFGHJKL]->(stu78)
MERGE (vwx90:Qwer {name: "mnbv3210", type: "zazxswed"})
MERGE (A1B2C3D4E5)-[:ZXCVB]->(vwx90)-[:ZXCVB]->(ZyXwVuTsr)
MERGE (qwerty)-[:ASDFGHJKL]->(vwx90)`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('double newline before block comment', () => {
    const query = `
MATCH (a)


/* block comment */
RETURN a`;
    const expected = `
MATCH (a)

/* block comment */
RETURN a`.trimStart();
    verifyFormatting(query, expected);
  });

  test('inline block comment with internal newlines', () => {
    const query = `
MATCH (a)
RETURN a; /* comment line 1

comment line 2 */
MATCH (b)
RETURN b;`;
    const expected = `
MATCH (a)
RETURN a; /* comment line 1

comment line 2 */
MATCH (b)
RETURN b;`.trimStart();
    verifyFormatting(query, expected);
  });

  test('multiline block comment with line before it', () => {
    const query = `
MATCH (a)
RETURN a;

/* comment line 1


comment line 3 */
MATCH (b)
RETURN b;`;
    const expected = `
MATCH (a)
RETURN a;

/* comment line 1


comment line 3 */
MATCH (b)
RETURN b;`.trimStart();
    verifyFormatting(query, expected);
  });

  test('mixed comments with explicit newline', () => {
    const query = `
MATCH (a)
// single line comment


/* block comment */
RETURN a`.trimStart();
    const expected = `
MATCH (a)
// single line comment

/* block comment */
RETURN a`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should remove the first but not the second newline, and keep indentation', () => {
    const query = `
MERGE (a:Person {name: "Alice"})

ON CREATE SET a.created = timestamp()
ON MATCH SET a.lastSeen = timestamp()

RETURN a
`.trimStart();
    const expected = `
MERGE (a:Person {name: "Alice"})
  ON CREATE SET a.created = timestamp()
  ON MATCH SET a.lastSeen = timestamp()

RETURN a`.trimStart();
    verifyFormatting(query, expected);
  });

  test('this query should not lose idempotency because of double break and concatenate', () => {
    const query = `MATCH (a:AbCdEf {XyZ012345: "ABCDEFGH"})

MATCH (a)-[b:ZxCvBnMq]->(d:GhIjKlM)<-[e1:ZxCvBnMq]-(zYxWvUtSrqP:AbCdEf)
WHERE (
  // abcdefghijklmnopqrstuvwxy
  (b.AbCdEfGhIjKlMn <= "1A2b3C4d")

  // Qwertyuiopasdfghjklzxcvbnm1234567890AB
  OR (
      e1.OpQrStUvW >= "Z9y8X7w6"
      AND b.AbCdEfGhIjKlMn in ["aBcDeFgH","IjKlMnOp"]
  )

  // QazwsxedcrfvtgbyhnujmikolpASDFGHJKLQWERTYUIOPZXCVBNM1234567abcdefghij
  OR (
      b.OpQrStUvW <= e1.OpQrStUvW
      AND e1.OpQrStUvW >= "QrStUvWx"
      AND b.AbCdEfGhIjKlMn in ["YzXwVuTs","LmNoPqRs"]
      // AND b.LmNo_PqRsTuV = e1.LmNo_PqRsTuV
  )

  // 0123456789abcdefghijKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVW
  OR (
      b.OpQrStUvW = e1.OpQrStUvW
      AND e1.OpQrStUvW >= "StUvWxYz"
      AND b.AbCdEfGhIjKlMn > "QwErTyUi"
      // AND b.LmNo_PqRsTuV = e1.LmNo_PqRsTuV
  )
)

RETURN a, b, d, e1, zYxWvUtSrqP`;
    const expected = `MATCH (a:AbCdEf {XyZ012345: "ABCDEFGH"})

MATCH (a)-[b:ZxCvBnMq]->(d:GhIjKlM)<-[e1:ZxCvBnMq]-(zYxWvUtSrqP:AbCdEf)
WHERE
  (
    // abcdefghijklmnopqrstuvwxy
    (b.AbCdEfGhIjKlMn <= "1A2b3C4d")

    // Qwertyuiopasdfghjklzxcvbnm1234567890AB
    OR
    (e1.OpQrStUvW >= "Z9y8X7w6" AND
      b.AbCdEfGhIjKlMn IN ["aBcDeFgH", "IjKlMnOp"])

    // QazwsxedcrfvtgbyhnujmikolpASDFGHJKLQWERTYUIOPZXCVBNM1234567abcdefghij
    OR
    (b.OpQrStUvW <= e1.OpQrStUvW AND
      e1.OpQrStUvW >= "QrStUvWx" AND
      b.AbCdEfGhIjKlMn IN ["YzXwVuTs", "LmNoPqRs"])
    // AND b.LmNo_PqRsTuV = e1.LmNo_PqRsTuV

    // 0123456789abcdefghijKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVW
    OR
    (b.OpQrStUvW = e1.OpQrStUvW AND
      e1.OpQrStUvW >= "StUvWxYz" AND
      b.AbCdEfGhIjKlMn > "QwErTyUi"))
// AND b.LmNo_PqRsTuV = e1.LmNo_PqRsTuV
RETURN a, b, d, e1, zYxWvUtSrqP`;
    verifyFormatting(query, expected);
  });

  test('should preserve newlines also after a comment', () => {
    const query = `
MATCH (n)
// Comment, please preserve the line below

RETURN n`.trimStart();
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('should keep the logical delimiter the user has made intact', () => {
    const query = `
MATCH (n)

// === THIS IS THE START OF THE RETURN STATEMENT ===

RETURN n`.trimStart();
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('should allow an explicit newline between MATCH and WHERE', () => {
    const query = `
MATCH (n)

WHERE n.prop = "String"
RETURN n`.trimStart();
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('should allow an explicit newline before LIMIT', () => {
    const query = `
MATCH (n)
RETURN n

LIMIT 10`.trimStart();
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('WHERE and LIMIT with comments in between', () => {
    const query = `
MATCH (n)
// Comment before WHERE

WHERE n.prop = "String"
RETURN n
// Comment before LIMIT

LIMIT 10`.trimStart();
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('two statements', () => {
    const query = `
MATCH (n)

RETURN n;

MATCH (n)

RETURN m;`;
    const expected = query.trimStart();
    verifyFormatting(query, expected);
  });

  test('multiple statements with comments inbetween', () => {
    const query = `
MATCH (n)

RETURN n;
// This is a comment

MATCH (n)

RETURN n;

// This is another comment

MATCH (n)
RETURN n;`;
    const expected = query.trimStart();
    verifyFormatting(query, expected);
  });

  test('end of statement with multiple newlines', () => {
    const query = `
MATCH (n)
RETURN m;


`;
    const expected = `MATCH (n)
RETURN m;`;
    verifyFormatting(query, expected);
  });

  test('too many newlines between statements should truncate to one', () => {
    const query = `
MATCH (n)
RETURN n;






MATCH (n)
RETURN m;`;
    const expected = `
MATCH (n)
RETURN n;

MATCH (n)
RETURN m;`.trimStart();
    verifyFormatting(query, expected);
  });
});
