import { Facet } from '@codemirror/state';
import { Input, NodeType, Parser, PartialParse, Tree } from '@lezer/common';
import {
  applySyntaxColouring,
  CypherTokenType,
  ParsedCypherToken,
} from '@neo4j-cypher/language-support';
import { cypherTokenTypeToNode, parserAdapterNodeSet } from './constants';

const DEFAULT_NODE_GROUP_SIZE = 4;

export class ParserAdapter extends Parser {
  cypherTokenTypeToNode: Record<CypherTokenType, NodeType> & {
    topNode: NodeType;
  };

  constructor(
    facet: Facet<unknown>,
    private onSlowParse?: (timeTaken: number) => void,
  ) {
    super();
    this.cypherTokenTypeToNode = cypherTokenTypeToNode(facet);
  }

  private createBufferForTokens(tokens: ParsedCypherToken[]) {
    return tokens.map((token) => {
      const nodeTypeId = this.cypherTokenTypeToNode[token.tokenType].id;
      const startOffset = token.position.startOffset;
      const endOffset = token.position.startOffset + token.length;

      return [nodeTypeId, startOffset, endOffset, DEFAULT_NODE_GROUP_SIZE];
    });
  }

  private addTopNodeToBuffer(buffer: number[][], document: string) {
    const id = this.cypherTokenTypeToNode.topNode.id;
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
    const startTime = performance.now();
    const tokens = applySyntaxColouring(document);
    const timeTaken = performance.now() - startTime;
    if (timeTaken > 300) {
      this.onSlowParse?.(timeTaken);
    }

    if (tokens.length < 1) {
      return Tree.build({
        buffer: [
          this.cypherTokenTypeToNode.topNode.id,
          0,
          document.length,
          DEFAULT_NODE_GROUP_SIZE,
        ],
        nodeSet: parserAdapterNodeSet(this.cypherTokenTypeToNode),
        topID: this.cypherTokenTypeToNode.topNode.id,
      });
    }

    const buffer = this.createBufferForTokens(tokens);
    this.addTopNodeToBuffer(buffer, document);

    return Tree.build({
      buffer: buffer.flat(),
      nodeSet: parserAdapterNodeSet(this.cypherTokenTypeToNode),
      topID: this.cypherTokenTypeToNode.topNode.id,
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
