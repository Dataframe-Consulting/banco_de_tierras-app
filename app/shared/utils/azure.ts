"use server";

import {
  SASProtocol,
  BlobServiceClient,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const CONTAINER_NAME = "my-files";

export async function generateSignedUploadUrl(
  blobName: string,
  contentType: string
) {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_ACCOUNT_KEY
  );

  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + 10);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER_NAME,
      blobName,
      permissions: BlobSASPermissions.parse("cw"),
      expiresOn,
      protocol: SASProtocol.Https,
      contentType,
    },
    sharedKeyCredential
  ).toString();

  const commonUrl = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}`;

  const sasUrl = `${commonUrl}?${sasToken}`;

  return {
    url: sasUrl,
    publicUrl: commonUrl,
  };
}

export async function deleteBlob(blobName: string) {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_ACCOUNT_KEY
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const deleteResponse = await blockBlobClient.deleteIfExists();

  return deleteResponse.succeeded;
}
