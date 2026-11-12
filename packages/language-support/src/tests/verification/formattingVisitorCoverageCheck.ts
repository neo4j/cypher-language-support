/* eslint-disable no-console */
/**
 * Checks that every visit<Rule> method in the formatter's TreePrintVisitor
 * visits every child accessor of its rule context on at least one branch.
 *
 * Catches the case where a grammar bump adds a new child to a rule we already
 * have a hand-written visitor for: the child is then silently dropped from the
 * formatted output.
 *
 * Usage: pnpm test:formattingVisitorCoverage [path/to/formatting.ts]
 *
 * Note: Generated script.
 * Since it's a helper only used for verification, I was a little less thorough in examining it,
 * but glancing through it seems to make sense, and handles some special cases in reasonable ways
 * (ex helper functions, aliased variables)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const here = path.dirname(fileURLToPath(import.meta.url));
const parserPath = path.resolve(
  here,
  '../../generated-parser/CypherCmdParser.ts',
);
const formatterPath = path.resolve(
  process.argv[2] ?? path.join(here, '../../formatting/formatting.ts'),
);
const VISITOR_CLASS = 'TreePrintVisitor';

// Calls that hand the whole context to the default child traversal.
const GENERIC_VISITS = new Set(['visitChildren', 'breakAndVisitChildren']);
// Calls that dispatch their argument to its visitor. Rule visitors
// (visit<Rule>) are added at runtime; any other class method is a helper
// whose body gets analysed instead.
const DISPATCHING_VISITS = new Set([
  'visit',
  '_visit',
  'visitTerminal',
  'visitTerminalRaw',
  '_visitTerminalRaw',
]);
// Marks that a helper visits the parameter itself (not just its children).
const SELF = '<self>';

// Intentional omissions: visitor method -> accessors it may skip (dotted
// paths like 'returnBody.ALL' for children handled by helpers).
const ALLOWED_MISSING: Record<string, string[]> = {
  visitStatementsOrCommands: ['EOF'],
};

const NON_ACCESSORS = new Set([
  'accept',
  'enterRule',
  'exitRule',
  'copyFrom',
  'ruleIndex',
]);

function parseFile(file: string): ts.SourceFile {
  return ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
}

interface ContextInfo {
  /** Child accessor methods (rules and tokens). */
  accessors: Set<string>;
  /** Rule accessor -> the context class it returns. */
  accessorTypes: Map<string, string>;
  /** Grammar labels (`whereExp=expression`) -> the accessor they alias. */
  labels: Map<string, string>;
}

// Goes through "class <Rule>Context" definitions and
// determines what children exist: child rules ("<rule>(): <Rule>Context") and
// tokens ("LCURLY(): TerminalNode") accessor methods,
// as well as figuring out what labels exist (ex. defined like "WHERE whereExp = expression" in the grammar - where whereExp is the label)
// In the end we get:
// {
//   LocalProcedureDefinitionContext: {
//     accessors: [procedureName, localInputFieldsSignature, ..., LCURLY, RCURLY]
//     accessorTypes: {procedureName: ProcedureNameContext, localInputFieldsSignature: LocalInputFieldsSignatureContext, ...}
//     labels: {_outputType: localOutputFieldsSignature}
//   },
//   ...
// }
function collectContexts(): Map<string, ContextInfo> {
  const result = new Map<string, ContextInfo>();
  for (const stmt of parseFile(parserPath).statements) {
    if (!ts.isClassDeclaration(stmt) || !stmt.name?.text.endsWith('Context')) {
      continue;
    }
    const accessors = new Set<string>();
    const accessorTypes = new Map<string, string>();
    const labels = new Map<string, string>();
    for (const member of stmt.members) {
      const ruleLabel =
        ts.isPropertyDeclaration(member) &&
        ts.isIdentifier(member.name) &&
        member.name.text.startsWith('_') &&
        /^(\w+)Context\b/.exec(member.type?.getText() ?? '');
      if (ruleLabel) {
        const rule = ruleLabel[1]!;
        labels.set(
          member.name.text,
          rule.charAt(0).toLowerCase() + rule.slice(1),
        );
      } else if (
        ts.isMethodDeclaration(member) &&
        ts.isIdentifier(member.name) &&
        !NON_ACCESSORS.has(member.name.text) &&
        member.type &&
        /Context|TerminalNode/.test(member.type.getText())
      ) {
        accessors.add(member.name.text);
        const ruleType = /(\w+Context)\b/.exec(member.type.getText());
        if (ruleType) accessorTypes.set(member.name.text, ruleType[1]!);
      }
    }
    result.set(stmt.name.text, { accessors, accessorTypes, labels });
  }
  return result;
}

type FunctionLike = ts.ArrowFunction | ts.FunctionExpression;

