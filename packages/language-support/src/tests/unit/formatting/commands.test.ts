import { verifyFormatting } from './testutil.js';

describe('tests for commands', () => {
  test('basic create constraint is unique', () => {
    const query = `create constraint for (a: Athlete) require a.id is unique`;
    const expected = `CREATE CONSTRAINT
FOR (a:Athlete)
REQUIRE a.id IS UNIQUE`;
    verifyFormatting(query, expected);
  });

  test('basic create constraint with "::"', () => {
    const query = `create constraint for (a: Athlete) require a.id :: int`;
    const expected = `CREATE CONSTRAINT
FOR (a:Athlete)
REQUIRE a.id :: INT`;
    verifyFormatting(query, expected);
  });

  test('basic create constraint with "is typed"', () => {
    const query = `create constraint for (a: Athlete) require a.id is typed int`;
    const expected = `CREATE CONSTRAINT
FOR (a:Athlete)
REQUIRE a.id IS TYPED INT`;
    verifyFormatting(query, expected);
  });

  test('basic create constraint with key', () => {
    const query = `create constraint for (a: Athlete) require a.id is key`;
    const expected = `CREATE CONSTRAINT
FOR (a:Athlete)
REQUIRE a.id IS KEY`;
    verifyFormatting(query, expected);
  });

  test('basic create constraint with not null', () => {
    const query = `create constraint for (a: Athlete) require a.id is not null`;
    const expected = `CREATE CONSTRAINT
FOR (a:Athlete)
REQUIRE a.id IS NOT NULL`;
    verifyFormatting(query, expected);
  });

  test('basic create index for on', () => {
    const query = `create index index_name for (a: Athlete) on (a.id)`;
    const expected = `CREATE INDEX index_name
FOR (a:Athlete)
ON (a.id)`;
    verifyFormatting(query, expected);
  });

  test('create index with command rel pattern', () => {
    const query = `create index relationship_index for ()-[rel:FRIENDS_WITH]-() on (rel.since, rel.status)`;
    const expected = `CREATE INDEX relationship_index
FOR ()-[rel:FRIENDS_WITH]-()
ON (rel.since, rel.status)`;
    verifyFormatting(query, expected);
  });

  test('create index on relationship with options', () => {
    const query = `create index index_name for ()-[r:RELATIONTYPE]-() on (r.since) options { indexProvider: 'range-1.0' }`;
    const expected = `
CREATE INDEX index_name
FOR ()-[r:RELATIONTYPE]-()
ON (r.since)
OPTIONS {indexProvider: 'range-1.0'}`.trimStart();
    verifyFormatting(query, expected);
  });

  test('create constraint with options', () => {
    const query = `create constraint for (a: Athlete) require a.id is unique options { constraintName: 'Athlete_Id_Unique' }`;
    const expected = `
CREATE CONSTRAINT
FOR (a:Athlete)
REQUIRE a.id IS UNIQUE
OPTIONS {constraintName: 'Athlete_Id_Unique'}`.trimStart();
    verifyFormatting(query, expected);
  });

  test('create constraint with multiple options', () => {
    const query = `create constraint for (a: Athlete) require a.id is unique options { constraintName: 'Athlete_Id_Unique', enforced: true }`;
    const expected = `
CREATE CONSTRAINT
FOR (a:Athlete)
REQUIRE a.id IS UNIQUE
OPTIONS {constraintName: 'Athlete_Id_Unique', enforced: true}`.trimStart();
    verifyFormatting(query, expected);
  });

  test('create fulltext index', () => {
    const query = `create fulltext index index_name for (a: Athlete) on each [a.name]`;
    const expected = `
CREATE FULLTEXT INDEX index_name
FOR (a:Athlete)
ON EACH [a.name]`.trimStart();
    verifyFormatting(query, expected);
  });

  test('create fulltext index with multiple bars', () => {
    const query = `create fulltext index index_name for (a: Athlete|CouchPotato|Olympian) on each [a.name]`;
    const expected = `
CREATE FULLTEXT INDEX index_name
FOR (a:Athlete|CouchPotato|Olympian)
ON EACH [a.name]`.trimStart();
    verifyFormatting(query, expected);
  });

  test('should not break after options', () => {
    const query = `CREATE CONSTRAINT aaaaaa FOR ( aaaaaa : aaaaaa ) REQUIRE ( aaaaaa . aaaaaa ) IS UNIQUE OPTIONS { aaaaaa : "20z9vakp" , aaaaaa : { aaaaaa : [ "aotV0uiw" , "SCxu0Vyn" , "ekTx6ngu" ] , aaaaaa : [ "WqAr9IvS" , "j5fYJwuN" ] , aaaaaa : [ "HUDXLCRN" , "LUfKWGc7" ] , aaaaaa : [ "qbk3JzMe" , "Ca4n1Ea9" , "I96Uwq16" ] , aaaaaa : [ "zcBcWjoJ" , "dz78begI" ] , aaaaaa : [ "MIADLwls" , "qkacQgzY" , "wYYAgiGo" ] , aaaaaa : [ "Jmw0tXjZ" , "ALiXrHno" , "QRYTGYFd" ] , aaaaaa : [ "EEJJKZGC" , "GGDt2msc" ] } }`;
    const expected = `CREATE CONSTRAINT aaaaaa
FOR (aaaaaa:aaaaaa)
REQUIRE (aaaaaa.aaaaaa) IS UNIQUE
OPTIONS {
  aaaaaa: "20z9vakp",
  aaaaaa: {
    aaaaaa: ["aotV0uiw", "SCxu0Vyn", "ekTx6ngu"],
    aaaaaa: ["WqAr9IvS", "j5fYJwuN"],
    aaaaaa: ["HUDXLCRN", "LUfKWGc7"],
    aaaaaa: ["qbk3JzMe", "Ca4n1Ea9", "I96Uwq16"],
    aaaaaa: ["zcBcWjoJ", "dz78begI"],
    aaaaaa: ["MIADLwls", "qkacQgzY", "wYYAgiGo"],
    aaaaaa: ["Jmw0tXjZ", "ALiXrHno", "QRYTGYFd"],
    aaaaaa: ["EEJJKZGC", "GGDt2msc"]
  }
}`;
    verifyFormatting(query, expected);
  });

  test('show indexes with where and return', () => {
    const query = `SHOW INDEXES
YIELD aaaaaa, aaaaaa, aaaaaa, aaaaaa, aaaaaa
WHERE aaaaaa = "wjL0ojNI" RETURN aaaaaa, aaaaaa, aaaaaa, aaaaaa`;
    const expected = `SHOW INDEXES
YIELD aaaaaa, aaaaaa, aaaaaa, aaaaaa, aaaaaa
WHERE aaaaaa = "wjL0ojNI"
RETURN aaaaaa, aaaaaa, aaaaaa, aaaaaa`;
    verifyFormatting(query, expected);
  });

  test('show indexes with just a where clause', () => {
    const query = `SHOW INDEXES WHERE aaaaaa = "wjL0ojNI"`;
    const expected = `SHOW INDEXES
WHERE aaaaaa = "wjL0ojNI"`;
    verifyFormatting(query, expected);
  });

  test('alter graph type - node', () => {
    const query = `Alter current graph type SET { (:Person => :Resident {name :: STRING NOT NULL}),(:Pet => :Resident&Animal {healthCertificate :: STRING, name :: STRING})}`;
    const expected = `ALTER CURRENT GRAPH TYPE SET {
  (:Person => :Resident {name :: STRING NOT NULL}),
  (:Pet => :Resident&Animal {healthCertificate :: STRING, name :: STRING})
}`;
    verifyFormatting(query, expected);
  });

  test('alter graph type - node v2', () => {
    const query = `Alter current graph type SET { (:Person => {name :: STRING NOT NULL}),(a:Pet => :Resident&Animal {healthCertificate :: STRING, name :: STRING})}`;
    const expected = `ALTER CURRENT GRAPH TYPE SET {
  (:Person => {name :: STRING NOT NULL}),
  (a:Pet => :Resident&Animal {healthCertificate :: STRING, name :: STRING})
}`;
    verifyFormatting(query, expected);
  });

  test('alter graph type - rel', () => {
    const query = `ALTER CURRENT GRAPH TYPE SET {(a:Resident)-[R:LIVES_IN => { since :: DATE NOT NULL}]->(:City)
}`;
    const expected = `ALTER CURRENT GRAPH TYPE SET {
  (a:Resident)-[R:LIVES_IN => {since :: DATE NOT NULL}]->(:City)
}`;
    verifyFormatting(query, expected);
  });

  test('alter graph type - constraint', () => {
    const query = `ALTER CURRENT GRAPH TYPE SET {  CONSTRAINT company_name FOR (c:Company) REQUIRE c.name IS KEY, CONSTRAINT animal_id FOR (a:Animal) REQUIRE a.id IS UNIQUE
}`;
    const expected = `ALTER CURRENT GRAPH TYPE SET {
  CONSTRAINT company_name FOR (c:Company)
  REQUIRE c.name IS KEY,
  CONSTRAINT animal_id FOR (a:Animal)
  REQUIRE a.id IS UNIQUE
}`;
    verifyFormatting(query, expected);
  });
});

