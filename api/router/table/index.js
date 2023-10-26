const router = require('express').Router();
const rowControllers = require('../../controllers/row.controllers');
const { auth } = require('../../middleware/auth');

router.post('/row', auth, rowControllers.addRow);

module.exports = router;
