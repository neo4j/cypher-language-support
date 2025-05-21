import semver from 'semver';

export function cypher25Supported(serverVersion: string) {
  const minSupportedVersion = '2025.8.0'; //TODO: set to correct value when cypher 25 is actually released
  const minSupported = semver.coerce(minSupportedVersion, {
    includePrerelease: false,
  });

  const cleanedServerVersion = serverVersion.replace(/"(\.0+)(?=\d)"/g, '.');
  const current = semver.coerce(cleanedServerVersion, {
    includePrerelease: false,
  });

  if (minSupported && current) {
    const comparison = semver.compare(minSupported, current);
    if (comparison === 0) {
      const minPrelease = semver.prerelease(minSupportedVersion)?.at(0);
      const currentPrelease = semver.prerelease(cleanedServerVersion)?.at(0);

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
