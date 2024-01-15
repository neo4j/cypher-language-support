
import { CharStreams, CommonTokenStream } from 'antlr4';
import Lexer from './ConsoleCommandLexer';
import Parser from './ConsoleCommandParser';

  const inputStream = CharStreams.fromString(':param 3+3');
  const lexer = new Lexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new Parser(tokenStream);

console.log(parser.consoleCommand().getText())