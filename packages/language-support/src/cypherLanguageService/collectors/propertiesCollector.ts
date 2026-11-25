import type { ParseTreeListener } from 'antlr4ng';
import type {
  ExpressionContext,
  VariableContext,
} from '../../generated-parser/CypherCmdParser.js';
import {
  PropertyKeyNameContext,
  ClauseContext,
  NodePatternContext,
  RelationshipPatternContext,
  Expression2Context,
  SetItemContext,
  SetPropContext,
  SetPropsContext,
  AddPropContext,
} from '../../generated-parser/CypherCmdParser.js';
import { findParent } from '../../helpers.js';
import { hasErrorNodesUnder } from '../utils/hasErrorNodesUnder.js';
import type { PropertyType } from '../parsingTypes.js';

export class PropertiesCollector implements ParseTreeListener {
  properties: PropertyType[] = [];

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
    if (ctx instanceof PropertyKeyNameContext) {
      if (ctx.parent && !hasErrorNodesUnder(ctx.parent)) {
        const parentClause = findParent(
          ctx,
          (ctx) => ctx instanceof ClauseContext,
        );
        if (parentClause instanceof ClauseContext) {
          const assignment = this.getAssignment(ctx);

          const isRead = this.isReadClause(parentClause);
          const isWrite = this.isWriteClause(parentClause);

          if ((isRead || isWrite) && ctx.start && ctx.stop) {
            const variable = this.getPropertyVariable(ctx);
            const propertyName = ctx.getText().replace(/^`|`$/g, '');

            this.properties.push({
              propertyName,
              variable,
              line: ctx.start.line,
              column: ctx.start.column,
              offsets: {
                start: ctx.start.start,
                end: ctx.stop.stop + 1,
              },
              type: isWrite ? 'write' : 'read',
              assignedExpression:
                assignment?.side === 'lhs' ? assignment.rhs : undefined,
            });
          }
        }
      }
    }
  }

  private getPropertyVariable(
    ctx: PropertyKeyNameContext,
  ): { name: string; start: number } | undefined {
    const varCtx =
      this.getVariableFromPatternProperty(ctx) ??
      this.getVariableFromPropertyAccess(ctx);

    if (varCtx && varCtx.start) {
      return {
        name: varCtx.getText(),
        start: varCtx.start.start,
      };
    }

    return undefined;
  }

  private getVariableFromPatternProperty(
    ctx: PropertyKeyNameContext,
  ): VariableContext | undefined {
    const patternElement = findParent(ctx, (ctx) => {
      return (
        ctx instanceof NodePatternContext ||
        ctx instanceof RelationshipPatternContext
      );
    });
    if (
      patternElement instanceof NodePatternContext ||
      patternElement instanceof RelationshipPatternContext
    ) {
      return patternElement.variable() ?? undefined;
    }
    return undefined;
  }

  private getVariableFromPropertyAccess(
    ctx: PropertyKeyNameContext,
  ): VariableContext | undefined {
    const propertyAccessExpr = findParent(
      ctx,
      (ctx) => ctx instanceof Expression2Context,
    );
    if (propertyAccessExpr instanceof Expression2Context) {
      return propertyAccessExpr.expression1().variable() ?? undefined;
    }

    return undefined;
  }

  /** Checks if a parent clause is writable for properties */
  private isWriteClause(clause: ClauseContext): boolean {
    return Boolean(
      clause.mergeClause() ||
      clause.createClause() ||
      clause.insertClause() ||
      clause.setClause() ||
      clause.removeClause(),
    );
  }

  /** Checks if a parent clause is readonly for properties */
  private isReadClause(clause: ClauseContext): boolean {
    return Boolean(
      clause.matchClause() || clause.withClause() || clause.returnClause(),
    );
  }

  /** Given a property, is it in the left or right side? */
  private getAssignment(
    ctx: PropertyKeyNameContext,
  ): { side: 'lhs' | 'rhs'; rhs: ExpressionContext } | undefined {
    const assignment = findParent(
      ctx,
      (node) => node instanceof SetItemContext,
    );
    // Only value assignments expose expression(); label assignments do not.
    // SetProp: SET n.name = value; SetProps: SET n = map; AddProp: SET n += map.
    if (
      !(assignment instanceof SetPropContext) &&
      !(assignment instanceof SetPropsContext) &&
      !(assignment instanceof AddPropContext)
    ) {
      return undefined;
    }

    if (hasErrorNodesUnder(assignment)) return undefined;

    const rhs = assignment.expression();
    if (findParent(ctx, (node) => node === rhs)) {
      return { side: 'rhs', rhs };
    }

    if (assignment instanceof SetPropContext) {
      const postfixes = assignment.expression2().postFix();
      const target = postfixes[postfixes.length - 1];
      // Only the final property lookup is written; dynamic keys are reads.
      if (ctx.parent?.parent === target) {
        return { side: 'lhs', rhs };
      }
    }

    return undefined;
  }
}
