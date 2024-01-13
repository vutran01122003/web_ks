const mongoose = require('mongoose');
const UserService = require('./user.service');
const PageService = require('./page.service');

class ProgressService {
    static getProgressByYear = async ({
        pageStudentMajor,
        pageStudentLevelYear,
        pageStudentCohort,
        userId
    }) => {
        const filterArr = [
            { $in: ['$_id', '$$rowIds'] },
            { $eq: ['$user', new mongoose.Types.ObjectId(userId)] }
        ];

        if (!userId) filterArr.splice(1, 1);

        try {
            const pageDetailsList = await PageService.getPageDetailsList({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort,
                filterArr
            });

            return pageDetailsList;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    static getAllProgress = async ({
        major,
        cohort,
        levelYear,
        filterCompletedTaskProgress,
        sortProgress
    }) => {
        try {
            const studentList = await UserService.getAnnualTaskProgress({
                major,
                cohort,
                levelYear,
                filterCompletedTaskProgress,
                sortProgress
            });

            return studentList;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = ProgressService;
