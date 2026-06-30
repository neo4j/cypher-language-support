import { ParserRuleContext } from 'antlr4';
import { DiagnosticSeverity } from 'vscode-languageserver-types';

import { DbSchema } from '../dbSchema.js';
import {
  CreateClauseContext,
  InsertClauseContext,
  MergeClauseContext,
  NodePatternContext,
  PatternElementContext,
  RelationshipPatternContext,
} from '../generated-parser/CypherCmdParser.js';
import {
  ParsedStatement,
  translateTokensToRange,
} from '../cypherLanguageService.js';
import {
  isAnyNode,
  isNotAnyNode,
  removeInnerAnys,
} from '../labelTreeRewriting.js';
import { getNodesFromRelsSet } from '../labelTreeWalking.js';
import { isLabelLeaf, LabelOrCondition, SymbolTable } from '../types.js';
import { SyntaxDiagnostic } from './syntaxValidation.js';
import { getDirection } from '../helpers.js';

// A relationship has exactly one type; this stand-in represents "some
// relationship type that is not mentioned anywhere" when checking whether a
// relationship type expression is satisfiable at all.
const NON_SCHEMA_RELTYPE = '__non_schema_reltype__';

type NodeRole = 'from' | 'to' | 'either';

/**
 * Warns when a node-relationship adjacency (a "path segment") in a read pattern
 * is not possible according to the graph schema. Works at the pair level: for
 * each relationship we check the node before it and the node after it against
 * the relationship's matching types on the relevant endpoint side.
 */
export function warnOnSchemaPathViolations(
  parseResult: ParsedStatement,
  dbSchema: DbSchema,
  symbolTable: SymbolTable,
): SyntaxDiagnostic[] {
  if (!dbSchema.graphSchema) {
    return [];
  }

  const diagnostics: SyntaxDiagnostic[] = [];
  try {
    const { fromRels, toRels } = getNodesFromRelsSet(dbSchema);
    const schemaRelTypes = new Set<string>(fromRels.keys());

    for (const patternElement of collectReadPatternElements(parseResult.ctx)) {
      const elements = (patternElement.children ?? []).filter(
        (c): c is NodePatternContext | RelationshipPatternContext =>
          c instanceof NodePatternContext ||
          c instanceof RelationshipPatternContext,
      );

      for (let i = 0; i < elements.length; i++) {
        const rel = elements[i];
        if (!(rel instanceof RelationshipPatternContext)) {
          continue;
        }
        try {
          const left = asNode(elements[i - 1]);
          const right = asNode(elements[i + 1]);
          collectSegmentWarnings(
            rel,
            left,
            right,
            symbolTable,
            schemaRelTypes,
            fromRels,
            toRels,
          ).forEach((d) => diagnostics.push(d));
        } catch {
          // A single broken/partial segment must never break linting.
        }
      }
    }
  } catch {
    return [];
  }

  return diagnostics;
}

function asNode(
  element: NodePatternContext | RelationshipPatternContext | undefined,
): NodePatternContext | undefined {
  return element instanceof NodePatternContext ? element : undefined;
}

type Direction = 'right' | 'left' | 'undirected';

function collectSegmentWarnings(
  rel: RelationshipPatternContext,
  left: NodePatternContext | undefined,
  right: NodePatternContext | undefined,
  symbolTable: SymbolTable,
  schemaRelTypes: Set<string>,
  fromRels: Map<string, Set<string>>,
  toRels: Map<string, Set<string>>,
): SyntaxDiagnostic[] {
  // Variable-length relationships are not linted.
  if (rel.pathLength()) {
    return [];
  }

  const relEntry = findEntry(rel, symbolTable);
  if (!relEntry || isAnyNode(relEntry.labels)) {
    return [];
  }
  const relTree = relEntry.labels;

  // `!%` and other relationship type expressions that no single type can
  // satisfy are handled by Neo4j's own semantic error; don't pile on.
  if (!relTypeSatisfiable(relTree, schemaRelTypes)) {
    return [];
  }

  const validRelTypes = [...schemaRelTypes].filter((t) =>
    relTypeMatches(relTree, t),
  );
  const direction = getDirection(rel);
  const relStr = renderLabelTree(relTree);

  const warnings: SyntaxDiagnostic[] = [];

  if (left) {
    const warning = checkAdjacency({
      node: left,
      position: 'left',
      rel,
      relStr,
      validRelTypes: validRelTypes,
      role: roleFor('left', direction),
      qualifier: qualifierFor(direction),
      symbolTable,
      fromRels,
      toRels,
    });
    if (warning) {
      warnings.push(warning);
    }
  }
  if (right) {
    const warning = checkAdjacency({
      node: right,
      position: 'right',
      rel,
      relStr,
      validRelTypes: validRelTypes,
      role: roleFor('right', direction),
      qualifier: qualifierFor(direction),
      symbolTable,
      fromRels,
      toRels,
    });
    if (warning) {
      warnings.push(warning);
    }
  }

  return warnings;
}

