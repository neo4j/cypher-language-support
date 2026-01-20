import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import { ParsedStatement } from '../parserWrapper';
import { isLabelLeaf, LabelOrCondition, SymbolsInfo } from '../types';
import { findParent } from '../helpers';
import {
  NodePatternContext,
  PatternElementContext,
  QuantifierContext,
  RelationshipPatternContext,
} from '../generated-parser/CypherCmdParser';
import { backtickIfNeeded } from './autocompletionHelpers';

export const labelsToCompletions = (labelNames: string[] = []) =>
  labelNames.map((labelName) => {
    const backtickedName = backtickIfNeeded(labelName, 'label');
    const maybeInsertText = backtickedName
      ? { insertText: backtickedName }
      : {};

    const result: CompletionItem = {
      label: labelName,
      kind: CompletionItemKind.TypeParameter,
      ...maybeInsertText,
    };
    return result;
  });

export const allLabelCompletions = (dbSchema: DbSchema) =>
  labelsToCompletions(dbSchema.labels);

export const reltypesToCompletions = (reltypes: string[] = []) =>
  reltypes.map((relType) => {
    const backtickedName = backtickIfNeeded(relType, 'relType');
    const maybeInsertText = backtickedName
      ? { insertText: backtickedName }
      : {};

    const result: CompletionItem = {
      label: relType,
      kind: CompletionItemKind.TypeParameter,
      ...maybeInsertText,
    };
    return result;
  });

export const allReltypeCompletions = (dbSchema: DbSchema) =>
  reltypesToCompletions(dbSchema.relationshipTypes);

//{Isak,Oskar,Necla,Greg}
//MATCH (n:!Isak) = MATCH (n:OR(alla som inte är Isak, plus blanka))
function intersectChildren(
  incomingLabels: Map<string, Set<string>>,
  outGoingLabels: Map<string, Set<string>>,
  children: LabelOrCondition[],
): { inLabels: Set<string>; outLabels: Set<string> } {
  let inLabels: Set<string> = undefined;
  let outLabels: Set<string> = undefined;
  children.forEach((c) => {
    const { inLabels: incoming, outLabels: outgoing } = walkLabelTree(
      incomingLabels,
      outGoingLabels,
      c,
    );
    if (!inLabels) {
      inLabels = incoming;
      outLabels = outgoing;
    } else {
      inLabels = inLabels.intersection(incoming);
      outLabels = outLabels.intersection(outgoing);
    }
  });
  if (!inLabels) {
    inLabels = new Set();
    outLabels = new Set();
  }
  return { inLabels, outLabels };
}

function uniteChildren(
  incomingLabels: Map<string, Set<string>>,
  outGoingLabels: Map<string, Set<string>>,
  children: LabelOrCondition[],
): { inLabels: Set<string>; outLabels: Set<string> } {
  let inLabels: Set<string> = new Set();
  let outLabels: Set<string> = new Set();
  children.forEach((c) => {
    const { inLabels: incoming, outLabels: outgoing } = walkLabelTree(
      incomingLabels,
      outGoingLabels,
      c
    );
    inLabels = inLabels.union(incoming);
    outLabels = outLabels.union(outgoing);
  });
  return { inLabels, outLabels };
}

function notChild(
  incomingLabels: Map<string, Set<string>>,
  outGoingLabels: Map<string, Set<string>>,
  children: LabelOrCondition[],
): {inLabels: Set<string>; outLabels: Set<string> } {
  //If we dont only have a single child, this approach does not work. 
  // Rewriting should always move NOTs to just above the label leaves
  //This is to bail, returning all labels, if something is wrong
//!(Joel|Isak) = !Joel&!Isak
//!Joel
  if (children.length !== 1  || !isLabelLeaf(children[0])) { //n:!(Joel|Isak))-[:
    let inLabels = new Set<string>();
    incomingLabels.forEach(part => inLabels = inLabels.union(part)); //n:!Oskar-[IS_NAMED] Isak-[IS_NAMED] ALLCOMPLETIONS.difference(OskarCompletions)
    let outLabels = new Set<string>();
    outGoingLabels.forEach(part => outLabels = outLabels.union(part)); 
    // This is equiv to saying !A = OR(B,C,D,E,...)
    // But is this really true? !A implies any node matching A is not to be matched.
    // So !A&!B&!C -> any label not A,B,C
    //When we then get completions out of A, we can have overlap 
    return {inLabels, outLabels}
  }
  const notLabel = children[0].value;
  var inLabels = new Set<string>();
  incomingLabels.forEach((part, key) => { if (key !== notLabel) inLabels = inLabels.union(part) });
  var outLabels = new Set<string>();
  outGoingLabels.forEach((part, key) => { if (key !== notLabel) outLabels = outLabels.union(part) });
  
  // Don't want to "remove labels going in/out of 'not-ed condition', since we can have overlap like 'x goes out of y, but also out of z' -> !y should still give x, since !y could be z "
  // More proper way - get all labels, but dont pick up those from not-ed label... how to do this with NOT(some big condition)?
  // Can we simplify by things like NOT(OR(A,B)) = AND(NOT(A), NOT(B)) = AND ( OR(B,C,D,...), OR(A,C,D,...)) = AND(OR(C,D,...)) -> skip labels out from A and out from B.. NOT(A & B) -> NOT(A) | NOT(B)
  //For more complicated like AND(OR(B,C,D), OR(A,C,D), Q) = AND(OR(C,D), Q)
  // let allIncomingLabels = new Set<string>();
  //   incomingLabels.forEach(part => allIncomingLabels = allIncomingLabels.union(part));
  // const { inLabels: childIncoming, outLabels: childOutgoing } = walkLabelTree(incomingLabels, outGoingLabels, children[0]);
  // let allOutGoingLabels = new Set<string>();
  //   outGoingLabels.forEach(part => allOutGoingLabels = allOutGoingLabels.union(part));
  // const inLabels = allIncomingLabels.difference(childIncoming);
  // const outLabels = allOutGoingLabels.difference(childOutgoing);
  return {inLabels, outLabels}
}

