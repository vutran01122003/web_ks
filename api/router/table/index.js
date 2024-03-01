const router = require('express').Router();
const tableControllers = require('../../controllers/table.controllers');
const { auth } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.post('/table', auth, checkPermission, tableControllers.addTable);

router.patch('/table', auth, checkPermission, tableControllers.updateTable);

router.delete('/table', auth, checkPermission, tableControllers.removeTable);

module.exports = router;
