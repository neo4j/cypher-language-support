
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
	CommonTokenStream,
	Lexer
} from "antlr4ts";

import { 
	CypherLexer 
} from './antlr/CypherLexer';

import { 
	CypherParser
} from './antlr/CypherParser';


function createParser(text: string) {
	const inputStream = new ANTLRInputStream(text);
	const lexer = new CypherLexer(inputStream);
	const tokenStream = new CommonTokenStream(lexer);
	const parser =  new CypherParser(tokenStream);
	return parser
}

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doAutoCompletion(documents: TextDocuments<TextDocument>) { 
	return (textDocumentPosition: TextDocumentPositionParams) => {
		const d = documents.get(textDocumentPosition.textDocument.uri);
		const position: Position = textDocumentPosition.position;
		const range: Range = {
			// TODO Nacho: We are parsing from the begining of the file. 
			// Do we need to parse from the begining of the current query?
			start: Position.create(0, 0),
			end: position
		};
		const wholeFileText: string = d?.getText(range) ?? '';
		const children = createParser(wholeFileText).oC_Cypher().children;
        const node = children?.at(children.length - 1);

		if (node) {
			const statementText: string = node?.text
			const statementParser = createParser(statementText);
			const tree = statementParser.oC_Cypher();
			const codeCompletion = new CodeCompletionCore(statementParser);
			const caretIndex = tree.stop?.tokenIndex ?? 0;

			// TODO Can this be extracted for more performance?
			const allPosibleTokens = new Map;
			statementParser.getTokenTypeMap().forEach(function(value, key, map) {
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
		} else {
			return []
		}
	}
}