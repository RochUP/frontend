import { BlobServiceClient } from "@azure/storage-blob";

const account = process.env.REACT_APP_AZURE_ACCOUNT_NAME || "account";
const sas_token = process.env.REACT_APP_AZURE_SHARED_ACCESS_SIGNATURE || "sas_token";

const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net${sas_token}`,
);

const containerName = process.env.REACT_APP_AZURE_CONTAINER_NAME || "container";

export async function uploadFile2AzureStorage(file: any) {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const content = file;
    const blobName = "react_newblob" + new Date().getTime();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobOptions = { blobHTTPHeaders: { blobContentType: 'application/pdf' }}; // this is where you set all blob options, including the header and content-type
    const uploadBlobResponse = await blockBlobClient.upload(content, content.size, blobOptions);
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    console.log(uploadBlobResponse._response.request.requestId, uploadBlobResponse._response.request.url.replace(sas_token, ""));
    const file_url = uploadBlobResponse._response.request.url.replace(sas_token, "");

    return file_url;
}