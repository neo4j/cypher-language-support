import { Facet } from '@codemirror/state';
import { Input, NodeType, Parser, PartialParse, Tree } from '@lezer/common';
import {
  applySyntaxColouring,
  CypherTokenType,
  ParsedCypherToken,
} from '@neo4j-cypher/language-support';

import Prism from 'prismjs';
import { cypherTokenTypeToNode, parserAdapterNodeSet } from './constants';
// cursed way to load cypher
import 'prismjs/components/prism-cypher';
import { CypherConfig } from './lang-cypher';

const DEFAULT_NODE_GROUP_SIZE = 4;
Prism.manual = true;
Prism.Token;

export class ParserAdapter extends Parser {
  cypherTokenTypeToNode: Record<CypherTokenType, NodeType> & {
    topNode: NodeType;
  } & Record<string, NodeType>; // todo

  constructor(facet: Facet<unknown>, private config: CypherConfig) {
    super();
    this.cypherTokenTypeToNode = cypherTokenTypeToNode(facet);
  }

  private createBufferForAntlrTokens(tokens: ParsedCypherToken[]) {
    return tokens.map((token) => {
      const nodeTypeId = this.cypherTokenTypeToNode[token.tokenType].id;
      const startOffset = token.position.startOffset;
      const endOffset = token.position.startOffset + token.length;

      return [nodeTypeId, startOffset, endOffset, DEFAULT_NODE_GROUP_SIZE];
    });
  }

  private createBufferForPrismTokens(tokens: (string | Prism.Token)[]) {
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

  private createEmptyTree(document: string) {
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

  // Prism is about 20x our parser, which helps a lot for input lag
  private buildTree(document: string) {
    let buffer: number[][] = [];
    if (this.config.useLightVersion) {
      const tokens = Prism.tokenize(document, Prism.languages.cypher);

      if (document.length === 0) {
        this.config.setUseLightVersion?.(false);
      }
      if (tokens.length === 0) {
        return this.createEmptyTree(document);
      }
      buffer = this.createBufferForPrismTokens(tokens);
      // encapsulate more for less duplication
    } else {
      const startTime = performance.now();
      const tokens = applySyntaxColouring(document);
      const timeTaken = performance.now() - startTime;
      if (timeTaken > 300) {
        this.config.setUseLightVersion?.(true);
      }

      if (tokens.length === 0) {
        return this.createEmptyTree(document);
      }
      buffer = this.createBufferForAntlrTokens(tokens);
    }

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
