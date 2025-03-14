import { verifyFormatting } from './testutil';

describe('formatting despite syntax errors', () => {
  test('syntax error at the beginning', () => {
    const query = `invalid syntax at start
MATCH (n:Person) RETURN n`;
    // The rest of the query becomes un-parseable so not much we can do.
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('unclosed string literal remains unchanged', () => {
    const query = `MATCH (n:Person)
WHERE n.name = "Alice
RETURN n`;
    const expected = `MATCH (n:Person)
WHERE n.name = "Alice
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('mixed valid and invalid comment lines', () => {
    const query = `MATCH (n:Person)
// Valid comment
invalid statement here
/* multi-line
comment with syntax error */
RETURN n`;
    const expected = `MATCH (n:Person)
// Valid comment
invalid statement here
/* multi-line
comment with syntax error */
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('nested subquery with a syntax error inside', () => {
    const query = `MATCH (n:Person)
CALL {
  WITH n
  MATCH (m:Movie)
  syntax error inside subquery
  RETURN m
}
RETURN n`;
    const expected = `MATCH (n:Person)
CALL {
  WITH n
  MATCH (m:Movie)
  syntax error inside subquery
  RETURN m
}
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('query with misplaced parenthesis (incomplete pattern)', () => {
    const query = `MATCH (n:Person
RETURN n`;
    const expected = `MATCH (n:Person
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('incorrect node map projection', () => {
    const query = `call apoc.load.json(url) yield value as v
merge (a:Article {v.article_number})
on create set a += v {.content_text, .published_date, .title, .url }
merge (s:Source {name: v.source})
merge (a)-[:PUBLISHED_IN]->(s)
with a, v where trim(v.authors) <> '' 
unwind split(v.authors,',') as name
merge (author:Author {name:name})
merge (a)-[:WRITTEN_BY]->(author)`;
    const expected = `CALL apoc.load.json(url) YIELD value AS v
MERGE (a:Article {v.article_number})
  ON CREATE SET a += v {.content_text, .published_date, .title, .url}
MERGE (s:Source {name: v.source})
MERGE (a)-[:PUBLISHED_IN]->(s)
WITH a, v
WHERE TRIM (v.authors) <> ''
UNWIND split(v.authors, ',') AS name
MERGE (author:Author {name: name})
MERGE (a)-[:WRITTEN_BY]->(author)`;
    verifyFormatting(query, expected);
  });

  test('does not add extra spaces to this query', () => {
    const query = `MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    syntax error 
// comment
OR $parameter > 2
RETURN variable;`;
    const expected = `MATCH (variable:Label)-[:REL_TYPE]->()
WHERE variable.property = "String" OR namespaced.function() = false
    syntax error 
// comment
OR $parameter > 2
RETURN variable;`;
    verifyFormatting(query, expected);
  });

  test('does not add a random newline in this query', () => {
    const query = `CALL {
syntaxerror
  RETURN 5
}`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('incorrect node label syntax', () => {
    const query = `match(n.Person{name:'Alice'}) return n`;
    const expected = `MATCH(n.Person{name:'Alice'})
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('missing parentheses', () => {
    const query = `MATCH (n:Person) RETURN toUpper n.name`;
    // Ideally the n.name part wouldn't go on a newline but whatever
    const expected = `MATCH (n:Person)
RETURN toUpper
n.name`;
    verifyFormatting(query, expected);
  });

  test('typoed match keyword', () => {
    const query = `macth (n:Person {name:'Alice'}) return n;`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('double equals', () => {
    const query = `MATCH (n:Person) WHERE n.name == 'Alice' RETURN n;`;
    const expected = `MATCH (n:Person)
WHERE n.name =='Alice'
RETURN n;`;
    verifyFormatting(query, expected);
  });

  test('extra wor in with', () => {
    const query = `MATCH (n:Person) WITH n ERROR RETURN n;`;
    const expected = `MATCH (n:Person)
WITH n ERROR
RETURN n;`;
    verifyFormatting(query, expected);
  });
});
