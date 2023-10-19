# React Codemirror

This package can be built with `npm run build` and then published to npm with `npm publish`.

### Completion Icons

We use unmodified copies of Visual Studio Code Icons from microsofts repository [here](https://github.com/microsoft/vscode-icons) licensed under creative commons.

### Build notes

We need to bundle the other project dependencies into the build until we've published those packages. When we do publish them, we can just do the same "tsc" build step as for example `language-support`.
