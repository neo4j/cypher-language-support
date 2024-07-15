import {
  isDate,
  isDateTime,
  isDuration,
  isInt,
  isLocalDateTime,
  isLocalTime,
  isTime,
  QueryResult,
} from 'neo4j-driver';

export function querySummary(result: QueryResult): string[] {
  const rows = result.records.length;
  const counters = result.summary.counters;
  const output: string[] = [];

  // Streamed
  if (rows > 0) {
    // Started streaming 1 records after 5 ms and completed after 10  ms.
    output.push(
      `Started streaming ${rows} record${
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

/**
 * Convert Neo4j Properties back into JavaScript types
 *
 * @param {Record<string, any>} properties
 * @return {Record<string, any>}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toNativeTypes(properties: Record<string, any>) {
  return Object.fromEntries(
    Object.keys(properties).map((key) => {
      const value = valueToNativeType(properties[key]);

      return [key, value];
    }),
  );
}

/**
 * Convert an individual value to its JavaScript equivalent
 *
 * @param {any} value
 * @returns {any}
 */
function valueToNativeType(value: unknown) {
  if (Array.isArray(value)) {
    value = value.map((innerValue) => valueToNativeType(innerValue));
  } else if (isInt(value)) {
    value = value.toNumber();
  } else if (
    isDate(value) ||
    isDateTime(value) ||
    isTime(value) ||
    isLocalDateTime(value) ||
    isLocalTime(value) ||
    isDuration(value)
  ) {
    value = value.toString();
  } else if (
    typeof value === 'object' &&
    value !== undefined &&
    value !== null
  ) {
    value = toNativeTypes(value);
  }

  return value;
}

export function getErrorContent(err: Error): string {
  return `
    <details class="error">
      <summary style="color:red">Error: ${err.message}</summary>
      <pre>${err.stack}</pre>
    </details>
  `;
}

export function setAllTabsToLoading(script: string): string {
  return `
    <html>
      <head>
      <script>
        const vscode = acquireVsCodeApi();
      </script>
      <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
      <style>
      :root {
        --background: #f2f2f2;
        --border: #ccc;
        --text: #000;
        --error: #ff0000;
      }

      @media (prefers-color-scheme: dark) {
        --background: transparent;
        --border: #ddd;
        --text: #ccc;
        --error: #bbb;
      }

      table{border-collapse:collapse; width: 100%}
      table,td,th{border:1px solid var(--border); padding:5px; vertical-align: top}
      th {font-weight: bold}
      details {margin-bottom: 24px; padding: 12px; border: 1px solid var(--border)}
      details summary {border-bottom: 1px solid var(--border); padding: 6px}
      pre {
        max-height: 280px;
        overflow: auto;
      }

      .error {
        color: var(--border);
        border-color: var(--border);
      }
      </style>
      </head>
      <body>
          <div id="resultDiv"></div> 
          <script src="${script}"></script>
      </body>
      </html>
    `;
}
