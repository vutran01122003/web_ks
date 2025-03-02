const multer = require("multer");
const fs = require("fs");

const uploadToDisk = ({ fileSize, numberOfiles, fileTypes, folderName }) => {
    const destinationPath = `${__dirname}/../data/${folderName}`;

    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                fs.mkdirSync(destinationPath, { recursive: true });
                cb(null, destinationPath);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + "-" + file.originalname);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (fileTypes.includes(file.mimetype)) cb(null, true);
            else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
        },
        limits: {
            fileSize: fileSize || 10000000,
            files: numberOfiles || 10
        }
    });
};

const uploadToMemory = ({ fileSize, numberOfiles, fileTypes }) => {
    return multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (fileTypes.includes(file.mimetype)) cb(null, true);
            else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
        },
        limits: {
            fileSize: fileSize || 10000000,
            files: numberOfiles || 10
        }
    });
};

module.exports = {
    uploadToDisk,
    uploadToMemory
};
