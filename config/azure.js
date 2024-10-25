import { BlobServiceClient } from "@azure/storage-blob";
import "dotenv/config";

const connectionString = process.env.AZURE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;

const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

const containerClient = blobServiceClient.getContainerClient(containerName);
await containerClient.createIfNotExists();

export { containerClient, blobServiceClient };
