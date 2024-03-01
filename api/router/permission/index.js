const router = require('express').Router();
const permissionControllers = require('../../controllers/permission.controllers');
const { auth } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.get('/routes', permissionControllers.getRegistedRoutes);

router.get('/groups', auth, checkPermission, permissionControllers.getAllGroup);
router.post('/groups', permissionControllers.createGroup);
router.patch('/groups/:groupId', permissionControllers.updateGroupById);
router.delete('/groups/:groupId', auth, permissionControllers.deleteGroup);

router.post('/roles', auth, checkPermission, permissionControllers.createRole);
router.delete('/roles/:roleId', auth, checkPermission, permissionControllers.deleteRole);

router.post('/groups/:groupId/roles', permissionControllers.grantPermissionsToGroup);
router.delete('/groups/:groupId/roles/:roleId', auth, permissionControllers.revokePermissionsToGroup);

module.exports = router;
