const router = require('express').Router();
const multerMidleware = require('../../config/multer.config');
const rowControllers = require('../../controllers/row.controllers');
const { auth } = require('../../middleware/auth');

const upload = multerMidleware;

router.post('/row', auth, upload.array('files'), rowControllers.addRow);

router.post('/row/update', auth, upload.array('files'), rowControllers.resubmitRow);

router.get('/dynamic_rows', auth, rowControllers.getDynamicRows);

router.patch('/dynamic_rows/update', auth, rowControllers.updateRowStatus);

module.exports = router;
