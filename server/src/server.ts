
import {
	DiagnosticSeverity,
	Diagnostic,
	createConnection,
	TextDocuments,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	CompletionItemKind,
	Position,
	CompletionItem,
	ProposedFeatures,
	InitializeParams
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
    ANTLRErrorListener, 
	ANTLRInputStream, 
	CommonToken, 
	CommonTokenStream, 
	RecognitionException, 
	Recognizer, 
	Token
} from "antlr4ts";

import { 
	CypherLexer 
} from './antlr/CypherLexer';

import { 
	CypherParser 
} from './antlr/CypherParser';


const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true
			}
		}
	};

	return result;
});

documents.onDidClose(e => {
	console.log("closing document");
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

// ************************************************************
// Part of the code that highlights the syntax errors
// ************************************************************
export class ErrorListener implements ANTLRErrorListener<CommonToken> {
	diagnostics: Diagnostic[];
	textDocument: TextDocument;
	
	constructor(textDocument: TextDocument) {
		this.diagnostics = [];
		this.textDocument = textDocument;
	}

    public syntaxError<T extends Token>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number,
        charPositionInLine: number, msg: string, e: RecognitionException | undefined): void {
			const lineIndex = (offendingSymbol?.line ?? 1) - 1;
			const start = offendingSymbol?.startIndex ?? 0;
			const end = (offendingSymbol?.stopIndex ?? 0) + 1;

			const diagnostic: Diagnostic = {
				severity: DiagnosticSeverity.Warning,
				range: {
					start: Position.create(lineIndex, start),
					end: Position.create(lineIndex, end)
				},
				message: msg
			};
			this.diagnostics.push(diagnostic);
    }
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	const lineText: string = textDocument.getText();
	const inputStream = new ANTLRInputStream(lineText);
	const lexer = new CypherLexer(inputStream);
	const tokenStream = new CommonTokenStream(lexer);
	
	const parser = new CypherParser(tokenStream);
	const errorListener = new ErrorListener(textDocument);
	parser.addErrorListener(errorListener);
	const tree = parser.oC_Cypher();

	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: errorListener.diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received a file change event');
});

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
connection.onCompletion(
	(textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
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

		// Nacho: What do I want this for?
		const tree = parser.oC_Cypher();

		const codeCompletion = new CodeCompletionCore(parser);
		const candidates = codeCompletion.collectCandidates(0);
		const allPosibleTokens = new Map;
		lexer.getTokenTypeMap().forEach(function(value, key, map) {
			allPosibleTokens.set(map.get(key), key);
		});
		const tokens = candidates.tokens.keys();
		const tokenCandidates = Array.from(tokens).map(t => allPosibleTokens.get(t));
		

		return tokenCandidates.map(t => {
			return {
				label: t,
				kind: CompletionItemKind.Keyword
			};
		});
	}
);


documents.listen(connection);
connection.listen();
