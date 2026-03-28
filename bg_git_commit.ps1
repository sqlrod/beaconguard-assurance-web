#requires -version 5.1
<#
.SYNOPSIS
  BeaconGuard operator commit wrapper (subject-only, no Cursor trailers, no binary artifacts).

.DESCRIPTION
  Operators run this INSTEAD OF `git commit`.
  - Optionally stages an explicit allow-list of paths.
  - Refuses to commit if staged contains forbidden artifacts (.db/.wal/.tmp/.log).
  - Forces subject-only commit messages (no body, no template, no editor).
  - Uses --no-verify by default (prevents hook-injected trailers).
  - Post-verifies HEAD commit message contains NO "Cursor"/"Made-with"/"Co-authored-by: Cursor".
  - If forbidden strings appear, attempts ONE subject-only amend; then fails closed.

.USAGE
  # Preferred: allow-list stage + commit
  .\bg_commit.ps1 -Message "docs: Governance update - Phase XIII Module 6 PASS" -Paths @(
    ".beaconguard/reviews/phase-xiii/engineering-plan/PHASE_XIII_ENGINEERING_OVERVIEW.md",
    ".gitignore"
  )

  # Commit what is already staged
  .\bg_commit.ps1 -Message "feat(module6): token replay retention engine" -NoStage

  # Amend HEAD subject-only (useful after a bad trailer appears)
  .\bg_commit.ps1 -Amend -Message "docs: Governance update - Phase XIII Module 6 PASS"
#>

[CmdletBinding(PositionalBinding = $false)]
param(
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$Message,

  [Parameter(Mandatory = $false)]
  [string[]]$Paths = @(),

  [Parameter(Mandatory = $false)]
  [switch]$NoStage,

  [Parameter(Mandatory = $false)]
  [switch]$Amend,

  [Parameter(Mandatory = $false)]
  [switch]$NoVerify = $true
)

$ErrorActionPreference = "Stop"

function Exec([string]$cmd) {
  Write-Host "BG_COMMIT> $cmd"
  $out = & cmd.exe /c $cmd 2>&1
  $code = $LASTEXITCODE
  if ($out) { $out | ForEach-Object { Write-Host $_ } }
  if ($code -ne 0) { throw "Command failed ($code): $cmd" }
}

function EnsureRepo() {
  $inside = (& git rev-parse --is-inside-work-tree 2>$null).Trim()
  if ($inside -ne "true") { throw "Not inside a git repo." }
}

function GetHeadBody() {
  return (& git show -s --format=%B HEAD) -join "`n"
}

function HasForbidden([string]$text) {
  if ($null -eq $text) { return $false }
  return ($text -match '(?i)\bCursor\b') -or
         ($text -match '(?i)\bMade-with:\s*Cursor\b') -or
         ($text -match '(?i)\bCo-authored-by:\s*Cursor\b')
}

function StripCursorFromPathEnv() {
  if ($env:Path) {
    $parts = $env:Path -split ';'
    $env:Path = (($parts | Where-Object { $_ -and ($_ -notmatch '(?i)cursor') }) -join ';')
  }
}

function HardenGitMessageInjection() {
  # Prevent editor opening and template injection.
  $env:GIT_EDITOR = "true"
  $env:VISUAL = "true"
  $env:EDITOR = "true"
  Exec 'git config --local commit.template ""'
  Exec 'git config --local commit.cleanup strip'
}

function StageAllowList([string[]]$paths) {
  if ($paths.Count -eq 0) { return }
  $quoted = $paths | ForEach-Object { '"' + $_.Replace('"','\"') + '"' }
  $argLine = ($quoted -join ' ')
  Exec "git add -- $argLine"
}

function GetStagedList() {
  return (& git diff --cached --name-only)
}

function FailIfForbiddenArtifactsStaged() {
  $staged = (GetStagedList) -join "`n"

  # Hard block common binary contamination everywhere
  if ($staged -match '(?i)\.(db|wal|tmp|log)$') {
    throw "Forbidden artifact staged (.db/.wal/.tmp/.log). Refusing to commit."
  }

  # Extra guardrail: phase-xiii tooling should never commit runtime outputs
  if ($staged -match '(?i)^Execution_Wired/tools/phase-xiii/.*\.(exe|dll|pdb)$') {
    throw "Forbidden binary staged under Execution_Wired/tools/phase-xiii (.exe/.dll/.pdb). Refusing to commit."
  }
}

function DoCommit([string]$subject, [bool]$amend, [bool]$noVerify) {
  $nv = ""
  if ($noVerify) { $nv = "--no-verify" }

  $safe = $subject.Replace('"','\"')

  if ($amend) {
    Exec ('git commit --amend {0} -m "{1}"' -f $nv, $safe)
  } else {
    Exec ('git commit {0} -m "{1}"' -f $nv, $safe)
  }
}

function VerifyOrFixOnce() {
  $msg = GetHeadBody
  if (-not (HasForbidden $msg)) { return }

  Write-Host "BG_COMMIT> Forbidden trailer detected. Attempting ONE subject-only auto-amend."
  $subj = (& git show -s --format=%s HEAD).Trim()
  if ([string]::IsNullOrWhiteSpace($subj)) { throw "Empty commit subject; cannot auto-amend." }

  DoCommit -subject $subj -amend $true -noVerify $true

  $msg2 = GetHeadBody
  if (HasForbidden $msg2) {
    throw "Forbidden strings still present after auto-amend. Abort; manual cleanup required."
  }
}

# ---- main ----
EnsureRepo
StripCursorFromPathEnv
HardenGitMessageInjection

if (-not $Amend) {
  if (-not $NoStage) {
    if ($Paths.Count -eq 0) {
      throw "Paths required unless -NoStage is specified."
    }
    StageAllowList -paths $Paths
  }

  $staged = GetStagedList
  if ($staged.Count -eq 0) { throw "No staged changes. Refusing to commit." }
  FailIfForbiddenArtifactsStaged
}

DoCommit -subject $Message -amend ([bool]$Amend) -noVerify ([bool]$NoVerify)
VerifyOrFixOnce

$head = (& git rev-parse HEAD).Trim()
Write-Host "BG_COMMIT> PASS: commit created/amended without forbidden trailers. HEAD=$head"