const UserService = require("./user.service");
const PageService = require("./page.service");
const convertToObjectId = require("../utils/convertToObjectId");
const FacultyService = require("./faculty.service");
const createHttpError = require("http-errors");

class ProgressService {
    static getProgressByYear = async ({ userId, pageStudentMajor, pageStudentLevelYear, pageStudentCohort }) => {
        try {
            const filterArr = [{ $in: ["$_id", "$$rowIds"] }, { $eq: ["$user", convertToObjectId(userId)] }];
            const user = await UserService.getUserAndPopulateGroupById({ id: userId });

            if (!userId) filterArr.splice(1, 1);
            if (!user) throw createHttpError("Người dùng không tồn tại");

            const pageDetailsList = await PageService.getPageDetailsList({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort,
                filterArr,
                groupCode: user.groups[0].groupCode
            });

            return pageDetailsList;
        } catch (error) {
            throw error;
        }
    };

    static getAllProgress = async ({
        userId,
        faculty,
        major,
        cohort,
        levelYear,
        groupCode,
        queryString,
        sortProgressPercentage
    }) => {
        try {
            const currentLevelYear = await FacultyService.getCurrentLevelYearOfCohort({
                facultyName: faculty.toLowerCase(),
                majorName: major.toLowerCase(),
                cohortName: cohort.toLowerCase()
            });

            const filterData = {
                major: major.toLowerCase(),
                cohort,
                userId: userId
                    ? {
                          $regex: userId
                      }
                    : userId,
                isActive: true
            };

            if (levelYear < currentLevelYear) delete filterData.isActive;
            if (!userId) delete filterData.userId;

            const studentList = await UserService.getAnnualTaskProgress({
                filterData,
                levelYear,
                groupCode,
                sortProgressPercentage: sortProgressPercentage * 1,
                queryString
            });

            return studentList;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = ProgressService;
