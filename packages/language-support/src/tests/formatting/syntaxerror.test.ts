import { formatQuery } from '../../formatting/formatting';
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
    const query = `MATCH (n:Person) where n.name = "Alice return n`;
    const expected = `MATCH (n:Person)
WHERE n.name = "Alice
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('query with missing parenthesis', () => {
    const query = `MATCH (n:Person return n`;
    const expected = `MATCH (n:Person
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('node map projection with . instead of :', () => {
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
WHERE trim(v.authors) <> ''
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
  return 5
}`;
    const expected = `CALL {
syntaxerror
  RETURN 5
}`;
    verifyFormatting(query, expected);
  });

  test('incorrect node label syntax', () => {
    const query = `match(n.Person{name:'Alice'}) return n`;
    const expected = `MATCH(n.Person{name:'Alice'})
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('missing parentheses', () => {
    const query = `match (n:Person) return toUpper n.name`;
    const expected = `MATCH (n:Person)
RETURN toUpper n.name`;
    verifyFormatting(query, expected);
  });

  test('typoed match keyword', () => {
    const query = `macth (n:Person {name:'Alice'}) return n;`;
    const expected = query;
    verifyFormatting(query, expected);
  });

  test('double equals', () => {
    const query = `match (n:Person) where n.name == 'Alice' return n;`;
    const expected = `MATCH (n:Person)
WHERE n.name =='Alice'
RETURN n;`;
    verifyFormatting(query, expected);
  });

  test('extra word in with', () => {
    const query = `match (n:    Person) with n ERROR RETURN n;`;
    const expected = `MATCH (n:Person)
WITH n ERROR RETURN n;`;
    verifyFormatting(query, expected);
  });

  // TODO: make the formatter able to handle these syntax errors as well. This one is tricky
  // because the parser miraculously recovers to find 'RETURN m' as a clause, though outside
  // the CALL expression. If this kind of unbehavior (which seems extremely hard
  // to account for) happens, just give up and return the query as is.
  test('query that we are currently unable to handle should throw.', () => {
    const query = `MATCH (n:Person)
CALL {
  WITH n
  MATCH (m:Movie)
  syntax error inside subquery
  RETURN m
}
RETURN n`;
    expect(() => formatQuery(query)).toThrowError(
      `Unable to format query due to syntax error near } at line 7`,
    );
  });

  test('map that uses dot instead of colon', () => {
    const query = `match (n:Person {age. 5}) return n`;
    const expected = `MATCH (n:Person {age. 5})
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('incomplete MERGE clause', () => {
    const query = `merge (n:Person {name:'Alice'`;
    const expected = `MERGE (n:Person {name:'Alice'`;
    verifyFormatting(query, expected);
  });

  test('incomplete AS in RETURN', () => {
    const query = `match (n:Person) return n as`;
    const expected = `MATCH (n:Person)
RETURN n AS`;
    verifyFormatting(query, expected);
  });

  test('missing closing quote in string literal inside map', () => {
    const query = `match (n:Person {name:'Alice}) return n`;
    const expected = `MATCH (n:Person {name:'Alice})
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('incomplete list literal remains unchanged', () => {
    const query = `match (n:Person)
where n.hobbies = ["reading", "biking
return n`;
    const expected = `MATCH (n:Person)
WHERE n.hobbies = ["reading", "biking
RETURN n`;
    verifyFormatting(query, expected);
  });

  test('incomplete function call', () => {
    const query = `match (n:Person) where toUpper(n.name return n;`;
    const expected = `MATCH (n:Person)
WHERE toUpper(n.name
RETURN n;`;
    verifyFormatting(query, expected);
  });

  test('missing end quote and extra word in same query', () => {
    const query = `MATCH (n:Person {name:'Alice)
WITH n EXTRA return n;`;
    const expected = `MATCH (n:Person {name:'Alice)
WITH n EXTRA return n;`;
    verifyFormatting(query, expected);
  });

  test('missing ending brace/parenthesis and missing alias', () => {
    const query = `merge (n:Person {name:'Alice'
return n as;`;
    const expected = `MERGE (n:Person {name:'Alice'
RETURN n AS;`;
    verifyFormatting(query, expected);
  });

  test('dot instead of colon and also misisng closing parenthesis', () => {
    const query = `call apoc.load.json(url) yield value as v
merge (a:Article {v.article_number})
on create set a +=+ v {.content_text .published_date, .title, .url }
merge (s:Source {name: v.source})
merge (a)-[:PUBLISHED_IN]->(s)
with a, v where trim(v.authors) <> '' 
unwind split(v.authors,',' as name
merge (author:Author {name:name})
merge (a)-[:WRITTEN_BY]->(author)`;
    const expected = `CALL apoc.load.json(url) YIELD value AS v
MERGE (a:Article {v.article_number})
  ON CREATE SET a += + v {.content_text.published_date, .title, .url }
MERGE (s:Source {name: v.source})
MERGE (a)-[:PUBLISHED_IN]->(s)
WITH a, v
WHERE trim(v.authors) <> ''
UNWIND split(v.authors, ','AS name
MERGE (author:Author {name: name})
MERGE (a)-[:WRITTEN_BY]->(author)`;
    verifyFormatting(query, expected);
  });
});
