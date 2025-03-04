import { window } from 'vscode';
import {
  parametersManager,
  ParameterType,
  parameterTypes,
} from './treeviews/parametersTreeProvider';

export async function setParameter(): Promise<void> {
  const parameters = parametersManager;
  const param = await window.showInputBox({
    prompt: 'Parameter string',
    placeHolder: 'eg. key: string, integer => 1234 or map => {a: 1}',
    ignoreFocusOut: true,
  });
  if (!param) {
    return;
  }

  // key => object
  const objectMatch = param.match(/^([a-z0-9\s]+)=>(.*)$/i);

  if (objectMatch) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_all, key, value] = objectMatch;

    const type = await window.showQuickPick(parameterTypes, {
      placeHolder: 'What type is this data?',
    });

    await parameters.set(key, value.trim(), type as ParameterType);

    return;
  }

  // key: string
  const stringMatch = param.match(/^([a-z0-9\s]+):(.*)$/i);

  if (stringMatch) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_all, key, value] = stringMatch;

    await parameters.set(key.trim(), value.trim());
  }
}
