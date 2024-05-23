To execute the Markdown tests:

```
npx vscode-tmgrammar-snap  --config package.json -s 'text.html.markdown' -g ./textmate_tests/md.tmLanguage 'textmate_tests/*.markdown'
```

To execute the Cypher tests:

```
npx vscode-tmgrammar-snap  --config package.json 'textmate_tests/*.cypher'
```

from inside the `vscode-extension` folder
