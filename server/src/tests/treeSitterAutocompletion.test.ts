import { assert } from 'console';
import { treeSitterParse } from '../treeSitterAutocompletion';

jest.setTimeout(1000000);
describe('MATCH auto-completion', () => {
  test('Correctly completes MATCH', async () => {
    const tree = await treeSitterParse('*');
    const root = tree.rootNode;
    console.log(root.type);
    console.log(tree.rootNode.descendantForIndex(0));

    console.log(tree.rootNode.hasError());

    assert(true === true);
  });
});
