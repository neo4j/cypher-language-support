import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import { mkdirSync } from 'node:fs';
import * as path from 'node:path';

/**
 * Runs API Extractor for a single workspace package.
 *
 * Locally this rewrites the committed API report, so a change to the public API shows
 * up as a diff to review. In CI (or with --ci) the report is only verified: a stale
 * report fails the build instead of being silently rewritten.
 */
export function runApiExtractor(packageFolder: string): void {
  const configPath = path.join(packageFolder, 'api-extractor.json');
  const config = ExtractorConfig.loadFileAndPrepare(configPath);

  // API Extractor fails rather than creating these itself.
  for (const folder of [
    config.reportFolder,
    config.reportTempFolder,
    path.dirname(config.apiJsonFilePath),
  ]) {
    mkdirSync(folder, { recursive: true });
  }

  const args = process.argv.slice(2);
  const localBuild = args.includes('--ci') ? false : !process.env.CI;

  const result = Extractor.invoke(config, {
    localBuild,
    showVerboseMessages: args.includes('--verbose'),
  });

  // Not result.succeeded: in a production build that is false whenever there are any
  // warnings at all. Tracked warnings are routed into the report itself
  // (addToApiReportFile), so the gate we actually want is "no errors, and the committed
  // report is current" - a changed set of warnings changes the report.
  const staleReport = !localBuild && result.apiReportChanged;

  if (result.errorCount === 0 && !staleReport) {
    if (localBuild && result.apiReportChanged) {
      console.warn(
        `\nThe API report changed and has been rewritten. Review the diff and commit\n` +
          `${path.relative(process.cwd(), config.reportFilePath)} - CI fails if it is not up to date.`,
      );
    }
    console.log(
      `API Extractor succeeded with ${result.warningCount} warning(s).`,
    );
    return;
  }

  if (staleReport) {
    console.error(
      `\nThe API report is out of date. Run "pnpm check-api-report" in ${path.basename(
        packageFolder,
      )} and commit the updated ${path.relative(packageFolder, config.reportFilePath)}.`,
    );
  }

  console.error(
    `API Extractor failed with ${result.errorCount} error(s) and ${result.warningCount} warning(s).`,
  );
  process.exitCode = 1;
}