function checkAdjacency({
  node,
  position,
  rel,
  relStr,
  validRelTypes,
  role,
  qualifier,
  symbolTable,
  fromRels,
  toRels,
}: {
  node: NodePatternContext;
  position: 'left' | 'right';
  rel: RelationshipPatternContext;
  relStr: string;
  validRelTypes: string[];
  role: NodeRole;
  qualifier: string;
  symbolTable: SymbolTable;
  fromRels: Map<string, Set<string>>;
  toRels: Map<string, Set<string>>;
}): SyntaxDiagnostic | undefined {
  const nodeEntry = findEntry(node, symbolTable);
  if (!nodeEntry || isAnyNode(nodeEntry.labels)) {
    return undefined;
  }
  const nodeTree = nodeEntry.labels;

  const cleaned = removeInnerAnys(nodeTree);
  // `%` (any) is a tautology and `!%` matches only label-less nodes - neither
  // can be disproven against a label-keyed schema.
  if (isAnyNode(cleaned) || isNotAnyNode(cleaned)) {
    return undefined;
  }

  const supported = validRelTypes.some((relType) => {
    const from = fromRels.get(relType) ?? new Set<string>();
    const to = toRels.get(relType) ?? new Set<string>();
    if (role === 'from') {
      return subsetSatisfiable(cleaned, from);
    }
    if (role === 'to') {
      return subsetSatisfiable(cleaned, to);
    }
    return subsetSatisfiable(cleaned, from) || subsetSatisfiable(cleaned, to);
  });

  if (supported) {
    return undefined;
  }

  const nodeStr = renderLabelTree(nodeTree);
  if (position === 'left') {
    return {
      message: `Relationship with relationship type(s) ${relStr} has no ${qualifier}connection to a node with label(s) ${nodeStr}.`,
      ...translateTokensToRange(node.start, rel.stop),
      severity: DiagnosticSeverity.Warning,
    };
  }
  return {
    message: `Node with label(s) ${nodeStr} has no ${qualifier}connection to a relationship with relationship type(s) ${relStr}.`,
    ...translateTokensToRange(rel.start, node.stop),
    severity: DiagnosticSeverity.Warning,
  };
}

function roleFor(position: 'left' | 'right', direction: Direction): NodeRole {
  if (direction === 'undirected') {
    return 'either';
  }
  if (direction === 'right') {
    return position === 'left' ? 'from' : 'to';
  }
  // left arrow
  return position === 'left' ? 'to' : 'from';
}

function qualifierFor(direction: Direction): string {
  if (direction === 'right') {
    return 'incoming ';
  }
  if (direction === 'left') {
    return 'outgoing ';
  }
  return '';
}

/**
 * Finds the (possibly anonymous) variable's symbol-table entry for a node or
 * relationship pattern. Named variables are matched by reference offset;
 * anonymous ones by the synthetic definition position inside the pattern span.
 */
function findEntry(
  element: NodePatternContext | RelationshipPatternContext,
  symbolTable: SymbolTable,
): SymbolTable[number] | undefined {
  const variable = element.variable();
  if (variable === null) {
    return symbolTable.find(
      (entry) =>
        entry.definitionPosition >= element.start.start &&
        entry.definitionPosition <= (element.stop?.stop ?? -1),
    );
  }
  return symbolTable.find((entry) =>
    entry.references.includes(variable.start.start),
  );
}

/**
 * Is the cleaned (any-free) node label tree satisfiable by some non-empty set
 * of labels that the schema allows on this side (`candidates`)?
 *
 * `evalNodeTree` only inspects labels that appear in the tree, so any candidate
 * NOT named in the tree is interchangeable with every other such candidate. We
 * therefore only enumerate subsets of the labels that are both named in the
 * tree and valid candidates (`candInTree`). That keeps the 2^n search bounded by
 * the number of labels written in the query's label expression, not by the
 * (potentially schema-sized) candidate set.
 *
 * `otherAvailable` records that at least one valid candidate is not named in the
 * tree. Such a label doesn't change the tree's truth value (the tree never
 * references it), but it does make the node's label set genuinely non-empty.
 * That is what lets e.g. `(:!Pokemon)` be satisfied by a `Gym` node when `Gym`
 * is a valid candidate: the empty `candInTree` subset evaluates the tree as
 * true, and `otherAvailable` confirms a real (non-empty) node can back it.
 */
