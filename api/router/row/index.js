const multer = require('multer');
const router = require('express').Router();
const rowControllers = require('../../controllers/row.controllers');
const { auth } = require('../../middleware/auth');

const upload = multer({
    storage: multer.memoryStorage()
});

router.post('/row', auth, upload.array('files'), rowControllers.addRow);

router.get('/pending_rows', auth, rowControllers.getPeddingRows);

router.patch('/pending_rows/update', auth, rowControllers.updateRowStatus);

module.exports = router;
