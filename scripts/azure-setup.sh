#!/bin/bash
# Azure Setup Script for MHCLG Planning App
# Run this after: az login

set -e

# Configuration - modify these if needed
RESOURCE_GROUP="rg-mhclg-planning"
LOCATION="uksouth"
APP_NAME="mhclg-planning-app"
ACR_NAME="mhclgplanningacr"  # must be globally unique, lowercase

echo "============================================"
echo "MHCLG Planning - Azure Setup"
echo "============================================"
echo ""
echo "Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  App Name: $APP_NAME"
echo "  ACR Name: $ACR_NAME"
echo ""

# Check if logged in
if ! az account show &>/dev/null; then
    echo "ERROR: Not logged into Azure. Please run 'az login' first."
    exit 1
fi

echo "Using Azure subscription:"
az account show --query "{Name:name, ID:id}" -o table
echo ""

# Step 1: Create Resource Group
echo "[1/4] Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output table
echo ""

# Step 2: Create Azure Container Registry
echo "[2/4] Creating Azure Container Registry..."
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $ACR_NAME \
    --sku Basic \
    --admin-enabled true \
    --output table
echo ""

# Step 3: Create App Service Plan
echo "[3/4] Creating App Service Plan..."
az appservice plan create \
    --name "${APP_NAME}-plan" \
    --resource-group $RESOURCE_GROUP \
    --is-linux \
    --sku B1 \
    --output table
echo ""

# Step 4: Create Web App
echo "[4/4] Creating Web App..."
az webapp create \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan "${APP_NAME}-plan" \
    --deployment-container-image-name nginx:alpine \
    --output table
echo ""

# Get credentials
echo "============================================"
echo "GITHUB SECRETS - Copy these values:"
echo "============================================"
echo ""

ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

echo "ACR_USERNAME: $ACR_USERNAME"
echo "ACR_PASSWORD: $ACR_PASSWORD"
echo ""

# Get subscription ID for service principal
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

echo "Creating Service Principal for GitHub Actions..."
echo ""
echo "AZURE_CREDENTIALS (copy the entire JSON below):"
echo "------------------------------------------------"
az ad sp create-for-rbac \
    --name "github-mhclg-planning" \
    --role contributor \
    --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
    --sdk-auth
echo "------------------------------------------------"
echo ""

# Configure Web App to use ACR
echo "Configuring Web App to pull from ACR..."
az webapp config container set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --docker-custom-image-name "${ACR_NAME}.azurecr.io/mhclg-planning:latest" \
    --docker-registry-server-url "https://${ACR_NAME}.azurecr.io" \
    --docker-registry-server-user $ACR_USERNAME \
    --docker-registry-server-password $ACR_PASSWORD \
    --output table

# Enable continuous deployment
az webapp deployment container config \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --enable-cd true \
    --output table

echo ""
echo "============================================"
echo "SETUP COMPLETE!"
echo "============================================"
echo ""
echo "Your app will be available at:"
echo "  https://${APP_NAME}.azurewebsites.net"
echo ""
echo "Next steps:"
echo "  1. Create a GitHub repository"
echo "  2. Add the secrets above to GitHub (Settings > Secrets > Actions)"
echo "  3. Push your code to trigger the deployment"
echo ""
