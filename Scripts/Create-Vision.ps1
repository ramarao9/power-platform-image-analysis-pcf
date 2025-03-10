#####################################################################
# Create-Vision.ps1
# Script to create an Azure Computer Vision resource
#####################################################################

# Parameters - modify these values as needed
param(
    [string]$ResourceGroupName = "vision-resource-group",
    [string]$Location = "eastus",
    [string]$ComputerVisionName = "my-vision-service-$(Get-Random -Maximum 999)",
    [string]$SkuName = "F0", # F0 (Free) or S1 (Standard)
    [switch]$CreateResourceGroup = $true,
    [string]$SubscriptionId = ""
)

# Ensure the Az module is installed
if (-not (Get-Module -ListAvailable -Name Az)) {
    Write-Host "Az module not found. Installing Az module..."
    Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
}

# Connect to Azure account
Write-Host "Connecting to Azure account..."
Connect-AzAccount

# Select subscription if provided
if ($SubscriptionId) {
    Write-Host "Selecting subscription: $SubscriptionId"
    Select-AzSubscription -SubscriptionId $SubscriptionId
}

# Display current subscription info
$currentSubscription = (Get-AzContext).Subscription
Write-Host "Using subscription: $($currentSubscription.Name) ($($currentSubscription.Id))"

# Create resource group if requested
if ($CreateResourceGroup) {
    Write-Host "Creating resource group: $ResourceGroupName in $Location"
    $resourceGroup = New-AzResourceGroup -Name $ResourceGroupName -Location $Location
}
else {
    # Verify resource group exists
    $resourceGroup = Get-AzResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
    if (-not $resourceGroup) {
        Write-Error "Resource group $ResourceGroupName does not exist. Use -CreateResourceGroup to create it."
        exit 1
    }
}

# Create Computer Vision resource
Write-Host "Creating Computer Vision resource: $ComputerVisionName"
try {
    $visionResource = New-AzCognitiveServicesAccount -ResourceGroupName $ResourceGroupName `
        -Name $ComputerVisionName `
        -Type ComputerVision `
        -SkuName $SkuName `
        -Location $Location

    Write-Host "Computer Vision resource created successfully!"
    Write-Host "Resource ID: $($visionResource.Id)"

    # Get the keys and endpoint
    $keys = Get-AzCognitiveServicesAccountKey -ResourceGroupName $ResourceGroupName -Name $ComputerVisionName
    $properties = Get-AzCognitiveServicesAccount -ResourceGroupName $ResourceGroupName -Name $ComputerVisionName
    $endpoint = $properties.Properties.Endpoint

    Write-Host "Endpoint: $endpoint"
    Write-Host "Key1: $($keys.Key1)"
    Write-Host "Key2: $($keys.Key2)"
}
catch {
    Write-Error "Failed to create Computer Vision resource: $_"
    exit 1
}

Write-Host "Script completed successfully!" -ForegroundColor Green