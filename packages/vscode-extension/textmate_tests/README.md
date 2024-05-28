To execute the Markdown tests:

```
npx vscode-tmgrammar-snap  --config package.json -s 'text.html.markdown' -g ./textmate_tests/md.tmLanguage 'textmate_tests/*.markdown'
```

To execute the Cypher tests:

```
npx vscode-tmgrammar-snap  --config package.json 'textmate_tests/*.cypher'
```

from inside the `vscode-extension` folder

The markdown grammar has been copied from https://github.com/microsoft/vscode-markdown-tm-grammar/blob/main/syntaxes/markdown.tmLanguage.

It uses https://github.com/PanAeon/vscode-tmgrammar-test

Alternative: https://github.com/microsoft/vscode-markdown-tm-grammar/blob/main/test/colorization.test.js
