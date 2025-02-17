const excelService = require("../services/excel.service");
const FacultyService = require("../services/faculty.service");
const UserService = require("../services/user.service");

class ExcelController {
    exportQualifiedUsersExcel = async (req, res, next) => {
        try {
            const { cohort, groupCode, major, status, sortByName } = req.query;

            const qualifiedUsersData = await UserService.getUsersByFields({
                fields: {
                    cohort: parseInt(cohort),
                    major,
                    isActive: status ? status === "true" : undefined
                },
                groupCode,
                sort: {
                    firstName: parseInt(sortByName)
                }
            });

            const workbook = await excelService.exportQualifiedUsersExcel(qualifiedUsersData);

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            res.setHeader("Content-Disposition", `attachment; filename=${Math.floor(new Date() / 1000)}.xlsx`);

            workbook.xlsx
                .write(res)
                .then(() => {
                    if (!res.headersSent) {
                        res.status(200).end();
                    }
                })
                .catch((error) => {
                    throw error;
                });
        } catch (error) {
            next(error);
        }
    };

    exportProgressStatisticsExcel = async (req, res, next) => {
        try {
            const { major, cohort, groupCode, faculty, levelYear, userId, sortProgressPercentage } = req.query;

            const currentLevelYear = await FacultyService.getCurrentLevelYearOfCohort({
                facultyName: faculty.toLowerCase(),
                majorName: major.toLowerCase(),
                cohortName: cohort
            });

            const filterData = {
                major: major.toLowerCase(),
                cohort: +cohort,
                userId: userId
                    ? {
                          $regex: userId
                      }
                    : userId,
                isActive: true
            };

            if (levelYear < currentLevelYear) delete filterData.isActive;
            if (!userId) delete filterData.userId;

            const progressStatisticsData = await UserService.getAnnualTaskProgress({
                filterData,
                levelYear,
                groupCode,
                sortProgressPercentage: sortProgressPercentage * 1
            });

            const workbook = await excelService.exportProgressStatisticsExcel(progressStatisticsData);

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            res.setHeader("Content-Disposition", `attachment; filename=${Math.floor(new Date() / 1000)}.xlsx`);

            workbook.xlsx
                .write(res)
                .then(() => {
                    if (!res.headersSent) {
                        res.status(200).end();
                    }
                })
                .catch((error) => {
                    throw error;
                });
        } catch (error) {
            next(error);
        }
    };

    importUsers = async (req, res, next) => {
        try {
            await excelService.importUser(req);

            res.status(200).json({
                status: 200,
                msg: "Thêm sinh viên mới thành công"
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new ExcelController();
