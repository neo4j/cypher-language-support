/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *  Taken and modified from
 *  https://github.com/microsoft/vscode-markdown-tm-grammar/blob/8c84fff4a2e93858b6e453ee270fe6eb3c65ebe8/test/colorization.test.js
 *--------------------------------------------------------------------------------------------*/
import * as assert from 'assert';
import fs from 'fs';
import path, { basename, dirname, join } from 'path';
import * as vscode from 'vscode';

type SyntaxToken = {
  character: string;
  type: string;
};

function assertUnchangedTokens(testFixurePath: string) {
  const fileName = basename(testFixurePath);

  return vscode.commands
    .executeCommand(
      '_workbench.captureSyntaxTokens',
      vscode.Uri.file(testFixurePath),
    )
    .then((rawData: { c: string; t: string }[]) => {
      const data: SyntaxToken[] = rawData.map((row) => {
        return {
          character: row.c,
          type: row.t,
        };
      });

      const resultsFolderPath = join(
        dirname(dirname(testFixurePath)),
        'textmate-results',
      );
      if (!fs.existsSync(resultsFolderPath)) {
        fs.mkdirSync(resultsFolderPath);
      }
      const resultPath = join(
        resultsFolderPath,
        fileName.replace('.', '-') + '.json',
      );
      if (fs.existsSync(resultPath)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const previousData = JSON.parse(fs.readFileSync(resultPath).toString());
        try {
          assert.deepEqual(previousData, data);
        } catch (e) {
          fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'), {
            flag: 'w',
          });

          throw e;
        }
      } else {
        fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'));
      }
    });
}

suite('Textmate highlighting', () => {
  const extensionColorizeFixturePath = path.resolve(
    __dirname,
    '../../../e2e_tests/fixtures/textmate',
  );

  if (fs.existsSync(extensionColorizeFixturePath)) {
    const fixturesFiles = fs.readdirSync(extensionColorizeFixturePath);
    fixturesFiles.forEach((fixturesFile) => {
      // define a test for each fixture
      test(fixturesFile, async () => {
        await assertUnchangedTokens(
          join(extensionColorizeFixturePath, fixturesFile),
        );
      });
    });
  }
});
