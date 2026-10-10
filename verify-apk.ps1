$ErrorActionPreference = 'Stop'
# Resolve paths relative to this script so it works from any machine/location.
$root = $PSScriptRoot
$apk = Join-Path $root 'mobile\android\app\build\outputs\apk\release\app-release.apk'
$dest = Join-Path $root 'FamilyConnect-1.0.0-release.apk'
$report = Join-Path $root 'verify-apk-report.txt'
$lines = @()

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($apk)
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'assets/index.android.bundle' }
if (-not $entry) {
    $zip.Dispose()
    throw 'assets/index.android.bundle NOT FOUND in APK'
}
$ms = New-Object System.IO.MemoryStream
$s = $entry.Open()
$s.CopyTo($ms)
$s.Close()
$t = [System.Text.Encoding]::UTF8.GetString($ms.ToArray())
$zip.Dispose()

$i = $t.IndexOf('10.61.31.94')
$seg = if ($i -ge 0) { $t.Substring($i, [Math]::Min(22, $t.Length - $i)) } else { 'NO_IP_FOUND' }
$lines += "SEG_B64: $([Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($seg)))"
$lines += "SEG: $seg"
$lines += "HAS_IP_PORT_API: $($t.Contains('10.61.31.94:30000/api'))"
$lines += "BUNDLE_BYTES: $($ms.Length)"
$lines += "APK_BEFORE_BYTES: $((Get-Item $apk).Length)"
$lines += "APK_TIME: $((Get-Item $apk).LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))"

Copy-Item $apk $dest -Force
$lines += "DEST_BYTES: $((Get-Item $dest).Length)"
$lines += "DEST_TIME: $((Get-Item $dest).LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))"
$lines += "DEST_SHA256: $((Get-FileHash $dest -Algorithm SHA256).Hash)"
$lines += "SRC_SHA256: $((Get-FileHash $apk -Algorithm SHA256).Hash)"

$lines | Set-Content $report -Encoding UTF8
