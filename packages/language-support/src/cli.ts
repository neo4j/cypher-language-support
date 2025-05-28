#!/usr/bin/env node

import { formatQuery } from './index.js';

function main() {
  const testQuery = `match (n) return n`;
  // eslint-disable-next-line no-console
  console.log(formatQuery(testQuery).formattedQuery);
}

main();
