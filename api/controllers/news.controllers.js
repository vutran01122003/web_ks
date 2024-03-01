const NewsService = require('../services/news.service');
const UploadService = require('../services/upload.service');
const createError = require('http-errors');

class NewsControllers {
    createNews = async (req, res, next) => {
        try {
            if (req.files.length <= 0) throw createError.BadRequest('Bài viết không có ảnh thu gọn');

            const userId = res.locals.userId;

            const uploadedFiles = await UploadService.uploadFilesToS3({
                files: req.files,
                folderName: `news_images`
            });

            const createdNews = await NewsService.createNews({
                newsData: {
                    ...req.body,
                    author: userId,
                    cover: uploadedFiles[0].Location
                }
            });

            res.status(201).json({
                status: 201,
                msg: 'Tạo tin tức thành công',
                data: createdNews
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
    getAllNews = async (req, res, next) => {
        try {
            const newsType = req.query.news_type;
            const news = await NewsService.getAllNews({ newsType });

            res.status(200).json({
                status: news.status,
                msg: news.msg,
                data: news.data
            });
        } catch (error) {
            next(error);
        }
    };
    getNewsDetails = async (req, res, next) => {
        try {
            const newsId = req.params.id;
            const newsDetails = await NewsService.getNewsDetails({ newsId });

            res.status(200).json({
                status: newsDetails.status,
                msg: newsDetails.msg,
                data: newsDetails.data
            });
        } catch (error) {
            next(error);
        }
    };
    updateNews = async (req, res, next) => {
        try {
            const { newsId, ...newsData } = req.body;
            const updatedNews = await NewsService.updateNews({ newsId, newsData });

            res.status(200).json({
                data: updatedNews.data,
                status: updatedNews.status,
                msg: updatedNews.msg
            });
        } catch (error) {
            next(error);
        }
    };
    deleteNews = async (req, res, next) => {
        const { newsId } = req.body;
        const deletedNews = await NewsService.deleteNews({ newsId });

        res.status(200).json({
            status: updatedNews.status,
            msg: deletedNews.msg
        });
    };
}

module.exports = new NewsControllers();
