# Upload files to server with password authentication
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$LocalPath = "deploy-temp",
    [string]$RemotePath = "/var/www/maclock"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Uploading files to server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Posh-SSH is available
$poshSSHAvailable = $false
try {
    Import-Module Posh-SSH -ErrorAction Stop
    $poshSSHAvailable = $true
    Write-Host "Using Posh-SSH module..." -ForegroundColor Green
} catch {
    Write-Host "Posh-SSH not available, trying alternative method..." -ForegroundColor Yellow
}

if ($poshSSHAvailable) {
    # Method 1: Using Posh-SSH
    try {
        $securePassword = ConvertTo-SecureString $Password -AsPlainText -Force
        $credential = New-Object System.Management.Automation.PSCredential($Username, $securePassword)
        
        Write-Host "Connecting to server..." -ForegroundColor Yellow
        $session = New-SSHSession -ComputerName $ServerIP -Credential $credential -AcceptKey
        
        if ($session) {
            Write-Host "Creating remote directory..." -ForegroundColor Yellow
            Invoke-SSHCommand -SessionId $session.SessionId -Command "mkdir -p $RemotePath" | Out-Null
            
            Write-Host "Uploading files..." -ForegroundColor Yellow
            Set-SCPItem -ComputerName $ServerIP -Credential $credential -Path "$LocalPath\*" -Destination $RemotePath -Recurse
            
            Write-Host "Files uploaded successfully!" -ForegroundColor Green
            Remove-SSHSession -SessionId $session.SessionId | Out-Null
            exit 0
        }
    } catch {
        Write-Host "Posh-SSH method failed: $_" -ForegroundColor Red
    }
}

# Method 2: Using WinSCP (if available)
$winscpPath = "C:\Program Files (x86)\WinSCP\WinSCP.com"
if (Test-Path $winscpPath) {
    Write-Host "Using WinSCP..." -ForegroundColor Green
    
    $scriptContent = @"
option batch abort
option confirm off
open sftp://$Username`:$Password@$ServerIP
mkdir $RemotePath
cd $RemotePath
put $LocalPath\* *
exit
"@
    
    $scriptFile = "$env:TEMP\winscp_script.txt"
    $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
    
    & $winscpPath /script=$scriptFile
    
    Remove-Item $scriptFile -Force
    Write-Host "Files uploaded using WinSCP!" -ForegroundColor Green
    exit 0
}

# Method 3: Create a batch file for manual execution
Write-Host "Creating upload script..." -ForegroundColor Yellow

$batchScript = @"
@echo off
echo Uploading files to server...
echo.
echo Please enter password when prompted: $Password
echo.

REM Try using SCP with password
scp -r -o StrictHostKeyChecking=no "$LocalPath\*" $Username@$ServerIP`:$RemotePath/

if errorlevel 1 (
    echo.
    echo SCP failed. Trying alternative method...
    echo.
    echo Please install one of the following tools:
    echo 1. WinSCP - https://winscp.net/
    echo 2. PuTTY (pscp) - https://www.putty.org/
    echo.
    echo Or manually upload files using FileZilla:
    echo Server: sftp://$ServerIP
    echo Username: $Username
    echo Password: $Password
    echo Remote path: $RemotePath
    pause
)
"@

$batchFile = "upload-files.bat"
$batchScript | Out-File -FilePath $batchFile -Encoding ASCII

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Upload Methods:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Method 1: Run the batch file (will prompt for password):" -ForegroundColor Yellow
Write-Host "  .\upload-files.bat" -ForegroundColor Green
Write-Host ""
Write-Host "Method 2: Manual SCP (enter password when prompted):" -ForegroundColor Yellow
Write-Host "  scp -r deploy-temp\* root@$ServerIP`:/var/www/maclock/" -ForegroundColor Green
Write-Host "  Password: $Password" -ForegroundColor White
Write-Host ""
Write-Host "Method 3: Use WinSCP or FileZilla:" -ForegroundColor Yellow
Write-Host "  Server: sftp://$ServerIP" -ForegroundColor White
Write-Host "  Username: $Username" -ForegroundColor White
Write-Host "  Password: $Password" -ForegroundColor White
Write-Host "  Remote path: $RemotePath" -ForegroundColor White
Write-Host ""

# Try to install Posh-SSH automatically
Write-Host "Attempting to install Posh-SSH module for automatic upload..." -ForegroundColor Yellow
try {
    Install-Module -Name Posh-SSH -Scope CurrentUser -Force -SkipPublisherCheck -ErrorAction Stop
    Write-Host "Posh-SSH installed! Retrying upload..." -ForegroundColor Green
    & $PSCommandPath
    exit 0
} catch {
    Write-Host "Could not install Posh-SSH automatically." -ForegroundColor Yellow
    Write-Host "Please use one of the manual methods above." -ForegroundColor Yellow
}



