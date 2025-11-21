# Auto upload using SSH.NET library
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$LocalPath = "deploy-temp",
    [string]$RemotePath = "/var/www/maclock"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Auto Upload to Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load SSH.NET assembly
$sshNetPath = "$PSScriptRoot\SSH.NET.dll"
if (-not (Test-Path $sshNetPath)) {
    Write-Host "Downloading SSH.NET library..." -ForegroundColor Yellow
    try {
        $url = "https://github.com/sshnet/SSH.NET/releases/download/2023.0.0/Renci.SshNet.dll"
        Invoke-WebRequest -Uri $url -OutFile $sshNetPath -UseBasicParsing
        Write-Host "SSH.NET downloaded!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download SSH.NET. Using alternative method..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please use WinSCP or FileZilla to upload files:" -ForegroundColor Yellow
        Write-Host "  Server: sftp://$ServerIP" -ForegroundColor White
        Write-Host "  Username: $Username" -ForegroundColor White
        Write-Host "  Password: $Password" -ForegroundColor White
        Write-Host "  Remote path: $RemotePath" -ForegroundColor White
        exit 1
    }
}

try {
    Add-Type -Path $sshNetPath
    
    Write-Host "Connecting to server..." -ForegroundColor Yellow
    $connectionInfo = New-Object Renci.SshNet.PasswordConnectionInfo($ServerIP, $Username, $Password)
    $client = New-Object Renci.SshNet.SftpClient($connectionInfo)
    $client.Connect()
    
    Write-Host "Connected! Creating remote directory..." -ForegroundColor Green
    $client.RunCommand("mkdir -p $RemotePath") | Out-Null
    
    Write-Host "Uploading files..." -ForegroundColor Yellow
    $files = Get-ChildItem -Path $LocalPath -Recurse -File
    $totalFiles = $files.Count
    $currentFile = 0
    
    foreach ($file in $files) {
        $currentFile++
        $relativePath = $file.FullName.Replace((Resolve-Path $LocalPath).Path + "\", "").Replace("\", "/")
        $remoteFilePath = "$RemotePath/$relativePath"
        $remoteDir = Split-Path $remoteFilePath -Parent
        
        # Create remote directory if needed
        $client.RunCommand("mkdir -p `"$remoteDir`"") | Out-Null
        
        # Upload file
        $remoteFileStream = $client.OpenWrite($remoteFilePath)
        $localFileStream = [System.IO.File]::OpenRead($file.FullName)
        $localFileStream.CopyTo($remoteFileStream)
        $localFileStream.Close()
        $remoteFileStream.Close()
        
        Write-Progress -Activity "Uploading files" -Status "Uploading $relativePath" -PercentComplete (($currentFile / $totalFiles) * 100)
    }
    
    $client.Disconnect()
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Upload completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Total files uploaded: $totalFiles" -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please use manual upload method:" -ForegroundColor Yellow
    Write-Host "  Server: sftp://$ServerIP" -ForegroundColor White
    Write-Host "  Username: $Username" -ForegroundColor White
    Write-Host "  Password: $Password" -ForegroundColor White
    Write-Host "  Remote path: $RemotePath" -ForegroundColor White
}



