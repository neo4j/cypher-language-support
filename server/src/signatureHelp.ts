import {
  Position,
  SignatureHelp,
  SignatureHelpParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { Range } from 'vscode-languageserver-types';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { CypherLexer } from './antlr/CypherLexer';

import { CypherParser } from './antlr/CypherParser';

import { DbInfo } from './dbInfo';

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doSignatureHelp(
  documents: TextDocuments<TextDocument>,
  dbInfo: DbInfo,
) {
  return (params: SignatureHelpParams) => {
    const endOfTriggerHelp = params.context?.triggerCharacter == ')';
    const emptyResult: SignatureHelp = {
      signatures: [],
      activeSignature: null,
      activeParameter: null,
    };

    if (endOfTriggerHelp) {
      return emptyResult;
    } else {
      const d = documents.get(params.textDocument.uri);
      const position = params.position;
      let procedureName: string | undefined = undefined;
      let numProcedureArgs: number | undefined = undefined;

      const range: Range = {
        // TODO Nacho: We are parsing from the begining of the file.
        // Do we need to parse from the begining of the current query?
        start: Position.create(0, 0),
        end: position,
      };
      const wholeFileText: string = d?.getText(range).trim() ?? '';
      const text = wholeFileText;
      const inputStream = CharStreams.fromString(text);
      const lexer = new CypherLexer(inputStream);
      const tokenStream = new CommonTokenStream(lexer);
      const wholeFileParser = new CypherParser(tokenStream);
      let keepParsing = true;
      let prevTokenIndex = -1;

      while (keepParsing && procedureName == undefined) {
        const tree = wholeFileParser.oC_Statement();
        const index = tree.start.tokenIndex;
        keepParsing = index != prevTokenIndex;
        prevTokenIndex = index;
        const tokens = tokenStream.getRange(index, tokenStream.size);
        const maybeProcedureCallText = tokens.map((t) => t.text).join('');

        const callProcedureStream = CharStreams.fromString(
          maybeProcedureCallText,
        );
        const callProcedureParser = new CypherParser(
          new CommonTokenStream(new CypherLexer(callProcedureStream)),
        );

        const procedureCallTree = callProcedureParser
          .oC_StandaloneCall()
          ?.oC_ExplicitProcedureInvocation();

        procedureName = procedureCallTree?.oC_ProcedureName().text;
        numProcedureArgs = procedureCallTree?.oc_ProcedureNameArg().length;
      }

      if (procedureName) {
        const procedure = dbInfo.procedureSignatures.get(procedureName);
        const signatures = procedure ? [procedure] : [];
        const argPosition =
          numProcedureArgs != undefined
            ? Math.max(numProcedureArgs - 1, 0)
            : null;

        const signatureHelp: SignatureHelp = {
          signatures: signatures,
          activeSignature: procedure ? 0 : null,
          activeParameter: argPosition,
        };
        return signatureHelp;
      } else {
        return emptyResult;
      }
    }
  };
}
