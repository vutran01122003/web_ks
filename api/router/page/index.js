const router = require("express").Router();
const pageControllers = require("../../controllers/page.controllers");
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");
const validateResource = require("../../middleware/validateResource");
const pageSchema = require("../../schema/goal.schema");
const { getPageByNameSchema } = require("../../schema/page.schema");

router.get("/pages", auth, checkPermission, pageControllers.getPages);
router.get("/page/:pageName", auth, checkPermission, validateResource(getPageByNameSchema), pageControllers.getPage);
router.get("/page/activities", auth, checkPermission, pageControllers.getActivities);
router.post("/page", auth, checkPermission, validateResource(pageSchema), pageControllers.createPage);
router.patch("/page", auth, checkPermission, pageControllers.updateStatusPage);
router.delete("/page", auth, checkPermission, pageControllers.removePage);

module.exports = router;
