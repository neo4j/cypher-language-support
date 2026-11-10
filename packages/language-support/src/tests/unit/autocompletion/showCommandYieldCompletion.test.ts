import { CompletionItemKind } from 'vscode-languageserver-types';
import type { DbSchema } from '../../../dbSchema.js';
import { testCompletions } from './completionAssertionHelpers.js';

const dbSchema: DbSchema = {
  yieldFields: {
    constraints: [
      'id',
      'name',
      'type',
      'entityType',
      'labelsOrTypes',
      'properties',
      'enforced',
      'classification',
      'ownedIndex',
      'propertyType',
      'options',
      'createStatement',
    ],
    users: ['user', 'roles', 'passwordChangeRequired', 'suspended', 'home'],
    roles: ['role'],
    databases: [
      'name',
      'type',
      'aliases',
      'access',
      'address',
      'currentStatus',
      'home',
      'default',
    ],
  },
};

const variable = (label: string) => ({
  label,
  kind: CompletionItemKind.Variable,
});

describe('Can complete SHOW CONSTRAINTS YIELD', () => {
  test('Can suggest all yield-able values', () => {
    testCompletions({
      query: 'SHOW CONSTRAINTS YIELD ',
      dbSchema,
      expected: dbSchema.yieldFields.constraints.map(variable),
    });
  });

  test('Suggests yield-able columns that fit started word', () => {
    testCompletions({
      query: 'SHOW CONSTRAINTS YIELD prop',
      dbSchema,
      expected: [variable('properties'), variable('propertyType')],
    });
  });

  test('Suggests only yield-able columns that are not already used', () => {
    testCompletions({
      query: 'SHOW CONSTRAINTS YIELD properties, prop',
      dbSchema,
      expected: [variable('propertyType')],
      excluded: [variable('properties')],
    });
  });
});

describe('Can complete SHOW USERS YIELD', () => {
  test('Can suggest all yield-able values', () => {
    testCompletions({
      query: 'SHOW USERS YIELD ',
      dbSchema,
      expected: dbSchema.yieldFields.users.map(variable),
    });
  });

  test('Suggests yield-able columns for the singular keyword', () => {
    testCompletions({
      query: 'SHOW USER YIELD ',
      dbSchema,
      expected: dbSchema.yieldFields.users.map(variable),
    });
  });

  test('Suggests only yield-able columns that are not already used', () => {
    testCompletions({
      query: 'SHOW USERS YIELD roles, user, ',
      dbSchema,
      expected: [
        variable('passwordChangeRequired'),
        variable('suspended'),
        variable('home'),
      ],
      excluded: [variable('roles'), variable('user')],
    });
  });

  test('Does not suggest columns of other SHOW commands', () => {
    testCompletions({
      query: 'SHOW USERS YIELD ',
      dbSchema,
      excluded: [variable('role'), variable('labelsOrTypes')],
    });
  });
});

describe('Can complete SHOW ROLES YIELD', () => {
  test('Can suggest all yield-able values', () => {
    testCompletions({
      query: 'SHOW ROLES YIELD ',
      dbSchema,
      expected: [variable('role')],
      excluded: [variable('user'), variable('name')],
    });
  });

  test('Suggests yield-able columns with ALL and POPULATED', () => {
    testCompletions({
      query: 'SHOW ALL ROLES YIELD ',
      dbSchema,
      expected: [variable('role')],
    });
    testCompletions({
      query: 'SHOW POPULATED ROLES YIELD ',
      dbSchema,
      expected: [variable('role')],
    });
  });

  test('Does not suggest already yielded columns', () => {
    testCompletions({
      query: 'SHOW ROLES YIELD role, ',
      dbSchema,
      excluded: [variable('role')],
    });
  });
});

describe('Can complete SHOW DATABASES YIELD', () => {
  test('Can suggest all yield-able values', () => {
    testCompletions({
      query: 'SHOW DATABASES YIELD ',
      dbSchema,
      expected: dbSchema.yieldFields.databases.map(variable),
    });
  });

  test('Suggests yield-able columns for a specific database', () => {
    testCompletions({
      query: 'SHOW DATABASE neo4j YIELD ',
      dbSchema,
      expected: dbSchema.yieldFields.databases.map(variable),
    });
  });

  test('Suggests yield-able columns for the home and default database', () => {
    testCompletions({
      query: 'SHOW HOME DATABASE YIELD ',
      dbSchema,
      expected: dbSchema.yieldFields.databases.map(variable),
    });
    testCompletions({
      query: 'SHOW DEFAULT DATABASE YIELD ',
      dbSchema,
      expected: dbSchema.yieldFields.databases.map(variable),
    });
  });

  test('Suggests yield-able columns that fit started word', () => {
    testCompletions({
      query: 'SHOW DATABASES YIELD name, cur',
      dbSchema,
      expected: [variable('currentStatus')],
      excluded: [variable('name')],
    });
  });
});

describe('SHOW command YIELD completions without polled fields', () => {
  test('Suggests no columns when the fields are not in the schema', () => {
    testCompletions({
      query: 'SHOW USERS YIELD ',
      dbSchema: { yieldFields: { roles: ['role'] } },
      excluded: [variable('role')],
    });
    testCompletions({
      query: 'SHOW CONSTRAINTS YIELD ',
      dbSchema: {},
      excluded: [{ kind: CompletionItemKind.Variable }],
    });
  });

  test('Does not suggest polled columns for SHOW commands we do not poll', () => {
    testCompletions({
      query: 'SHOW INDEXES YIELD ',
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Variable }],
    });
  });
});
