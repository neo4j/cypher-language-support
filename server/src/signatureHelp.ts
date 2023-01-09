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

interface MethodInfo {
  description: string;
  parameters: ParameterInfo[];
  returnType: string;
}

interface ParameterInfo {
  name: string;
  type: string;
  mandatory: boolean;
  defaultValue: string | undefined;
}

const procedureNames: Map<string, MethodInfo> = new Map();

function getParamsInfo(params: string[]): ParameterInfo[] {
  return params.map((p: string) => {
    // FIXME: There are cases where this doesn't work:
    // paramslabels :: LIST? OF STRING?,groupByProperties :: LIST? OF STRING?,aggregations = [{*=count},{*=count}] :: LIST? OF MAP?,config = {} :: MAP?
    const [headerInfo, paramType] = p.split(' :: ');
    const [paramName, defaultValue] = headerInfo.split(' = ');
    const mandatory = !(paramType?.endsWith('?') ?? false);

    const sanitisedType = paramType ? paramType.replace(/\?$/, '') : paramType;

    return {
      name: paramName,
      type: sanitisedType,
      mandatory: mandatory,
      defaultValue: defaultValue,
    };
  });
}

function updateProcedureNames() {
  const s = neo4j.session({ defaultAccessMode: session.WRITE });
  const tx = s.beginTransaction();
  const resultPromise = tx.run(
    'SHOW PROCEDURES yield name, signature, description;',
  );

  resultPromise.then((result) => {
    result.records.map((record) => {
      const name = record.get('name');
      const signature = record.get('signature');
      const description = record.get('description');

      const [header, returnType] = signature.split(') :: ');
      const paramsString = header
        .replace(name, '')
        .replace('(', '')
        .replace(')', '')
        .trim();

      const params: string[] =
        paramsString.length > 0 ? paramsString.split(', ') : [];

      procedureNames.set(name, {
        description: description,
        parameters: getParamsInfo(params),
        returnType: returnType,
      });
    });
  });
}

class CallProcedureDetector implements CypherListener {
  parsedProcedureNames: string[] = [];
  numProcedureArgs = 0;

  exitOC_ProcedureName(ctx: OC_ProcedureNameContext) {
    this.parsedProcedureNames.push(ctx.text);
  }

  exitOc_ProcedureNameArg(ctx: Oc_ProcedureNameArgContext) {
    this.numProcedureArgs++;
  }
}

// ************************************************************
// Part of the code that does the autocompletion
// ************************************************************
export function doSignatureHelp(documents: TextDocuments<TextDocument>) {
  return (params: SignatureHelpParams) => {
    const d = documents.get(params.textDocument.uri);
    const position = params.position;
    const range: Range = {
      // TODO Nacho: We are parsing from the begining of the file.
      // Do we need to parse from the begining of the current query?
      start: Position.create(0, 0),
      end: position,
    };
    const wholeFileText: string = d?.getText(range).trim() ?? '';
    const argOffset = wholeFileText.endsWith(',') ? 0 : -1;
    const text = wholeFileText.replace(/,$/, '') + ')';
    const inputStream = CharStreams.fromString(text);
    const lexer = new CypherLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const wholeFileParser = new CypherParser(tokenStream);

    // Block to update cached labels, procedure names, etc
    updateProcedureNames();

    const procedureNameDetector = new CallProcedureDetector();
    wholeFileParser.addParseListener(
      procedureNameDetector as ParseTreeListener,
    );

    // FIXME: half parsed arguments
    // CALL method([1,2
    const tree = wholeFileParser.oC_Cypher();

    const numProcedureArgs = procedureNameDetector.numProcedureArgs;

    const signatureHelp: SignatureHelp = {
      signatures: [
        SignatureInformation.create(
          'apoc.coll.zipToRows',
          '',
          ParameterInformation.create('list1', 'list1 :: LIST? OF ANY?'),
          ParameterInformation.create('list2', 'list2 :: LIST? OF ANY?'),
        ),
      ],
      activeSignature: 0,
      activeParameter: numProcedureArgs + argOffset,
    };

    return signatureHelp;
  };
}
