const chatControllers = require('../../controllers/chat.controllers');
const router = require('express').Router();
const { auth } = require('../../middleware/auth');

router.route('/chat').get(auth, chatControllers.getTypeChat).post(auth, chatControllers.handleChat);

module.exports = router;
