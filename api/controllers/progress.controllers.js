const ProgressService = require('../services/progress.service');
const [ACCEPTED_STATUS, PENDING_STATUS, REJECTED_STATUS, RESUMBITED_STATUS] = [
    'đã duyệt',
    'chờ duyệt',
    'từ chối',
    'phải nộp lại'
];

class ProgressControllers {
    getProgressByYear = async (req, res, next) => {
        try {
            const { userId, pageStudentMajor, pageStudentLevelYear, pageStudentCohort } = req.query;

            const pageDetailsList = await ProgressService.getProgressByYear({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort,
                userId: userId
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
                        pendingTasksNum: 0
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
                        tables
                    }
                ];
            }, []);

            res.status(200).json({
                status: 200,
                msg: 'Lấy Quá Trình Hoàn Thành Chỉ Tiêu Theo Năm Thành Công',
                data: completedTasks
            });
        } catch (error) {
            next(error);
        }
    };

    getAllProgress = async (req, res, next) => {
        try {
            const { major, cohort, levelYear, sortProgress } = req.query;

            const studentList = await ProgressService.getAllProgress({
                major,
                cohort,
                levelYear,
                sortProgress
            });

            res.status(200).json({
                msg: 'Lấy danh sách sinh viên thành công',
                data: studentList
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new ProgressControllers();
