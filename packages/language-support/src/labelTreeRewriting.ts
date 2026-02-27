import {
  Condition,
  ConditionNode,
  isLabelLeaf,
  LabelOrCondition,
} from './types';

function copyLabelTree(labelTree: LabelOrCondition): LabelOrCondition {
  if (isLabelLeaf(labelTree)) {
    return { ...labelTree };
  } else {
    return {
      condition: labelTree.condition,
      children: labelTree.children.map(copyLabelTree),
    };
  }
}

/**
 * Takes a label tree with an AND-root and converts it to Conjunctive Normal Form
 * @param root - the original label tree
 * @returns a an equivalent CNF tree
 */
export function convertToCNF(root: LabelOrCondition): LabelOrCondition {
  if (isLabelLeaf(root) || !(root.condition === 'and')) {
    throw new Error('Misshapen label tree: Root is not an AND-node');
  } else {
    const newRoot = removeDuplicates(pushInNots(root));
    if (isLabelLeaf(newRoot) || !(root.condition === 'and')) {
      throw new Error(
        'Misshapen label tree: Root of tree after removing duplicates and moving to NNF is not an AND-node',
      );
    }
    const newChildren: LabelOrCondition[] = [];
    newRoot.children.forEach((x) => {
      const newChild: LabelOrCondition | undefined = depthFirstConvertAnds(x);
      addChild(newChildren, newChild, 'and');
    });
    const cnfRoot: ConditionNode = { condition: 'and', children: newChildren };
    const cleanedCnfTree: LabelOrCondition =
      simplifyAndRemoveTautologies(cnfRoot);
    return cleanedCnfTree;
  }
}

//TODO: Look into converting this using Tseytin Transformation for efficiency
/**
 * Converts a tree of AND/ORs so all AND's are pushed to the top.
 * Expects the input tree to be on Negative Normal Form
 * @param existingNode
 * @returns a converted tree containing no AND-children
 */
function depthFirstConvertAnds(
  existingNode: LabelOrCondition,
): LabelOrCondition | undefined {
  let node: LabelOrCondition = copyLabelTree(existingNode);
  if (isLabelLeaf(node)) {
    return node;
  }
  const newChildren: LabelOrCondition[] = [];
  const condition: Condition = node.condition;
  node.children.forEach((x: LabelOrCondition) => {
    const convertedChild: LabelOrCondition | undefined =
      depthFirstConvertAnds(x);
    //To get Ex. AND(AND(X,Y),Z) = AND(X,Y,Z)
    if (convertedChild) {
      addChild(newChildren, convertedChild, condition);
    }
  });
  node = { condition: node.condition, children: newChildren };
  if (node.condition === 'and') {
    return node;
  } else if (node.condition === 'or') {
    const pushedNode: LabelOrCondition = pushInOr(node);
    return pushedNode;
  } else if (
    node.condition === 'not' &&
    node.children.length === 1 &&
    isLabelLeaf(node.children[0])
  ) {
    return node;
  }
  //We should call pushInNots first, so if we get not above a condition, we have a bug, bail and fail
  else {
    throw new Error(
      'Misshapen label tree: Conversion expects an AND/OR tree on NNF',
    );
  }
}

/**
 * Helper method to add a condition while avoiding duplicate conditions and nested conditions of the same type.
 * Modifies the input array
 * @param arrayToModify
 * @param newChild
 * @param topCondition
 */
function addChild(
  arrayToModify: LabelOrCondition[],
  newChild: LabelOrCondition,
  topCondition: Condition,
) {
  if (!isLabelLeaf(newChild) && newChild.condition === topCondition) {
    newChild.children.forEach((gc) => {
      if (!childAlreadyExists(arrayToModify, gc)) arrayToModify.push(gc);
    });
  } else {
    if (!childAlreadyExists(arrayToModify, newChild))
      arrayToModify.push(newChild);
  }
}

/**
 * Helper method to check if we are adding a duplicate child-condition/label to an existing list of children
 * Exported for unit testing
 * @param existingChildren
 * @param newChild
 * @returns
 */
