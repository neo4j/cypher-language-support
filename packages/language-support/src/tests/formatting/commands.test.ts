import { verifyFormatting } from './testutil';

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
    const query = `SHOW INDEXES YIELD aaaaaa, aaaaaa, aaaaaa, aaaaaa, aaaaaa
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
