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

    getPages = async (req, res, next) => {
        try {
            const { userId, ...fields } = req.query;
            let pages = [];

            if (userId) {
                const { pageStudentCohort, pageStudentLevelYear } = fields;

                if (pageStudentCohort) fields.pageStudentCohort = parseInt(pageStudentCohort);
                if (pageStudentLevelYear) fields.pageStudentLevelYear = parseInt(pageStudentLevelYear);

                pages = await pageService.getPages(fields, userId);
            } else {
                pages = await pageService.getGoals(fields);
            }

            res.status(200).json({
                status: 'Lấy dữ liệu trang thành công',
                data: pages
            });
        } catch (error) {
            console.log(error);
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
        } catch (error) {
            next(error);
        }
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

    updateStatusPage = async (req, res, next) => {
        try {
            const { pageId, currentStatus } = req.body;

            const updatedPage = await PageService.updateStatusPage({ pageId, currentStatus });

            res.status(200).json({
                status: updatedPage.status,
                msg: updatedPage.msg
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
