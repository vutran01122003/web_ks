const multer = require('multer');
const router = require('express').Router();
const rowControllers = require('../../controllers/row.controllers');
const { auth } = require('../../middleware/auth');

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.split('/')[0] === 'image') cb(null, true);
        else if (
            file.mimetype === 'application/msword' ||
            file.mimetype ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
            cb(null, true);
        else if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    },
    limits: {
        fileSize: 10000000,
        files: 10
    }
});

router.post('/row', auth, upload.array('files'), rowControllers.addRow);

router.get('/dynamic_rows', auth, rowControllers.getDynamicRows);

router.patch('/pending_rows/update', auth, rowControllers.updateRowStatus);

module.exports = router;
