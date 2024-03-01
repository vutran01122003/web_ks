const News = require('../models/news.model');
const createError = require('http-errors');

class NewsService {
    static createNews = async ({ newsData }) => {
        try {
            const createdNews = await News.create(newsData);

            return createdNews;
        } catch (error) {
            throw error;
        }
    };
    static getAllNews = async ({ newsType }) => {
        try {
            const news = await News.find({ newsType })
                .select('cover title summary author createdAt')
                .populate({
                    path: 'author',
                    model: 'user',
                    select: 'fullName avatar'
                })
                .lean()
                .exec();

            if (!news) throw createError.NotFound(`Không Tồn Tại Tin Tức Có Chủ Đề ${newsType}`);

            return {
                status: 200,
                msg: 'Lấy toàn bộ tin tức thành công',
                data: news
            };
        } catch (error) {
            throw error;
        }
    };
    static getNewsDetails = async ({ newsId }) => {
        try {
            const newsDetails = await News.findById(newsId)
                .populate({
                    path: 'author',
                    model: 'user',
                    select: 'fullName avatar'
                })
                .lean()
                .exec();

            if (!newsDetails) throw createError.NotFound('Bài Viết Không Tồn Tại');

            return {
                status: 200,
                msg: 'Lấy tin tức thành công',
                data: newsDetails
            };
        } catch (error) {
            throw error;
        }
    };
    static updateNews = async ({ newsId, newsData }) => {
        try {
            const updatedNews = await News.findByIdAndUpdate({ _id: newsId }, newsData, {
                new: true
            })
                .lean()
                .exec();

            if (!updatedNews) {
                return {
                    status: 400,
                    msg: 'Bài viết không tồn tại'
                };
            }

            return {
                status: 200,
                msg: `Cập nhật bài viết thành công`,
                data: updatedNews
            };
        } catch (error) {
            throw error;
        }
    };
    static deleteNews = async ({ newsId }) => {
        try {
            const deletedNews = await News.findByIdAndDelete(newsId);

            if (!deletedNews) {
                return {
                    status: 400,
                    msg: 'Bài viết không tồn tại'
                };
            }

            return {
                status: 200,
                msg: 'Xóa bài viết thành công'
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = NewsService;
