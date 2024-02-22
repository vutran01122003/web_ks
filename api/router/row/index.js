const router = require('express').Router();
const multerMidleware = require('../../config/multer.config');
const rowControllers = require('../../controllers/row.controllers');
const { auth } = require('../../middleware/auth');

const upload = multerMidleware;

router.post('/rows', auth, upload.array('files'), rowControllers.addRow);

router.patch('/rows/:rowId', auth, upload.array('files'), rowControllers.resubmitRow);

router.get('/dynamic-rows', auth, rowControllers.getDynamicRows);

router.patch('/dynamic-rows/:rowId', auth, rowControllers.updateRowStatus);

module.exports = router;
