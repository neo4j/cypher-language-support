## Semantic analysis maintenance

There's a file at the root of the repository, `modify-semantic-analysis.js`, which does the necessary modifications to the `semanticAnalysis.js` file. To update the semantic analysis version, just:

- Copy the new `semanticAnalysis.js` version in `./packages/language-support/src/highlighting/syntaxValidation`.
- Run `node modify-semantic.analysis.js`.

### Summary

To update the `semanticAnalysis.js` file, follow this steps:

- Copy `semanticAnalysis.js` we produce in the monorepo to `./packages/language-support/src/highlighting/syntaxValidation`.
- Perform the following modifications

### Modifications

- Provide a return inside the `rt_mainStarter` (the library does not do it by default since a `main` method in java is void).

ie. it will change:

```js
$rt_mainStarter = (f) => (args, callback) => {
  if (!args) {
    args = [];
  }
  let javaArgs = $rt_createArray($rt_objcls(), args.length);
  for (let i = 0; i < args.length; ++i) {
    javaArgs.data[i] = $rt_str(args[i]);
  }
  $rt_startThread(() => {
    f.call(null, javaArgs);
  }, callback);
};
```

by:

```js
$rt_mainStarter = (f) => (args, callback) => {
  if (!args) {
    args = [];
  }
  let javaArgs = $rt_createArray($rt_objcls(), args.length);
  for (let i = 0; i < args.length; ++i) {
    javaArgs.data[i] = $rt_str(args[i]);
  }
  $rt_startThread(() => {
    return f.call(null, javaArgs);
  }, callback);
};
```

- Remove calling the `analyze` and `updateSignatureResolver` functions from the `main` initialization method:

```js
cnsa_Main_main = (var$1) => {
  cnsa_Main_$callClinit();
  var$1 = var$1.data;
  cnsa_Main_updateSignatureResolver(null);
  cnsa_Main_analyzeQuery(var$1[0]);
  cnsa_Main_updateSignatureResolver(null);
  cnsa_Main_analyzeQuery(var$1[0]);
};
```

gets replaced by:

```js
cnsa_Main_main = (var$1) => {
  cnsa_Main_$callClinit();
};
```

- Add, at the end of the file, add a call to `main` and export the analyze method as semantic analysis, which is what we are going to be able to call from the outside of this file:

```js
    $rt_exports.main = $rt_export_main;

    // Initialize everything
    $rt_exports.main([]);

    // Export the signature registry updater
    $rt_exports.updateSignatureResolver = cnsa_Main_updateSignatureResolver;

    // Export the analyze function as well
    $rt_exports.semanticAnalysis = $rt_mainStarter(($args) => cnsa_Main_analyzeQuery($args.data[0]));
}));
```

### Historic of modifications

We don't need to do these anymore, but best to keep a log of what we had to do at some point to make the transpiled file to work:

- Substitute `global` by `globalThis` in the code that sets the module scaffolding at the top, so the code can be used from both NodeJS and a web browser.

- Escape the    (\u2028 and \u2029) from the string (the need to be in a backtick quoted one) and escape the ` `` `:

