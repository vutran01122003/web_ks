const router = require("express").Router();
const permissionControllers = require("../../controllers/permission.controllers");
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");

router.get("/routes", permissionControllers.getRegistedRoutes);

router.get("/groups", auth, checkPermission, permissionControllers.getAllGroup);
router.post("/groups", auth, checkPermission, permissionControllers.createGroup);
router.patch("/groups/:groupId", auth, checkPermission, permissionControllers.updateGroupById);
router.delete("/groups/:groupId", auth, checkPermission, permissionControllers.deleteGroup);

router.post("/roles", auth, checkPermission, permissionControllers.createRole);
router.delete("/roles/:roleId", auth, checkPermission, permissionControllers.deleteRole);

router.post("/groups/:groupId/roles", auth, checkPermission, permissionControllers.grantPermissionsToGroup);
router.delete("/groups/:groupId/roles/:roleId", auth, checkPermission, permissionControllers.revokePermissionsToGroup);

module.exports = router;
