const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");
const progressControllers = require("../../controllers/progress.controllers");

const router = require("express").Router();

router.get("/progress", auth, progressControllers.getProgressByYear);

router.get("/progress/all", auth, checkPermission, progressControllers.getAllProgress);

router.post("/progress/process", auth, progressControllers.updateUserActivityStatusByMajor);
router.post("/progress/confirm", auth, progressControllers.confirmUpdateUserActivityStatusByMajor);
router.post("/progress/revert", auth, progressControllers.revertProgress);
module.exports = router;
