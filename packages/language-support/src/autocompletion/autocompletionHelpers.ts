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
