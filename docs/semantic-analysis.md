## Semantic analysis maintenance

### Summary

To update the `semanticAnalysis.js` file, follow this steps:

- Copy `semanticAnalysis.js` we produce in the monorepo to `./packages/language-support/src/highlighting/syntaxValidation`.
- Run `git apply semantic-analysis.patch`.

### Explanation

This patch will:

- Substitute `global` by `globalThis` in the code that sets the module scaffolding at the top, so the code can be used from both NodeJS and a web browser.
- Provide a return inside the `rt_mainStarter` (the library does not do it by default since a `main` method in java is void).

ie. it will change:

```js
function $rt_mainStarter(f) {
  return function (args, callback) {
    if (!args) {
      args = [];
    }
    var javaArgs = $rt_createArray($rt_objcls(), args.length);
    for (var i = 0; i < args.length; ++i) {
      javaArgs.data[i] = $rt_str(args[i]);
    }
    $rt_startThread(function () {
      f.call(null, javaArgs);
    }, callback);
  };
}
```

by:

```js
function $rt_mainStarter(f) {
  return function (args, callback) {
    if (!args) {
      args = [];
    }
    var javaArgs = $rt_createArray($rt_objcls(), args.length);
    for (var i = 0; i < args.length; ++i) {
      javaArgs.data[i] = $rt_str(args[i]);
    }
    $rt_startThread(function () {
      return f.call(null, javaArgs);
    }, callback);
  };
}
```

- Remove calling the `analyze` function from the `main` initialization method:

```js
function ons_MainNodejs_main($args) {
    ...
    oncie_ListComprehension$__clinit_();
    oncie_Ands$__clinit_();
    $args = $args.data;
    cnsa_Main_updateSignatureResolver(null);
    cnsa_Main_analyzeQuery($args[0]);
}
```

gets replaced by:

```js
function ons_MainNodejs_main($args) {
    ...
    oncie_ListComprehension$__clinit_();
    oncie_Ands$__clinit_();
}
```

- Add, at the end of the file, a call to `main` and exports the analyze method as semantic analysis, which is what we are going to be able to call from the outside of this file:

```js
    // Initialize everything
    $rt_exports.main([]);

    // Export the signature registry updater
    $rt_exports.updateSignatureResolver = cnsa_Main_updateSignatureResolver;

    // Export the analyze function as well
    $rt_exports.semanticAnalysis = $rt_mainStarter(($args) => cnsa_Main_analyzeQuery($args.data[0]));
}));
```
