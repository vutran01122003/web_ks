const { S3 } = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const { S3_REGION, S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY } = process.env;

const S3UploadV2 = new S3({
    region: S3_REGION,
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_ACCESS_KEY
});

module.exports = S3UploadV2;
