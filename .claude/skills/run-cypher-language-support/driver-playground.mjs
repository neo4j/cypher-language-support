// Drives the react-codemirror playground headlessly with Playwright.
//
//   node .claude/skills/run-cypher-language-support/driver-playground.mjs [--url http://localhost:5173] [--screenshot path.png]
//
// Without --url it starts the playground's vite dev server itself on port 5199
// and stops it afterwards. Exercises linting (typo query -> error underline),
// autocompletion (label completion from the mock schema) and formatting, then
// saves a screenshot (default: playground-screenshot.png in the CWD).
// Run from the repo root. Playwright is resolved from packages/react-codemirror.
import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(
  new URL('../../../packages/react-codemirror/package.json', import.meta.url),
);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
function argValue(flag, fallback) {
  const i = args.indexOf(flag);
  return i === -1 ? fallback : args[i + 1];
}
const screenshotPath = argValue('--screenshot', 'playground-screenshot.png');
let url = argValue('--url', null);

let viteProc = null;
if (!url) {
  const port = 5199;
  url = `http://localhost:${port}/`;
  // detached on unix puts vite in its own process group so stopVite can kill
  // the whole tree; on Windows taskkill /T does that instead.
  viteProc = spawn(
    `pnpm --filter @neo4j-cypher/react-codemirror-playground exec vite --port ${port} --strictPort`,
    {
      shell: true,
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'inherit'],
    },
  );
  viteProc.stdout.on('data', () => {});
  const deadline = Date.now() + 60_000;
  for (;;) {
    try {
      await fetch(url);
      break;
    } catch {
      if (Date.now() > deadline) {
        console.error('TIMEOUT: vite dev server did not come up on ' + url);
        stopVite();
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

function stopVite() {
  if (!viteProc) return;
  // shell:true means viteProc.pid is the shell, not vite itself; kill the tree.
  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /pid ${viteProc.pid} /T /F`, { stdio: 'ignore' });
    } catch {}
  } else {
    try {
      process.kill(-viteProc.pid, 'SIGTERM'); // negative pid = process group
    } catch {
      viteProc.kill('SIGTERM');
    }
  }
}

let failures = 0;
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
}

// The exact browser build playwright wants may not be downloaded; fall back to
// the newest chromium headless shell already present in the playwright cache
// (minor version skew is fine for what this driver does).
async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (err) {
    const cache =
      process.platform === 'win32'
        ? join(process.env.LOCALAPPDATA, 'ms-playwright')
        : join(
            process.env.HOME,
            process.platform === 'darwin'
              ? 'Library/Caches/ms-playwright'
              : '.cache/ms-playwright',
          );
    const shells = readdirSync(cache)
      .filter((d) => d.startsWith('chromium_headless_shell-'))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
    // The platform/arch-specific directory layout inside the build varies
    // (…-win64, …-linux64, …-mac-arm64, …); scan for the binary instead.
    for (const shell of shells) {
      const dir = join(cache, shell);
      const hit = readdirSync(dir, { recursive: true }).find((p) =>
        /(^|[\\/])chrome-headless-shell(\.exe)?$/.test(String(p)),
      );
      if (hit) {
        const exe = join(dir, String(hit));
        console.log('default browser missing, falling back to ' + exe);
        return await chromium.launch({ executablePath: exe });
      }
    }
    throw err;
  }
}

let browser;
try {
  browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url);
  const editor = page.locator('.cm-content');
  await editor.waitFor({ timeout: 15_000 });

  async function setQuery(text) {
    await editor.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.press('Delete');
    await page.keyboard.type(text);
  }

  // 1. Linting: a typo should produce an error underline (lint runs in a web worker).
  await setQuery('MATCH (n:Person) RETRN n.name');
  await page.keyboard.press('Escape'); // dismiss any autocomplete tooltip
  const lintMark = page.locator('.cm-lintRange-error').first();
  await lintMark.waitFor({ timeout: 15_000 }).catch(() => {});
  check('lint error underline appears', await lintMark.isVisible());

  // 2. Autocompletion: ':' triggers label completions from the mock schema.
  await setQuery('MATCH (n:');
  const options = page.locator('.cm-tooltip-autocomplete li');
  await options.first().waitFor({ timeout: 10_000 }).catch(() => {});
  const labels = await options.allInnerTexts();
  check(
    'label autocompletion appears',
    labels.length > 0,
    labels.slice(0, 5).join(', '),
  );
  await page.screenshot({ path: screenshotPath });
  console.log('screenshot saved to ' + screenshotPath);
  await page.keyboard.press('Escape');

  // 3. Formatting: the "Format Query" link runs the formatter.
  await setQuery('match (n:Person) where n.age > 30 return n');
  await page.keyboard.press('Escape');
  await page.getByText('Format Query').click();
  await page.waitForTimeout(500);
  const formatted = await editor.innerText();
  check(
    'Format Query uppercases keywords',
    formatted.includes('MATCH') && formatted.includes('WHERE'),
    JSON.stringify(formatted.split('\n')[0]),
  );
} finally {
  await browser?.close();
  stopVite();
}
process.exit(failures === 0 ? 0 : 1);
