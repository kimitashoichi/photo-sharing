import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as azure_native from "@pulumi/azure-native";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("photo_sharing");

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("psstrage", {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
});

// Export the primary key of the Storage Account
// 不要かもしれない
const storageAccountKeys = storage.listStorageAccountKeysOutput({
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name
});

// front-end
const clientStaticWebApp = new azure_native.web.StaticSite("photoSharingClient", {
    resourceGroupName: resourceGroup.name,
    name: "photo-sharing-client-webapp",
    location: "East Asia",
    provider: "Github",
    repositoryUrl: "https://github.com/kimitashoichi/photo-sharing",
    branch: "main",
    sku: {
        name: "Free",
        tier: "Free",
    },
});

// app service plan
const appServicePlan = new azure_native.web.AppServicePlan('psServicePlan', {
    resourceGroupName: resourceGroup.name,
    name: "psServicePlan",
    location: "East Asia",
    kind: "Linux",
    sku: {
        name: "F1",
        tier: "Free",
        size: "F1",
    },
});

const appServer = new azure_native.web.WebApp('psApiWebApp', {
    resourceGroupName: resourceGroup.name,
    name: "psApiWebApp",
    location: "East Asia",
    serverFarmId: appServicePlan.id,
    siteConfig: {
        ftpsState: "Disabled",
    },
});

export const primaryStorageKey = storageAccountKeys.keys[0].value;
