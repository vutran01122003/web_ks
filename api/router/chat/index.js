const chatControllers = require("../../controllers/chat.controllers");
const router = require("express").Router();
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");

router.get("/chat", auth, checkPermission, chatControllers.getTypeChat);
router.post("/chat", auth, checkPermission, chatControllers.handleChat);

module.exports = router;