export function childAlreadyExists(
  existingChildren: LabelOrCondition[],
  newChild: LabelOrCondition,
): boolean {
  if (isLabelLeaf(newChild)) {
    return (
      existingChildren.find(
        (c) => isLabelLeaf(c) && c.value === newChild.value,
      ) !== undefined
    );
  } else {
    return (
      existingChildren.find((c) => equalConditions(c, newChild)) !== undefined
    );
  }
}

function equalConditions(c1: LabelOrCondition, c2: LabelOrCondition) {
  if (isLabelLeaf(c1)) {
    return isLabelLeaf(c2) && c1.value === c2.value;
  } else if (isLabelLeaf(c2)) {
    return false;
  } else if (
    c1.condition === c2.condition &&
    c1.children.length === c2.children.length
  ) {
    return c1.children.every((gc1) =>
      c2.children.some((gc2) => equalConditions(gc1, gc2)),
    );
  }
  return false;
}

/**
 * Pushes in the OR-node into AND-children, assuming OR-children like OR(OR(x),...) have been simplified to OR(x,...)
 * Also assumes the tree is in in Negative Normal Form (NNF)
 * See ex. https://personal.cis.strath.ac.uk/robert.atkey/cs208/converting-to-cnf.html
 * @param orCondition, an OR-node, which could contain AND-nodes
 * @returns the original OR-node if it contains no AND-nodes, and otherwise an AND-node, which can not contain other AND-nodes.
 */
function pushInOr(orCondition: LabelOrCondition): LabelOrCondition {
  const rewrittenOrNode: LabelOrCondition = copyLabelTree(orCondition);
  //Bail and fail if not calling with "and"-node

  if (isLabelLeaf(rewrittenOrNode) || rewrittenOrNode.condition !== 'or') {
    throw new Error(
      'Misshapen label tree: Calling for reshape of OR-node but passing different node',
    );
  }
  let rewrittenChildren: LabelOrCondition[] = rewrittenOrNode.children;
  let hasInnerAnds: boolean = true;
  while (hasInnerAnds) {
    const innerAnds: ConditionNode[] = [];
    const innerLiterals: LabelOrCondition[] = [];
    for (const c of rewrittenChildren) {
      if (isLabelLeaf(c) || c.condition === 'not') {
        innerLiterals.push(c);
      } else if (c.condition === 'and') {
        innerAnds.push(c);
      }
    }
    if (innerAnds.length === 0) {
      hasInnerAnds = false;
    } else if (innerLiterals.length > 0) {
      //Rewrite using Associative Law like OR(x,y, AND(A,B), AND(U,R,S)) = OR(OR(x,y,z, AND(A,B)),AND(R,S,T))
      //Then rewrite inner OR with the single AND using the distributive law so we get
      //OR(AND(OR(x,y,z,A), OR(x,y,z,B)), AND(R,S,T)), so we're left with just multiple ANDs of { literals/ORs of literals }
      const firstAnd: ConditionNode = innerAnds[0];
      const newInnerChildren: LabelOrCondition[] = [];
      for (const c of firstAnd.children) {
        const newGrandChildren: LabelOrCondition[] = [...innerLiterals];
        addChild(newGrandChildren, c, 'or');
        if (newGrandChildren.length > 1) {
          newInnerChildren.push({
            condition: 'or',
            children: newGrandChildren,
          });
        } else if (newGrandChildren.length === 1) {
          newInnerChildren.push(newGrandChildren[0]);
        }
      }

      const pushedOr: ConditionNode = {
        condition: 'and',
        children: newInnerChildren,
      };
      rewrittenChildren = [pushedOr].concat(
        innerAnds.slice(1, innerAnds.length),
      );
    } else if (innerAnds.length > 1) {
      //AND(x, OR(a,b)) => OR(AND(x,a), AND(x,b))
      //OR(x, AND(x,b)) => AND(OR(x,x), OR(x,b))
      // Rewrite using Associative Law Ex. OR(AND(A,B,C), AND(D,E,F), AND(R,S,T), ...) = OR(OR(AND(A,B,C), AND(D,E,F)), AND(R,S,T),...)
      // Then rewrite inner OR with 2 ANDs using the distributive law so we get
      // OR(AND(OR(A, AND(D,E,F), OR(B, AND(D,E,F)), OR(C, AND(D,E,F))), AND(R,S,T),...))
      // And rewrite each new inner OR with the distributive law ->
      // OR(AND(AND(OR(A,D),OR(A,E),OR(A,F),...),AND(OR(B,D),...),...)), AND(R,S,T)) - not forgetting to simplify double AND to
      // OR(AND(OR(A,D),OR(A,E),...),AND(R,S,T)) <- and we have reduced the inner AND-count by one. Rinse and repeat
      const firstAnd = innerAnds[0];
      const secondAnd = innerAnds[1];
      const totalMergedChildren: LabelOrCondition[] = [];
      for (const c of firstAnd.children) {
        //each of the first AND-children A,B,C gives us a new OR like OR(A, AND(D,E,F)), OR(B, AND(...))...
        //each of these can be deconstructed using the distributive law to an AND-node so we get
        //AND(AND(OR(...), OR(...)...,AND(OR(...)...),...)) = AND(OR(...), OR(...), OR(...), ...)
        for (const c2 of secondAnd.children) {
          const newChildren: LabelOrCondition[] = [];
          addChild(newChildren, c, 'or');
          addChild(newChildren, c2, 'or');
          if (newChildren.length > 1) {
            totalMergedChildren.push({
              condition: 'or',
              children: newChildren,
            });
          } else if (newChildren.length === 1) {
            totalMergedChildren.push(newChildren[0]);
          }
        }
      }
      const pushedOr: ConditionNode = {
        condition: 'and',
        children: totalMergedChildren,
      };
      rewrittenChildren = [pushedOr].concat(
        innerAnds.slice(2, innerAnds.length),
      );
    } else {
      //Finally after merging ANDs one by one we will arrive at OR(AND(...)) = AND(...) (where the final AND can get some pretty massive amount of children)
      return innerAnds[0];
    }
  }
  //Only reach this if we had no inner ands
  return rewrittenOrNode;
}

