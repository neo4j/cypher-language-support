import { applySyntaxColouring } from 'language-support';

export function TokenTable({ document }: { document: string }) {
  const tokens = applySyntaxColouring(document);

  const table = tokens.map((token) => ({
    text: token.token,
    type: token.tokenType,
    startIndex: token.position.startCharacter,
    stopIndex: token.position.startCharacter + token.token.length,
  }));

  const tableHeadings = Object.keys(table[0]);

  return (
    <div className="mt-35">
      {tableHeadings.map((heading, i) => (
        <span
          key={i.toString() + 'a23b'}
          style={{ width: '100px', display: 'inline-block' }}
        >
          {heading}
        </span>
      ))}
      {table.map((row, i) => (
        <div key={i}>
          {Object.values(row).map((value, i) => (
            <span
              key={i.toString() + 'ab'}
              className="font-bold"
              style={{ width: '100px', display: 'inline-block' }}
            >
              {value}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
