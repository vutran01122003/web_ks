const newsControllers = require('../../controllers/news.controllers');
const { auth } = require('../../middleware/auth');
const router = require('express').Router();
const upload = require('multer')();

router
    .route('/news')
    .get(auth, newsControllers.getAllNews)
    .post(auth, upload.array('cover'), newsControllers.createNews)
    .patch(auth, newsControllers.updateNews)
    .delete(auth, newsControllers.deleteNews);

router.get('/news/:id', auth, newsControllers.getNewsDetails);

module.exports = router;
