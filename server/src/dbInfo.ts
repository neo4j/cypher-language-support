import {
  ParameterInformation,
  SignatureInformation,
} from 'vscode-languageserver/node';

import { auth, driver, session } from 'neo4j-driver';

export class DbInfo {
  procedureSignatures: Map<string, SignatureInformation> = new Map();
  labels: string[] = [];

  private neo4j = driver(
    'neo4j://localhost',
    // TODO Nacho This is hardcoded
    auth.basic('neo4j', 'pass12345'),
  );

  constructor() {
    setInterval(() => this.updateProcedureCache(), 10000);
    setInterval(() => this.updateLabels(), 10000);
  }

  getParamsInfo(param: string): ParameterInformation {
    // FIXME: There are cases where this doesn't work:
    // paramslabels :: LIST? OF STRING?,groupByProperties :: LIST? OF STRING?,aggregations = [{*=count},{*=count}] :: LIST? OF MAP?,config = {} :: MAP?
    const [headerInfo, paramType] = param.split(' :: ');
    const [paramName, defaultValue] = headerInfo.split(' = ');

    return ParameterInformation.create(paramName, param);
  }

  private updateLabels() {
    const s = this.neo4j.session({ defaultAccessMode: session.WRITE });
    const tx = s.beginTransaction();
    // Nacho FIXME Do we have to close the transaction?
    const resultPromise = tx.run('CALL db.labels()');

    resultPromise.then((result) => {
      this.labels = result.records.map((record) => record.get('label'));
    });
  }

  private updateProcedureCache() {
    const s = this.neo4j.session({ defaultAccessMode: session.WRITE });
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

        this.procedureSignatures.set(
          procedureName,
          SignatureInformation.create(
            procedureName,
            description,
            ...params.map(this.getParamsInfo),
          ),
        );
      });
    });
  }
}
