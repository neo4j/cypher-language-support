import semver from 'semver';
import { integer } from 'vscode-languageserver-types';

export function cypher25Supported(serverVersion: string) {
  const minSupportedVersion = '5.27.0-2025040';
  return compareVersions(minSupportedVersion, serverVersion) <= 0;
}

/**Like semver.compare - Returns:
 *  - -1 if v1 < v2
 *  -  0 if v1 === v2
 *  -  1 if  v1 > v2
 *
 *  But taking only numerical prerelease versions into account,
 *  ignoring ones that are strings */
export function compareVersions(version1: string, version2: string): integer {
  const v1 = semver.coerce(version1, {
    includePrerelease: false,
  });
  const v2 = semver.coerce(version2, {
    includePrerelease: false,
  });
  if (v1 && v2) {
    const comparison = semver.compare(v1, v2);
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
