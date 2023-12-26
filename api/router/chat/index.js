const chatControllers = require('../../controllers/chat.controllers')
const router = require('express').Router()
// const { auth } = require('../../middleware/auth');

router.route('/chat').get(chatControllers.getTypeChat).post(chatControllers.handleChat)
module.exports = router
