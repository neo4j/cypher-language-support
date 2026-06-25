import {
  Condition,
  ConditionNode,
  isLabelLeaf,
  LabelOrCondition,
} from './types.js';

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
 * Takes a label tree with an AND-root and converts it to Distjunctive Normal Form
 * also simplifies away redundant conditions
 * @param root - the original label tree
 * @returns a an equivalent DNF tree
 */
export function convertToSimplifiedDNF(
  root: LabelOrCondition,
): LabelOrCondition {
  const dnfRoot: LabelOrCondition = convertToDNF(root);
  return simplifyAndRemoveDNFContradictions(dnfRoot);
}

/**
 * Takes a label tree with an AND-root and converts it to Distjunctive Normal Form
 * Uses a trick with De Morgan's law (ex. !AND(X,Y) = OR(!X, !Y)) to turn CNF to DNF
 * Like this: !CNF(!Φ) = DNF(Φ). CNF(!Φ) is equiv to !Φ and !CNF(!Φ) is thus equiv to !!Φ = Φ
 * @param root - the original label tree
 * @returns a an equivalent DNF tree
 */
export function convertToDNF(root: LabelOrCondition): LabelOrCondition {
  //Because we need an AND-root in my CNF functions, I add AND(NOT(Φ)) - AND with a single child can be simplified away
  const negatedRoot: ConditionNode = {
    condition: 'and',
    children: [{ condition: 'not', children: [root] }],
  };
  const negatedRootCNF = convertToCNF(negatedRoot);
  //Negated CNF -> DNF via De Morgan's law. Double negation (initial + this) -> equivalent to original tree
  return pushInNots({ condition: 'not', children: [negatedRootCNF] });
}

/**
 * Takes a label tree with an AND-root and converts it to Conjunctive Normal Form
 * also simplifies away redundant conditions
 * @param root - the original label tree
 * @returns an equivalent CNF tree, simplified to remove duplication and tautologies
 */
export function convertToSimplifiedCNF(
  root: LabelOrCondition,
): LabelOrCondition {
  const cnfRoot: LabelOrCondition = convertToCNF(root);
  const cleanedCnfTree: LabelOrCondition =
    simplifyAndRemoveTautologies(cnfRoot);
  return cleanedCnfTree;
}