/** Class members defined as `name = (...) => {...}` or methods. */
function collectClassFunctions(
  cls: ts.ClassDeclaration,
): Map<string, FunctionLike | ts.MethodDeclaration> {
  const fns = new Map<string, FunctionLike | ts.MethodDeclaration>();
  for (const member of cls.members) {
    if (!member.name || !ts.isIdentifier(member.name)) continue;
    if (
      ts.isPropertyDeclaration(member) &&
      member.initializer &&
      (ts.isArrowFunction(member.initializer) ||
        ts.isFunctionExpression(member.initializer))
    ) {
      fns.set(member.name.text, member.initializer);
    } else if (ts.isMethodDeclaration(member) && member.body) {
      fns.set(member.name.text, member);
    }
  }
  return fns;
}

interface Coverage {
  visited: Set<string>;
  generic: boolean;
  /**
   * Children never visited themselves, but handed to helpers that visit
   * their sub-children directly -> what those helpers cover of them.
   */
  delegated: Map<string, Coverage>;
}

const emptyCoverage = (): Coverage => ({
  visited: new Set(),
  generic: false,
  delegated: new Map(),
});

function mergeInto(target: Coverage, src: Coverage) {
  src.visited.forEach((v) => target.visited.add(v));
  target.generic ||= src.generic;
  for (const [acc, sub] of src.delegated) {
    const existing = target.delegated.get(acc) ?? emptyCoverage();
    mergeInto(existing, sub);
    target.delegated.set(acc, existing);
  }
}

function walk(node: ts.Node, cb: (n: ts.Node) => void) {
  cb(node);
  node.forEachChild((c) => walk(c, cb));
}

function thisCallName(call: ts.CallExpression): string | undefined {
  const callee = call.expression;
  if (
    ts.isPropertyAccessExpression(callee) &&
    callee.expression.kind === ts.SyntaxKind.ThisKeyword
  ) {
    return callee.name.text;
  }
  return undefined;
}

function isIdent(node: ts.Node, name: string) {
  return ts.isIdentifier(node) && node.text === name;
}

// For array params, `param[i]` and `...param` count as the param itself.
function isParamOrElement(node: ts.Node, name: string) {
  if (ts.isElementAccessExpression(node) || ts.isSpreadElement(node)) {
    return isIdent(node.expression, name);
  }
  return isIdent(node, name);
}

class CoverageAnalyzer {
  private cache = new Map<string, Coverage>();
  private inProgress = new Set<string>();

  constructor(
    private fns: Map<string, FunctionLike | ts.MethodDeclaration>,
    private dispatching: Set<string>,
  ) {}

  /** What the function visits of its parameter at `paramIndex`.
   * Called on a visitor function this collects which children of the
   * only param (corresponding to the visited rule) are used inside a
   * visit-call. Comparing that against the rule's children happens in
   * findMissing.
   */
  analyze(fnName: string, paramIndex: number): Coverage {
    const key = `${fnName}#${paramIndex}`;
    const cached = this.cache.get(key);
    if (cached) return cached;
    const fn = this.fns.get(fnName);
    if (!fn?.body) return emptyCoverage();
    // Arguments past a rest parameter all land in it
    const lastParam = fn.parameters.at(-1);
    const param =
      lastParam?.dotDotDotToken && paramIndex >= fn.parameters.length - 1
        ? lastParam
        : fn.parameters[paramIndex];
    if (!param || !ts.isIdentifier(param.name)) {
      return emptyCoverage();
    }
    // Recursive helpers: assume nothing extra on the cyclic edge.
    if (this.inProgress.has(key)) return emptyCoverage();
    this.inProgress.add(key);

    const ctx = param.name.text;
    const coverage = emptyCoverage();

    // Accessors reached by an expression: `ctx.foo(...)` calls, `ctx._label`
    // fields (resolved per context later) and aliases.
    const aliases = new Map<string, Set<string>>();
    const accessorsIn = (expr: ts.Node): Set<string> => {
      const found = new Set<string>();
      walk(expr, (n) => {
        if (
          ts.isCallExpression(n) &&
          ts.isPropertyAccessExpression(n.expression) &&
          isIdent(n.expression.expression, ctx)
        ) {
          found.add(n.expression.name.text);
        } else if (
          ts.isPropertyAccessExpression(n) &&
          isIdent(n.expression, ctx) &&
          n.name.text.startsWith('_')
        ) {
          found.add(n.name.text);
        } else if (ts.isIdentifier(n) && aliases.has(n.text)) {
          aliases.get(n.text)?.forEach((a) => found.add(a));
        }
      });
      return found;
    };

    // `const x = ctx.foo()` makes later `this.visit(x)` count for foo.
    walk(fn.body, (n) => {
      if (
        ts.isVariableDeclaration(n) &&
        ts.isIdentifier(n.name) &&
        n.initializer
      ) {
        const acc = accessorsIn(n.initializer);
        if (acc.size > 0) aliases.set(n.name.text, acc);
      }
    });

    walk(fn.body, (n) => {
      // Iterating children by hand dispatches to every child generically.
      if (
        ts.isPropertyAccessExpression(n) &&
        isIdent(n.expression, ctx) &&
        (n.name.text === 'children' || n.name.text === 'getChild')
      ) {
        coverage.generic = true;
      }
      if (!ts.isCallExpression(n)) return;
      const name = thisCallName(n);
      if (!name) return;
      const isVisit = GENERIC_VISITS.has(name) || this.dispatching.has(name);
      const isHelper = !isVisit && this.fns.has(name);
      if (!isVisit && !isHelper) return;

      n.arguments.forEach((arg, i) => {
        if (isParamOrElement(arg, ctx)) {
          if (GENERIC_VISITS.has(name)) {
            coverage.generic = true;
          } else if (isVisit) {
            coverage.visited.add(SELF);
          } else {
            // ctx handed to a helper: inherit what the helper visits.
            mergeInto(coverage, this.analyze(name, i));
          }
          return;
        }
        const reached = accessorsIn(arg);
        if (isVisit) {
          reached.forEach((a) => coverage.visited.add(a));
          return;
        }
        if (reached.size === 0) return;
        // A child passed to a helper: either the helper visits it, or it
        // handles the child's own children, which are then checked against
        // the child's context.
        const sub = this.analyze(name, i);
        for (const acc of reached) {
          if (sub.generic || sub.visited.has(SELF)) {
            coverage.visited.add(acc);
          } else {
            const existing = coverage.delegated.get(acc) ?? emptyCoverage();
            mergeInto(existing, sub);
            coverage.delegated.set(acc, existing);
          }
        }
      });
    });

    this.inProgress.delete(key);
    this.cache.set(key, coverage);
    return coverage;
  }
}

