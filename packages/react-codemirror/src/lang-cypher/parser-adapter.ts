import { Facet } from '@codemirror/state';
import { Input, NodeType, Parser, PartialParse, Tree } from '@lezer/common';
import {
  applySyntaxColouring,
  ParsedCypherToken,
} from '@neo4j-cypher/language-support';

import Prism from 'prismjs';
import {
  CodemirrorParseTokenType,
  cypherTokenTypeToNode,
  parserAdapterNodeSet,
} from './constants';
// This import will load the cypher support in prisma
import 'prismjs/components/prism-cypher';
import { CypherConfig } from './langCypher';

const DEFAULT_NODE_GROUP_SIZE = 4;
Prism.manual = true;

export class ParserAdapter extends Parser {
  cypherTokenTypeToNode: Record<CodemirrorParseTokenType, NodeType>;

  constructor(facet: Facet<unknown>, private config: CypherConfig) {
    super();
    this.cypherTokenTypeToNode = cypherTokenTypeToNode(facet);
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

  private buildTree(document: string) {
    const parse = this.config.useLightVersion
      ? this.prismParse(document)
      : this.antlrParse(document);

    if (parse.tokens.length === 0) {
      return this.createEmptyTree(document);
    }

    const buffer =
      parse.type === 'prism'
        ? this.createBufferForPrismTokens(parse.tokens)
        : this.createBufferForAntlrTokens(parse.tokens);

    this.addTopNodeToBuffer(buffer, document);

    return Tree.build({
      buffer: buffer.flat(),
      nodeSet: parserAdapterNodeSet(this.cypherTokenTypeToNode),
      topID: this.cypherTokenTypeToNode.topNode.id,
    });
  }

  private antlrParse(document: string) {
    const startTime = performance.now();
    const tokens = applySyntaxColouring(document);
    const timeTaken = performance.now() - startTime;
    if (timeTaken > 300) {
      this.config.setUseLightVersion?.(true);
    }
    return { type: 'antlr' as const, tokens };
  }

  private prismParse(document: string) {
    if (document.length === 0) {
      this.config.setUseLightVersion?.(false);
    }
    const tokens = Prism.tokenize(document, Prism.languages.cypher);
    return {
      type: 'prism' as const,
      tokens,
    };
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
      const tokenType = (
        typeof token === 'string' ? 'variable' : token.type
      ) as CodemirrorParseTokenType;

      const nodeTypeId = this.cypherTokenTypeToNode[tokenType].id;
      const startOffset = totalOffset;
      const endOffset = startOffset + token.length;
      totalOffset = endOffset;

      return [nodeTypeId, startOffset, endOffset, DEFAULT_NODE_GROUP_SIZE];
    });
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
}
