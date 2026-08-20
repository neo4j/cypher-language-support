interface FeatureFlags {
  debugSymbolTable: boolean;
}

export const _internalFeatureFlags: FeatureFlags = {
  debugSymbolTable:
    typeof process === 'undefined'
      ? false
      : process.env.debugSymbolTable == 'true',
};
