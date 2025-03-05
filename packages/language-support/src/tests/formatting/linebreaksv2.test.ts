/*
 * This file is a WIP of the next iteration of the cypher-formatter.
 * It's being kept as a separate file to enable having two separate version at once
 * since it would be difficult to consolidate the new and the old version
 */

import { verifyFormatting } from './testutilv2';

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
WHERE (insertBefore IS NULL OR move <> insertBefore) AND
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
WHERE (insertBefore IS NULL OR move <> insertBefore) AND
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
WHERE (
      // abcdefghijklmnopqrstuvwxy
      (b.AbCdEfGhIjKlMn <= "1A2b3C4d")

      // Qwertyuiopasdfghjklzxcvbnm1234567890AB
      OR (e1.OpQrStUvW >= "Z9y8X7w6" AND
          b.AbCdEfGhIjKlMn IN ["aBcDeFgH", "IjKlMnOp"])

      // QazwsxedcrfvtgbyhnujmikolpASDFGHJKLQWERTYUIOPZXCVBNM1234567abcdefghij
      OR (b.OpQrStUvW <= e1.OpQrStUvW AND e1.OpQrStUvW >= "QrStUvWx" AND
          b.AbCdEfGhIjKlMn IN ["YzXwVuTs", "LmNoPqRs"])
      // AND b.LmNo_PqRsTuV = e1.LmNo_PqRsTuV

      // 0123456789abcdefghijKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVW
      OR (b.OpQrStUvW = e1.OpQrStUvW AND e1.OpQrStUvW >= "StUvWxYz" AND
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
});
