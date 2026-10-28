import type { ParseTreeListener } from 'antlr4ng';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import { CypherVersionContext } from '../../generated-parser/CypherCmdParser.js';
import type { SyntaxDiagnostic } from '../../syntaxValidation/syntaxValidation.js';
import type { CypherVersion } from '../../types.js';
import { allCypherVersions, cypherVersionNumbers } from '../../types.js';
import { translateTokensToRange } from '../utils/translateTokenToRange.js';
import {
  getContextStartToken,
  getContextStopToken,
} from '../../helpers/getContextToken.js';

export class CypherVersionCollector implements ParseTreeListener {
  public cypherVersion: CypherVersion | undefined;
  public invalidVersionError: SyntaxDiagnostic | undefined;

  enterEveryRule() {
    /* no-op */
  }
  visitTerminal() {
    /* no-op */
  }
  visitErrorNode() {
    /* no-op */
  }

  exitEveryRule(ctx: unknown) {
    if (ctx instanceof CypherVersionContext) {
      const parsedVersion = 'CYPHER ' + ctx.getText();
      allCypherVersions.forEach((validVersion) => {
        if (parsedVersion === validVersion) {
          this.cypherVersion = parsedVersion;
        }
      });
      if (!this.cypherVersion) {
        this.invalidVersionError = {
          message:
            ctx.getText() +
            ' is not a valid option for cypher version. Valid options are: ' +
            cypherVersionNumbers.join(', '),
          severity: DiagnosticSeverity.Error,
          ...translateTokensToRange(
            getContextStartToken(ctx),
            getContextStopToken(ctx),
          ),
        };
      }
    }
  }
}
