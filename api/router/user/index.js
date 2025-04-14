const router = require("express").Router();
const userControllers = require("../../controllers/user.controllers");
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");

router.post("/users/:userId/groups/:groupId", userControllers.addGroupForUser);
router.get("/users", auth, userControllers.getUsers);
router.get("/users/groups", auth, userControllers.getUsersByGroup);
router.get("/users/:userId", auth, checkPermission, userControllers.getUserByUserId);
router.patch("/users/:userId", auth, userControllers.updateUser);
module.exports = router;