function copyLabelTree(
  labelTree: LabelOrCondition
) {
  if (isLabelLeaf(labelTree)) {
    return {...labelTree};
  } else {
    return {condition: labelTree.condition, children: labelTree.children.map(copyLabelTree)}
  }
}

/**
 * Use laws of boolean algebra to rewrite label tree to remove duplicate conditions
 * and move not-nodes to the bottom with De Morgan's laws
 * Could be expanded to use absorption law
 * @param labelTree 
 * @returns a simplified copy of the input tree
 */
export function rewriteLabelTree(
  labelTree: LabelOrCondition
) {
  let newLabelTree: LabelOrCondition = copyLabelTree(labelTree);
  if (isLabelLeaf(newLabelTree)) {
    return newLabelTree;
  } else {
    //Handling negation
    if (newLabelTree.condition === 'not' && !isLabelLeaf(newLabelTree.children[0])) {
      const c = newLabelTree.children[0]
      const newCondition = c.condition === 'not' ? "doubleNegation" : c.condition === 'and' ? 'or' : 'and';
      if (newCondition === "doubleNegation"){
        // If double negation, completely remove both negations and restart to check for leaves
        newLabelTree = newLabelTree.children[0].children[0]
        return rewriteLabelTree(newLabelTree);
      } else {
        // If single negation, use De Morgan's law to move down NOTs like NOT(AND(A,B,...)) = OR(NOT(A),NOT(B),...)
        const newChildren: LabelOrCondition[] = newLabelTree.children[0].children.map(c =>  {
          return {condition: 'not', children: [c]}
        })
        newLabelTree = { condition: newCondition, children: newChildren};
      }
    }

    for (let i=0; i< newLabelTree.children.length; i++) {
      newLabelTree.children[i] = rewriteLabelTree(newLabelTree.children[i])
    }

    // Simplify repeated conditions like AND(AND(A,B))
    const newChildren: LabelOrCondition[] = []
    for (const c of newLabelTree.children) {
      if (isLabelLeaf(c) || c.condition !== newLabelTree.condition) {
        newChildren.push(c);
      } else {
        c.children.forEach(innerChild => newChildren.push(innerChild));
      }
    }
    newLabelTree.children = newChildren;

    for (let i=0; i < newLabelTree.children.length; i++) {
      for (let j=i+1; j < newLabelTree.children.length; j++) {
        if(newLabelTree.children[i] == undefined || newLabelTree.children[j] == undefined) {
          continue;
        }
        const firstDef = getFirstDefinition(newLabelTree.children[i], newLabelTree.children[j]);
        if (firstDef === newLabelTree.children[i]) {
          newLabelTree.children[j] = undefined;
        } else if (firstDef === newLabelTree.children[j]) {
          newLabelTree.children[i] = undefined;
        }
      }
    }
    newLabelTree.children = newLabelTree.children.filter(x => x !== undefined)
  }
  return newLabelTree;
}

//Should unit test these if we end up doing things this way
//Can improve this by sorting children
/** 
 * @param labelTree1 
 * @param labelTree2 
 * @returns first definition of the condition if the two conditions are equal
 * otherwise returns undefined
 */
