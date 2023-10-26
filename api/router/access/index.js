const router = require('express').Router();
const accessControllers = require('../../controllers/access.controllers');
const { auth } = require('../../middleware/auth');

router.get('/access_token', auth, accessControllers.getInfoUser);
router.post('/login', accessControllers.login);
router.get('/logout', accessControllers.logout);
router.post('/register', accessControllers.register);

module.exports = router;
