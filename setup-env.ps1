Write-Host "MedBadge Local Environment Setup" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan

# 1. Install Node.js
Write-Host "Downloading and Installing Node.js..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi" -OutFile "node.msi"
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i node.msi /qn" -Wait
Remove-Item "node.msi"
Write-Host "Node.js installation completed." -ForegroundColor Green

# 2. Install Java (Temurin 17 JDK)
Write-Host "Downloading and Installing Java (Required for Firebase Emulators)..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.10%2B7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.10_7.msi" -OutFile "java.msi"
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i java.msi /qn" -Wait
Remove-Item "java.msi"
Write-Host "Java installation completed." -ForegroundColor Green

# 3. Install Firebase CLI
Write-Host "Downloading Firebase CLI Standalone..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://firebase.tools/bin/win/instant/latest" -OutFile "firebase.exe"
Write-Host "Firebase CLI downloaded to the current directory as firebase.exe." -ForegroundColor Green

Write-Host "Setup script completed. Please restart your terminal to ensure PATH updates take effect." -ForegroundColor Cyan
