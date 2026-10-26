import type { ParseTreeListener } from 'antlr4ng';
import type { VariableContext } from '../../generated-parser/CypherCmdParser.js';
import {
  PropertyKeyNameContext,
  ClauseContext,
  NodePatternContext,
  RelationshipPatternContext,
  Expression2Context,
} from '../../generated-parser/CypherCmdParser.js';
import { findParent } from '../../helpers.js';
import { hasErrorNodesUnder } from '../utils/hasErrorNodesUnder.js';
import type { PropertyType } from '../parsingTypes.js';

// This listener collects all properties in read operations
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
          const isRead = this.isReadClause(parentClause);
          const isWrite = this.isWriteClause(parentClause);

          if (isRead || isWrite) {
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

    if (varCtx) {
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
      return patternElement.variable();
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
      return propertyAccessExpr.expression1().variable();
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
}
