import {
  Position,
  Range,
  SignatureHelp,
  SignatureHelpParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CharStreams, CommonTokenStream, ParserRuleContext } from 'antlr4ts';

import { CypherLexer } from './antlr/CypherLexer';

import { CypherParser } from './antlr/CypherParser';

import { DbInfo } from './dbInfo';

export const emptyResult: SignatureHelp = {
  signatures: [],
  activeSignature: null,
  activeParameter: null,
};

export function doSignatureHelpForQuery(
  wholeFileText: string,
  dbInfo: DbInfo,
): SignatureHelp {
  let methodName: string | undefined = undefined;
  let numProcedureArgs: number | undefined = undefined;

  const text = wholeFileText;
  const inputStream = CharStreams.fromString(text);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const wholeFileParser = new CypherParser(tokenStream);
  const tree = wholeFileParser.oC_Cypher();
  const children = tree.children;

  // Get last statement and try to parse it as a procedure call
  if (children && children.length > 0) {
    const lastChild = children[children.length - 1];
    const index = (lastChild as ParserRuleContext).start.tokenIndex;
    const tokens = tokenStream.getRange(index, tokenStream.size);
    const maybeMethodInvocationText = tokens.map((t) => t.text).join('');

    const callProcedureStream = CharStreams.fromString(
      maybeMethodInvocationText,
    );
    const callProcedureParser = new CypherParser(
      new CommonTokenStream(new CypherLexer(callProcedureStream)),
    );
    const procedureCallTree = callProcedureParser
      .oC_StandaloneCall()
      ?.oC_ExplicitProcedureInvocation();

    methodName = procedureCallTree?.oC_ProcedureName().text;
    numProcedureArgs = procedureCallTree?.oc_ProcedureNameArg().length;
  }

  if (methodName) {
    const procedure = dbInfo.procedureSignatures.get(methodName);
    const signatures = procedure ? [procedure] : [];
    const argPosition =
      numProcedureArgs != undefined ? Math.max(numProcedureArgs - 1, 0) : null;

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

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doSignatureHelp(
  documents: TextDocuments<TextDocument>,
  dbInfo: DbInfo,
) {
  return (params: SignatureHelpParams) => {
    const endOfTriggerHelp = params.context?.triggerCharacter == ')';

    if (endOfTriggerHelp) {
      return emptyResult;
    } else {
      const d = documents.get(params.textDocument.uri);
      const position = params.position;
      const range: Range = {
        // TODO Nacho: We are parsing from the begining of the file.
        // Do we need to parse from the begining of the current query?
        start: Position.create(0, 0),
        end: position,
      };
      const wholeFileText: string = d?.getText(range).trim() ?? '';

      return doSignatureHelpForQuery(wholeFileText, dbInfo);
    }
  };
}