describe('tests for vector index commands', () => {
  test('create vector index', () => {
    const query = `create vector index myIndex for (n: Label) on (n.embedding) options { indexProvider: 'vector-2.0' }`;
    const expected = `CREATE VECTOR INDEX myIndex
FOR (n:Label)
ON (n.embedding)
OPTIONS {indexProvider: 'vector-2.0'}`;
    verifyFormatting(query, expected);
  });

  test('create vector index if not exists', () => {
    const query = `create vector index myIndex if not exists for (n: Label) on (n.embedding)`;
    const expected = `CREATE VECTOR INDEX myIndex IF NOT EXISTS
FOR (n:Label)
ON (n.embedding)`;
    verifyFormatting(query, expected);
  });

  test('create vector index with options', () => {
    const query = `create vector index myIndex for (n: Label) on (n.embedding) options { indexProvider: 'vector-2.0' , dimensions: 256 }`;
    const expected = `CREATE VECTOR INDEX myIndex
FOR (n:Label)
ON (n.embedding)
OPTIONS {indexProvider: 'vector-2.0', dimensions: 256}`;
    verifyFormatting(query, expected);
  });
});

describe('tests for auth rule commands', () => {
  test('create auth rule', () => {
    const query = `create auth rule myRule set condition 1 = 1 set enabled true`;
    const expected = `CREATE AUTH RULE myRule
  SET CONDITION 1 = 1
  SET ENABLED TRUE`;
    verifyFormatting(query, expected);
  });

  test('alter auth rule', () => {
    const query = `alter auth rule myRule if exists set enabled false`;
    const expected = `ALTER AUTH RULE myRule IF EXISTS
  SET ENABLED FALSE`;
    verifyFormatting(query, expected);
  });

  test('rename auth rule', () => {
    const query = `rename auth rule myRule if exists to yourRule`;
    const expected = `RENAME AUTH RULE myRule IF EXISTS TO yourRule`;
    verifyFormatting(query, expected);
  });

  test('show auth rule', () => {
    const query = `show auth rule as commands yield name`;
    const expected = `SHOW AUTH RULE AS COMMANDS
YIELD name`;
    verifyFormatting(query, expected);
  });
});

