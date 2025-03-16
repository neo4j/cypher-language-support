import semver from 'semver';

export function cypher25Supported(serverVersion: string) {
  const minSupportedVersion = '5.27.0-2025040';
  const minSupported = semver.coerce(minSupportedVersion, {
    includePrerelease: false,
  });
  const current = semver.coerce(serverVersion, { includePrerelease: false });

  if (minSupported && current) {
    const comparison = semver.compare(minSupported, current);
    if (comparison === 0) {
      const minPrelease = semver.prerelease(minSupportedVersion)?.at(0);
      const currentPrelease = semver.prerelease(serverVersion)?.at(0);

      return (
        typeof minPrelease === 'number' &&
        typeof currentPrelease === 'number' &&
        minPrelease <= currentPrelease
      );
    } else {
      return comparison < 0;
    }
  }

  return false;
}
