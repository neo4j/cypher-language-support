export function copyToClipboard(text: string): Promise<void> {
  // navigator clipboard requires https
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback deprecated method, which requires a textarea
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  return new Promise<void>((resolve, reject) => {
    // eslint-disable-next-line no-unused-expressions, prefer-promise-reject-errors
    document.execCommand('copy') ? resolve() : reject();
    textArea.remove();
  });
}
