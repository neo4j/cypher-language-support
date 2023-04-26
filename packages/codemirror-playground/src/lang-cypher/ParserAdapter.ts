import { Input, Parser, PartialParse, Tree } from '@lezer/common';
import { applySyntaxColouring, ParsedCypherToken } from 'language-support';
import { cypherTokenTypeToNode, parserAdapterNodeSet } from './constants';

const DEFAULT_NODE_GROUP_SIZE = 4;

export class ParserAdapter extends Parser {
  private createBufferForTokens(tokens: ParsedCypherToken[]) {
    return tokens.map((token) => {
      const nodeTypeId = cypherTokenTypeToNode[token.tokenType].id;
      const startOffset = token.position.startCharacter;
      const endOffset = token.position.startCharacter + token.length;

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
    const tokens = applySyntaxColouring(document);

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
