interface FeatureFlags {
  consoleCommands: boolean;
  cypher25: boolean;
}

export const _internalFeatureFlags: FeatureFlags = {
  /* 
  Because the parserWrapper is done as a single-ton global variable, the setting for 
  console commands was also easiest to do as a global variable as it avoid messing with the cache

  It would make sense for the client to initialize and own the ParserWrapper, then each editor can have
  it's own cache and preference on if console commands are enabled or not.
  */
  consoleCommands: false,
  cypher25: false,
};
