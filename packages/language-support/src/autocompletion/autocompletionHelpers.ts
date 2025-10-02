export function shouldAutoCompleteYield(query: string, offset: number) {
  const yieldTriggerPhrase = 'yield ';
  const text = query.slice(0, offset);
  const yieldStart = offset - yieldTriggerPhrase.length;
  if (yieldStart >= 0) {
    const precedingText = text.slice(yieldStart, offset);
    return precedingText.toLowerCase() === yieldTriggerPhrase;
  }
  return false;
}

export const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

type BacktickVariant = 'label' | 'propertyKey' | 'relType' | 'dbName' | 'param';

export function backtickIfNeeded(
  e: string,
  variant: BacktickVariant,
): string | undefined {
  if (e == null || e == '') {
    return undefined;
  } else if (
    (variant === 'label' ||
      variant === 'propertyKey' ||
      variant === 'relType') &&
    (/[^\p{L}\p{N}_]/u.test(e) || /[^\p{L}_]/u.test(e[0]))
  ) {
    return `\`${e}\``;
  } else if (
    variant === 'dbName' &&
    (/[^\p{L}\p{N}_.]/u.test(e) ||
      /[^\p{L}_]/u.test(e[0]) ||
      /[^\p{L}\p{N}_]/u.test(e.at(-1)))
  ) {
    return `\`${e}\``;
  } else if (variant === 'param' && /[^\p{L}\p{N}_]/u.test(e)) {
    return `\`${e}\``;
  } else {
    return undefined;
  }
}
