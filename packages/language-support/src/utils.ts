import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { CypherLexer } from './generated-parser/CypherLexer';

export function getTokenStream(value: string) {
  const chars = CharStreams.fromString(value);
  const lexer = new CypherLexer(chars);
  const tokenStream = new CommonTokenStream(lexer);

  tokenStream.fill();

  return tokenStream.getTokens();
}
