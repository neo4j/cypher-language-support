// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore There is a default export but not in the types
import def, {
  CharStreams,
  CommonTokenStream,
  ParserRuleContext,
  Token,
} from 'antlr4';
import CypherLexer from './generated-parser/CypherLexer';
import CypherParser, {
  StatementsContext,
} from './generated-parser/CypherParser';

export function findStopNode(root: StatementsContext) {
  let children = root.children;
  let current: ParserRuleContext = root;

  while (children && children.length > 0) {
    let index = children.length - 1;
    let child = children[index];

    while (
      index > 0 &&
      (child === root.EOF() ||
        child.getText() === '' ||
        child.getText().startsWith('<missing'))
    ) {
      index--;
      child = children[index];
    }
    current = child as ParserRuleContext;
    children = current.children;
  }

  return current;
}

export function findParent(
  leaf: ParserRuleContext | undefined,
  condition: (node: ParserRuleContext) => boolean,
) {
  let current: ParserRuleContext | undefined = leaf;

  while (current && !condition(current)) {
    current = current.parentCtx;
  }

  return current;
}

export function getTokens(tokenStream: CommonTokenStream): Token[] {
  // FIXME The type of .tokens is string[], it seems wrong in the antlr4 library
  // Fix this after we've raised an issue and a PR and has been corrected in antlr4
  return tokenStream.tokens as unknown as Token[];
}

export function parse(cypher: string) {
  const inputStream = CharStreams.fromString(cypher);

  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new CypherParser(tokenStream);
  return parser.statements();
}

export interface SimpleTree {
  name: string;
  children?: SimpleTree[];
}

type AntlrTreeUtil = {
  tree: {
    Trees: {
      getNodeText(
        node: ParserRuleContext,
        s: string[],
        c: typeof CypherParser,
      ): string;
      getChildren(node: ParserRuleContext): ParserRuleContext[];
    };
  };
};
const antlrUtils = def as unknown as AntlrTreeUtil;
export function getDebugTree(cypher: string): SimpleTree {
  const inputStream = CharStreams.fromString(cypher);

  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new CypherParser(tokenStream);

  const statements = parser.statements();
  function walk(node: ParserRuleContext): SimpleTree {
    const name = antlrUtils.tree.Trees.getNodeText(
      node,
      CypherParser.ruleNames,
      CypherParser,
    );

    return {
      name: name,
      children: antlrUtils.tree.Trees.getChildren(node).map(walk),
    };
  }

  return walk(statements);
}