/**
 * Takes a CNF-tree and simplifies away redudant conditions and tautologies
 *
 * Tautologies are the conditions that are true for any label, like OR(!A, !B) or OR(!A, A)
 *
 * We can also simplify away conditions covered by another like AND(A, OR(A,B) = AND(A)
 *
 * Finally we can also simplify OR(!A, B, C, D) to !A, since this case includes the specific cases B,C,D
 *
 * Does some simplifications of the tree to remove redudant conditions. Some of these simplifications
 * ignore positions, rather than taking the first instance of a rule
 * @param root
 * @returns
 */
export function simplifyAndRemoveTautologies(
  root: LabelOrCondition,
): LabelOrCondition {
  const newRoot: LabelOrCondition = copyLabelTree(root);
  if (isLabelLeaf(newRoot) || newRoot.condition !== 'and') {
    return newRoot;
  } else {
    for (let i = 0; i < newRoot.children.length; i++) {
      if (!newRoot.children[i]) {
        continue;
      }
      //Rewriting to CNF we can get nodes like OR(Person,Person)
      //We can also have tautologies like OR(!A, A) or OR(!A, !B) which are always true
      //within the AND, we can also remove ORs fully covered by other ORs or literals
      //Ex. AND(A, OR(A,B), OR(B,C), OR(B,C,D)) = AND(A,OR(B,C))
      if (isTautology(newRoot.children[i])) {
        newRoot.children[i] = undefined;
        continue;
      }
      //After removing tautologies we can only have 0 or 1 Not-node inside an OR-condition, without any matching not-NOT node with the same label.
      //These can then be simplified to just the not-condition since ex. OR(!A, B, C)=!A (!A covers B and C too)
      const currentNode = newRoot.children[i];
      if (!isLabelLeaf(currentNode) && currentNode.condition === 'or') {
        for (const c of currentNode.children) {
          if (!isLabelLeaf(c) && c.condition === 'not') {
            newRoot.children[i] = c;
          }
        }
      }
      for (let j = i + 1; j < newRoot.children.length; j++) {
        if (!newRoot.children[j]) {
          continue;
        } else if (!newRoot.children[i]) {
          break;
        }

        const stricterCondition = findStricterCondition(
          newRoot.children[i],
          newRoot.children[j],
        );
        if (stricterCondition === newRoot.children[i]) {
          newRoot.children[j] = undefined;
          continue;
        }
        if (stricterCondition === newRoot.children[j]) {
          newRoot.children[i] = undefined;
          break;
        }

        const isDuplicate = checkEquality(
          newRoot.children[i],
          newRoot.children[j],
        );
        if (isDuplicate) {
          newRoot.children[i] = undefined;
        }
      }
    }
    newRoot.children = newRoot.children.filter((x) => x !== undefined);
    return newRoot;
  }
}

