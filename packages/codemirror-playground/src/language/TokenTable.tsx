import { getTokenStream, lexerSymbols } from 'language-support';
export function TokenTable({ document }: { document: string }) {
  const tokens = getTokenStream(document);

  const table = tokens.map((token) => {
    const { text, type, startIndex, stopIndex } = token;
    return {
      text,
      typeIndex: type,
      typeName: lexerSymbols[type] ?? 'none',
      startIndex,
      stopIndex,
    };
  });

  const tableHeadings = Object.keys(table[0]);

  return (
    <div>
      <table cellPadding={0} cellSpacing={0} className="w-full text-sm">
        <thead className="bg-slate-200">
          <tr>
            {tableHeadings.map((heading, i) => (
              <th
                key={i.toString() + 'a23b'}
                className="px-2 py-1.5 border first:border-l-0 border-r-0 border-t-0 border-slate-400 text-left font-sans"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i} className="even:bg-slate-100 odd:bg-white">
              {Object.entries(row).map(([_key, value], i) => {
                // TODO highlight?
                return (
                  <td
                    key={i.toString() + 'ab'}
                    className={`px-2 py-1.5 border first:border-l-0 border-r-0 border-b-0 border-slate-400 text-left font-mono`}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
