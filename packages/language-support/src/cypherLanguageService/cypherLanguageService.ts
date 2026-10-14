import { _internalFeatureFlags } from '../featureFlags.js';
import { lintCypherQueryWithParsingResult } from '../syntaxValidation/syntaxValidation.js';
import type { SymbolsInfo, SymbolTable } from '../types.js';
import type { DbSchema } from '../dbSchema.js';
import { getSignatureInfoWithParsingResult } from '../signatureHelp.js';
import { highlightSyntaxWithParsingResult } from '../syntaxHighlighting/syntaxHighlighting.js';
import { autocompleteWithParsingResult } from '../autocompletion/autocompletion.js';
import type { HoverInfo } from '../hoverInformation/hover.js';
import { getHoverInfo } from '../hoverInformation/hover.js';
import type { ParsingResult } from './parser/parser.js';
import { createParsingResult } from './parser/parser.js';

export class CypherLanguageService {
  private parsingResult?: ParsingResult;
  private symbolsInfo?: SymbolsInfo;
  private consoleCommandsEnabled: boolean;

  constructor({
    consoleCommandsEnabled = true,
  }: { consoleCommandsEnabled?: boolean } = {}) {
    this.consoleCommandsEnabled = consoleCommandsEnabled;
  }

  private parse(query: string): ParsingResult {
    if (
      this.parsingResult !== undefined &&
      this.parsingResult.query === query
    ) {
      return this.parsingResult;
    } else {
      const parsingResult = createParsingResult(query, {
        consoleCommandsEnabled: this.consoleCommandsEnabled,
      });
      // this.parsingResult=parsingResult
      return parsingResult;
    }
  }

  clearCache() {
    this.parsingResult = undefined;
    this.symbolsInfo = undefined;
  }

  setSymbolsInfo(
    symbolsInfo: SymbolsInfo,
    sendMessage?: (symbolTables: SymbolTable[]) => Promise<void>,
  ) {
    if (_internalFeatureFlags.debugSymbolTable && sendMessage)
      void sendMessage(symbolsInfo.symbolTables);
    this.symbolsInfo = symbolsInfo;
  }

  lint(query: string, dbSchema: DbSchema) {
    const parsingResult = this.parse(query);
    return lintCypherQueryWithParsingResult(query, dbSchema, { parsingResult });
  }

  highlightSyntax(query: string) {
    const parsingResult = this.parse(query);
    return highlightSyntaxWithParsingResult(query, { parsingResult });
  }

  hoverInfo(
    query: string,
    { caretPosition, dbSchema }: { caretPosition: number; dbSchema: DbSchema },
  ): HoverInfo | undefined {
    const parsingResult = this.parse(query);
    return getHoverInfo({
      caretPosition,
      dbSchema,
      parsingResult,
      symbolsInfo: this.symbolsInfo,
    });
  }

  getSignatureHelp(
    query: string,
    dbSchema: DbSchema,
    { caretPosition = query.length }: { caretPosition?: number } = {},
  ) {
    const parsingResult = this.parse(query);
    return getSignatureInfoWithParsingResult(query, dbSchema, {
      caretPosition,
      parsingResult,
    });
  }

  autocomplete(
    query: string,
    dbSchema: DbSchema,
    {
      caretPosition = query.length,
      manual = false,
    }: { caretPosition?: number; manual?: boolean } = {},
  ) {
    // TODO This is a temporary hack because completions are not working well
    query = query.slice(0, caretPosition);
    const parsingResult = this.parse(query);
    return autocompleteWithParsingResult(query, dbSchema, {
      consoleCommandsEnabled: this.consoleCommandsEnabled,
      caretPosition,
      manual,
      symbolsInfo: this.symbolsInfo,
      parsingResult,
    });
  }
}
