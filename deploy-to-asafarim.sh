#!/bin/bash

# Deployment script for IGS Pharma to igs.asafarim.com (Linux version)
echo -e "\e[32mStarting deployment process for IGS Pharma to igs.asafarim.com...\e[0m"

# Set working directory
ROOT_DIR=$(pwd)
FRONTEND_DIR="$ROOT_DIR/ECommerceApp/ecommerce-frontend"
BACKEND_DIR="$ROOT_DIR/ECommerceApp/dotnet-backend-clean/IGSPharma.API"
DEPLOYMENT_DIR="$ROOT_DIR/deployment"

# Create deployment directory if it doesn't exist
if [ ! -d "$DEPLOYMENT_DIR" ]; then
    mkdir -p "$DEPLOYMENT_DIR"
    echo -e "\e[36mCreated deployment directory: $DEPLOYMENT_DIR\e[0m"
fi

# Step 1: Build the frontend
echo -e "\e[36mBuilding frontend application...\e[0m"
cd "$ROOT_DIR"
pnpm --filter igs-pharma-frontend build

if [ $? -ne 0 ]; then
    echo -e "\e[31mFrontend build failed. Exiting deployment process.\e[0m"
    exit 1
fi

# Step 2: Build and publish the backend
echo -e "\e[36mBuilding and publishing backend application...\e[0m"
cd "$ROOT_DIR"
dotnet publish "$BACKEND_DIR" -c Release -o "$DEPLOYMENT_DIR/backend"

if [ $? -ne 0 ]; then
    echo -e "\e[31mBackend publish failed. Exiting deployment process.\e[0m"
    exit 1
fi

# Step 3: Copy frontend build to deployment directory
echo -e "\e[36mCopying frontend build to deployment directory...\e[0m"
FRONTEND_BUILD_DIR="$FRONTEND_DIR/build"
FRONTEND_DEPLOY_DIR="$DEPLOYMENT_DIR/frontend"

if [ -d "$FRONTEND_DEPLOY_DIR" ]; then
    rm -rf "$FRONTEND_DEPLOY_DIR"
fi

mkdir -p "$FRONTEND_DEPLOY_DIR"
cp -R "$FRONTEND_BUILD_DIR/"* "$FRONTEND_DEPLOY_DIR/"

# Step 4: Update backend configuration for production
echo -e "\e[36mUpdating backend configuration for production...\e[0m"
APPSETTINGS_PATH="$DEPLOYMENT_DIR/backend/appsettings.json"

if [ -f "$APPSETTINGS_PATH" ]; then
    # Using jq to modify JSON (make sure jq is installed: apt-get install jq)
    # Create a temporary file with the updated JSON
    jq '.Cors.AllowedOrigins = ["https://igs.asafarim.com"]' "$APPSETTINGS_PATH" > "$APPSETTINGS_PATH.tmp"
    
    # Replace the original file with the updated one
    mv "$APPSETTINGS_PATH.tmp" "$APPSETTINGS_PATH"
    
    echo -e "\e[32mBackend configuration updated for production.\e[0m"
else
    echo -e "\e[33mWarning: appsettings.json not found in the published output.\e[0m"
fi

# Step 5: Create deployment package
echo -e "\e[36mCreating deployment package...\e[0m"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ZIP_FILE_NAME="IGSPharma-Deployment-$TIMESTAMP.zip"
ZIP_FILE_PATH="$ROOT_DIR/$ZIP_FILE_NAME"

# Create zip archive (using zip command)
cd "$DEPLOYMENT_DIR"
zip -r "$ZIP_FILE_PATH" ./*

echo -e "\e[32mDeployment package created: $ZIP_FILE_PATH\e[0m"
echo ""
echo -e "\e[33mNext steps:\e[0m"
echo -e "\e[33m1. Upload the deployment package to your igs.asafarim.com server\e[0m"
echo -e "\e[33m2. Extract the package on the server\e[0m"
echo -e "\e[33m3. Configure your web server (Nginx, Apache, etc.) to serve the frontend static files\e[0m"
echo -e "\e[33m4. Set up the backend as a service\e[0m"
echo -e "\e[33m5. Update DNS settings to point igs.asafarim.com to your server\e[0m"
echo ""
echo -e "\e[32mDeployment preparation completed!\e[0m"