/**
 * Takes in two labels/conditions from a CNF-tree and returns the stricter of the two if one covers the other. Otherwise returns undefined to signal that neither rule is redundant
 * @param A
 * @param B
 * @returns A if A is a stricter version of B, in the sense that if A is true, B will always be true as well. Vice versa if B is stricter than A. If neither covers the other, returns undefined
 */
function findStricterCondition(
  A: LabelOrCondition,
  B: LabelOrCondition,
): LabelOrCondition | undefined {
  const aIsLabel = isLabelLeaf(A);
  const bIsLabel = isLabelLeaf(B);
  if (aIsLabel && bIsLabel) {
    return undefined;
  } else if (aIsLabel && !bIsLabel) {
    if (B.children.find((x) => isLabelLeaf(x) && x.value === A.value)) {
      return A;
    } else {
      return undefined;
    }
  } else if (bIsLabel && !aIsLabel) {
    if (A.children.find((x) => isLabelLeaf(x) && x.value === B.value)) {
      return B;
    } else {
      return undefined;
    }
  } else if (!aIsLabel && !bIsLabel) {
    const aIsNotNode = A.condition === 'not';
    const bIsNotNode = B.condition === 'not';
    if (aIsNotNode && bIsNotNode) {
      return undefined;
    } else if (aIsNotNode && !bIsNotNode) {
      if (
        B.children.find(
          (x) =>
            !isLabelLeaf(x) &&
            x.condition === 'not' &&
            isLabelLeaf(x.children[0]) &&
            isLabelLeaf(A.children[0]) &&
            x.children[0].value === A.children[0].value,
        )
      ) {
        return A;
      } else {
        return undefined;
      }
    } else if (bIsNotNode && !aIsNotNode) {
      if (
        A.children.find(
          (x) =>
            !isLabelLeaf(x) &&
            x.condition === 'not' &&
            isLabelLeaf(x.children[0]) &&
            isLabelLeaf(B.children[0]) &&
            x.children[0].value === B.children[0].value,
        )
      ) {
        return B;
      } else {
        return undefined;
      }
    }
  }
  if (aIsLabel || bIsLabel) {
    return undefined;
  }

  if (A.children.length < B.children.length) {
    for (const cA of A.children) {
      if (
        !B.children.find((x) => {
          if (isLabelLeaf(x) && isLabelLeaf(cA)) {
            return x.value === cA.value;
          }
          return false;
        })
      ) {
        return undefined;
      }
    }
    return A;
  } else {
    for (const cB of B.children) {
      if (
        !A.children.find((x) => {
          if (isLabelLeaf(x) && isLabelLeaf(cB)) {
            return x.value === cB.value;
          }
          return false;
        })
      ) {
        return undefined;
      }
    }
    return B;
  }
}

/**
 * Takes a child-node from a CNF-tree (an OR-node, a NOT-node or a literal) and returns whether it is a tautology or not
 * @param node
 * @returns
 */
