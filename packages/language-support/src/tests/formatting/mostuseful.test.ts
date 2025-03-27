import { verifyFormatting } from './testutil';

describe('useful tests for testing V3 linebreaks', () => {
  test('should not break after options', () => {
    const query = `CREATE CONSTRAINT aaaaaa FOR ( aaaaaa : aaaaaa ) REQUIRE ( aaaaaa . aaaaaa ) IS UNIQUE OPTIONS { aaaaaa : "20z9vakp" , aaaaaa : { aaaaaa : [ "aotV0uiw" , "SCxu0Vyn" , "ekTx6ngu" ] , aaaaaa : [ "WqAr9IvS" , "j5fYJwuN" ] , aaaaaa : [ "HUDXLCRN" , "LUfKWGc7" ] , aaaaaa : [ "qbk3JzMe" , "Ca4n1Ea9" , "I96Uwq16" ] , aaaaaa : [ "zcBcWjoJ" , "dz78begI" ] , aaaaaa : [ "MIADLwls" , "qkacQgzY" , "wYYAgiGo" ] , aaaaaa : [ "Jmw0tXjZ" , "ALiXrHno" , "QRYTGYFd" ] , aaaaaa : [ "EEJJKZGC" , "GGDt2msc" ] } }`;
    const expected = `CREATE CONSTRAINT aaaaaa
FOR (aaaaaa:aaaaaa)
REQUIRE (aaaaaa.aaaaaa) IS UNIQUE
OPTIONS {
  aaaaaa: "20z9vakp",
  aaaaaa: {
    aaaaaa: ["aotV0uiw", "SCxu0Vyn", "ekTx6ngu"],
    aaaaaa: ["WqAr9IvS", "j5fYJwuN"],
    aaaaaa: ["HUDXLCRN", "LUfKWGc7"],
    aaaaaa: ["qbk3JzMe", "Ca4n1Ea9", "I96Uwq16"],
    aaaaaa: ["zcBcWjoJ", "dz78begI"],
    aaaaaa: ["MIADLwls", "qkacQgzY", "wYYAgiGo"],
    aaaaaa: ["Jmw0tXjZ", "ALiXrHno", "QRYTGYFd"],
    aaaaaa: ["EEJJKZGC", "GGDt2msc"]
  }
}`;
    verifyFormatting(query, expected);
  });

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

  test('allTokenTypes example from codemirror demo', () => {
    const query = `MATCH (variable :Label)-[:REL_TYPE]->()
WHERE variable.property = "String"
    OR namespaced.function() = false
    // comment
    OR $parameter > 2
RETURN variable;`;
    const expected = `MATCH (variable:Label)-[:REL_TYPE]->()
WHERE 
  variable.property = "String" OR
  namespaced.function() = false
  // comment
  OR $parameter > 2
RETURN variable;`;
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
  (b:Person {name: 'DariusIII'}), (b:Person {name: 'DariusIII'})-->
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
    (u:User)-[:USER_EVENT]->(e:GeneratedQuery) (()--(:GeneratedQuery))* // Optionally successive
    (()-->(:RanCommand)-->(:RanCypher))+ // One or more chains of RanCommand + RanCypher
    (()-->(:GeneratedQuery))+ // Optionally successive repeated calls of GeneratedQuery
    (()-->(:RanCommand)-->(:RanCypher))* // One or more chains of RanCommand + RanCypher
RETURN pth ORDER BY length(pth) DESC
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
  [:OWNED_BY]->(p:Person)<-
  // The person who owns the account
  [:SHARED_WITH]-(anotherAccount:Account)-
  // Another account that is shared with the same person
  [:HAS_TRANSACTIONS]->(t:Transaction)-
  // Transactions belong to the second account
  [:CATEGORY]->(c:Category)
RETURN
  a.id AS accountId,
  anotherAccount.id AS sharedAccountId,
  t.amount,
  c.name AS category;`.trimStart();
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

  test('map projections should line up like maps 1', () => {
    const query = `MATCH (p:Person {name: "Alice"})
RETURN p {.name, .age, .email, .phone, .address, .occupation, .nationality,
       .birthdate, .gender} AS personInfo`;
    const expected = `MATCH (p:Person {name: "Alice"})
RETURN p {
  .name,
  .age,
  .email,
  .phone,
  .address,
  .occupation,
  .nationality,
  .birthdate,
  .gender
} AS personInfo`;
    verifyFormatting(query, expected);
  });

  test('map projections should line up like maps 2', () => {
    const query = `MATCH (p:Person {name: "Alice"})-[:LIVES_IN]->(c:City)
RETURN p {.name, .age, .email, .phone, address:
    {street: p.street, city: c.name, zip: p.zip}, .occupation, .nationality,
    .birthdate, .gender} AS personInfo`;
    const expected = `MATCH (p:Person {name: "Alice"})-[:LIVES_IN]->(c:City)
RETURN p {.name,
  .age,
  .email,
  .phone,
  address: {street: p.street, city: c.name, zip: p.zip},
  .occupation,
  .nationality,
  .birthdate,
  .gender
} AS personInfo`;
    verifyFormatting(query, expected);
  });

  test('does not split in the middle of a relation', () => {
    const query = `MATCH path = (m1:loooooooongrelationtypename {code: "mFG66X9v"})-[
r:verylongrelationtypename]->(m2:anotherverylongrelationtypename)
RETURN path`;
    const expected = `
MATCH path = (m1:loooooooongrelationtypename {code: "mFG66X9v"})-
             [r:verylongrelationtypename]->(m2:anotherverylongrelationtypename)
RETURN path`.trimStart();
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

  test('aligns large maps one further than the opening brace', () => {
    const query = `RETURN {looooooooooooooooooooooongkey:value, loooooooooooooooooooongkeeeyyyyyyyy:value2, looooooooooooooongkeeey:value3}`;
    const expected = `
RETURN {
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
WHERE p.article_number IN [
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

  test('should not break after DISTINCT that follows RETURN', () => {
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
  (Carla55:EmployeeType)-[PARTNR:partner_of]->(Dave:Short)
RETURN Alice123`.trimStart();
    verifyFormatting(query, expected);
  });

  test('very long where', () => {
    const query = `MATCH (n)
WHERE true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true and true
return n`;
    const expected = `MATCH (n)
WHERE
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
WITH u,
     apoc.util.
     validate(u.status <> 'active',
              'User ' + u.username +
              ' does not have an active status which is required for processing the requested operation. '
              + 'Please check the user account settings for further details.',
              [u.id, u.username]) AS validation
RETURN u;`;
    verifyFormatting(query, expected);
  });
});
