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
import path from 'path';
import { Uri, Webview } from 'vscode';
import { getExtensionContext } from '../contextService';

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

export function getLoadingContent(cypher: string) {
  return wrapper(
    cypher,
    `
    <p>Running query, please wait...</p>
  `,
  );
}

export function getErrorContent(cypher: string, err: Error): string {
  return wrapper(
    cypher,
    `
    <details class="error">
      <summary style="color:red">Error: ${err.message}</summary>
      <pre>${err.stack}</pre>
    </details>
  `,
  );
}

export function getResultContent(
  cypher: string,
  res: QueryResult,
  webview: Webview,
) {
  // return wrapper(
  //   cypher,
  //   `
  //   ${renderTable(res)}

  //   <div class="summary">${querySummary(res)
  //     .map((str) => `<p>${str}</p>`)
  //     .join('\n')}</div>
  // `,
  // );

  const panelJsPath = Uri.file(
    path.join(
      getExtensionContext().extensionPath,
      'dist',
      'webviews',
      'webview.js',
    ),
  );

  const panelJsUri = webview.asWebviewUri(panelJsPath);
  return wrapper(
    cypher,
    `
      <div id="root"></div>
      <script src="${panelJsUri.toString()}"></script>
    `,
  );
}

function wrapper(cypher: string, content: string): string {
  return `
    <html>
      <head>
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
        <details>
          <summary>Query Details</summary>
          <pre>${cypher}</pre>
        </details>
        ${content}
      </body>
      </html>
    `;
}

function renderTable(res: QueryResult) {
  if (res.records.length === 0) {
    return `<p>No records returned</p>`;
  }

  return `
    <table>
      <thead>
      ${res.records[0].keys.map((key) => `<th>${key.toString()}</th>`).join('')}
      </thead>
      <tbody>
        ${res.records
          .map((record) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            renderRow(record.keys, toNativeTypes(record.toObject()) as any),
          )
          .join('\n')}
      </tbody>
    </table>
  `;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderRow(keys: any[], row: Record<string, any>[]) {
  return `
    <tr>
      ${keys
        .map((key) => {
          return `
            <td>
              <pre>${
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                JSON.stringify(row[key], null, 2)
              }</pre>
            </td>
            `;
        })
        .join('')}
    </tr>
  `;
}
