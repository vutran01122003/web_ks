const PageService = require("../services/page.service");
const pageService = require("../services/page.service");

const { TEMPORARY_TALENT_ENGINEER_TYPE, TALENT_ENGINEER_TYPE } = process.env;

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
            const { groupCode } = res.locals.userData.group;

            let pages = [];
            if (userId) {
                const { pageStudentCohort, pageStudentLevelYear } = fields;

                if ([TEMPORARY_TALENT_ENGINEER_TYPE, TALENT_ENGINEER_TYPE].includes(groupCode))
                    fields.pageTalentEngineerType = groupCode;
                if (pageStudentCohort) fields.pageStudentCohort = parseInt(pageStudentCohort);
                if (pageStudentLevelYear) fields.pageStudentLevelYear = parseInt(pageStudentLevelYear);

                pages = await pageService.getPages(fields, userId);
            } else {
                pages = await pageService.getGoals(fields);
            }

            res.status(200).json({
                status: "Lấy dữ liệu trang thành công",
                data: pages
            });
        } catch (error) {
            next(error);
        }
    };

    getActivities = async (req, res, next) => {
        try {
            const { pageStudentMajor, pageStudentCohort, pageStudentLevelYear, pageTalentEngineerType } = req.query;
            const activities = await pageService.getActivities({
                pageStudentMajor,
                pageStudentCohort,
                pageStudentLevelYear,
                pageTalentEngineerType
            });

            return res.status(200).json({
                status: "Lấy Toàn Bộ Hoạt Động Thành Công",
                data: activities || []
            });
        } catch (error) {
            next(error);
        }
    };

    getPage = async (req, res, next) => {
        const { major, cohort, faculty } = req.query;
        const { groupCode } = res.locals.userData.group;
        const fields = {
            pageName: req.params?.name,
            pageStudentMajor: major,
            pageStudentCohort: parseInt(cohort),
            pageFaculty: faculty
        };

        if ([TEMPORARY_TALENT_ENGINEER_TYPE, TALENT_ENGINEER_TYPE].includes(groupCode))
            fields.pageTalentEngineerType = groupCode;

        const page = await pageService.getPage({
            fields,
            userId: res.locals.userData._id
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
