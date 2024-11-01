const newsControllers = require("../../controllers/news.controllers");
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");
const router = require("express").Router();
const upload = require("multer")();

router.get("/news", auth, checkPermission, newsControllers.getAllNews);
router.post("/news", auth, checkPermission, upload.array("cover"), newsControllers.createNews);
router.get("/news/:id", auth, newsControllers.getNewsDetails);

// router.patch('/news', auth, checkPermission, newsControllers.updateNews);
// router.delete('/news', auth, checkPermission, newsControllers.deleteNews);

module.exports = router;
