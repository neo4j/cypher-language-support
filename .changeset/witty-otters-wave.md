---
'@neo4j-cypher/react-codemirror': patch
---

Declares `react-dom` as a peer dependency, since `CypherEditor` now imports `createPortal` from it to render the editor action buttons overlay