function isTautology(node: LabelOrCondition): boolean {
  if (!node || isLabelLeaf(node) || node.condition === 'not') {
    return false;
  }
  //getting here node must be an OR-condition
  for (let i = 0; i < node.children.length; i++) {
    for (let j = i + 1; j < node.children.length; j++) {
      const nodeI = node.children[i];
      const nodeJ = node.children[j];
      //If we have OR(A, !A)
      if (
        isLabelLeaf(nodeI) &&
        !isLabelLeaf(nodeJ) &&
        nodeJ.condition === 'not' &&
        isLabelLeaf(nodeJ.children[0]) &&
        nodeJ.children[0].value === nodeI.value
      ) {
        return true;
      } else if (
        isLabelLeaf(nodeJ) &&
        !isLabelLeaf(nodeI) &&
        nodeI.condition === 'not' &&
        isLabelLeaf(nodeI.children[0]) &&
        nodeI.children[0].value === nodeJ.value
      ) {
        return true;
        //If we have OR(!A, !B)
      } else if (
        !isLabelLeaf(nodeJ) &&
        nodeJ.condition === 'not' &&
        isLabelLeaf(nodeJ.children[0]) &&
        !isLabelLeaf(nodeI) &&
        nodeI.condition === 'not' &&
        isLabelLeaf(nodeI.children[0]) &&
        nodeI.children[0].value !== nodeJ.children[0].value
      ) {
        return true;
      }
    }
  }
  return false;
}

export function removeDuplicates(
  labelTree: LabelOrCondition,
): LabelOrCondition {
  const newLabelTree: LabelOrCondition = copyLabelTree(labelTree);
  if (isLabelLeaf(newLabelTree)) {
    return newLabelTree;
  }
  for (let i = 0; i < newLabelTree.children.length; i++) {
    newLabelTree.children[i] = removeDuplicates(newLabelTree.children[i]);
  }
  for (let i = 0; i < newLabelTree.children.length; i++) {
    for (let j = i + 1; j < newLabelTree.children.length; j++) {
      if (
        newLabelTree.children[i] === undefined ||
        newLabelTree.children[j] === undefined
      ) {
        continue;
      }
      const foundDuplicate: boolean = checkEquality(
        newLabelTree.children[i],
        newLabelTree.children[j],
      );
      if (foundDuplicate) {
        newLabelTree.children[i] = undefined;
        break;
      }
    }
  }
  newLabelTree.children = newLabelTree.children.filter((x) => x !== undefined);
  return newLabelTree;
}

//Can speed this check by sorting the children
/**
 * @param labelTree1
 * @param labelTree2
 * @returns true if both trees describe the same labels, ignoring order
 */
function checkEquality(
  labelTree1: LabelOrCondition,
  labelTree2: LabelOrCondition,
): boolean {
  if (
    isLabelLeaf(labelTree1) &&
    isLabelLeaf(labelTree2) &&
    labelTree1.value === labelTree2.value
  ) {
    return true;
  }
  if (
    isLabelLeaf(labelTree1) ||
    isLabelLeaf(labelTree2) ||
    labelTree1.condition !== labelTree2.condition
  ) {
    return false;
  }

  let treesAreEqual = false;
  for (const c1 of labelTree1.children) {
    treesAreEqual = false;
    for (const c2 of labelTree2.children) {
      const equalChildren = checkEquality(c1, c2);
      if (equalChildren) {
        treesAreEqual = true;
        break;
      }
    }
    //If we failed to find a single match
    if (!treesAreEqual) {
      return false;
    }
  }
  return true;
}

/**
 * Converts a label tree with arbitrary NOTs to one without NOTs on AND/OR/NOT conditions
 * This is achieved by removing double negations and "pushing in" NOTs to OR/ANDs using De Morgan's laws see
 * https://en.wikipedia.org/wiki/De_Morgan%27s_laws
 * @param labelTree
 * @returns a transformed copy of the tree with only NOTs above label leaves
 */
