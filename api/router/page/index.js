const router = require('express').Router();
const pageControllers = require('../../controllers/page.controllers');
const { auth } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.post('/page', auth, checkPermission, pageControllers.createPage);

router.get('/page', auth, checkPermission, pageControllers.getAllPage);

router.get('/page/activities', auth, checkPermission, pageControllers.getActivities);

router.get('/page/:name', auth, checkPermission, pageControllers.getPage);

router.delete('/page', auth, checkPermission, pageControllers.removePage);

module.exports = router;
