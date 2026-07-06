#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import {
  initPowerShellFromCommands,
  loadHarnessFiles,
  scoreHarness
} from './lib/harness-utils.mjs';

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const powerShellAvailable = await hasPowerShell();

await testCreateHarnessWritesPowerShellEntrypoint();
if (powerShellAvailable) {
  await testPowerShellEntrypointFailsOnNativeCommandFailure();
}
testPowerShellCommandsAvoidPosixSyntax();
await testPowerShellEntrypointCountsForValidation();

console.log('Windows harness support tests passed');

async function testCreateHarnessWritesPowerShellEntrypoint() {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'harness-windows-create-'));
  try {
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({
        name: 'windows-create',
        scripts: {
          check: 'node -e "process.exit(0)"',
          test: 'node -e "process.exit(0)"'
        }
      })
    );

    await execFileAsync('node', [path.join(scriptDir, 'create-harness.mjs'), '--target', dir]);

    const shellScript = await readFile(path.join(dir, 'init.sh'), 'utf8');
    const powerShellScript = await readFile(path.join(dir, 'init.ps1'), 'utf8');
    const agents = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');

    assert.match(shellScript, /^#!\/bin\/bash/);
    assert.match(powerShellScript, /\$ErrorActionPreference = 'Stop'/);
    assert.match(powerShellScript, /npm install/);
    assert.match(powerShellScript, /npm run check/);
    assert.match(powerShellScript, /npm test/);
    assert.match(agents, /\.\\init\.ps1/);

    if (powerShellAvailable) {
      await execFileAsync('powershell', [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(dir, 'init.ps1')
      ], { cwd: dir });
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function testPowerShellEntrypointFailsOnNativeCommandFailure() {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'harness-windows-failure-'));
  try {
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({
        name: 'windows-failure',
        scripts: {
          test: 'node -e "process.exit(7)"',
          build: 'node -e "process.exit(0)"'
        }
      })
    );

    await execFileAsync('node', [path.join(scriptDir, 'create-harness.mjs'), '--target', dir]);

    await assert.rejects(
      execFileAsync('powershell', [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(dir, 'init.ps1')
      ], { cwd: dir }),
      (error) => error.code === 7
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function hasPowerShell() {
  try {
    await execFileAsync('powershell', ['-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()']);
    return true;
  } catch {
    return false;
  }
}

function testPowerShellCommandsAvoidPosixSyntax() {
  const script = initPowerShellFromCommands([
    'python3 -m pytest || [ $? -eq 5 ]',
    "python3 -m compileall -q -x '(^|/)(\\.?venv|env|node_modules|build|dist|__pycache__)(/|$)' .",
    './gradlew test',
    'echo "No package manifest detected; replace this line with your project verification command."'
  ]);

  assert.match(script, /python -m pytest/);
  assert.match(script, /Invoke-HarnessCommandAllowExitCodes 'python -m pytest' @\(0, 5\)/);
  assert.doesNotMatch(script, /\[\s*\$\?\s*-eq\s*5\s*\]/);
  assert.doesNotMatch(script, /python3/);
  assert.match(script, /Test-Path '\.\\gradlew\.bat'/);
  assert.match(script, /gradle test/);
  assert.match(script, /Write-Host "No package manifest detected; replace this line with your project verification command\."/);
}

async function testPowerShellEntrypointCountsForValidation() {
  const files = [
    {
      path: 'AGENTS.md',
      content: `# AGENTS.md

## Startup Workflow

- Before writing code, run .\\init.ps1.

## Definition of Done

- A feature is done only when tests pass.

## Verification Commands

- .\\init.ps1
- dotnet test

## Working Rules

- One feature at a time.
- Stay in scope.

## End of Session

- Before ending, record evidence.
`
    },
    {
      path: 'feature_list.json',
      content: JSON.stringify({
        features: [
          {
            id: 'F-001',
            name: 'Example',
            description: 'Example feature',
            status: 'todo',
            dependencies: []
          }
        ]
      })
    },
    {
      path: 'progress.md',
      content: `# Progress

## Last Updated

Today

## Current State

What is done and what is next.

## Verification Evidence

| Check | Command | Result |
|---|---|---|
| test | dotnet test | pass |
`
    },
    {
      path: 'session-handoff.md',
      content: `# Session Handoff

## Current Objective

Ship Windows verification.

## Files Changed

- init.ps1

## Blockers

- None

## Next Session

Run verification.

## Recommended Next Step

Continue.
`
    },
    {
      path: 'init.ps1',
      content: `$ErrorActionPreference = 'Stop'
Write-Host "=== Harness Initialization ==="
dotnet test
Write-Host "=== Verification Complete ==="
Write-Host "Next steps:"
`
    }
  ];

  const result = scoreHarness(files);
  assert.equal(result.subsystems.verification.checks[0].pass, true);
  assert.equal(result.subsystems.verification.checks[1].pass, true);
  assert.equal(result.subsystems.lifecycle.checks[0].pass, true);

  const dir = await mkdtemp(path.join(os.tmpdir(), 'harness-windows-load-'));
  try {
    await writeFile(path.join(dir, 'init.ps1'), files.at(-1).content);
    const loaded = await loadHarnessFiles(dir);
    assert.deepEqual(loaded.map((file) => file.path), ['init.ps1']);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
