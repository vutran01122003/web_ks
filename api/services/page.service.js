const Page = require('../models/page.model');
const createError = require('http-errors');

class PageService {
    static createPage = async (data) => {
        try {
            const { pageName, tables } = data;

            const isExists = await Page.findOne({ pageName }).lean();
            if (isExists) throw createError(409, 'Tên Page Đã Tồn Tại');

            const createdPage = await Page.create({
                pageName,
                tables
            });

            return createdPage;
        } catch (error) {
            throw error;
        }
    };

    static getAllPage = async () => {
        try {
            const pages = await Page.find();
            return pages;
        } catch (error) {
            throw error;
        }
    };

    static getPage = async ({ pageName, userId }) => {
        try {
            const page = await Page.findOne({ pageName })
                .populate({
                    path: 'tables',
                    populate: {
                        path: 'rowValueList',
                        model: 'row',
                        select: 'content proofImageList',
                        match: { user: userId }
                    }
                })
                .lean();
            return page;
        } catch (error) {
            throw error;
        }
    };

    static removePage = async ({ pageId }) => {
        try {
            await Page.findOneAndDelete({ _id: pageId });

            return {
                status: 200,
                msg: 'Xóa page thành công'
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = PageService;
