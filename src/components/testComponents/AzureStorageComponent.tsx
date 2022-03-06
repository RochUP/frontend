import { BlobServiceClient } from "@azure/storage-blob";

export default function AzureStorageComponent() {
    const account = "hacku";
    const sas_token = "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-03-13T00:44:05Z&st=2022-03-06T16:44:05Z&spr=https&sig=FBcy34Pimt3autzqQC6bR6xlW38HdMKH%2BcMwdJf8HwQ%3D";


    const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net${sas_token}`,
    );

    const containerName = `pdfcontainer`;

    var file: any;

    async function uploadFile() {
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const content = file;
        const blobName = "react_newblob" + new Date().getTime();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const blobOptions = { blobHTTPHeaders: { blobContentType: 'application/pdf' }}; // this is where you set all blob options, including the header and content-type
        const uploadBlobResponse = await blockBlobClient.upload(content, content.size, blobOptions);
        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
        console.log(uploadBlobResponse._response.request.requestId, uploadBlobResponse._response.request.url.replace(sas_token, ""));
        const file_url = uploadBlobResponse._response.request.url.replace(sas_token, "");
        const input_element = document.getElementById("input") as HTMLInputElement;
        input_element.value = "";
    }

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        if (!e.target.files){
            return;
        }
        file = e.target.files[0];
    };

    return (
        <div>
            <input id="input" type='file' onChange={onFileInputChange}/>
            <button onClick={uploadFile}>Upload</button>
        </div>
    )
}