import type { ParseTreeListener, CommonTokenStream } from 'antlr4ng';
import {
  VariableContext,
  ProcedureResultItemContext,
  CypherCmdParser as CypherParser,
} from '../../generated-parser/CypherCmdParser.js';
import { rulesDefiningOrUsingVariables } from '../../helpers.js';

// This class is collects all variables detected by the parser which means
// it does include variable scope nor differentiate between variable use and definition
// we use it when the semantic anaylsis result is not available
export class VariableCollector implements ParseTreeListener {
  variables: string[] = [];
  private tokenStream: CommonTokenStream;

  constructor(tokenStream: CommonTokenStream) {
    this.tokenStream = tokenStream;
  }

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
    if (ctx instanceof VariableContext) {
      const variable = ctx.symbolicVariableNameString().getText();
      // To avoid suggesting the variable that is currently being typed
      // For example RETURN a| <- we don't want to suggest "a" as a variable
      // We check if the variable is in the end of the statement
      const nextTokenIndex = ctx.stop?.tokenIndex;

      const nextTokenIsEOF =
        nextTokenIndex !== undefined &&
        this.tokenStream?.get(nextTokenIndex + 1)?.type === CypherParser.EOF;

      const parentRule = ctx.parent?.ruleIndex;
      const definesVariable =
        parentRule !== undefined &&
        rulesDefiningOrUsingVariables.includes(parentRule);

      if (variable && !nextTokenIsEOF && definesVariable) {
        this.variables.push(variable);
      }
    }
    if (ctx instanceof ProcedureResultItemContext) {
      const variable = ctx.getText();
      if (variable) {
        this.variables.push(variable);
      }
    }
  }
}
