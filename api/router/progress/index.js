const { auth } = require('../../middleware/auth');
const progressControllers = require('../../controllers/progress.controllers');
const router = require('express').Router();

router.get('/progress', auth, progressControllers.getProgressByYear);

module.exports = router;
