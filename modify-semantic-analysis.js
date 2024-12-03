var path = require('path');
var fs = require('fs');

var file = path.resolve(
  __dirname,
  './packages/language-support/src/syntaxValidation/semanticAnalysis.js',
);

fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  let result = data.replace(
    `    $rt_startThread(() => {
        f.call(null, javaArgs);
    }, callback);`,
    `    $rt_startThread(() => {
        return f.call(null, javaArgs);
    }, callback);`,
  );

  result = result.replace(
    `export { $rt_export_main as main };`,
    `
let semanticAnalysis = $rt_mainStarter(($args) => cnsa_Main_analyzeQuery($args.data[0]));
export { cnsa_Main_updateSignatureResolver as updateSignatureResolver, semanticAnalysis };`,
  );
  fs.writeFile(file, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
