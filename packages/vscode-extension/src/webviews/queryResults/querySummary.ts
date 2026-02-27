import type { QueryResultWithLimit } from '@neo4j-cypher/query-tools';

export function querySummary(result: QueryResultWithLimit): string[] {
  const rows = result.records.length;
  const counters = result.summary.counters;
  const output: string[] = [];

  // Streamed
  if (rows > 0) {
    // Started streaming 1 records after 5 ms and completed after 10  ms.
    output.push(
      `${
        result.recordLimitHit
          ? `Fetch limit hit at ${result.records.length} records. `
          : ''
      }Started streaming ${rows} record${
        rows === 1 ? '' : 's'
      } after ${result.summary.resultConsumedAfter.toString()} ms and completed after ${result.summary.resultAvailableAfter.toString()}ms.`,
    );
  }

  if (counters.containsUpdates()) {
    const updates = [];

    const updateCounts = counters.updates();

    for (const key in updateCounts) {
      const count = updateCounts[key];
      if (count > 0) {
        const parts = key.split(/(?=[A-Z])/);
        updates.push(
          `${count} ${parts.map((value) => value.toLowerCase()).join(' ')}`,
        );
      }
    }

    if (updates.length > 0) {
      output.push(`${updates.join(', ')}.`);
    }
  }

  if (counters.containsSystemUpdates()) {
    output.push(`${counters.systemUpdates()} system updates.`);
  }

  return output;
}
