import { Settings } from './types/settings';

export function getConnectionString(settings: Settings): string {
  return `${settings.scheme}${settings.host}:${settings.port}`;
}

export function getCredentials(settings: Settings): {
  username: string;
  password: string;
} {
  return {
    username: settings.user,
    password: settings.password,
  };
}