describe('tests for create alias/create database', () => {
  test('create alias with additional info', () => {
    const query = `create  alias \`northwind-2022\` for database \`northwind-graph-2022\` at "neo4j+s://location:7687" properties {newestNorthwind:true,index:3}`;
    const expected = `CREATE ALIAS \`northwind-2022\`
FOR DATABASE \`northwind-graph-2022\`
AT "neo4j+s://location:7687"
PROPERTIES {newestNorthwind: true, index: 3}`;
    verifyFormatting(query, expected);
  });

  test('create database with additional info', () => {
    const query = `create  database neo4j if not exists set default language cypher 25 options {txLogEnrichment:Full} wait 500 sec`;
    const expected = `CREATE DATABASE neo4j IF NOT EXISTS
SET DEFAULT LANGUAGE CYPHER 25
OPTIONS {txLogEnrichment: Full}
WAIT 500 SEC`;
    verifyFormatting(query, expected);
  });
});

describe('tests for explicit newlines in commands', () => {
  test('two indexes with explicit newline inbetween', () => {
    const query = `
CREATE FULLTEXT INDEX index_name FOR (a:Athlete) ON EACH [a.name];

CREATE FULLTEXT INDEX index_name FOR (a:Athlete) ON EACH [a.id];`;
    const expected = `
CREATE FULLTEXT INDEX index_name
FOR (a:Athlete)
ON EACH [a.name];

CREATE FULLTEXT INDEX index_name
FOR (a:Athlete)
ON EACH [a.id];`.trimStart();
    verifyFormatting(query, expected);
  });

  test('two constraints with comments', () => {
    const query = `CREATE CONSTRAINT FOR (a:Athlete) REQUIRE a.id IS UNIQUE

// This is a comment and there is an explicit newline
OPTIONS {constraintName: 'Athlete_Id_Unique'}`;
    const expected = `CREATE CONSTRAINT
FOR (a:Athlete)
REQUIRE a.id IS UNIQUE

// This is a comment and there is an explicit newline
OPTIONS {constraintName: 'Athlete_Id_Unique'}`;
    verifyFormatting(query, expected);
  });

  test('OPTION should be able to have nice map print', () => {
    const query =
      "CREATE DATABASE testdb OPTIONS {existingData: 'use', seedURI:'s3://bucketpath', seedConfig: 'region=eu-west-1', seedCredentials: 'foo;bar'};";
    const expected = `CREATE DATABASE testdb
OPTIONS {
  existingData: 'use',
  seedURI: 's3://bucketpath',
  seedConfig: 'region=eu-west-1',
  seedCredentials: 'foo;bar'
};`;
    verifyFormatting(query, expected);
  });
});

