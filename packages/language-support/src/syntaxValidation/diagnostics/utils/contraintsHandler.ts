import type { LabelOrCondition } from '../../../types.js';
import {
  isLabelLeaf,
  type Constraint,
  type SymbolTable,
} from '../../../types.js';
import type { PropertyType } from '../../../cypherLanguageService/parsingTypes.js';
import { convertToCNF } from '../../../labelTreeRewriting.js';

/** Non-exaustive list of constraints types */
enum CONSTRAINT_TYPE {
  NODE_PROPERTY_UNIQUENESS = 'NODE_PROPERTY_UNIQUENESS',
  RELATIONSHIP_PROPERTY_UNIQUENESS = 'RELATIONSHIP_PROPERTY_UNIQUENESS',
  NODE_PROPERTY_EXISTENCE = 'NODE_PROPERTY_EXISTENCE',
  RELATIONSHIP_PROPERTY_EXISTENCE = 'RELATIONSHIP_PROPERTY_EXISTENCE',
  NODE_PROPERTY_TYPE = 'NODE_PROPERTY_TYPE',
  RELATIONSHIP_PROPERTY_TYPE = 'RELATIONSHIP_PROPERTY_TYPE',
  NODE_LABEL_EXISTENCE = 'NODE_LABEL_EXISTENCE',
  RELATIONSHIP_SOURCE_LABEL = 'RELATIONSHIP_SOURCE_LABEL',
  RELATIONSHIP_TARGET_LABEL = 'RELATIONSHIP_TARGET_LABEL',
  NODE_KEY = 'NODE_KEY',
  RELATIONSHIP_KEY = 'RELATIONSHIP_KEY',
}

/** Helper utility to handle constraints */
export class ConstraintsHandler {
  private constraints: Constraint[];
  private symbolTable: SymbolTable;

  constructor(constraints: Constraint[], symbolTable: SymbolTable) {
    this.constraints = constraints;
    this.symbolTable = symbolTable;
  }

  /** Returns the property type, according to existing constraints  */
  public getPropertyType(property: PropertyType): string | undefined {
    const variable = property.variable;
    if (!variable) {
      return undefined;
    }

    const symbol = this.symbolTable.find((symbol) => {
      return symbol.variable === variable.name;
    });
    if (!symbol) {
      return undefined;
    }

    const nodeLabels = this.getLabels(symbol.labels);

    for (const label of nodeLabels) {
      const constraints = this.getConstraintForLabel(
        label,
        CONSTRAINT_TYPE.NODE_PROPERTY_TYPE,
      );

      for (const c of constraints) {
        if (c.properties.includes(property.propertyName)) {
          return c.propertyType;
        }
      }
    }

    return undefined;
  }

  /** Return a list of and'd labels from a condition */
  private getLabels(labelTree: LabelOrCondition): string[] {
    const cnfTree = isLabelLeaf(labelTree)
      ? labelTree
      : convertToCNF(labelTree);

    if (isLabelLeaf(cnfTree)) {
      return [cnfTree.value];
    }

    if (cnfTree.condition === 'and') {
      return cnfTree.children.flatMap((l) => this.getLabels(l));
    }
    // Ignore ors, nots and anys
    return [];
  }

  private getConstraintForLabel(
    label: string,
    constraintType: CONSTRAINT_TYPE,
  ): Constraint[] {
    return this.constraints.filter((c) => {
      if (constraintType && c.type !== constraintType) {
        return false;
      }

      return c.labelsOrTypes.includes(label);
    });
  }
}
