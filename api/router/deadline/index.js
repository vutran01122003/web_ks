const router = require("express").Router();
const deadlineController = require("../../controllers/deadline.controllers");
const { auth } = require("../../middleware/auth");

router.post("/deadline", auth, deadlineController.createDeadline);
router.get("/deadline", auth, deadlineController.getDeadlineList);
router.patch("/deadline", auth, deadlineController.updateDeadline);

module.exports = router;
