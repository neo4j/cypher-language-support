import semver from 'semver';
import { integer } from 'vscode-languageserver-types';

/**Like semver.compare - Returns:
 *  - -1 if v1 < v2
 *  -  0 if v1 === v2
 *  -  1 if  v1 > v2
 *  But ignores patch version,
 *  and returns undefined if versions are of incorrect format */
export function compareMajorMinorVersions(
  version1: string,
  version2: string,
): integer | undefined {
  const semVer1: semver.SemVer | null = semver.coerce(version1, {
    includePrerelease: false,
  });
  const semVer2: semver.SemVer | null = semver.coerce(version2, {
    includePrerelease: false,
  });
  if (semVer1 && semVer2) {
    semVer1.patch = 0;
    semVer2.patch = 0;
    return semver.compare(semVer1, semVer2);
  }
  return undefined;
}
