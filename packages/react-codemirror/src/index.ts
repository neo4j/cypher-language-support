import * as LanguageSupport from '@neo4j-cypher/language-support';
import {
  darkThemeConstants as internalDarkThemeConstants,
  lightThemeConstants as internalLightThemeConstants,
} from './themes';
import type { ThemeOptions } from './lang-cypher/createCypherTheme';

export const darkTheme: ThemeOptions = internalDarkThemeConstants;
export const lightThemeConstants: ThemeOptions = internalLightThemeConstants;

export { LanguageSupport };
export {
  CypherEditor,
  CypherEditorProps,
  CypherEditorState,
  CodemirrorSymbolFetcher,
  DomEventHandlers,
} from './CypherEditor';
export type { InlinePanelProps } from './CypherEditor';
export type { InlinePanelCallbacks } from './inlinePanel.js';
export type { DiffProps } from './diffView';
export { cypher, CypherConfig } from './lang-cypher/langCypher';
export type {
  ThemeOptions,
  DiffColors,
} from './lang-cypher/createCypherTheme.js';
export type { HostPortalCallbacks } from './hostCallbacks.js';
export type { HighlightedCypherTokenTypes } from './lang-cypher/constants.js';
