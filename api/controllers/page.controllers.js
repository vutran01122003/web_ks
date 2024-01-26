const PageService = require('../services/page.service');
const pageService = require('../services/page.service');
const createError = require('http-errors');

class PageControllers {
    createPage = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ quyền tạo trang');

            const createdPage = await pageService.createPage(req.body);

            res.status(201).json({
                status: createdPage.status,
                msg: createdPage.msg,
                data: createdPage.data
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    getAllPage = async (req, res, next) => {
        try {
            const pages = await pageService.getAllPage();
            res.status(200).json({
                status: 'Lấy Toàn Bộ Page Thành Công',
                data: pages || []
            });
        } catch (error) {
            next(error);
        }
    };

    getPage = async (req, res, next) => {
        const page = await pageService.getPage({
            pageName: req.params?.page,
            userId: res.locals.userId
        });

        try {
            res.status(200).json({
                status: page.status,
                data: page.data,
                msg: page.msg
            });
        } catch (error) {
            next(error);
        }
    };

    removePage = async (req, res, next) => {
        try {
            const { pageId } = req.body;

            const removedPage = await PageService.removePage({ pageId });

            res.status(200).json({
                status: removedPage.status,
                msg: removedPage.msg
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new PageControllers();
