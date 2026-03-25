interface FeatureFlags {
  consoleCommands: boolean;
  debugSymbolTable: boolean;
}

export const _internalFeatureFlags: FeatureFlags = {
  // Used by tests to toggle console command parsing
  consoleCommands: false,
  debugSymbolTable:
    typeof process === 'undefined'
      ? false
      : process.env.debugSymbolTable == 'true',
};
