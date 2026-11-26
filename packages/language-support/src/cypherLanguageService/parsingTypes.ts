import type { ExpressionContext } from '../generated-parser/CypherCmdParser.js';

type HasPosition = {
  line: number;
  column: number;
  offsets: {
    start: number;
    end: number;
  };
};

export enum LabelType {
  nodeLabelType = 'Label',
  relLabelType = 'Relationship type',
  unknown = 'Label or relationship type',
}

export type LabelOrRelType = HasPosition & {
  labelType: LabelType;
  labelText: string;
};

export type PropertyType = HasPosition & {
  propertyName: string;
  variable?: {
    name: string;
    start: number;
  };
  type: 'read' | 'write';
  /** The expression assigned to the property in the query.
   * This is only available in properties for the LHS of an assigment expression */
  assignedExpression?: ExpressionContext;
};

export type ParsedParameter = HasPosition & {
  name: string;
  rawText: string;
};

export type ParsedFunction = HasPosition & {
  name: string;
  rawText: string;
};

export type ParsedProcedure = ParsedFunction;
