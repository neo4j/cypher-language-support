const fs = require('fs');
const languageSupport = require('@neo4j-cypher/language-support');
const textMateGrammar = languageSupport.textMateGrammar;

fs.writeFileSync(
  './syntaxes/cypher.json',
  JSON.stringify(textMateGrammar, undefined, 2),
);
