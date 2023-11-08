const postControllers = require('../../controllers/post.controllers');
const auth = require('../../middleware/auth');
const router = require('express').Router();

router
    .route('/post')
    .get(postControllers.getAllPost)
    .post(postControllers.createPost)
    .patch(postControllers.updatePost)
    .delete(postControllers.deletePost);

router.get('/post/:id', postControllers.getPost);

module.exports = router;
