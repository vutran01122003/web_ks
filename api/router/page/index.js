const router = require("express").Router();
const pageControllers = require("../../controllers/page.controllers");
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");
const validateResource = require("../../middleware/validateResource");
const pageSchema = require("../../schema/goal.schema");

router.get("/pages", auth, checkPermission, pageControllers.getPages);
router.get("/page/activities", auth, checkPermission, pageControllers.getActivities);
router.get("/page/:name", auth, checkPermission, pageControllers.getPage);
router.post("/page", auth, checkPermission, validateResource(pageSchema), pageControllers.createPage);
router.patch("/page", auth, checkPermission, pageControllers.updateStatusPage);
router.delete("/page", auth, checkPermission, pageControllers.removePage);

module.exports = router;