describe('tests for secret commands', () => {
  test('drop secret', () => {
    const query = `drop secret mySecret if exists`;
    const expected = `DROP SECRET mySecret IF EXISTS`;
    verifyFormatting(query, expected);
  });

  test('secret privileges', () => {
    const query = `grant access secret * on dbms to myRole;
grant access secret mySecret on dbms to myRole;
grant create secret on dbms to myRole;
deny drop secret on dbms to myRole;
grant write external secret on dbms to myRole;
revoke external secret management on dbms from myRole;
grant secret management on dbms to myRole;
grant show secret on dbms to myRole;
grant show external secret on dbms to myRole;`;
    const expected = `GRANT ACCESS SECRET * ON DBMS TO myRole;
GRANT ACCESS SECRET mySecret ON DBMS TO myRole;
GRANT CREATE SECRET ON DBMS TO myRole;
DENY DROP SECRET ON DBMS TO myRole;
GRANT WRITE EXTERNAL SECRET ON DBMS TO myRole;
REVOKE EXTERNAL SECRET MANAGEMENT ON DBMS FROM myRole;
GRANT SECRET MANAGEMENT ON DBMS TO myRole;
GRANT SHOW SECRET ON DBMS TO myRole;
GRANT SHOW EXTERNAL SECRET ON DBMS TO myRole;`;
    verifyFormatting(query, expected);
  });

  test('create secret with multiple set clauses', () => {
    const query = `create secret myVeryLongSecretName if not exists of type amazonWebServicesSecretsManager set accessKeyIdentifier $accessKeyParameter set secretAccessKey from external secret "arn:aws:secretsmanager:eu-west-1:123456789:secret:mySecret"`;
    const expected = `CREATE SECRET myVeryLongSecretName IF NOT EXISTS
OF TYPE amazonWebServicesSecretsManager
SET accessKeyIdentifier $accessKeyParameter
SET secretAccessKey FROM EXTERNAL SECRET "arn:aws:secretsmanager:eu-west-1:123456789:secret:mySecret"`;
    verifyFormatting(query, expected);
  });
});