function subsetSatisfiable(
  tree: LabelOrCondition,
  candidates: Set<string>,
): boolean {
  const mentioned = labelsIn(tree);
  const candInTree = [...candidates].filter((c) => mentioned.has(c));
  const otherAvailable = [...candidates].some((c) => !mentioned.has(c));

  const n = candInTree.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    const labelSet = new Set<string>();
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        labelSet.add(candInTree[i]);
      }
    }
    // The assignment must correspond to a real, non-empty node: it either uses
    // a named candidate, or relies on some other (unnamed) candidate existing.
    if (evalNodeTree(tree, labelSet) && (labelSet.size > 0 || otherAvailable)) {
      return true;
    }
  }
  return false;
}

/** Evaluate a node label tree as a boolean over the node's label set `S`. */
function evalNodeTree(tree: LabelOrCondition, labelSet: Set<string>): boolean {
  if (isLabelLeaf(tree)) {
    return labelSet.has(tree.value);
  }
  switch (tree.condition) {
    case 'and':
      return tree.children.every((c) => evalNodeTree(c, labelSet));
    case 'or':
      return tree.children.some((c) => evalNodeTree(c, labelSet));
    case 'not':
      return !evalNodeTree(tree.children[0], labelSet);
    case 'any':
      return labelSet.size > 0;
  }
}

/** Whether a relationship of exactly type `t` matches the type expression. */
function relTypeMatches(tree: LabelOrCondition, t: string): boolean {
  if (isLabelLeaf(tree)) {
    return tree.value === t;
  }
  switch (tree.condition) {
    case 'and':
      return tree.children.every((c) => relTypeMatches(c, t));
    case 'or':
      return tree.children.some((c) => relTypeMatches(c, t));
    case 'not':
      return !relTypeMatches(tree.children[0], t);
    case 'any':
      return true;
  }
}

/** Whether any single relationship type could satisfy the type expression. */
function relTypeSatisfiable(
  tree: LabelOrCondition,
  schemaRelTypes: Set<string>,
): boolean {
  const universe = new Set<string>([
    ...schemaRelTypes,
    ...labelsIn(tree),
    NON_SCHEMA_RELTYPE,
  ]);
  for (const t of universe) {
    if (relTypeMatches(tree, t)) {
      return true;
    }
  }
  return false;
}

function labelsIn(
  tree: LabelOrCondition,
  acc: Set<string> = new Set<string>(),
): Set<string> {
  if (isLabelLeaf(tree)) {
    acc.add(tree.value);
  } else {
    tree.children.forEach((c) => labelsIn(c, acc));
  }
  return acc;
}

//TODO: verify that this is how switch-case works (see 'and')
/** Renders a label/type tree back to its written form (e.g. `(A | !B)`). */
function renderLabelTree(tree: LabelOrCondition): string {
  if (isLabelLeaf(tree)) {
    return tree.value;
  }
  switch (tree.condition) {
    case 'any':
      return '%';
    case 'not':
      return '!' + renderLabelTree(tree.children[0]);
    case 'and':
    case 'or': {
      if (tree.children.length <= 1) {
        return tree.children.length === 1
          ? renderLabelTree(tree.children[0])
          : '';
      }
      const separator = tree.condition === 'and' ? ' & ' : ' | ';
      return '(' + tree.children.map(renderLabelTree).join(separator) + ')';
    }
  }
}

/** All read-side `PatternElement`s, skipping CREATE/INSERT/MERGE subtrees. */
function collectReadPatternElements(
  root: ParserRuleContext,
): PatternElementContext[] {
  const result: PatternElementContext[] = [];
  const visit = (node: ParserRuleContext) => {
    if (
      node instanceof CreateClauseContext ||
      node instanceof MergeClauseContext ||
      node instanceof InsertClauseContext
    ) {
      return;
    }
    if (node instanceof PatternElementContext) {
      result.push(node);
    }
    for (const child of node.children ?? []) {
      if (child instanceof ParserRuleContext) {
        visit(child);
      }
    }
  };
  visit(root);
  return result;
}
