const cloudinary = require('../config/cloudinary.config');
const createError = require('http-errors');
const S3UploadV2 = require('../config/S3Buckets.config');

class UploadService {
    static uploadFilesToS3 = async ({ files, folderName }) => {
        const uploadedFiles = await Promise.all(
            files.map((file) => {
                return S3UploadV2.upload({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `${folderName}/${decodeURI(file.originalname)}`,
                    Body: file.buffer
                }).promise();
            })
        );

        return uploadedFiles;
    };

    static uploadImageFromFiles = async ({ files, folderName }) => {
        const results = [];
        try {
            if (!files) throw createError.BadRequest('Không có files minh chứng');

            for (let i = 0; i < files.length; i++) {
                const b64 = Buffer.from(files[i].buffer).toString('base64');
                const dataURI = 'data:' + files[i].mimetype + ';base64,' + b64;
                const result = await cloudinary.uploader.upload(dataURI, { folder: folderName });
                results.push({ imageId: result.public_id, url: result.secure_url });
            }

            return {
                status: 200,
                results,
                msg: 'Lưu minh chứng thành công'
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = UploadService;