describe('tests for virtual graph database commands', () => {
  test('create virtual graph database with map mapping', () => {
    const query = `create virtual graph database myGraph datasource {type: 'jdbc'} secret mySecret mapping {nodes: []}`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE myGraph
DATASOURCE {type: 'jdbc'}
SECRET mySecret
MAPPING {nodes: []}`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with set prefixes, options and wait', () => {
    const query = `create virtual graph database myGraph if not exists set datasource $ds set secret mySecret set mapping $mapping set default language cypher 25 options {foo: 1} wait`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE myGraph IF NOT EXISTS
SET DATASOURCE $ds
SET SECRET mySecret
SET MAPPING $mapping
SET DEFAULT LANGUAGE CYPHER 25
OPTIONS {foo: 1}
WAIT`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with property tables', () => {
    const query = `create virtual graph database myGraph datasource {type: 'jdbc'} secret mySecret mapping node tables (persons key (id) label Person properties are all columns except (password), movies as m label Movie no properties) edge tables (acted_in source key (person_id) references persons destination key (movie_id) references movies (id) label ACTED_IN properties (role as character, year))`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE myGraph
DATASOURCE {type: 'jdbc'}
SECRET mySecret
MAPPING
NODE TABLES (
  persons KEY (id) LABEL Person PROPERTIES ARE ALL COLUMNS EXCEPT (password),
  movies AS m LABEL Movie NO PROPERTIES
)
EDGE TABLES (
  acted_in
    SOURCE KEY (person_id) REFERENCES persons
    DESTINATION KEY (movie_id) REFERENCES movies (id)
    LABEL ACTED_IN PROPERTIES (role AS character, year)
)`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with qualified table names and synonyms', () => {
    const query = `create virtual graph database myGraph datasource {type: 'jdbc'} secret mySecret mapping vertex tables (db.schema.persons default label properties all columns) relationship tables (knows key (a, b) source key (a) references db.schema.persons destination key (b) references db.schema.persons label KNOWS label FRIEND no properties)`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE myGraph
DATASOURCE {type: 'jdbc'}
SECRET mySecret
MAPPING
VERTEX TABLES (
  db.schema.persons DEFAULT LABEL PROPERTIES ALL COLUMNS
)
RELATIONSHIP TABLES (
  knows
    KEY (a, b)
    SOURCE KEY (a) REFERENCES db.schema.persons
    DESTINATION KEY (b) REFERENCES db.schema.persons
    LABEL KNOWS LABEL FRIEND NO PROPERTIES
)`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with long label list', () => {
    const query = `create virtual graph database a datasource $d secret s mapping node tables (persons key (id) label Person label Actor label Director label Producer label Writer label Human properties are all columns)`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE a
DATASOURCE $d
SECRET s
MAPPING
NODE TABLES (
  persons
    KEY (id)
    LABEL Person
    LABEL Actor
    LABEL Director
    LABEL Producer
    LABEL Writer
    LABEL Human PROPERTIES ARE ALL COLUMNS
)`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with long derived property list', () => {
    const query = `create virtual graph database a datasource $d secret s mapping node tables (persons properties (firstName as first, lastName as last, dateOfBirth as born, placeOfBirth as birthplace))`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE a
DATASOURCE $d
SECRET s
MAPPING
NODE TABLES (
  persons
    PROPERTIES (
      firstName AS first,
      lastName AS last,
      dateOfBirth AS born,
      placeOfBirth AS birthplace
    )
)`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with long key column list', () => {
    const query = `create virtual graph database a datasource $d secret s mapping node tables (persons key (aVeryLongColumnName, anotherVeryLongColumnName, yetAnotherVeryLongColumnName) no properties)`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE a
DATASOURCE $d
SECRET s
MAPPING
NODE TABLES (
  persons
    KEY (
      aVeryLongColumnName,
      anotherVeryLongColumnName,
      yetAnotherVeryLongColumnName
    )
    NO PROPERTIES
)`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with long label properties and except list', () => {
    const query = `create virtual graph database a datasource $d secret s mapping node tables (persons label Person properties are all columns except (passwordHash, socialSecurityNumber, creditCardNumber))`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE a
DATASOURCE $d
SECRET s
MAPPING
NODE TABLES (
  persons
    LABEL Person
      PROPERTIES ARE ALL COLUMNS EXCEPT (
        passwordHash,
        socialSecurityNumber,
        creditCardNumber
      )
)`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with long source key', () => {
    const query = `create virtual graph database a datasource $d secret s mapping node tables (p) edge tables (knows source key (personIdentifierA, personIdentifierB) references persons_with_long_name (identifierA, identifierB) destination key (b) references p)`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE a
DATASOURCE $d
SECRET s
MAPPING
NODE TABLES (
  p
)
EDGE TABLES (
  knows
    SOURCE KEY (personIdentifierA, personIdentifierB)
      REFERENCES persons_with_long_name (identifierA, identifierB)
    DESTINATION KEY (b) REFERENCES p
)`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with long datasource map', () => {
    const query = `create virtual graph database a datasource {type: 'jdbc', url: 'jdbc:postgresql://some.very.long.host.example.com:5432/db', user: 'me'} secret s mapping $m`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE a
DATASOURCE {
  type: 'jdbc',
  url: 'jdbc:postgresql://some.very.long.host.example.com:5432/db',
  user: 'me'
}
SECRET s
MAPPING $m`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with long SET datasource map', () => {
    const query = `create virtual graph database a set datasource {type: 'jdbc', url: 'jdbc:postgresql://some.very.long.host.example.com:5432/db'} set secret s set mapping $m`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE a
SET DATASOURCE {
  type: 'jdbc',
  url: 'jdbc:postgresql://some.very.long.host.example.com:5432/db'
}
SET SECRET s
SET MAPPING $m`;
    verifyFormatting(query, expected);
  });

  test('create virtual graph database with long mapping map', () => {
    const query = `create virtual graph database a datasource $d secret s mapping {nodes: [{table: 'persons', label: 'Person'}, {table: 'movies', label: 'Movie'}], edges: []}`;
    const expected = `CREATE VIRTUAL GRAPH DATABASE a
DATASOURCE $d
SECRET s
MAPPING {
  nodes: [
    {table: 'persons', label: 'Person'},
    {table: 'movies', label: 'Movie'}
  ],
  edges: []
}`;
    verifyFormatting(query, expected);
  });
});
