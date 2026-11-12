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
  /** The inferred type of the right hand side of an expression with the property.
   * @example WHERE m.title = "The Matrix" // STRING
   */
  rightHandType?: string;
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
