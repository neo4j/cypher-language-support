import { StatementOrCommandContext as StatementOrCommandContext_v25 } from './Cypher25/generated-parser/CypherCmdParser';
import {
  parse as parse_v25,
  parserWrapper as parserWrapper_v25,
  parseStatementsStrs as parseStatementsStrs_v25,
  ParsingResult as ParsingResult_v25,
} from './Cypher25/parserWrapper';
import { StatementOrCommandContext as StatementOrCommandContext_v5 } from './Cypher5/generated-parser/CypherCmdParser';
import {
  parse as parse_v5,
  parserWrapper as parserWrapper_v5,
  parseStatementsStrs as parseStatementsStrs_v5,
  ParsingResult as ParsingResult_v5,
} from './Cypher5/parserWrapper';
import { DbSchema } from './dbSchema';
import { cypherVersion } from './helpers';

export function parse(
  query: string,
  dbSchema: DbSchema,
): StatementOrCommandContext_v5[] | StatementOrCommandContext_v25[] {
  if (cypherVersion(query, dbSchema) === 'cypher 5') {
    return parse_v5(query);
  } else {
    return parse_v25(query);
  }
}

export function parseAndCache(
  query: string,
  dbSchema: DbSchema,
): ParsingResult_v5 | ParsingResult_v25 {
  if (cypherVersion(query, dbSchema) === 'cypher 5') {
    return parserWrapper_v5.parse(query);
  } else {
    return parserWrapper_v25.parse(query);
  }
}

export function parseStatementsStrs(
  query: string,
  dbSchema: DbSchema,
): string[] {
  if (cypherVersion(query, dbSchema) === 'cypher 5') {
    return parseStatementsStrs_v5(query);
  } else {
    return parseStatementsStrs_v25(query);
  }
}
