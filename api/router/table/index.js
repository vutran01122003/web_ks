const upload = require('multer')();

const router = require('express').Router();
const rowControllers = require('../../controllers/row.controllers');
const { auth } = require('../../middleware/auth');

// upload.array('photos', 12)
router.post('/row', auth, upload.array('files'), rowControllers.addRow);

module.exports = router;
