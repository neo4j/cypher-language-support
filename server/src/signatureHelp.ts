import {
  ParameterInformation,
  Position,
  SignatureHelp,
  SignatureHelpParams,
  SignatureInformation,
  TextDocuments,
} from 'vscode-languageserver/node';

import { Range } from 'vscode-languageserver-types';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { CypherLexer } from './antlr/CypherLexer';

import { CypherParser, Oc_ProcedureNameArgContext } from './antlr/CypherParser';

import { CypherListener } from './antlr/CypherListener';

import { auth, driver, session } from 'neo4j-driver';

import { OC_ProcedureNameContext } from './antlr/CypherParser';

import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';

const neo4j = driver(
  'neo4j://localhost',
  // TODO Nacho This is hardcoded
  auth.basic('neo4j', 'pass12345'),
);

const procedureSignatures: Map<string, SignatureInformation> = new Map();

function getParamsInfo(param: string): ParameterInformation {
  // FIXME: There are cases where this doesn't work:
  // paramslabels :: LIST? OF STRING?,groupByProperties :: LIST? OF STRING?,aggregations = [{*=count},{*=count}] :: LIST? OF MAP?,config = {} :: MAP?
  const [headerInfo, paramType] = param.split(' :: ');
  const [paramName, defaultValue] = headerInfo.split(' = ');

  return ParameterInformation.create(paramName, param);
}

function updateProcedureCache() {
  const s = neo4j.session({ defaultAccessMode: session.WRITE });
  const tx = s.beginTransaction();
  const resultPromise = tx.run(
    'SHOW PROCEDURES yield name, signature, description;',
  );

  resultPromise.then((result) => {
    result.records.map((record) => {
      const procedureName = record.get('name');
      const signature = record.get('signature');
      const description = record.get('description');

      const [header, returnType] = signature.split(') :: ');
      const paramsString = header
        .replace(procedureName, '')
        .replace('(', '')
        .replace(')', '')
        .trim();

      const params: string[] =
        paramsString.length > 0 ? paramsString.split(', ') : [];

      procedureSignatures.set(
        procedureName,
        SignatureInformation.create(
          procedureName,
          description,
          ...params.map(getParamsInfo),
        ),
      );
    });
  });
}

class CallProcedureDetector implements CypherListener {
  parsedProcedureName = '';
  numProcedureArgs = 0;

  exitOC_ProcedureName(ctx: OC_ProcedureNameContext) {
    this.parsedProcedureName = ctx.text;
  }

  exitOc_ProcedureNameArg(ctx: Oc_ProcedureNameArgContext) {
    this.numProcedureArgs++;
  }
}

function decreasePosition(position: Position) {
  const c = position.character - 1;
  const l = position.line;

  if (c > 0) {
    return Position.create(l, c);
  } else {
    return Position.create(l - 1, -1);
  }
}

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doSignatureHelp(documents: TextDocuments<TextDocument>) {
  return (params: SignatureHelpParams) => {
    const endOfTriggerHelp = params.context?.triggerCharacter == ')';

    if (endOfTriggerHelp) {
      const signatureHelp: SignatureHelp = {
        signatures: [],
        activeSignature: null,
        activeParameter: null,
      };

      return signatureHelp;
    } else {
      const d = documents.get(params.textDocument.uri);
      let procedureName: string | undefined = undefined;
      let numProcedureArgs = 0;
      let position = params.position;
      let argOffset = 0;
      // Block to update cached labels, procedure names, etc
      updateProcedureCache();

      // Backtrack in the line until we've managed to parse a procedure name
      while (!procedureName) {
        const range: Range = {
          // TODO Nacho: We are parsing from the begining of the file.
          // Do we need to parse from the begining of the current query?
          start: Position.create(0, 0),
          end: position,
        };
        const wholeFileText: string = d?.getText(range).trim() ?? '';
        argOffset = wholeFileText.endsWith(',') ? 0 : -1;
        const text = wholeFileText.replace(/,$/, '') + ')';
        const inputStream = CharStreams.fromString(text);
        const lexer = new CypherLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const wholeFileParser = new CypherParser(tokenStream);

        const procedureNameDetector = new CallProcedureDetector();
        wholeFileParser.addParseListener(
          procedureNameDetector as ParseTreeListener,
        );

        // FIXME: half parsed arguments
        // CALL method([1,2
        wholeFileParser.oC_Cypher();

        procedureName = procedureNameDetector.parsedProcedureName;
        numProcedureArgs = procedureNameDetector.numProcedureArgs;
        position = decreasePosition(position);
      }

      const procedure = procedureSignatures.get(procedureName);
      const signatures = procedure ? [procedure] : [];

      const signatureHelp: SignatureHelp = {
        signatures: signatures,
        activeSignature: procedure ? 0 : null,
        activeParameter: Math.max(numProcedureArgs + argOffset, 0),
      };
      return signatureHelp;
    }
  };
}
