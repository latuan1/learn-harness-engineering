$ErrorActionPreference = 'Stop'

function Invoke-HarnessCommand {
  param([string]$Command)
  $global:LASTEXITCODE = 0
  Invoke-Expression $Command
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}

function Invoke-HarnessCommandAllowExitCodes {
  param([string]$Command, [int[]]$AllowedExitCodes)
  $global:LASTEXITCODE = 0
  Invoke-Expression $Command
  if ($AllowedExitCodes -notcontains $LASTEXITCODE) {
    exit $LASTEXITCODE
  }
}

Write-Host "=== Harness Initialization ==="

if (Test-Path 'package.json') {
  if (Test-Path 'pnpm-lock.yaml') {
    $PM = 'pnpm'
  } elseif (Test-Path 'yarn.lock') {
    $PM = 'yarn'
  } elseif ((Test-Path 'bun.lock') -or (Test-Path 'bun.lockb')) {
    $PM = 'bun'
  } else {
    $PM = 'npm'
  }

  Write-Host "=== Installing dependencies with $PM ==="
  if ($PM -eq 'npm') {
    Invoke-HarnessCommand 'npm install'
  } else {
    Invoke-HarnessCommand "$PM install"
  }

  $scripts = (Get-Content 'package.json' -Raw | ConvertFrom-Json).scripts
  if ($scripts.check) {
    if ($PM -eq 'npm') { Invoke-HarnessCommand 'npm run check' } else { Invoke-HarnessCommand "$PM run check" }
  } elseif ($scripts.typecheck) {
    if ($PM -eq 'npm') { Invoke-HarnessCommand 'npm run typecheck' } else { Invoke-HarnessCommand "$PM run typecheck" }
  } elseif ($scripts.'type-check') {
    if ($PM -eq 'npm') { Invoke-HarnessCommand 'npm run type-check' } else { Invoke-HarnessCommand "$PM run type-check" }
  }

  if ($scripts.lint) {
    if ($PM -eq 'npm') { Invoke-HarnessCommand 'npm run lint' } else { Invoke-HarnessCommand "$PM run lint" }
  }

  if ($scripts.test) {
    if ($PM -eq 'npm') { Invoke-HarnessCommand 'npm test' } else { Invoke-HarnessCommand "$PM test" }
  }

  if ($scripts.build) {
    if ($PM -eq 'npm') { Invoke-HarnessCommand 'npm run build' } else { Invoke-HarnessCommand "$PM run build" }
  }
} elseif ((Test-Path 'pyproject.toml') -or (Test-Path 'requirements.txt')) {
  Write-Host "=== Running Python verification ==="
  Invoke-HarnessCommandAllowExitCodes 'python -m pytest' @(0, 5)
  Invoke-HarnessCommand "python -m compileall -q -x '(^|/)(\.?venv|env|node_modules|build|dist|__pycache__)(/|$)' ."
} elseif (Test-Path 'go.mod') {
  Write-Host "=== Running Go verification ==="
  Invoke-HarnessCommand 'go test ./...'
} elseif (Test-Path 'Cargo.toml') {
  Write-Host "=== Running Rust verification ==="
  Invoke-HarnessCommand 'cargo test'
} elseif (Test-Path 'pom.xml') {
  Write-Host "=== Running Maven verification ==="
  Invoke-HarnessCommand 'mvn test'
} elseif ((Test-Path 'build.gradle') -or (Test-Path 'build.gradle.kts')) {
  Write-Host "=== Running Gradle verification ==="
  if (Test-Path '.\gradlew.bat') {
    Invoke-HarnessCommand '.\gradlew.bat test'
  } else {
    Invoke-HarnessCommand 'gradle test'
  }
} elseif ((Get-ChildItem -Path . -Filter '*.csproj' -File | Select-Object -First 1) -or (Get-ChildItem -Path . -Filter '*.sln' -File | Select-Object -First 1)) {
  Write-Host "=== Running .NET verification ==="
  Invoke-HarnessCommand 'dotnet test'
} else {
  Write-Host "No recognized package manifest detected."
  Write-Host "Replace this section with the project's verification commands."
}

Write-Host "=== Verification Complete ==="
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Read feature_list.json to see current feature state"
Write-Host "2. Pick ONE unfinished feature to work on"
Write-Host "3. Implement only that feature"
Write-Host "4. Re-run verification before claiming done"
