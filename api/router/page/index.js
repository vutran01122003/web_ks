const router = require('express').Router();
const fetch = require('node-fetch');
const pageControllers = require('../../controllers/page.controllers');
const { auth } = require('../../middleware/auth');

router.post('/page', auth, pageControllers.createPage);

router.get('/page', auth, pageControllers.getAllPage);

router.get('/page/:page', auth, pageControllers.getPage);

module.exports = router;
