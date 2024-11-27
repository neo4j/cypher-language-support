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
    `    cnsa_Main_$callClinit();
    var$1 = var$1.data;
    cnsa_Main_updateSignatureResolver(null);
    cnsa_Main_analyzeQuery(var$1[0], $rt_s(1));
    cnsa_Main_updateSignatureResolver(null);
    cnsa_Main_analyzeQuery(var$1[0], $rt_s(2));`,
    `    cnsa_Main_$callClinit();`,
  );

  result = result.replace(
    `    cnsa_Main_$callClinit();
    var$1 = var$1.data;
    cnsa_Main_updateSignatureResolver(null);
    cnsa_Main_analyzeQuery(var$1[0]);
    cnsa_Main_updateSignatureResolver(null);
    cnsa_Main_analyzeQuery(var$1[0]);`,
    `    cnsa_Main_$callClinit();`,
  );

  result = result.replace(
    `$rt_exports.main = $rt_export_main;`,
    `
$rt_exports.main = $rt_export_main;

// Initialize everything
$rt_exports.main([]);

// Export the signature registry updater
$rt_exports.updateSignatureResolver = cnsa_Main_updateSignatureResolver;

// Export the analyze function as well
$rt_exports.semanticAnalysis = $rt_mainStarter(($args) => cnsa_Main_analyzeQuery($args.data[0], $args.data[1]));`,
  );
  fs.writeFile(file, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