function getFirstDefinition(labelTree1: LabelOrCondition, labelTree2: LabelOrCondition): LabelOrCondition | undefined {
  if(isLabelLeaf(labelTree1) && isLabelLeaf(labelTree2) && labelTree1.value == labelTree2.value) {
    if (labelTree1.validFrom <= labelTree2.validFrom) {
      return labelTree1;
    } else {
      return labelTree2;
    }
  }
  if (isLabelLeaf(labelTree1) || isLabelLeaf(labelTree2) || labelTree1.condition !== labelTree2.condition) {
    return undefined;
  }

  let firstCondition: LabelOrCondition = undefined;
  
  for (const c1 of labelTree1.children) {
    firstCondition = undefined;
    for (const c2 of labelTree2.children) {
      const firstDef = getFirstDefinition(c1, c2);
      //So firstdefinition is only set on a match
      
      //We can trust the last call of this overwriting firstCondition to be the same as the first,
      //since a clause defining a condition will in its entirety (including all subconditions) be either before or after another clause
      //Ex. MATCH (n:A&B)-[]-(n:B&A) <- there is no weird construct that somehow reads the second node pattern AND something from the first node pattern to create a duplicate
      //condition. The second node-pattern clause is after in its entirety.

      //above sounds messy, but atm im struggling to find a clean way to describe it
      if (firstDef === c1) {
        firstCondition = labelTree1;
        break;
      } else if (firstDef === c2) {
        firstCondition = labelTree2;
        break;
      }
    }
    //If we failed to find a single match
    if (!firstCondition) {
      return undefined
    }
  }
  return firstCondition;


}

function walkLabelTree(
  incomingLabels: Map<string, Set<string>>,
  outGoingLabels: Map<string, Set<string>>,
  labelTree: LabelOrCondition,
): { inLabels: Set<string>; outLabels: Set<string> } {
  if (isLabelLeaf(labelTree)) {
    const incoming = incomingLabels.get(labelTree.value);
    const outgoing = outGoingLabels.get(labelTree.value);
    return {
      inLabels: incoming ?? new Set(),
      outLabels: outgoing ?? new Set(),
    };
  } else if (labelTree.condition == 'and') {
    return intersectChildren(
      incomingLabels,
      outGoingLabels,
      labelTree.children,
    );
  } else if (labelTree.condition == 'or') {
    return uniteChildren(incomingLabels, outGoingLabels, labelTree.children);
  } else {
    return notChild(incomingLabels, outGoingLabels, labelTree.children);
  }
}

function getRelsFromNodesSets(dbSchema: DbSchema): {
  toNodes: Map<string, Set<string>>;
  fromNodes: Map<string, Set<string>>;
} {
  if (dbSchema.graphSchema) {
    const toNodes: Map<string, Set<string>> = new Map();
    const fromNodes: Map<string, Set<string>> = new Map();
    dbSchema.graphSchema.forEach((rel) => {
      //rels in schema defined like (from)-(relType)->(to)
      //Means 'from' is "node going to rel", hence why we
      //pass rel.from into toNodes
      if (!toNodes.has(rel.from)) {
        toNodes.set(rel.from, new Set());
      }
      if (!fromNodes.has(rel.to)) {
        fromNodes.set(rel.to, new Set());
      }
      toNodes.get(rel.from).add(rel.relType);
      fromNodes.get(rel.to).add(rel.relType);
    });
    return { toNodes, fromNodes };
  }
  return undefined;
}

function getNodesFromRelsSet(dbSchema: DbSchema): {
  toRels: Map<string, Set<string>>;
  fromRels: Map<string, Set<string>>;
} {
  if (dbSchema.graphSchema) {
    const toRels: Map<string, Set<string>> = new Map();
    const fromRels: Map<string, Set<string>> = new Map();
    dbSchema.graphSchema.forEach((rel) => {
      if (!toRels.has(rel.relType)) {
        toRels.set(rel.relType, new Set());
        fromRels.set(rel.relType, new Set());
      }
      toRels.get(rel.relType).add(rel.to);
      fromRels.get(rel.relType).add(rel.from);
    });
    return { toRels, fromRels };
  }
  return undefined;
}

function findLastVariable(
  lastValidElement: NodePatternContext | RelationshipPatternContext,
  symbolsInfo: SymbolsInfo,
) {
  const variable = lastValidElement.variable();
  const isAnonVar = variable === null;
  const foundVariable = isAnonVar
    ? symbolsInfo?.symbolTables?.flat().find(
        (entry) =>
          // Because the anonymous variable created in the AST is "made up", it doesnt have a position of its own in the query.
          // It therefor inherits the parent-nodes (The NodePattern/RelationshipPattern = lastValidElement) position
          entry.definitionPosition >= lastValidElement.start.start &&
          entry.definitionPosition <= lastValidElement.stop.stop,
      )
    : symbolsInfo?.symbolTables
        ?.flat()
        .find((entry) => entry.references.includes(variable.start.start));
  return foundVariable;
}

