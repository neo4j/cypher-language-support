import { verifyFormatting } from './testutil';

describe('tests for create constraint', () => {
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

  test('basic create with "is typed"', () => {
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
});
