import {
    BlobSASPermissions,
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { containerClient } from "../../config/azure.js";

export const getSASToken = (blobName) => {
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
            permissions: BlobSASPermissions.parse("r"),
            expiresOn: expiryDate,
        },
        sharedKeyCredential
    );

    return sasParams.toString();
};