function main() {
  const generatedContexts = collectContexts();
  const formatterFile = parseFile(formatterPath);
  const treePrintVisitor = formatterFile.statements.find(
    (s): s is ts.ClassDeclaration =>
      ts.isClassDeclaration(s) && s.name?.text === VISITOR_CLASS,
  );
  if (!treePrintVisitor) throw new Error(`Class ${VISITOR_CLASS} not found`);

  const fns = collectClassFunctions(treePrintVisitor);
  // See if formatting.ts method is visitor of Context class in generated parser
  const contextOfVisitor = (name: string) => {
    const match = /^visit([A-Z]\w*)$/.exec(name);
    return match ? generatedContexts.get(`${match[1]}Context`) : undefined;
  };
  // Gets filled with visitor method names like visitFilterClause etc, so that
  // calling another rule visitor directly counts as a visit, e.g.
  // this.visitNodePattern(...) in _processNodeRelSequence. Those visitors
  // are checked on their own, so the caller shouldn't re-check their children.
  const dispatching = new Set(DISPATCHING_VISITS);
  for (const name of fns.keys()) {
    if (contextOfVisitor(name)) dispatching.add(name);
  }
  const analyzer = new CoverageAnalyzer(fns, dispatching);
  let checked = 0;
  let generic = 0;
  const problems: string[] = [];

  /** Children of `context` not covered, as dotted paths. */
  const findMissing = (
    coverage: Coverage,
    context: ContextInfo,
    prefix: string,
  ): string[] => {
    if (coverage.generic) return [];
    const resolve = (v: string) => context.labels.get(v) ?? v;
    const visited = new Set([...coverage.visited].map(resolve));
    const delegated = new Map<string, Coverage>();
    for (const [acc, sub] of coverage.delegated) {
      delegated.set(resolve(acc), sub);
    }
    const missing: string[] = [];
    for (const acc of context.accessors) {
      if (visited.has(acc)) continue;
      const sub = delegated.get(acc);
      const childContext = generatedContexts.get(
        context.accessorTypes.get(acc) ?? '',
      );
      if (sub && childContext) {
        missing.push(...findMissing(sub, childContext, `${prefix}${acc}.`));
      } else {
        missing.push(prefix + acc);
      }
    }
    return missing;
  };

  for (const [name, fn] of fns) {
    const context = contextOfVisitor(name);
    // Not a rule visitor (e.g. visitTerminal) or no matching context.
    if (!context || fn.parameters.length !== 1) continue;
    checked++;

    const coverage = analyzer.analyze(name, 0);
    if (coverage.generic) {
      generic++;
      continue;
    }
    const allowed = new Set(ALLOWED_MISSING[name] ?? []);
    const missing = findMissing(coverage, context, '').filter(
      (a) => !allowed.has(a),
    );
    if (missing.length > 0) {
      const line =
        formatterFile.getLineAndCharacterOfPosition(fn.getStart()).line + 1;
      problems.push(
        `  ${name} (${path.basename(formatterPath)}:${line}): ${missing.join(', ')}`,
      );
    }
  }

  console.log(
    `Checked ${checked} visitor methods (${generic} delegate to generic child traversal).`,
  );
  if (problems.length > 0) {
    console.log(
      `\n${problems.length} visitor methods never visit some children:\n${problems.join('\n')}`,
    );
    process.exit(1);
  }
  console.log('All visitor methods visit all their children.');
}

main();
