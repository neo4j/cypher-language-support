export function cleanType(type: string): string {
  let resultType = type;

  if (resultType.startsWith('LIST? OF ')) {
    resultType = resultType.replace('LIST? OF ', 'LIST<');
    resultType += '>';
  }
  return resultType.replace(/\?/g, '');
}

export function cleanTypeDescription<T extends { type: string }>(arg: T) {
  return { ...arg, type: cleanType(arg.type) };
}
