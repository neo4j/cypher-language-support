import { Input, Parser, PartialParse, Tree } from '@lezer/common';
import { Token } from 'antlr4ts';
import { getTokenStream, lexerSymbols } from 'language-support';
import { cypherTokenTypeToNode, parserAdapterNodeSet } from './constants';

const DEFAULT_NODE_GROUP_SIZE = 4;

// Simplified tree ->
// Statements
// statement

// start with pretending the lexer could do it all.
// then look at how the tree strcuture would work
// determine if we want to map to a lezer tree with codemirror types

export class ParserAdapter extends Parser {
  private createBufferForTokens(tokens: Token[]) {
    return tokens.map((token) => {
      const nodeTypeId =
        cypherTokenTypeToNode[lexerSymbols[token.type] ?? 'none'].id;

      const startOffset = token.startIndex;
      // Adding 1 to include the character that lies to the right of the stopIndex (which is included in the word)
      const endOffset = token.stopIndex + 1;

      return [nodeTypeId, startOffset, endOffset, DEFAULT_NODE_GROUP_SIZE];
    });
  }

  private addTopNodeToBuffer(buffer: number[][], document: string) {
    const id = cypherTokenTypeToNode.topNode.id;
    const startOffset = 0;
    const endOffset = document.length;
    const totalBufferLength = buffer.length * DEFAULT_NODE_GROUP_SIZE;

    buffer.push([
      id,
      startOffset,
      endOffset,
      totalBufferLength + DEFAULT_NODE_GROUP_SIZE,
    ]);
  }

  private buildTree(document: string) {
    const tokens = getTokenStream(document);

    if (tokens.length < 1) {
      return Tree.build({
        buffer: [
          cypherTokenTypeToNode.topNode.id,
          0,
          document.length,
          DEFAULT_NODE_GROUP_SIZE,
        ],
        nodeSet: parserAdapterNodeSet,
        topID: cypherTokenTypeToNode.topNode.id,
      });
    }

    const buffer = this.createBufferForTokens(tokens);
    this.addTopNodeToBuffer(buffer, document);

    return Tree.build({
      buffer: buffer.flat(),
      nodeSet: parserAdapterNodeSet,
      topID: cypherTokenTypeToNode.topNode.id,
    });
  }

  createParse(input: Input): PartialParse {
    return this.startParse(input);
  }

  /* There are more arguments, but since we don't do any incremental parsing, they are not useful */
  startParse(input: string | Input): PartialParse {
    const document =
      typeof input === 'string' ? input : input.read(0, input.length);

    const tree = this.buildTree(document);

    return {
      stoppedAt: input.length,
      parsedPos: input.length,
      stopAt: () => {
        return undefined;
      },
      advance: () => tree,
    };
  }
}