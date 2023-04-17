import {
  ParameterInformation,
  SignatureInformation,
} from 'vscode-languageserver-types';

import { auth, driver, Driver, Session, session } from 'neo4j-driver';

export interface DbInfo {
  procedureSignatures: Map<string, SignatureInformation>;
  functionSignatures: Map<string, SignatureInformation>;
  labels: string[];
  relationshipTypes: string[];
}

export class DbInfoImpl implements DbInfo {
  public procedureSignatures: Map<string, SignatureInformation> = new Map();
  public functionSignatures: Map<string, SignatureInformation> = new Map();
  public labels: string[] = [];
  public relationshipTypes: string[] = [];

  private dbPollingInterval: NodeJS.Timer | undefined;

  private neo4j: Driver | undefined;

  public setConfig({
    url,
    user,
    password,
  }: {
    url: string;
    user: string;
    password: string;
  }): void {
    if (this.neo4j) {
      void this.neo4j.close();
    }
    this.neo4j = driver(url, auth.basic(user, password));
  }

  public stopPolling(): void {
    clearInterval(this.dbPollingInterval);
    this.dbPollingInterval = undefined;
  }

  public async startSignaturesPolling() {
    this.stopPolling();

    if (!this.neo4j) return;
    // We do not need to update procedures and functions because they are cached
    const updateLabelsAndTypes = async () => {
      await this.updateLabels();
      await this.updateRelationshipTypes();
    };

    await this.updateMethodsCache(this.procedureSignatures);
    await this.updateMethodsCache(this.functionSignatures);
    await updateLabelsAndTypes();

    this.dbPollingInterval = setInterval(
      () => void updateLabelsAndTypes(),
      20000,
    );
    return;
  }

  private getParamsInfo = (param: string) => {
    // FIXME: There are cases where this doesn't work:
    // paramslabels :: LIST? OF STRING?,groupByProperties :: LIST? OF STRING?,aggregations = [{*=count},{*=count}] :: LIST? OF MAP?,config = {} :: MAP?
    const [headerInfo] = param.split(' :: ');
    const [paramName] = headerInfo.split(' = ');

    return ParameterInformation.create(paramName, param);
  };

  private async updateLabels() {
    if (!this.neo4j) return;
    const s: Session = this.neo4j.session({ defaultAccessMode: session.WRITE });

    try {
      const result = await s.run('CALL db.labels()');
      this.labels = result.records.map(
        (record) => record.get('label') as string,
      );
    } catch (error) {
      console.log('could not contact the database to fetch labels');
    } finally {
      await s.close();
    }
  }

  private async updateRelationshipTypes() {
    if (!this.neo4j) return;
    const s: Session = this.neo4j.session({ defaultAccessMode: session.WRITE });

    try {
      const result = await s.run('CALL db.relationshipTypes()');
      this.relationshipTypes = result.records.map(
        (record) => record.get('relationshipType') as string,
      );
    } catch (error) {
      console.log('could not contact the database to fetch relationship types');
    } finally {
      await s.close();
    }
  }

  private async updateMethodsCache(cache: Map<string, SignatureInformation>) {
    if (!this.neo4j) return;
    const s: Session = this.neo4j.session({ defaultAccessMode: session.WRITE });
    const updateTarget =
      cache === this.functionSignatures ? 'functions' : 'procedures';

    try {
      const result = await s.run(
        'SHOW ' + updateTarget + ' yield name, signature, description;',
      );

      result.records.map((record) => {
        const methodName = record.get('name') as string;
        const signature = record.get('signature') as string;
        const description = record.get('description') as string;

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
      console.log('could not contact the database to fetch ' + updateTarget);
    } finally {
      await s.close();
    }
  }
}
