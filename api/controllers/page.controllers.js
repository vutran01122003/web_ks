const PageService = require('../services/page.service');
const pageService = require('../services/page.service');

class PageControllers {
    createPage = async (req, res, next) => {
        try {
            const createdPage = await pageService.createPage(req.body);

            res.status(201).json({
                status: createdPage.status,
                msg: createdPage.msg,
                data: createdPage.data
            });
        } catch (error) {
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

    getActivities = async (req, res, next) => {
        try {
            const { pageStudentMajor, pageStudentCohort, pageStudentLevelYear } = req.query;
            const activities = await pageService.getActivities({
                pageStudentMajor,
                pageStudentCohort,
                pageStudentLevelYear
            });

            return res.status(200).json({
                status: 'Lấy Toàn Bộ Hoạt Động Thành Công',
                data: activities || []
            });
        } catch (error) {}
    };

    getPage = async (req, res, next) => {
        const page = await pageService.getPage({
            pageName: req.params?.name,
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
