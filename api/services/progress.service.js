const UserService = require('./user.service');
const PageService = require('./page.service');
const convertToObjectId = require('../utils/convertToObjectId');

class ProgressService {
    static getProgressByYear = async ({ pageStudentMajor, pageStudentLevelYear, pageStudentCohort, userId }) => {
        try {
            const filterArr = [{ $in: ['$_id', '$$rowIds'] }, { $eq: ['$user', convertToObjectId(userId)] }];

            if (!userId) filterArr.splice(1, 1);

            const pageDetailsList = await PageService.getPageDetailsList({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort,
                filterArr
            });

            return pageDetailsList;
        } catch (error) {
            throw error;
        }
    };

    static getAllProgress = async ({ major, cohort, userId, levelYear, sort, queryString }) => {
        try {
            const filterData = {
                major: major.toLowerCase(),
                cohort: parseInt(cohort),
                userId: userId
                    ? {
                          $regex: userId
                      }
                    : userId
            };

            if (!userId) delete filterData.userId;

            const studentList = await UserService.getAnnualTaskProgress({
                filterData,
                levelYear,
                sort,
                queryString
            });

            return studentList;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = ProgressService;
