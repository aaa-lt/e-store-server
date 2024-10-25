import { BlobServiceClient } from "@azure/storage-blob";
import "dotenv/config";

const connectionString = process.env.AZURE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;

let blobServiceClient;
let containerClient;

try {
    blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
    containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
} catch (error) {
    console.log(error);
}

export { containerClient, blobServiceClient };
