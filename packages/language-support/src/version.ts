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
  let semVer1: semver.SemVer;
  let semVer2: semver.SemVer;
  try {
    semVer1 = semver.coerce(version1, {
      includePrerelease: false,
    });
    semVer2 = semver.coerce(version2, {
      includePrerelease: false,
    });
  } catch (e) {
    return undefined;
  }
  if (semVer1 && semVer2) {
    semVer1.patch = 0;
    semVer2.patch = 0;
    return semver.compare(semVer1, semVer2);
  }
}

/**Like semver.compare - Returns:
 *  - -1 if v1 < v2
 *  -  0 if v1 === v2
 *  -  1 if  v1 > v2
 *  But if versions are of incorrect format, returns undefined
 *
 *  If major- minor- and patch versions are equal,
 *  compares prerelease versions too, provided that they are numerical. */
export function compareVersions(
  version1: string,
  version2: string,
): integer | undefined {
  let semVer1: semver.SemVer;
  let semVer2: semver.SemVer;
  try {
    semVer1 = semver.coerce(version1, {
      includePrerelease: false,
    });
    semVer2 = semver.coerce(version2, {
      includePrerelease: false,
    });
  } catch (e) {
    return undefined;
  }

  if (semVer1 && semVer2) {
    const comparison = semver.compare(semVer1, semVer2);
    const prerelease1 = semver.prerelease(version1)?.at(0);
    const prerelease2 = semver.prerelease(version2)?.at(0);
    if (
      comparison === 0 &&
      typeof prerelease1 === 'number' &&
      typeof prerelease2 === 'number'
    ) {
      return semver.compare(prerelease1.toString(), prerelease2.toString());
    } else {
      return comparison;
    }
  }
  return -1;
}
