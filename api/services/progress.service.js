const UserService = require("./user.service");
const PageService = require("./page.service");
const convertToObjectId = require("../utils/convertToObjectId");
const FacultyService = require("./faculty.service");

class ProgressService {
    static getProgressByYear = async ({ pageStudentMajor, pageStudentLevelYear, pageStudentCohort, userId }) => {
        try {
            const filterArr = [{ $in: ["$_id", "$$rowIds"] }, { $eq: ["$user", convertToObjectId(userId)] }];

            if (!userId) filterArr.splice(1, 1);

            const pageDetailsList = await PageService.getPageDetailsList({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort,
                filterArr,
            });

            return pageDetailsList;
        } catch (error) {
            throw error;
        }
    };

    static getAllProgress = async ({
        major,
        cohort,
        faculty,
        userId,
        levelYear,
        sortProgressPercentageValue,
        queryString,
    }) => {
        try {
            const currentLevelYear = await FacultyService.getCurrentLevelYearOfCohort({
                facultyName: faculty,
                majorName: major,
                cohortName: cohort,
            });

            const filterData = {
                major: major.toLowerCase(),
                cohort: parseInt(cohort),
                userId: userId
                    ? {
                          $regex: userId,
                      }
                    : userId,
                isActive: true,
            };

            if (levelYear < currentLevelYear) delete filterData.isActive;
            if (!userId) delete filterData.userId;

            const studentList = await UserService.getAnnualTaskProgress({
                filterData,
                levelYear,
                sortProgressPercentageValue,
                queryString,
            });

            return studentList;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = ProgressService;
