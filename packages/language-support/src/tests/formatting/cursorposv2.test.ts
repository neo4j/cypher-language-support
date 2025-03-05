/*
 * This file is a WIP of the next iteration of the cypher-formatter.
 * It's being kept as a separate file to enable having two separate version at once
 * since it would be difficult to consolidate the new and the old version
 */

import { formatQuery } from '../../formatting/formattingv2';

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
