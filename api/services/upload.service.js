const cloudinary = require('../config/cloudinary.config');
const createError = require('http-errors');

// function to encode file data to base64 encoded string

class UploadService {
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
                code: 200,
                results,
                msg: 'Lưu minh chứng thành công'
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = UploadService;
