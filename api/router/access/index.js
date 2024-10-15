const router = require("express").Router();
const accessControllers = require("../../controllers/access.controllers");
const { auth } = require("../../middleware/auth");
const validateResource = require("../../middleware/validateResource");
const registerSchema = require("../../schema/register.schema");

router.get("/access-token", auth, accessControllers.getInfoUser);
router.post("/login", accessControllers.login);
router.get("/logout", accessControllers.logout);
router.post("/register", validateResource(registerSchema), accessControllers.register);

module.exports = router;
