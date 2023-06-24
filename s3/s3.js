
require('dotenv').config()
const AWS = require('aws-sdk');
const crypto = require('crypto')
async function uploadFile(file) {
    const { name, buffer, clientId: folderName } = file
    const accessKeyId = process.env.WASABI_ACCESS_KEY;
    const secretAccessKey = process.env.WASABI_SECRET_KEY;
    const endpoint = process.env.WASABI_ENDPOINT;
    const region = process.env.WASABI_REGION;
    const bucketName = 'filesbaileys';
    const hash = crypto.createHash('sha256').digest('hex')
    const pathName = `${folderName}/${hash}-${name}`;
    const fileContent = buffer;
    //const mimeType = await fileTypeFromBuffer(buffer)

    const wasabiConfig = {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        endpoint: endpoint,
        region: region,
    };

    const s3 = new AWS.S3(wasabiConfig);

    try {
        await s3.createBucket({ Bucket: bucketName }).promise();
    } catch (error) {
        console.error(`Erro ao criar o bucket "${bucketName}":`, error);
        return;
    }

    const uploadParams = {
        Bucket: bucketName,
        Key: pathName,
        Body: fileContent,
    };

    await s3.upload(uploadParams).promise();
    const params = {
        Bucket: bucketName,
        Key: pathName,
        Expires: 604800, // 7 dias em segundos
        ResponseContentType: null, // Definir o tipo MIME correto do arquivo
    };

    try {
        const url = await s3.getSignedUrl('getObject', params);
        return { name: name, url: url }
    } catch (error) {
        return error;
    }
}

exports.uploadFile = uploadFile
