const multer = require('multer');

const multerMidleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    },
    limits: {
        fileSize: 10000000,
        files: 10
    }
});

module.exports = multerMidleware;