export function completeNodeLabel(
  dbSchema: DbSchema,
  parsingResult: ParsedStatement,
  symbolsInfo: SymbolsInfo,
): CompletionItem[] {
  if (dbSchema.graphSchema === undefined) {
    return allLabelCompletions(dbSchema);
  }

  const callContext = findParent(
    parsingResult.stopNode.parentCtx,
    (x) => x instanceof PatternElementContext,
  );

  if (callContext instanceof PatternElementContext) {
    const lastValidElement = callContext.children.toReversed().find((child) => {
      if (child instanceof RelationshipPatternContext) {
        if (child.exception === null) {
          return true;
        }
      }
    });

    // limitation: bailing out on quantifiers
    if (lastValidElement instanceof QuantifierContext) {
      return allLabelCompletions(dbSchema);
    }

    if (lastValidElement instanceof RelationshipPatternContext) {
      const foundVariable = findLastVariable(lastValidElement, symbolsInfo);
      if (
        foundVariable === undefined ||
        ('children' in foundVariable.labels &&
          foundVariable.labels.children.length == 0)
      ) {
        return allLabelCompletions(dbSchema);
      }

      const direction = lastValidElement.leftArrow()
        ? 'outgoing'
        : lastValidElement.rightArrow()
        ? 'incoming'
        : 'bidirectional';

      // limitation: not direction-aware (ignores <- vs ->)
      // limitation: not checking node label repetition
      const { toRels: nodesToRelsSet, fromRels: nodesFromRelsSet } =
        getNodesFromRelsSet(dbSchema);

      const rewrittenLabelTree = rewriteLabelTree(foundVariable.labels);

      const { inLabels, outLabels } = walkLabelTree(
        nodesToRelsSet,
        nodesFromRelsSet,
        rewrittenLabelTree
      );
      const allNodes =
        direction === 'outgoing'
          ? outLabels
          : direction === 'incoming'
          ? inLabels
          : inLabels.union(outLabels);
      return labelsToCompletions(Array.from(allNodes));
    }
  }

  return allLabelCompletions(dbSchema);
}

export function completeRelationshipType(
  dbSchema: DbSchema,
  parsingResult: ParsedStatement,
  symbolsInfo: SymbolsInfo,
): CompletionItem[] {
  if (dbSchema.graphSchema === undefined) {
    return allReltypeCompletions(dbSchema);
  }

  // limitation: not checking PathPatternNonEmptyContext
  // limitation: not handling parenthesized paths
  const patternContext = findParent(
    parsingResult.stopNode.parentCtx,
    (x) => x instanceof PatternElementContext,
  );

  if (patternContext instanceof PatternElementContext) {
    const lastValidElement = patternContext.children
      .toReversed()
      .find((child) => {
        if (child instanceof NodePatternContext) {
          if (child.exception === null) {
            return true;
          }
        }
      });

    const thisCtx = findParent(
      parsingResult.stopNode,
      (x) => x instanceof RelationshipPatternContext,
    );
    let direction = 'bidirectional';
    if (thisCtx instanceof RelationshipPatternContext) {
      direction = thisCtx.leftArrow()
        ? 'outgoing'
        : thisCtx.rightArrow()
        ? 'incoming'
        : 'bidirectional';
    }

    // limitation: bailing out on quantifiers
    if (lastValidElement instanceof QuantifierContext) {
      return allReltypeCompletions(dbSchema);
    }

    if (lastValidElement instanceof NodePatternContext) {
      const foundVariable = findLastVariable(lastValidElement, symbolsInfo);
      if (
        foundVariable === undefined ||
        ('children' in foundVariable.labels &&
          foundVariable.labels.children.length == 0)
      ) {
        return allReltypeCompletions(dbSchema);
      }

      // limitation: not checking relationship type repetition
      const { toNodes: relsToNodesSet, fromNodes: relsFromNodesSet } =
        getRelsFromNodesSets(dbSchema);

      const rewrittenLabelTree = rewriteLabelTree(foundVariable.labels);
      const { inLabels, outLabels } = walkLabelTree(
        relsToNodesSet,
        relsFromNodesSet,
        rewrittenLabelTree
      );
      const allRels =
        direction === 'outgoing'
          ? outLabels
          : direction === 'incoming'
          ? inLabels
          : inLabels.union(outLabels);
      return reltypesToCompletions(Array.from(allRels));
    }
  }

  return allReltypeCompletions(dbSchema);
}
