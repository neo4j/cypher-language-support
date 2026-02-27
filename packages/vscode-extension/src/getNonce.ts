/**
 * Non crypto secure random alphanumeric generator
 * @param length Optional length of the nonce to generate. Default is 32.
 * @returns A random alphanumeric string.
 */
export function getNonce(length: number = 32): string {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
