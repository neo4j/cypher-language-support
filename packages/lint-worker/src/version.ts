import semver from 'semver';
import type { integer } from 'vscode-languageserver-types';

/**
 * Compares the major and minor version of a neo4j release, ignoring patch version.
 * Our linters are versioned per minor release, and this allows us to match server
 * version to corresponding linter.
 *
 * @param version1 - One semver-style version
 * @param version2 - Another semver-style version
 *
 * @returns
 *  - -1 if version1 < version2
 *  -  0 if version1 === version2
 *  -  1 if version1 > version2
 *
 *  Ignoring patch version, and undefined if versions are of incorrect format
 */
export function compareMajorMinorVersions(
  version1: string,
  version2: string,
): integer | undefined {
  const semVer1: semver.SemVer | null = semver.coerce(version1, {
    includePrerelease: false,
    loose: true,
  });
  const semVer2: semver.SemVer | null = semver.coerce(version2, {
    includePrerelease: false,
    loose: true,
  });
  if (semVer1 && semVer2) {
    semVer1.patch = 0;
    semVer2.patch = 0;
    const result = semver.compare(semVer1, semVer2, true);
    return result;
  }
  return undefined;
}
