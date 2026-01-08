export type StyledCaption = {
  /**
   * The font styles as an array of style keywords.
   * @example `['bold', 'italic']`
   */
  styles?: string[];
  /** The text value for the caption. */
  value?: string;
  /** The identifier key for the caption. */
  key?: string;
};

export interface GraphElement {
  /**
   * The id of the current node or relationship.
   * Ids need to be unique across all nodes and relationships.
   * Ids need to be strings and cannot be empty.
   */
  readonly id: string;
  /** The color of the graph element.*/
  color?: string;
  /**
   * The text to display inside on node or relationship.
   * @note: If both caption and captions are provided, captions takes precedence.
   * @note: To provide multiple captions with custom styles, use the {@link captions} property.
   * @note: Captions are only visible when using the 'canvas' renderer.
   */
  caption?: string;
  /** The caption text size.*/
  captionSize?: number;
  /**
   * The caption align.
   * Has no affect on self-referring relationships.
   */
  captionAlign?: 'top' | 'bottom' | 'center';
  /**
   * The caption text and font styles.
   * @note: To provide a single caption without custom styles, you can also use the {@link caption} property.
   * @note: Captions are only visible when using the 'canvas' renderer.
   */
  captions?: StyledCaption[];
  /**
   * An icon to be displayed anywhere on top of the graph element.
   * Icons are expected to be square.
   */
  overlayIcon?: {
    /** The url to the icon.*/
    url: string;
    /**
     * The position of the icon relative to the node or relationship.
     * The position is a percentage of the node or relationship size.
     * `[1, 1]` is the bottom right corner of the node or relationship.
     * `[-1, -1]` is the top left corner of the node or relationship.
     * @defaultValue `[0, 0]`, the center of the node or relationship.
     */
    position?: number[];
    /**
     * The size of the icon relative to the node size or relationship caption size.
     * The size is a percentage of the node size or relationship caption size.
     * @defaultValue `1`, the same size as the node size or relationship caption size.
     */
    size?: number;
  };
}
/**
 * A node inside the graph visualization.
 */
export interface NvlNodeStyle extends GraphElement {
  /** The size of the node.*/
  size?: number;
  /**
   * The url to an icon to display inside the node.
   * Icons are expected to be black. If the node's background color is dark,
   * the icon will be inverted to white.
   * Icons are expected to be square.
   */
  icon?: string;
}

/**
 * A relationship inside the graph visualization.
 */
export interface NVLRelationshipStyle extends GraphElement {
  /** The width of the relationship.*/
  width?: number;
}

export type StyleRule = {
  match: Match;
  where?: Where;
  apply: Style;

  disabled?: boolean;

  /**
   * Optional priority for rule ordering.
   *
   * When unset or tied, the last rule in array order wins.
   *
   * Negative values are reserved for internal use.
   */
  priority?: number;
};

type Match = { label: string | null } | { reltype: string | null };

export type CypherValue = string | number | boolean | null;

export type Value = { property: string } | CypherValue;

export type Where =
  | { equal: [Value, Value] }
  | { not: Where }
  | { lessThan: [Value, Value] }
  | { lessThanOrEqual: [Value, Value] }
  | { greaterThan: [Value, Value] }
  | { greaterThanOrEqual: [Value, Value] }
  | { contains: [Value, Value] }
  | { startsWith: [Value, Value] }
  | { endsWith: [Value, Value] }
  | { isNull: Value }
  | { property: string }
  | { and: Where[] }
  | { or: Where[] }
  | Match;

/**
 * Supported caption style keywords.
 */
export type CaptionVariation = 'bold' | 'italic' | 'underline';

export type Caption = {
  /** Plain string, property access or type */
  value: string | { property: string } | { useType: true };
  /** @see CaptionVariation */
  styles?: CaptionVariation[];
};

export type Style = {
  color?: string;
  size?: number;
  width?: number;

  /** Array of styled captions with custom formatting. */
  captions?: Caption[];
  captionSize?: number;
  captionAlign?: 'top' | 'bottom' | 'center';
};