export function pushInNots(labelTree: LabelOrCondition): LabelOrCondition {
  let newLabelTree: LabelOrCondition = copyLabelTree(labelTree);
  if (isLabelLeaf(newLabelTree)) {
    return newLabelTree;
  }
  if (
    newLabelTree.condition === 'not' &&
    !isLabelLeaf(newLabelTree.children[0])
  ) {
    const c = newLabelTree.children[0];
    const newCondition =
      c.condition === 'not'
        ? 'doubleNegation'
        : c.condition === 'and'
          ? 'or'
          : 'and';
    if (newCondition === 'doubleNegation') {
      // If double negation, completely remove both negations and restart to check for leaves
      newLabelTree = newLabelTree.children[0].children[0];
      return pushInNots(newLabelTree);
    } else {
      // If single negation, use De Morgan's law to move down NOTs like NOT(AND(A,B,...)) = OR(NOT(A),NOT(B),...)
      const newChildren: LabelOrCondition[] =
        newLabelTree.children[0].children.map((c) => {
          return { condition: 'not', children: [c] };
        });
      newLabelTree = { condition: newCondition, children: newChildren };
    }
  }
  const pushedChildren: LabelOrCondition[] = [];
  newLabelTree.children.forEach((c) => {
    const newChild = pushInNots(c);
    addChild(pushedChildren, newChild, newLabelTree.condition);
  });
  return { ...newLabelTree, children: pushedChildren };
}

export const isAnyNode = (n: LabelOrCondition) =>
  !isLabelLeaf(n) && n.condition === 'any';
export const isNotAnyNode = (n: LabelOrCondition) =>
  !isLabelLeaf(n) && n.condition === 'not' && isAnyNode(n.children[0]);

/**
 * Converts a label tree with ANYs to one without ANYs by simplifying like
 * AND(ANY, ...) = AND(redudant, ...) = AND(...)
 *
 * OR(ANY, ...) = OR(ANY) = ANY
 *
 * AND(NOT(ANY), ...) = NOT(ANY)
 *
 * OR(NOT(ANY), ...) = OR(...)
 * Doing this bottom up we ensure we either get ANY/NOT(ANY) or the existing root without any ANYs inside
 * @param labelTree
 * @returns a transformed copy of the tree such that the new root is either an ANY/NOT(ANY) node itself or has no inner ANYs
 */
export function removeInnerAnys(labelTree: LabelOrCondition): LabelOrCondition {
  const newLabelTree: LabelOrCondition = copyLabelTree(labelTree);
  if (isLabelLeaf(newLabelTree) || newLabelTree.condition === 'any') {
    return newLabelTree;
  }

  newLabelTree.children = newLabelTree.children.map((c) => removeInnerAnys(c));
  if (newLabelTree.condition === 'and') {
    // ANY redundant in AND
    newLabelTree.children = newLabelTree.children.filter((x) => !isAnyNode(x));
    // NOT(ANY) dominates AND
    if (newLabelTree.children.some((c) => isNotAnyNode(c))) {
      return {
        condition: 'not',
        children: [{ condition: 'any', children: [] }],
      };
      // if we only had ANY-children, this AND-node really was only an ANY-node
    } else if (newLabelTree.children.length === 0) {
      return { condition: 'any', children: [] };
    } else {
      return newLabelTree;
    }
  } else if (newLabelTree.condition === 'or') {
    // NOT(ANY) reundant in OR
    newLabelTree.children = newLabelTree.children.filter(
      (c) => !isNotAnyNode(c),
    );
    // ANY dominates OR
    if (newLabelTree.children.some((c) => isAnyNode(c))) {
      return { condition: 'any', children: [] };
      // if we only had NOT(ANY)-children, this OR-node really was only a NOT(ANY)-node
    } else if (newLabelTree.children.length === 0) {
      return {
        condition: 'not',
        children: [{ condition: 'any', children: [] }],
      };
    } else {
      return newLabelTree;
    }
  }
  return newLabelTree;
}
