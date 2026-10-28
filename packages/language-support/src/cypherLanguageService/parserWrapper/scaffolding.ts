import type { Token } from 'antlr4ng';
import {
  CommonTokenStream,
  CharStream,
  ListTokenSource,
  CommonToken,
} from 'antlr4ng';
import { CypherCmdLexer as CypherLexer } from '../../generated-parser/CypherCmdLexer.js';
import { CypherCmdParser as CypherParser } from '../../generated-parser/CypherCmdParser.js';

interface ParsingScaffolding {
  query: string;
  statementsScaffolding: StatementParsingScaffolding[];
}

interface StatementParsingScaffolding {
  parser: CypherParser;
  tokenStream: CommonTokenStream;
  tokens: Token[];
}

export function createParsingScaffolding(query: string): ParsingScaffolding {
  const statementChunks = getStatementTokenChunks(query);

  const statementsScaffolding: StatementParsingScaffolding[] =
    statementChunks.map((tokens) => {
      const statementStream = new CommonTokenStream(
        new ListTokenSource(tokens),
      );
      const parser = new CypherParser(statementStream);
      parser.removeErrorListeners();

      return {
        parser: parser,
        tokenStream: statementStream,
        tokens: tokens,
      };
    });

  return {
    query: query,
    statementsScaffolding: statementsScaffolding,
  };
}

export function getStatementTokenChunks(query: string): Token[][] {
  const inputStream = CharStream.fromString(query);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);

  return splitIntoStatements(tokenStream);
}

function splitIntoStatements(tokenStream: CommonTokenStream): Token[][] {
  tokenStream.fill();
  const tokens = tokenStream.getTokens();

  let i = 0;
  const result: Token[][] = [];
  let chunk: Token[] = [];

  while (i < tokens.length) {
    const current = CommonToken.fromToken(tokens[i]!);
    current.tokenIndex = chunk.length;

    chunk.push(current);

    if (
      current.type === CypherLexer.SEMICOLON ||
      current.type === CypherLexer.EOF
    ) {
      result.push(chunk);
      chunk = [];
    }

    i++;
  }

  return result;
}
