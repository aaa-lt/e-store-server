import {
    BlobSASPermissions,
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { containerClient } from "../../config/azure.js";

export const generateSASUrl = (blobName) => {
    const sharedKeyCredential = new StorageSharedKeyCredential(
        process.env.AZURE_ACCOUNT_NAME,
        process.env.AZURE_ACCOUNT_KEY
    );

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const sasParams = generateBlobSASQueryParameters(
        {
            containerName: containerClient.containerName,
            blobName: blobName,
            permissions: BlobSASPermissions.parse("r"), // Только чтение
            expiresOn: expiryDate,
        },
        sharedKeyCredential
    );

    const blobClient = containerClient.getBlobClient(blobName);
    return `${blobClient.url}?${sasParams.toString()}`;
};

export const addSasToUrl = (url) => {
    const blobUrl = new URL(url);
    const blobName = blobUrl.pathname.split("/").pop();
    return generateSASUrl(blobName);
};
