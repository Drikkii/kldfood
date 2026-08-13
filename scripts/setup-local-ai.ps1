[CmdletBinding()]
param(
  [switch]$SkipModelPull,
  [switch]$ForceConfig
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$templatePath = Join-Path $projectRoot ".continue\config.yaml.example"
$continueDir = Join-Path $env:USERPROFILE ".continue"
$configPath = Join-Path $continueDir "config.yaml"

$ollama = Get-Command ollama -ErrorAction SilentlyContinue
if (-not $ollama) {
  $standardPath = Join-Path $env:LOCALAPPDATA "Programs\Ollama\ollama.exe"
  if (Test-Path -LiteralPath $standardPath) {
    $ollama = Get-Item -LiteralPath $standardPath
  } else {
    throw "Ollama is not installed. Install it from https://ollama.com/download/windows and run this script again."
  }
}

New-Item -ItemType Directory -Force -Path $continueDir | Out-Null
if (Test-Path -LiteralPath $configPath) {
  if (-not $ForceConfig) {
    throw "Continue config already exists at $configPath. Re-run with -ForceConfig to back it up and replace it."
  }
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  Copy-Item -LiteralPath $configPath -Destination "$configPath.backup-$stamp"
}
Copy-Item -LiteralPath $templatePath -Destination $configPath -Force

if (-not $SkipModelPull) {
  & $ollama.FullName pull qwen2.5-coder:7b
  & $ollama.FullName pull qwen2.5-coder:1.5b-base
}

Write-Host "Continue local configuration installed: $configPath"
Write-Host "Project rules are active from: $projectRoot\.continue\rules"