```
"ÜǍÝǏÞǑßǓàǕáǗ\u0000Ǚ\u0000Ǜâǝ\u0000ǟãǡäǣåǥæǧçǩèǫéǭ\u0000ǯêǱëǳìǵíǷîǹïǻðǽñǿòȁóȃôȅõȇöȉ÷ȋøȍùȏúȑûȓüȕýȗþșÿțĀȝāȟĂȡăȣĄȥąȧĆȩćȫĈȭĉȯĊȱċȳČȵčȷĎȹďȻĐȽđȿĒɁēɃ\u0000ɅĔɇĕɉĖɋėɍĘɏęɑĚɓěɕĜɗĝəĞɛğɝĠɟġɡ\u0000ɣ\u0000ɥĢɧģɩĤɫ\u0000ɭ\u0000ɯ\u0000ɱ\u0000ɳ\u0000ɵ\u0000ɷ\u0000ɹ\u0000ɻ\u0000ɽ\u0000ɿ\u0000ʁ\u0000ʃ\u0000ʅ\u0000ʇ\u0000ʉ\u0000ʋ\u0000ʍ\u0000ʏ\u0000ʑ\u0000ʓ\u0000ʕ\u0000ʗ\u0000ʙ\u0000ʛ\u0000ʝ\u0000\u0001\u0000\'\t\u0000\t\r\u001c             　　\u0002\u0000\n\n\r\r\u0001\u000009\u0001\u000019\u0002\u0000EEee\u0002\u0000++--\u0002\u0000XXxx\u0001\u0000\'\'\u0001\u0000\"\"\u0001\u0000``ƃ\u0000AZ__azªªµµººÀÖØöøˁˆˑˠˤˬˬˮˮͰʹͶͷͺͽͿͿΆΆΈΊΌΌΎΡΣϵϷҁҊԯԱՖՙՙՠֈאתׯײؠيٮٯٱۓەەۥۦۮۯۺۼۿۿܐܐܒܯݍޥޱޱߊߪߴߵߺߺࠀࠕࠚࠚࠤࠤࠨࠨࡀࡘࡠࡪࢠࢴࢶࣇऄहऽऽॐॐक़ॡॱঀঅঌএঐওনপরললশহঽঽৎৎড়ঢ়য়ৡৰৱৼৼਅਊਏਐਓਨਪਰਲਲ਼ਵਸ਼ਸਹਖ਼ੜਫ਼ਫ਼ੲੴઅઍએઑઓનપરલળવહઽઽૐૐૠૡૹૹଅଌଏଐଓନପରଲଳଵହଽଽଡ଼ଢ଼ୟୡୱୱஃஃஅஊஎஐஒகஙசஜஜஞடணதநபமஹௐௐఅఌఎఐఒనపహఽఽౘౚ"
```

```
"ÜǍÝǏÞǑßǓàǕáǗ\u0000Ǚ\u0000Ǜâǝ\u0000ǟãǡäǣåǥæǧçǩèǫéǭ\u0000ǯêǱëǳìǵíǷîǹïǻðǽñǿòȁóȃôȅõȇöȉ÷ȋøȍùȏúȑûȓüȕýȗþșÿțĀȝāȟĂȡăȣĄȥąȧĆȩćȫĈȭĉȯĊȱċȳČȵčȷĎȹďȻĐȽđȿĒɁēɃ\u0000ɅĔɇĕɉĖɋėɍĘɏęɑĚɓěɕĜɗĝəĞɛğɝĠɟġɡ\u0000ɣ\u0000ɥĢɧģɩĤɫ\u0000ɭ\u0000ɯ\u0000ɱ\u0000ɳ\u0000ɵ\u0000ɷ\u0000ɹ\u0000ɻ\u0000ɽ\u0000ɿ\u0000ʁ\u0000ʃ\u0000ʅ\u0000ʇ\u0000ʉ\u0000ʋ\u0000ʍ\u0000ʏ\u0000ʑ\u0000ʓ\u0000ʕ\u0000ʗ\u0000ʙ\u0000ʛ\u0000ʝ\u0000\u0001\u0000\'\t\u0000\t\r\u001c       " + `  ` + "    　　\u0002\u0000\n\n\r\r\u0001\u000009\u0001\u000019\u0002\u0000EEee\u0002\u0000++--\u0002\u0000XXxx\u0001\u0000\'\'\u0001\u0000\"\"\u0001\u0000\`\`ƃ\u0000AZ__azªªµµººÀÖØöøˁˆˑˠˤˬˬˮˮͰʹͶͷͺͽͿͿΆΆΈΊΌΌΎΡΣϵϷҁҊԯԱՖՙՙՠֈאתׯײؠيٮٯٱۓەەۥۦۮۯۺۼۿۿܐܐܒܯݍޥޱޱߊߪߴߵߺߺࠀࠕࠚࠚࠤࠤࠨࠨࡀࡘࡠࡪࢠࢴࢶࣇऄहऽऽॐॐक़ॡॱঀঅঌএঐওনপরললশহঽঽৎৎড়ঢ়য়ৡৰৱৼৼਅਊਏਐਓਨਪਰਲਲ਼ਵਸ਼ਸਹਖ਼ੜਫ਼ਫ਼ੲੴઅઍએઑઓનપરલળવહઽઽૐૐૠૡૹૹଅଌଏଐଓନପରଲଳଵହଽଽଡ଼ଢ଼ୟୡୱୱஃஃஅஊஎஐஒகஙசஜஜஞடணதநபமஹௐௐఅఌఎఐఒనపహఽఽౘౚ"
```
