const router = require("express").Router();
const deadlineController = require("../../controllers/deadline.controllers");

router.post("/deadline", deadlineController.createDeadline);
router.get("/deadline", deadlineController.getDeadlineList);
router.patch("/deadline", deadlineController.updateDeadline);

module.exports = router;
