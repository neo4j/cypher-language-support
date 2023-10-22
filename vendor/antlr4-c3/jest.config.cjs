/*
 * This file is released under the MIT license.
 * Copyright (c) 2023 Mike Lischke
 *
 * See LICENSE file for more info.
 */

const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['dist', 'esm', 'out']
};

module.exports = config;
