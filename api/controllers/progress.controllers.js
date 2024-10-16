const createError = require("http-errors");
const FacultyService = require("../services/faculty.service");
const ProgressService = require("../services/progress.service");
const UserService = require("../services/user.service");
const PermissionService = require("../services/permission.service");
const [FACULTY_MANAGER, ADMIN] = ["003", "004"];
const { VITE_APP_FACULTY_MANAGER_CODE, VITE_APP_ADMIN_CODE, TEMPORARY_TALENT_ENGINEER_TYPE, TALENT_ENGINEER_TYPE } =
    process.env;
const [ACCEPTED_STATUS, PENDING_STATUS, REJECTED_STATUS, RESUMBITED_STATUS] = [
    "đã duyệt",
    "chờ duyệt",
    "từ chối",
    "phải nộp lại",
];

class ProgressControllers {
    getProgressByYear = async (req, res, next) => {
        try {
            const { userId, pageStudentMajor, pageStudentLevelYear, pageStudentCohort } = req.query;
            const { groupCode } = res.locals.userData.group;

            const pageDetailsList = await ProgressService.getProgressByYear({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort,
                userId: userId,
                groupCode,
            });

            const completedTasks = pageDetailsList.reduce((arr, page) => {
                const tables = {};

                let quantityDemanded = 0;
                let completedTasksNum = 0;

                page.tables.forEach((table) => {
                    quantityDemanded += table.quantityDemanded;

                    tables[table.tableName] = {
                        tableId: table._id,
                        quantityDemanded: table.quantityDemanded,
                        tableDescription: table?.description,
                        acceptedTasksNum: 0,
                        rejectedTasksNum: 0,
                        resubmitedTasksNum: 0,
                        pendingTasksNum: 0,
                    };

                    table.rowValueList[0]?.content.forEach((content) => {
                        switch (content.status) {
                            case ACCEPTED_STATUS:
                                tables[table.tableName].acceptedTasksNum += 1;
                                completedTasksNum += 1;
                                break;
                            case REJECTED_STATUS:
                                tables[table.tableName].rejectedTasksNum += 1;
                                break;
                            case PENDING_STATUS:
                                tables[table.tableName].pendingTasksNum += 1;
                                break;
                            case RESUMBITED_STATUS:
                                tables[table.tableName].resubmitedTasksNum += 1;
                                break;
                            default:
                                break;
                        }
                    });
                });

                return [
                    ...arr,
                    {
                        pageId: page._id,
                        pageName: page.pageName,
                        quantityDemanded,
                        completedTasksNum,
                        percent: Number.parseFloat((completedTasksNum / quantityDemanded) * 100),
                        tables,
                    },
                ];
            }, []);

            res.status(200).json({
                status: 200,
                msg: "Lấy Quá Trình Hoàn Thành Chỉ Tiêu Theo Năm Thành Công",
                data: completedTasks,
            });
        } catch (error) {
            next(error);
        }
    };

    getAllProgress = async (req, res, next) => {
        try {
            const { major, cohort, groupCode, faculty, levelYear, userId, sortProgressPercentage, page, limit } =
                req.query;
            const studentList = await ProgressService.getAllProgress({
                major,
                cohort,
                faculty,
                userId,
                levelYear,
                groupCode,
                sortProgressPercentage: parseInt(sortProgressPercentage),
                queryString: {
                    page,
                    limit,
                },
            });

            res.status(200).json({
                msg: "Lấy danh sách tiến độ hoàn thành hoạt động thành công",
                data: studentList,
            });
        } catch (error) {
            next(error);
        }
    };

    updateUserActivityStatusByMajor = async (req, res, next) => {
        try {
            const { major, cohort, faculty, levelYear } = req.body;

            const [currentLevelYear, groupList] = await Promise.all([
                FacultyService.getCurrentLevelYearOfCohort({
                    facultyName: faculty,
                    majorName: major,
                    cohortName: cohort,
                }),
                PermissionService.getGroupsByGroupCode({ groupCodeList: [FACULTY_MANAGER, ADMIN] }),
            ]);

            const groupIdList = groupList.map((group) => group._id);

            if (levelYear < currentLevelYear)
                throw createError.BadRequest(`Hoạt động nộp minh chứng năm ${levelYear} đã kết thúc`);

            await UserService.updateUserActivityStatusByMajor({ ...req.body, groupIdList });

            res.status(200).json({
                status: 200,
                msg: `Kết thúc hoạt động nộp minh chứng của sinh viên khóa ${cohort} ngành ${major}`,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new ProgressControllers();
