import { applySyntaxColouring } from '@neo4j-cypher/language-support';
import React from 'react';

export function TokenTable({ document }: { document: string }) {
  const tokens = applySyntaxColouring(document);

  const tableHeadings = ['text', 'type', 'startIndex'];

  return (
    <div className="grid grid-cols-3 gap-x-1">
      {tableHeadings.map((heading) => (
        <span key={heading} className="font-bold">
          {heading}
        </span>
      ))}
      {tokens.map(({ token, tokenType, position }) => (
        <React.Fragment key={`${position.line}:${position.startCharacter}`}>
          <div>{token}</div>
          <div>{tokenType}</div>
          <div>
            {position.line}:{position.startCharacter}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