/**
 * Takes a label tree with an AND-root and converts it to Conjunctive Normal Form, without simplification
 * @param root - the original label tree
 * @returns an equivalent CNF tree
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
    return cnfRoot;
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

function equalConditions(c1: LabelOrCondition, c2: LabelOrCondition): boolean {
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
 * Takes a CNF tree and simplifies away redudant conditions and tautologies
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
  if (isLabelLeaf(root) || !(root.condition === 'and')) {
    throw new Error('Misshapen label tree: Root is not an AND-node');
  }
  const newRoot: LabelOrCondition = copyLabelTree(root);
  if (isLabelLeaf(newRoot)) {
    return newRoot;
  } else {
    const simplifiedChildren: (LabelOrCondition | undefined)[] = [
      ...newRoot.children,
    ];
    for (let i = 0; i < simplifiedChildren.length; i++) {
      const currentNode = simplifiedChildren[i];
      if (!currentNode) {
        continue;
      }
      //Rewriting to CNF we can get nodes like OR(Person,Person)
      //We can also have tautologies like OR(!A, A) or OR(!A, !B) which are always true
      //within the AND, we can also remove ORs fully covered by other ORs or literals
      //Ex. AND(A, OR(A,B), OR(B,C), OR(B,C,D)) = AND(A,OR(B,C))
      if (isTautology(currentNode)) {
        simplifiedChildren[i] = undefined;
        continue;
      }
      //After removing tautologies we can only have 0 or 1 Not-node inside an OR-condition, without any matching not-NOT node with the same label.
      //These can then be simplified to just the not-condition since ex. OR(!A, B, C)=!A (!A covers B and C too)
      if (!isLabelLeaf(currentNode) && currentNode.condition === 'or') {
        for (const c of currentNode.children) {
          if (!isLabelLeaf(c) && c.condition === 'not') {
            simplifiedChildren[i] = c;
          }
        }
      }

      //We can also remove conditions where one covers the other
      //Ex. AND(OR(A,B), OR(A,B,C)) -> if OR(A,B) is true, OR(A,B,C) will always be true too, so since we need both (ANDed) we can check just for OR(A,B)
      for (let j = i + 1; j < simplifiedChildren.length; j++) {
        const comparedNode = simplifiedChildren[j];
        if (!comparedNode) {
          continue;
        }

        const stricterCondition = findStricterCondition(
          currentNode,
          comparedNode,
        );
        if (stricterCondition === simplifiedChildren[i]) {
          simplifiedChildren[j] = undefined;
          continue;
        }
        if (stricterCondition === simplifiedChildren[j]) {
          simplifiedChildren[i] = undefined;
          break;
        }

        if (
          simplifiedChildren[i] !== undefined &&
          simplifiedChildren[j] !== undefined
        ) {
          const isDuplicate = checkEquality(currentNode, comparedNode);
          if (isDuplicate) {
            simplifiedChildren[i] = undefined;
            break;
          }
        }
      }
    }

    //At this stage we have simplified to 3 types of children - A: free label, B: free NOT label, C: OR of labels (not NOTed)
    //Finally we can also remove NOTs covered by the other conditions
    //Since we would have removed other conditions covered by NOTs previously, we can remove all free NOTs if we have some non-not child
    // Ex. AND(A, OR(B,C), !D, !E) = AND(A, OR(B,C))
    //AND(!A, !B) = AND(!A, !B)
    const hasNonNegatedLabel = simplifiedChildren.some(
      (c) => c && (isLabelLeaf(c) || c.condition !== 'not'),
    );
    if (hasNonNegatedLabel) {
      for (let i = 0; i < simplifiedChildren.length; i++) {
        const c = simplifiedChildren[i];
        if (c && !isLabelLeaf(c) && c.condition === 'not') {
          simplifiedChildren[i] = undefined;
        }
      }
    }
    newRoot.children = simplifiedChildren.filter((x) => x !== undefined);

    return newRoot;
  }
}
//DNF is OR(AND(x,!y), AND(!z,!w), AND(v, u), s, r, !t)
//if we have OR(AND(x,...), x, ...) we can remove the AND. For the outer OR, we can remove any inner ANDs that are more strict than

//OR -> true IF ANY CONDITION is true -> can simplify away more strict conditions that are true if any of the less strict are true
//We can obviously also remove duplicate identical conditions
//Simplifying away NOT conditions:
// OR(AND(!A, A), ...) <- OR(never, ...) => OR(...)
// OR(!A, A) <- ANY => ANY
/**
 * Takes a DNF tree and simplifies away redudant conditions and tautologies
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
export function simplifyAndRemoveDNFContradictions(
  root: LabelOrCondition,
): LabelOrCondition {
  const newRoot: LabelOrCondition = copyLabelTree(root);
  if (
    isLabelLeaf(newRoot) ||
    newRoot.condition === 'any' ||
    newRoot.condition === 'not'
  ) {
    return newRoot;
  } else {
    const simplifiedChildren: (LabelOrCondition | undefined)[] = [
      ...newRoot.children,
    ];
    for (let i = 0; i < simplifiedChildren.length; i++) {
      let currentNode = simplifiedChildren[i];
      if (!currentNode) {
        continue;
      }
      //The child-conditions of the DNF tree can be contradictions like AND(!A, A) which is never true
      //Since it's within an OR we can simplify by removing this condition, we can also remove ANDs that are a subcondition of an existing condition in the OR
      //Ex. OR(A, AND(A,B), AND(B,C), AND(B,C,D)) = OR(A, AND(B,C))
      if (isContradiction(currentNode)) {
        simplifiedChildren[i] = undefined;
        continue;
      } else if (!isLabelLeaf(currentNode) && currentNode.condition === 'and') {
        //for ANDs like AND(A, !B) where we dont have a contradiction, we can remove the !B which becomes true automatically if we must have other labels than B, keeping only non-negated labels
        //Could not remove it if we have both !B and B, but this would be caught above
        //Can also not remove them if we dont have non-NOTed labels
        const newChildren = currentNode.children.filter((c) => isLabelLeaf(c));
        if (newChildren.length !== 0) {
          currentNode =
            newChildren.length === 1
              ? newChildren[0]
              : {
                  condition: 'and',
                  children: currentNode.children.filter((c) => isLabelLeaf(c)),
                };
          simplifiedChildren[i] = currentNode;
        }
      }
      //After removing contradictions we can only have !A or A, not both for any label A inside an AND-condition.
      for (let j = i + 1; j < simplifiedChildren.length; j++) {
        const comparedNode = simplifiedChildren[j];
        if (!comparedNode) {
          continue;
        }

        const stricterCondition = findStricterCondition(
          currentNode,
          comparedNode,
        );
        //Remove the stricter condition here, since we are inside an OR
        if (stricterCondition === simplifiedChildren[i]) {
          simplifiedChildren[i] = undefined;
          break;
        }
        if (stricterCondition === simplifiedChildren[j]) {
          simplifiedChildren[j] = undefined;
          continue;
        }

        const isDuplicate = checkEquality(currentNode, comparedNode);
        if (isDuplicate) {
          simplifiedChildren[i] = undefined;
          break;
        }
      }
    }

    //At this stage we must have no negations inside ANDs, for example
    //OR(A, !B, AND(C,B))
    //But if we have an outer !B, this would also pass for all cases that A and AND(C,B) cover, so we can remove those
    //OR(A, !B, AND(C,B)) = OR(!B)

    //TODO add this simplification too

    // const freeNots = simplifiedChildren.filter(c => c && !isLabelLeaf(c) && c.condition === "not");
    // //If we have OR(!A, A, ...) - simplify to OR(ANY)
    // if (freeNots.some(c => {
    //   if (c && !isLabelLeaf(c) && c.condition === "not") {
    //     const innerLabel = c.children[0];
    //     if (isLabelLeaf(innerLabel)) {
    //       return simplifiedChildren.some(c2 => c2 && isLabelLeaf(c2) && c2.value === innerLabel.value)
    //     }
    //   }
    // }))

    // if (freeNots) {
    //   simplifiedChildren.map(c => {
    //     if (c && !isLabelLeaf(c) && c.condition === "and") {
    //       return undefined;
    //     } else if (c && isLabelLeaf(c)) {
    //       return undefined;
    //     } else {
    //       return c;
    //     }
    //   });
    // }

    newRoot.children = simplifiedChildren.filter((x) => x !== undefined);
    return newRoot;
  }
}

/**
 * Takes in two labels/conditions and returns the stricter of the two if one covers the other. Otherwise returns undefined to signal that neither rule is redundant
 * For OR-conditions a smaller condition is stricter (Ex. OR(A,B) over OR(A,B,C)) and the opposite is true for ANDs, (ex. AND(A,B,C) over AND(A,B))
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
  } else if (aIsLabel && !bIsLabel && !(B.condition === 'not')) {
    if (B.children.find((x) => isLabelLeaf(x) && x.value === A.value)) {
      return B.condition === 'or' ? A : B;
    } else {
      return undefined;
    }
  } else if (bIsLabel && !aIsLabel && !(A.condition === 'not')) {
    if (A.children.find((x) => isLabelLeaf(x) && x.value === B.value)) {
      return A.condition === 'or' ? B : A;
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
        return B.condition === 'or' ? A : B;
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
        return A.condition === 'or' ? B : A;
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
    return B.condition === 'or' ? A : B;
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
    return A.condition === 'or' ? B : A;
  }
}

//Contradictions we could have...
//AND(A,B)... no
//AND(!A,A).. yes
//AND(!A,B)...no
//AND(!A,!B)...no

/**
 * Takes a child-node from a DNF-tree (an AND-node, a NOT-node or a literal) and returns whether it is a contradiction or not
 * @param node
 * @returns
 */
function isContradiction(node: LabelOrCondition) {
  if (!node || isLabelLeaf(node) || node.condition === 'not') {
    return false;
  }
  //getting here node must be an AND-condition
  for (let i = 0; i < node.children.length; i++) {
    for (let j = i + 1; j < node.children.length; j++) {
      const nodeI = node.children[i];
      const nodeJ = node.children[j];
      //If we have AND(A, !A)
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
      }
    }
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
  const deduplicatedChildren = [];
  for (let i = 0; i < newLabelTree.children.length; i++) {
    let foundDuplicate = false;
    for (let j = i + 1; j < newLabelTree.children.length; j++) {
      foundDuplicate = checkEquality(
        newLabelTree.children[i],
        newLabelTree.children[j],
      );
      if (foundDuplicate) {
        break;
      }
    }
    if (!foundDuplicate) {
      deduplicatedChildren.push(newLabelTree.children[i]);
    }
  }
  newLabelTree.children = deduplicatedChildren;
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

  if (labelTree1.children.length !== labelTree2.children.length) {
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
