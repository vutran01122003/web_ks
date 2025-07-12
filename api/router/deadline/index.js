const router = require("express").Router();
const deadlineController = require("../../controllers/deadline.controllers");
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");

router.post("/deadline", auth, checkPermission, deadlineController.createDeadline);
router.get("/deadline", auth, checkPermission, deadlineController.getDeadlineList);
router.patch("/deadline", auth, checkPermission, deadlineController.updateDeadline);

module.exports = router;
