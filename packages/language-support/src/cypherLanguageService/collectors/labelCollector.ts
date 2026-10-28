import type { ParserRuleContext, ParseTreeListener } from 'antlr4ng';
import {
  LabelNameContext,
  LabelOrRelTypeContext,
} from '../../generated-parser/CypherCmdParser.js';
import { inNodeLabel, inRelationshipType, isDefined } from '../../helpers.js';
import { couldCreateNewLabel } from '../utils/couldCreateNewLabel.js';
import { hasErrorNodesUnder } from '../utils/hasErrorNodesUnder.js';
import type { LabelOrRelType } from '../parsingTypes.js';
import { LabelType } from '../parsingTypes.js';
import {
  getContextStartToken,
  getContextStopToken,
} from '../../helpers/getContextToken.js';

/** This listener collects all labels and relationship types in read operations */
export class ReadLabelAndRelTypesCollector implements ParseTreeListener {
  labelOrRelTypes: LabelOrRelType[] = [];

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
    if (ctx instanceof LabelNameContext) {
      // If the parser recovered from an error reading the label
      // like in the case MATCH (n:) RETURN n
      // RETURN would be incorrectly idenfified as the label
      // If this is the case, the context containing the label would have an error node
      if (
        ctx.parent &&
        !hasErrorNodesUnder(ctx.parent) &&
        !couldCreateNewLabel(ctx)
      ) {
        this.labelOrRelTypes.push({
          labelType: getLabelType(ctx),
          labelText: ctx.getText(),
          line: getContextStartToken(ctx).line,
          column: getContextStartToken(ctx).column,
          offsets: {
            start: getContextStartToken(ctx).start,
            end: getContextStopToken(ctx).stop + 1,
          },
        });
      }
    } else if (ctx instanceof LabelOrRelTypeContext) {
      const symbolicName = ctx.symbolicNameString();
      // Read comment for the label name case
      if (
        isDefined(symbolicName) &&
        ctx.parent &&
        !hasErrorNodesUnder(ctx.parent) &&
        !couldCreateNewLabel(ctx)
      ) {
        this.labelOrRelTypes.push({
          labelType: getLabelType(ctx),
          labelText: getContextStartToken(symbolicName).text ?? '',
          line: getContextStartToken(symbolicName).line,
          column: getContextStartToken(symbolicName).column,
          offsets: {
            start: getContextStartToken(symbolicName).start,
            end: getContextStopToken(symbolicName).stop + 1,
          },
        });
      }
    }
  }
}

function getLabelType(ctx: ParserRuleContext): LabelType {
  if (inNodeLabel(ctx)) return LabelType.nodeLabelType;
  else if (inRelationshipType(ctx)) return LabelType.relLabelType;
  else return LabelType.unknown;
}
