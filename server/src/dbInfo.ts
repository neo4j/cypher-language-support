import {
  ParameterInformation,
  SignatureInformation,
} from 'vscode-languageserver/node';

import { auth, driver, Driver, Session, session } from 'neo4j-driver';

export interface DbInfo {
  procedureSignatures: Map<string, SignatureInformation>;
  functionSignatures: Map<string, SignatureInformation>;
  labels: string[];
  relationshipTypes: string[];
}

export class DbInfoImpl implements DbInfo {
  procedureSignatures: Map<string, SignatureInformation> = new Map();
  functionSignatures: Map<string, SignatureInformation> = new Map();
  labels: string[] = [];
  relationshipTypes: string[] = [];

  private neo4j: Driver = driver(
    'neo4j://localhost',
    // TODO Nacho This is hardcoded
    auth.basic('neo4j', 'pass12345'),
  );

  constructor() {
    // We do not need to update procedures and functions because they are cached
    const updateLabelsAndTypes = () => {
      this.updateLabels();
      this.updateRelationshipTypes();
    };

    this.updateProceduresCache();
    this.updateFunctionsCache();
    updateLabelsAndTypes();
    setInterval(updateLabelsAndTypes, 20000);
  }

  private getParamsInfo(param: string): ParameterInformation {
    // FIXME: There are cases where this doesn't work:
    // paramslabels :: LIST? OF STRING?,groupByProperties :: LIST? OF STRING?,aggregations = [{*=count},{*=count}] :: LIST? OF MAP?,config = {} :: MAP?
    const [headerInfo] = param.split(' :: ');
    const [paramName] = headerInfo.split(' = ');

    return ParameterInformation.create(paramName, param);
  }

  private async updateLabels() {
    const s: Session = this.neo4j.session({ defaultAccessMode: session.WRITE });

    try {
      const result = await s.run('CALL db.labels()');
      this.labels = result.records.map((record) => record.get('label'));
    } catch (error) {
      console.log('coult not contact the database to fetch labels');
    } finally {
      await s.close();
    }
  }

  private async updateRelationshipTypes() {
    const s: Session = this.neo4j.session({ defaultAccessMode: session.WRITE });

    try {
      const result = await s.run('CALL db.relationshipTypes()');
      this.relationshipTypes = result.records.map((record) =>
        record.get('relationshipType'),
      );
    } catch (error) {
      console.log('coult not contact the database to fetch relationship types');
    } finally {
      await s.close();
    }
  }

  private updateProceduresCache() {
    this.updateMethodsCache(this.procedureSignatures);
  }

  private updateFunctionsCache() {
    this.updateMethodsCache(this.functionSignatures);
  }

  private async updateMethodsCache(cache: Map<string, SignatureInformation>) {
    const s: Session = this.neo4j.session({ defaultAccessMode: session.WRITE });
    const updateTarget =
      cache === this.functionSignatures ? 'functions' : 'procedures';

    try {
      const result = await s.run(
        'SHOW ' + updateTarget + ' yield name, signature, description;',
      );

      result.records.map((record) => {
        const methodName = record.get('name');
        const signature = record.get('signature');
        const description = record.get('description');

        const [header] = signature.split(') :: ');
        const paramsString = header
          .replace(methodName, '')
          .replace('(', '')
          .replace(')', '')
          .trim();

        const params: string[] =
          paramsString.length > 0 ? paramsString.split(', ') : [];

        cache.set(
          methodName,
          SignatureInformation.create(
            methodName,
            description,
            ...params.map(this.getParamsInfo),
          ),
        );
      });
    } catch (error) {
      console.log('coult not contact the database to fetch ' + updateTarget);
    } finally {
      await s.close();
    }
  }
}
