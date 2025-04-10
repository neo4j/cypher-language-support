import semver from 'semver';

export function cypher25Supported(serverVersion: string) {
  const minSupportedVersion = '5.27.0-2025040';
  return compareVersions(minSupportedVersion, serverVersion);
}

export function compareVersions(version1: string, version2: string): boolean {
  const v1 = semver.coerce(version1, {
    includePrerelease: false,
  });
  const v2 = semver.coerce(version2, {
    includePrerelease: false,
  });
  if (v1 && v2) {
    const comparison = semver.compare(v1, v2);
    if (comparison === 0) {
      const prerelease1 = semver.prerelease(version1)?.at(0);
      const prerelease2 = semver.prerelease(version2)?.at(0);

      return (
        typeof prerelease1 === 'number' &&
        typeof prerelease2 === 'number' &&
        prerelease1 <= prerelease2
      );
    } else {
      return comparison < 0;
    }
  }
  return false;
}
