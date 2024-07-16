import {
  FileDecoration,
  FileDecorationProvider,
  ProviderResult,
  ThemeColor,
  Uri,
} from 'vscode';
import { ConnectionItemType } from './connectionTreeDataProvider';

export class ConnectionTreeDecorationProvider
  implements FileDecorationProvider
{
  provideFileDecoration(uri: Uri): ProviderResult<FileDecoration> {
    const params: URLSearchParams = new URLSearchParams(uri.query);
    const type: ConnectionItemType = params.get('type') as ConnectionItemType;

    switch (type) {
      case 'activeDatabase':
        return {
          color: new ThemeColor('charts.green'),
        };
      default:
        return undefined;
    }
  }
}
