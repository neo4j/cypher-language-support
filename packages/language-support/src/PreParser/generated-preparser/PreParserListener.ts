// Generated from src/PreParser/antlr-grammar/PreParser.g4 by ANTLR 4.13.2

import {ParseTreeListener} from "antlr4";


import { QueryContext } from "./PreParserParser.js";
import { CypherVersionContext } from "./PreParserParser.js";
import { CypherFiveContext } from "./PreParserParser.js";
import { CypherTwentyFiveContext } from "./PreParserParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `PreParserParser`.
 */
export default class PreParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `PreParserParser.query`.
	 * @param ctx the parse tree
	 */
	enterQuery?: (ctx: QueryContext) => void;
	/**
	 * Exit a parse tree produced by `PreParserParser.query`.
	 * @param ctx the parse tree
	 */
	exitQuery?: (ctx: QueryContext) => void;
	/**
	 * Enter a parse tree produced by `PreParserParser.cypherVersion`.
	 * @param ctx the parse tree
	 */
	enterCypherVersion?: (ctx: CypherVersionContext) => void;
	/**
	 * Exit a parse tree produced by `PreParserParser.cypherVersion`.
	 * @param ctx the parse tree
	 */
	exitCypherVersion?: (ctx: CypherVersionContext) => void;
	/**
	 * Enter a parse tree produced by `PreParserParser.cypherFive`.
	 * @param ctx the parse tree
	 */
	enterCypherFive?: (ctx: CypherFiveContext) => void;
	/**
	 * Exit a parse tree produced by `PreParserParser.cypherFive`.
	 * @param ctx the parse tree
	 */
	exitCypherFive?: (ctx: CypherFiveContext) => void;
	/**
	 * Enter a parse tree produced by `PreParserParser.cypherTwentyFive`.
	 * @param ctx the parse tree
	 */
	enterCypherTwentyFive?: (ctx: CypherTwentyFiveContext) => void;
	/**
	 * Exit a parse tree produced by `PreParserParser.cypherTwentyFive`.
	 * @param ctx the parse tree
	 */
	exitCypherTwentyFive?: (ctx: CypherTwentyFiveContext) => void;
}

