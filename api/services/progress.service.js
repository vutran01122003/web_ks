const UserService = require("./user.service");
const PageService = require("./page.service");
const convertToObjectId = require("../utils/convertToObjectId");
const FacultyService = require("./faculty.service");

const { TEMPORARY_TALENT_ENGINEER_CODE } = process.env;

class ProgressService {
    static getProgressByYear = async ({
        pageStudentMajor,
        pageStudentLevelYear,
        pageStudentCohort,
        userId,
        groupCode,
    }) => {
        try {
            const filterArr = [{ $in: ["$_id", "$$rowIds"] }, { $eq: ["$user", convertToObjectId(userId)] }];

            if (!userId) filterArr.splice(1, 1);

            const pageDetailsList = await PageService.getPageDetailsList({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort,
                filterArr,
                groupCode,
            });

            return pageDetailsList;
        } catch (error) {
            throw error;
        }
    };

    static getAllProgress = async ({
        major,
        cohort,
        groupCode,
        faculty,
        userId,
        levelYear,
        sortProgressPercentage,
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
                additionalLevelYears: { $in: [+levelYear] },
                isActive: true,
            };

            if (levelYear < currentLevelYear) delete filterData.isActive;
            if (!userId) delete filterData.userId;
            if (groupCode !== TEMPORARY_TALENT_ENGINEER_CODE) delete filterData.additionalLevelYears;

            const studentList = await UserService.getAnnualTaskProgress({
                filterData,
                levelYear,
                groupCode,
                sortProgressPercentage: sortProgressPercentage * 1,
                queryString,
            });

            return studentList;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
}

module.exports = ProgressService;
