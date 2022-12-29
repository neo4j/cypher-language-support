
import {
	TextDocumentPositionParams,
	TextDocuments,
	CompletionItemKind,
	Position,
	CompletionItem
} from 'vscode-languageserver/node';

import { 
	Range 
} from 'vscode-languageserver-types';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import {
	CodeCompletionCore
} from 'antlr4-c3';

import {
	ANTLRInputStream, 
	CommonTokenStream
} from "antlr4ts";

import { 
	CypherLexer 
} from './antlr/CypherLexer';

import { 
	CypherParser
} from './antlr/CypherParser';

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doAutoCompletion(documents: TextDocuments<TextDocument>) { 
	return (textDocumentPosition: TextDocumentPositionParams) => {
		const d = documents.get(textDocumentPosition.textDocument.uri);
		const position: Position = textDocumentPosition.position;
		const range: Range = {
			start: Position.create(position.line, 0),
			end: position
		};
		const lineText: string = d?.getText(range) ?? '';
		const inputStream = new ANTLRInputStream(lineText);
		const lexer = new CypherLexer(inputStream);
		const tokenStream = new CommonTokenStream(lexer);
		const parser = new CypherParser(tokenStream);
		const tree = parser.oC_Cypher();
		const codeCompletion = new CodeCompletionCore(parser);
		const caretIndex = tree.stop?.tokenIndex ?? 0;

		// TODO Can this be extracted for more performance?
		const allPosibleTokens = new Map;
		lexer.getTokenTypeMap().forEach(function(value, key, map) {
			allPosibleTokens.set(map.get(key), key);
		});

		const candidates = codeCompletion.collectCandidates(caretIndex as number);
		const tokens = candidates.tokens.keys();
		const tokenCandidates = Array.from(tokens).map(t => allPosibleTokens.get(t));
		
		return tokenCandidates.map(t => {
			return {
				label: t,
				kind: CompletionItemKind.Keyword
			};
		});
	}
}