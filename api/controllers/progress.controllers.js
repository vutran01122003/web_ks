const ProgressService = require('../services/progress.service');

class ProgressControllers {
    getProgressByYear = async (req, res, next) => {
        try {
            const { pageStudentMajor, pageStudentLevelYear, pageStudentCohort } = req.query;

            const pageDetailsList = await ProgressService.getProgressByYear({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort,
                userId: res.locals.userId
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
                        completedTasksNum: 0,
                        rejectedTasksNum: 0
                    };

                    table.rowValueList[0]?.content.forEach((content) => {
                        if (content.status === 'Đã Duyệt') {
                            completedTasksNum += 1;
                            tables[table.tableName].completedTasksNum += 1;
                        } else if (content.status === 'Từ Chối') {
                            tables[table.tableName].rejectedTasksNum += 1;
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
}

module.exports = new ProgressControllers();
