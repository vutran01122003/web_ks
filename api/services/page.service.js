const Page = require('../models/page.model');

class PageService {
    static createPage = async (data) => {
        try {
            const { pageName, tables } = data;

            const createdPage = await Page.create({
                pageName,
                tables
            });

            return createdPage;
        } catch (error) {
            console.log(error);
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
}

module.exports = PageService;
