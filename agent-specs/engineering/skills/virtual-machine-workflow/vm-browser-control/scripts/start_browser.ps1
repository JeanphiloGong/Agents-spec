param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[a-zA-Z0-9][a-zA-Z0-9_-]{0,47}$')]
    [string]$Instance,
    [Parameter(Mandatory = $true)]
    [ValidateRange(1024, 65535)]
    [int]$DebugPort,
    [string]$StartUrl = 'about:blank'
)

$ErrorActionPreference = 'Stop'
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
if ($principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Run this browser launcher in a non-elevated desktop PowerShell.'
}
if ($StartUrl -ne 'about:blank' -and $StartUrl -notmatch '^https?://[^\s"<>]+$') {
    throw 'StartUrl must be about:blank or an HTTP(S) URL without spaces or quotes.'
}

$edge = Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path -LiteralPath $edge)) {
    $edge = Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe'
}
if (-not (Test-Path -LiteralPath $edge)) { throw 'Microsoft Edge was not found.' }

$instanceRoot = Join-Path (Join-Path $env:LOCALAPPDATA 'AgentVMBrowsers') $Instance
$profilePath = Join-Path $instanceRoot 'Profile'
$existing = Get-CimInstance Win32_Process -Filter "Name = 'msedge.exe'" |
    Where-Object { $_.CommandLine -and $_.CommandLine.Contains($profilePath) }
if ($existing) { throw 'This instance is already running; attach to it or choose a new instance.' }

$listener = New-Object Net.Sockets.TcpListener([Net.IPAddress]::Loopback, $DebugPort)
try { $listener.Start() }
catch { throw "Debug port $DebugPort is unavailable; choose an unused port." }
finally { $listener.Stop() }

New-Item -ItemType Directory -Force -Path $instanceRoot | Out-Null
$arguments = '--user-data-dir="' + $profilePath + '" --remote-debugging-address=127.0.0.1 --remote-debugging-port=' + $DebugPort + ' --no-first-run --no-default-browser-check --new-window "' + $StartUrl + '"'
Start-Process -FilePath $edge -ArgumentList $arguments | Out-Null

$version = $null
for ($attempt = 0; $attempt -lt 20; $attempt++) {
    try {
        $version = Invoke-RestMethod -Uri "http://127.0.0.1:$DebugPort/json/version" -TimeoutSec 2
        if ($version.webSocketDebuggerUrl) { break }
    }
    catch { }
    Start-Sleep -Milliseconds 500
}
if (-not $version.webSocketDebuggerUrl) {
    throw 'Edge started but its CDP endpoint did not become ready; inspect the desktop.'
}

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut((Join-Path ([Environment]::GetFolderPath('Desktop')) "Agent Browser - $Instance.lnk"))
$shortcut.TargetPath = $edge
$shortcut.Arguments = $arguments
$shortcut.Description = 'Independent browser profile inside this Windows VM.'
$shortcut.Save()

[ordered]@{
    instance = $Instance
    profile = $profilePath
    debugPort = $DebugPort
    guestEndpoint = "http://127.0.0.1:$DebugPort"
    browser = $version.Browser
} | ConvertTo-Json -Compress
