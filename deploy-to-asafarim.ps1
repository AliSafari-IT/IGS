# Deployment script for IGS Pharma to igs.asafarim.com
Write-Host "Starting deployment process for IGS Pharma to igs.asafarim.com..." -ForegroundColor Green

# Set working directory
$rootDir = $PSScriptRoot
$frontendDir = Join-Path $rootDir "ECommerceApp\ecommerce-frontend"
$backendDir = Join-Path $rootDir "ECommerceApp\dotnet-backend-clean\IGSPharma.API"
$deploymentDir = Join-Path $rootDir "deployment"

# Create deployment directory if it doesn't exist
if (-not (Test-Path $deploymentDir)) {
    New-Item -ItemType Directory -Path $deploymentDir | Out-Null
    Write-Host "Created deployment directory: $deploymentDir" -ForegroundColor Cyan
}

# Step 1: Build the frontend
Write-Host "Building frontend application..." -ForegroundColor Cyan
Set-Location $rootDir
& pnpm --filter igs-pharma-frontend build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed. Exiting deployment process." -ForegroundColor Red
    exit 1
}

# Step 2: Build and publish the backend
Write-Host "Building and publishing backend application..." -ForegroundColor Cyan
Set-Location $rootDir
& dotnet publish $backendDir -c Release -o "$deploymentDir\backend"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend publish failed. Exiting deployment process." -ForegroundColor Red
    exit 1
}

# Step 3: Copy frontend build to deployment directory
Write-Host "Copying frontend build to deployment directory..." -ForegroundColor Cyan
$frontendBuildDir = Join-Path $frontendDir "build"
$frontendDeployDir = Join-Path $deploymentDir "frontend"

if (Test-Path $frontendDeployDir) {
    Remove-Item -Path $frontendDeployDir -Recurse -Force
}

New-Item -ItemType Directory -Path $frontendDeployDir | Out-Null
Copy-Item -Path "$frontendBuildDir\*" -Destination $frontendDeployDir -Recurse

# Step 4: Update backend configuration for production
Write-Host "Updating backend configuration for production..." -ForegroundColor Cyan
$appsettingsPath = Join-Path $deploymentDir "backend\appsettings.json"

if (Test-Path $appsettingsPath) {
    $appsettings = Get-Content $appsettingsPath -Raw | ConvertFrom-Json
    
    # Update CORS policy to allow igs.asafarim.com
    $appsettings.Cors.AllowedOrigins = @("https://igs.asafarim.com")
    
    # Update connection strings if needed
    # Note: You should use environment variables or Azure Key Vault for sensitive data in production
    
    # Save the updated configuration
    $appsettings | ConvertTo-Json -Depth 10 | Set-Content $appsettingsPath
    
    Write-Host "Backend configuration updated for production." -ForegroundColor Green
} else {
    Write-Host "Warning: appsettings.json not found in the published output." -ForegroundColor Yellow
}

# Step 5: Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipFileName = "IGSPharma-Deployment-$timestamp.zip"
$zipFilePath = Join-Path $rootDir $zipFileName

Compress-Archive -Path "$deploymentDir\*" -DestinationPath $zipFilePath

Write-Host "Deployment package created: $zipFilePath" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Upload the deployment package to your igs.asafarim.com server" -ForegroundColor Yellow
Write-Host "2. Extract the package on the server" -ForegroundColor Yellow
Write-Host "3. Configure your web server (IIS, Nginx, etc.) to serve the frontend static files" -ForegroundColor Yellow
Write-Host "4. Set up the backend as a service or in IIS" -ForegroundColor Yellow
Write-Host "5. Update DNS settings to point igs.asafarim.com to your server" -ForegroundColor Yellow
Write-Host ""
Write-Host "Deployment preparation completed!" -ForegroundColor Green
