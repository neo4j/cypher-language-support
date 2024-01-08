import { Facet } from '@codemirror/state';
import { Input, NodeType, Parser, PartialParse, Tree } from '@lezer/common';
import Prism from 'prismjs';
// cursed way to load cypher
import 'prismjs/components/prism-cypher';

Prism.manual = true;
Prism.Token;

import { parserAdapterNodeSet, prismTokenTypeToNode } from './constants';

const DEFAULT_NODE_GROUP_SIZE = 4;

export class PrismParserAdapter extends Parser {
  cypherTokenTypeToNode: Record<string, NodeType> & {
    topNode: NodeType;
  };

  constructor(facet: Facet<unknown>) {
    super();
    this.cypherTokenTypeToNode = prismTokenTypeToNode(facet);
  }

  private createBufferForTokens(tokens: (string | Prism.Token)[]) {
    let totalOffset = 0;
    return tokens.map((token) => {
      if (typeof token === 'string') {
        const nodeTypeId = this.cypherTokenTypeToNode.variable.id;
        const startOffset = totalOffset;
        const endOffset = startOffset + token.length;
        totalOffset = endOffset;

        return [nodeTypeId, startOffset, endOffset, DEFAULT_NODE_GROUP_SIZE];
      } else {
        const nodeTypeId = this.cypherTokenTypeToNode[token.type].id;
        const startOffset = totalOffset;
        const endOffset = startOffset + token.length;
        totalOffset = endOffset;

        return [nodeTypeId, startOffset, endOffset, DEFAULT_NODE_GROUP_SIZE];
      }
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
    const prismStart = performance.now();
    const tokens = Prism.tokenize(document, Prism.languages.cypher);
    const prismtaken = performance.now() - prismStart;
    console.log(tokens);
    console.log('prism took', prismtaken);

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
