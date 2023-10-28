const cloudinary = require('../config/cloudinary.config');
var fs = require('fs');

// function to encode file data to base64 encoded string

class UploadService {
    static uploadImageFromFiles = async ({ data, files, rowListId }) => {
        const folderName = `${process.env.CLOUDINARY_ROOT_FOLDER}/proof_images/user_${data.user}/page_${data.page}/table_${data.table}/row_${rowListId}`;
        const results = [];
        try {
            for (let i = 0; i < files.length; i++) {
                const b64 = Buffer.from(files[i].buffer).toString('base64');
                const dataURI = 'data:' + files[i].mimetype + ';base64,' + b64;
                const result = await cloudinary.uploader.upload(dataURI, { folder: folderName });
                results.push({ proofImageId: result.public_id, url: result.secure_url });
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
