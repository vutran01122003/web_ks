const router = require('express').Router();
const multerMidleware = require('../../config/multer.config');
const rowControllers = require('../../controllers/row.controllers');
const { auth } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

const upload = multerMidleware;

router.post('/rows', auth, checkPermission, upload.array('files'), rowControllers.addRow);

router.patch('/rows/:rowId', auth, checkPermission, upload.array('files'), rowControllers.resubmitRow);

router.get('/dynamic-rows', auth, checkPermission, rowControllers.getDynamicRows);

router.patch('/dynamic-rows/:rowId', auth, checkPermission, rowControllers.updateRowStatus);

module.exports = router;
