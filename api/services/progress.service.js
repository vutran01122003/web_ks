const UserService = require("./user.service");
const PageService = require("./page.service");
const convertToObjectId = require("../utils/convertToObjectId");
const FacultyService = require("./faculty.service");
const createHttpError = require("http-errors");

const { TEMPORARY_TALENT_ENGINEER_CODE, TALENT_ENGINEER_CODE } = process.env;
const [COHORT_PENDING_STATUS, COHORT_PROCESS_STATUS, COHORT_DONE_STATUS] = ["pending", "process", "done"];

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
        major,
        cohort,
        levelYear,
        groupCode,
        queryString,
        sortProgressPercentage
    }) => {
        try {
            const [majorData, cohortData] = await Promise.all([
                FacultyService.getMajorByName({ majorName: major.toLowerCase() }),
                FacultyService.getCohortByName({ majorName: major.toLowerCase(), cohortName: cohort.toLowerCase() })
            ]);

            const filterData = {
                major: majorData._id,
                cohort: cohortData._id,
                userId: userId
                    ? {
                          $regex: userId
                      }
                    : userId,
                isActive: true
            };

            if (levelYear < cohortData.currentLevelYear) delete filterData.isActive;
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

    static async revertProgress({ majorName, cohortName, groupCode, levelYear }) {
        try {
            if (groupCode === TEMPORARY_TALENT_ENGINEER_CODE) {
                await FacultyService.updateAdditionalApplyCohort({
                    majorName,
                    cohortName,
                    approvedUsers: [],
                    rejectedUsers: [],
                    status: COHORT_PENDING_STATUS
                });
            } else {
                const [majorData, cohortData] = await Promise.all([
                    FacultyService.getMajorByName({ majorName }),
                    FacultyService.getCohortByName({
                        majorName,
                        cohortName
                    })
                ]);

                await FacultyService.updateCohortById({
                    majorId: majorData._id,
                    cohortId: cohortData._id,
                    data: {
                        levelYear,
                        approvedUsers: [],
                        rejectedUsers: [],
                        status: COHORT_PENDING_STATUS
                    }
                });
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProgressService;
