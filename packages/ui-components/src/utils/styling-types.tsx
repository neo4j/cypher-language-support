export type CaptionOption =
  | {
      type: 'id';
      captionSize?: number;
    }
  | {
      type: 'type';
      captionSize?: number;
    }
  | {
      type: 'property';
      captionKey: string;
      captionSize?: number;
    };

export type NodeStyling = {
  color: string;
  size: number;
  captions: CaptionOption[];
  priority: number;
};

export type RelationStyling = {
  color: string;
  captions: CaptionOption[];
  width: number;
};

export type GraphStyling = {
  node: Record<string, Partial<NodeStyling>>;
  relationship: Record<string, Partial<RelationStyling>>;
  stylingPrecedence: string[];
};
