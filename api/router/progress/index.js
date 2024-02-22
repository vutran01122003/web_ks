const { auth } = require('../../middleware/auth');
const progressControllers = require('../../controllers/progress.controllers');
const userControllers = require('../../controllers/user.controllers');

const router = require('express').Router();

router.get('/progress', auth, progressControllers.getProgressByYear);

router.get('/progress/all', auth, progressControllers.getAllProgress);

router.post('/progress/updated-users', auth, userControllers.updateUserActivityStatusByMajor);

module.exports = router;
