const User = require('../models/user.model');

class UserService {
    static updateActiveUsers = async ({ progressPercentage, score, major, cohort, levelYear }) => {
        try {
            const filterUser = {
                major: major.toLowerCase(),
                cohort: parseInt(cohort),
                [`annualTaskProgress.${levelYear}.completedTaskPrecent`]: {
                    $lt: Number.parseFloat(progressPercentage)
                },
                [`annualTaskProgress.${levelYear}.totalScore`]: {
                    $lt: Number.parseFloat(progressPercentage)
                }
            };

            if (!progressPercentage)
                delete filterUser[`annualTaskProgress.${levelYear}.completedTaskPrecent`];
            if (!score) delete filterUser[`annualTaskProgress.${levelYear}.totalScore`];

            if (score || progressPercentage) {
                await User.updateMany(filterUser, {
                    $set: {
                        isActive: false
                    }
                });
            }

            await User.updateMany(
                {
                    major: major.toLowerCase(),
                    cohort: parseInt(cohort)
                },
                {
                    $set: {
                        levelYear: levelYear + 1
                    }
                }
            );

            return {
                msg: 'Cập nhật trạng thái hoạt động của tất cả sinh viên thành công'
            };
        } catch (error) {
            throw error;
        }
    };

    static getAnnualTaskProgress = async ({
        major,
        cohort,
        levelYear,
        filterCompletedTaskProgress,
        sortProgress
    }) => {
        try {
            const studentList = await User.aggregate([
                {
                    $match: {
                        major: major.toLowerCase(),
                        cohort: parseInt(cohort)
                    }
                },
                {
                    $project: {
                        studentId: 1,
                        fullName: 1,
                        faculty: 1,
                        major: 1,
                        levelYear: 1,
                        cohort: 1,
                        isActive: 1,
                        completedTaskProgress: `$annualTaskProgress.${levelYear}`
                    }
                },
                {
                    $match: filterCompletedTaskProgress
                },
                {
                    $sort: {
                        'completedTaskProgress.completedTaskPrecent':
                            sortProgress === 'true' ? 1 : -1,
                        'completedTaskProgress.totalScore': sortProgress === 'true' ? 1 : -1,
                        'completedTaskProgress.updatedAt:': 1
                    }
                }
            ]);
            return studentList;
        } catch (error) {
            throw error;
        }
    };

    static updateAnnualTaskProgress = async ({
        pageFaculty,
        pageStudentMajor,
        pageStudentCohort,
        pageStudentLevelYear,
        quantityDemanded,
        isSubtract
    }) => {
        try {
            if (!isSubtract) {
                await User.updateMany(
                    {
                        faculty: pageFaculty,
                        major: pageStudentMajor,
                        cohort: Number.parseInt(pageStudentCohort),
                        levelYear: Number.parseInt(pageStudentLevelYear),
                        isActive: true,
                        [`annualTaskProgress.${pageStudentLevelYear}`]: {
                            $exists: false
                        }
                    },
                    {
                        $set: {
                            [`annualTaskProgress.${pageStudentLevelYear}`]: {
                                completedTaskPrecent: 0,
                                totalScore: 0,
                                quantityDemanded: 0,
                                completedTasksNum: 0,
                                updatedAt: new Date()
                            }
                        }
                    }
                );
            }

            await User.updateMany(
                {
                    faculty: pageFaculty.toLowerCase(),
                    major: pageStudentMajor.toLowerCase(),
                    cohort: Number.parseInt(pageStudentCohort),
                    levelYear: Number.parseInt(pageStudentLevelYear),
                    isActive: true,
                    [`annualTaskProgress.${pageStudentLevelYear}`]: {
                        $exists: true
                    }
                },
                [
                    {
                        $set: {
                            [`annualTaskProgress.${pageStudentLevelYear}`]: {
                                completedTaskPrecent: {
                                    $multiply: [
                                        {
                                            $divide: [
                                                `$annualTaskProgress.${pageStudentLevelYear}.completedTasksNum`,
                                                {
                                                    $add: [
                                                        `$annualTaskProgress.${pageStudentLevelYear}.quantityDemanded`,
                                                        quantityDemanded
                                                    ]
                                                }
                                            ]
                                        },
                                        100
                                    ]
                                },
                                completedTasksNum: `$annualTaskProgress.${pageStudentLevelYear}.completedTasksNum`,
                                quantityDemanded: {
                                    [isSubtract ? '$subtract' : '$add']: [
                                        `$annualTaskProgress.${pageStudentLevelYear}.quantityDemanded`,
                                        quantityDemanded
                                    ]
                                },
                                totalScore: `$annualTaskProgress.${pageStudentLevelYear}.totalScore`,
                                updatedAt: new Date()
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            throw error;
        }
    };
}

module.exports = UserService;
