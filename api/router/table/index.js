const router = require('express').Router();
const tableControllers = require('../../controllers/table.controllers');
const { auth } = require('../../middleware/auth');

router.post('/table', auth, tableControllers.addTable);

router.patch('/table', auth, tableControllers.updateTable);

router.delete('/table', auth, tableControllers.removeTable);

module.exports = router;
