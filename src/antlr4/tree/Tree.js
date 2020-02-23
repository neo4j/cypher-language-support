/* Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */
///

// The basic notion of a tree has a parent, a payload, and a list of children.
//  It is the most abstract interface for all the trees used by ANTLR.
///

var Token = require('./../Token').Token;
var Interval = require('./../IntervalSet').Interval;
var INVALID_INTERVAL = new Interval(-1, -2);
var Utils = require('../Utils.js');

class Tree {}

class SyntaxTree extends Tree {
	constructor() {
		super();
	}
}

class ParseTree extends SyntaxTree {
	constructor() {
		super();
	}
}

class RuleNode extends ParseTree {
	constructor() {
		super();
	}
}

class TerminalNode extends ParseTree {
	constructor() {
		super();
	}
}

class ErrorNode extends TerminalNode {
	constructor() {
		super();
	}
}

class ParseTreeVisitor {
	visit(ctx) {
		 if (Array.isArray(ctx)) {
			return ctx.map(function(child) {
				return child.accept(this);
			}, this);
		} else {
			return ctx.accept(this);
		}
	}

	visitChildren(ctx) {
		if (ctx.children) {
			return this.visit(ctx.children);
		} else {
			return null;
		}
	}

	visitTerminal(node) {
	}

	visitErrorNode(node) {
	}
}

class ParseTreeListener {
	visitTerminal(node) {
	}

	visitErrorNode(node) {
	}

	enterEveryRule(node) {
	}

	exitEveryRule(node) {
	}
}

class TerminalNodeImpl extends TerminalNode {
	constructor(symbol) {
		super();
		this.parentCtx = null;
		this.symbol = symbol;
	}

	getChild(i) {
		return null;
	}

	getSymbol() {
		return this.symbol;
	}

	getParent() {
		return this.parentCtx;
	}

	getPayload() {
		return this.symbol;
	}

	getSourceInterval() {
		if (this.symbol === null) {
			return INVALID_INTERVAL;
		}
		var tokenIndex = this.symbol.tokenIndex;
		return new Interval(tokenIndex, tokenIndex);
	}

	getChildCount() {
		return 0;
	}

	accept(visitor) {
		return visitor.visitTerminal(this);
	}

	getText() {
		return this.symbol.text;
	}

	toString() {
		if (this.symbol.type === Token.EOF) {
			return "<EOF>";
		} else {
			return this.symbol.text;
		}
	}
}


// Represents a token that was consumed during resynchronization
// rather than during a valid match operation. For example,
// we will create this kind of a node during single token insertion
// and deletion as well as during "consume until error recovery set"
// upon no viable alternative exceptions.

class ErrorNodeImpl extends TerminalNodeImpl {
	constructor(token) {
		super(token);
	}

	isErrorNode() {
		return true;
	}

	accept(visitor) {
		return visitor.visitErrorNode(this);
	}
}

class ParseTreeWalker {
	walk(listener, t) {
		var errorNode = t instanceof ErrorNode ||
				(t.isErrorNode !== undefined && t.isErrorNode());
		if (errorNode) {
			listener.visitErrorNode(t);
		} else if (t instanceof TerminalNode) {
			listener.visitTerminal(t);
		} else {
			this.enterRule(listener, t);
			for (var i = 0; i < t.getChildCount(); i++) {
				var child = t.getChild(i);
				this.walk(listener, child);
			}
			this.exitRule(listener, t);
		}
	}

//
// The discovery of a rule node, involves sending two events: the generic
// {@link ParseTreeListener//enterEveryRule} and a
// {@link RuleContext}-specific event. First we trigger the generic and then
// the rule specific. We to them in reverse order upon finishing the node.
//
	enterRule(listener, r) {
		var ctx = r.getRuleContext();
		listener.enterEveryRule(ctx);
		ctx.enterRule(listener);
	}

	exitRule(listener, r) {
		var ctx = r.getRuleContext();
		ctx.exitRule(listener);
		listener.exitEveryRule(ctx);
	}
}

ParseTreeWalker.DEFAULT = new ParseTreeWalker();

exports.RuleNode = RuleNode;
exports.ErrorNode = ErrorNode;
exports.TerminalNode = TerminalNode;
exports.ErrorNodeImpl = ErrorNodeImpl;
exports.TerminalNodeImpl = TerminalNodeImpl;
exports.ParseTreeListener = ParseTreeListener;
exports.ParseTreeVisitor = ParseTreeVisitor;
exports.ParseTreeWalker = ParseTreeWalker;
exports.INVALID_INTERVAL = INVALID_INTERVAL;
