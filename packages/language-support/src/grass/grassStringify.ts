import type { StyleRule, Where, Value, Caption, Style } from './grassTypes';

/**
 * Convert StyleRule objects back to grass DSL string.
 */
export function stringifyGrass(rules: StyleRule[]): string {
  return rules.map(stringifyRule).join(';\n\n');
}

function stringifyRule(rule: StyleRule): string {
  const parts: string[] = [];

  // MATCH clause
  parts.push(stringifyMatch(rule.match));

  // WHERE clause (optional)
  if (rule.where) {
    parts.push(`WHERE ${stringifyWhere(rule.where)}`);
  }

  // APPLY clause
  parts.push(`APPLY ${stringifyStyle(rule.apply)}`);

  return parts.join(' ');
}

function stringifyMatch(match: StyleRule['match']): string {
  if ('label' in match) {
    const label = match.label ? `:${match.label}` : '';
    return `MATCH (n${label})`;
  } else if ('reltype' in match) {
    const reltype = match.reltype ? `:${match.reltype}` : '';
    return `MATCH [r${reltype}]`;
  } else {
    // property selector - shouldn't happen in match context, but handle gracefully
    return `MATCH (n)`;
  }
}

function stringifyWhere(where: Where): string {
  if ('and' in where) {
    return where.and.map((w) => `(${stringifyWhere(w)})`).join(' AND ');
  }
  if ('or' in where) {
    return where.or.map((w) => `(${stringifyWhere(w)})`).join(' OR ');
  }
  if ('not' in where) {
    return `NOT (${stringifyWhere(where.not)})`;
  }
  if ('equal' in where) {
    return `${stringifyValue(where.equal[0])} = ${stringifyValue(
      where.equal[1],
    )}`;
  }
  if ('lessThan' in where) {
    return `${stringifyValue(where.lessThan[0])} < ${stringifyValue(
      where.lessThan[1],
    )}`;
  }
  if ('greaterThan' in where) {
    return `${stringifyValue(where.greaterThan[0])} > ${stringifyValue(
      where.greaterThan[1],
    )}`;
  }
  if ('lessThanOrEqual' in where) {
    return `${stringifyValue(where.lessThanOrEqual[0])} <= ${stringifyValue(
      where.lessThanOrEqual[1],
    )}`;
  }
  if ('greaterThanOrEqual' in where) {
    return `${stringifyValue(where.greaterThanOrEqual[0])} >= ${stringifyValue(
      where.greaterThanOrEqual[1],
    )}`;
  }
  if ('contains' in where) {
    return `${stringifyValue(where.contains[0])} CONTAINS ${stringifyValue(
      where.contains[1],
    )}`;
  }
  if ('startsWith' in where) {
    return `${stringifyValue(where.startsWith[0])} STARTS WITH ${stringifyValue(
      where.startsWith[1],
    )}`;
  }
  if ('endsWith' in where) {
    return `${stringifyValue(where.endsWith[0])} ENDS WITH ${stringifyValue(
      where.endsWith[1],
    )}`;
  }
  if ('isNull' in where) {
    return `${stringifyValue(where.isNull)} IS NULL`;
  }
  // Selector-based where (label/reltype/property check)
  if ('label' in where) {
    return where.label ? `n:${where.label}` : 'n';
  }
  if ('reltype' in where) {
    return where.reltype ? `r:${where.reltype}` : 'r';
  }
  if ('property' in where) {
    return `n.${where.property}`;
  }
  return '';
}

function stringifyValue(value: Value): string {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "\\'")}'`;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  // Property access: { property: string }
  return `n.${value.property}`;
}

function stringifyStyle(style: Style): string {
  const props: string[] = [];

  if (style.color !== undefined) {
    props.push(`color: '${style.color}'`);
  }
  if (style.size !== undefined) {
    props.push(`size: ${style.size}`);
  }
  if (style.width !== undefined) {
    props.push(`width: ${style.width}`);
  }
  if (style.captionSize !== undefined) {
    props.push(`captionSize: ${style.captionSize}`);
  }
  if (style.captionAlign !== undefined) {
    props.push(`captionAlign: '${style.captionAlign}'`);
  }
  if (style.captions !== undefined) {
    props.push(`captions: ${stringifyCaptions(style.captions)}`);
  }

  return `{${props.join(', ')}}`;
}

function stringifyCaptions(captions: Caption[]): string {
  return captions.map(stringifyCaption).join(' + ');
}

function stringifyCaption(caption: Caption): string {
  let value: string;

  if (typeof caption.value === 'string') {
    value = `'${caption.value.replace(/'/g, "\\'")}'`;
  } else if ('property' in caption.value) {
    value = `n.${caption.value.property}`;
  } else {
    // useType
    value = 'type(r)';
  }

  const styles = caption.styles ?? [];
  let result = value;

  // Apply styles from innermost to outermost
  for (const style of styles.slice().reverse()) {
    result = `${style}(${result})`;
  }

  return result;
}
