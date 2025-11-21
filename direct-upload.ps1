# Direct upload using PowerShell SSH
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$LocalPath = "deploy-temp",
    [string]$RemotePath = "/var/www/maclock"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Direct Upload to Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Try to download SSH.NET if not present
$sshNetDll = Join-Path $PSScriptRoot "Renci.SshNet.dll"
if (-not (Test-Path $sshNetDll)) {
    Write-Host "Downloading SSH.NET library..." -ForegroundColor Yellow
    try {
        $url = "https://github.com/sshnet/SSH.NET/releases/download/2023.0.0/Renci.SshNet.dll"
        Invoke-WebRequest -Uri $url -OutFile $sshNetDll -UseBasicParsing
        Write-Host "SSH.NET downloaded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download SSH.NET automatically." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please use one of these manual methods:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Install WinSCP: https://winscp.net/" -ForegroundColor Cyan
        Write-Host "   Then run: .\upload-files.ps1" -ForegroundColor White
        Write-Host ""
        Write-Host "2. Use FileZilla:" -ForegroundColor Cyan
        Write-Host "   Server: sftp://$ServerIP" -ForegroundColor White
        Write-Host "   Username: $Username" -ForegroundColor White
        Write-Host "   Password: $Password" -ForegroundColor White
        Write-Host "   Remote path: $RemotePath" -ForegroundColor White
        Write-Host ""
        Write-Host "3. Manual SCP (enter password when prompted):" -ForegroundColor Cyan
        Write-Host "   scp -r deploy-temp\* root@$ServerIP`:/var/www/maclock/" -ForegroundColor White
        Write-Host "   Password: $Password" -ForegroundColor White
        exit 1
    }
}

try {
    Add-Type -Path $sshNetDll
    
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
        $remoteDir = $remoteFilePath.Substring(0, $remoteFilePath.LastIndexOf("/"))
        
        # Create remote directory if needed
        try {
            $client.RunCommand("mkdir -p `"$remoteDir`"") | Out-Null
        } catch {}
        
        # Upload file
        try {
            $remoteFileStream = $client.OpenWrite($remoteFilePath)
            $localFileStream = [System.IO.File]::OpenRead($file.FullName)
            $localFileStream.CopyTo($remoteFileStream)
            $localFileStream.Close()
            $remoteFileStream.Close()
            
            Write-Progress -Activity "Uploading files" -Status "Uploading $relativePath" -PercentComplete (($currentFile / $totalFiles) * 100)
        } catch {
            Write-Host "Failed to upload: $relativePath - $_" -ForegroundColor Red
        }
    }
    
    $client.Disconnect()
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Upload completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Total files uploaded: $totalFiles" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  ssh root@$ServerIP" -ForegroundColor White
    Write-Host "  Password: $Password" -ForegroundColor White
    Write-Host ""
    Write-Host "Then on server:" -ForegroundColor Yellow
    Write-Host "  cd /var/www/maclock" -ForegroundColor White
    Write-Host "  chmod +x deploy-complete.sh" -ForegroundColor White
    Write-Host "  ./deploy-complete.sh" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please use manual upload method (see UPLOAD_GUIDE.md)" -ForegroundColor Yellow
}



