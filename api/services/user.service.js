const createError = require('http-errors');
const User = require('../models/user.model');
const PermissionService = require('./permission.service');
const PageService = require('./page.service');
const FacultyService = require('./faculty.service');

class UserService {
    static findUserAndPopulateGroupById = async ({ id, idList }) => {
        try {
            let result = null;

            if (id) result = await User.findById(id).populate('group').lean();
            else if (idList.length > 0) result = await User.find({ _id: { $in: [...idList] } }).lean();

            if (!result) throw createError.NotFound('Người dùng không tồn tại');
            return result;
        } catch (error) {
            throw error;
        }
    };

    static findUserById = async (id) => {
        try {
            return await User.findById(id);
        } catch (error) {
            throw error;
        }
    };

    static findUserByUserId = async ({ userId }) => {
        try {
            const user = await User.findOne({ userId: userId }).lean();
            if (!user) throw createError.NotFound('Người dùng không tồn tại');
            return user;
        } catch (error) {
            throw error;
        }
    };

    static checkRole = async ({ userId, path, method }) => {
        try {
            const user = await User.findById(userId)
                .populate({
                    path: 'group',
                    model: 'group',
                    populate: {
                        path: `method.${method}`,
                        model: 'role'
                    }
                })
                .lean();

            if (!user) throw createError.NotFound('Người dùng không tồn tại');

            for (let i = 0; i < user.group.method[method].length; i++) {
                const roleInfo = user.group.method[method][i];
                if (roleInfo.url === path && roleInfo.method === method) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            throw error;
        }
    };

    static updateUserActivityStatusByMajor = async ({
        progressPercentage,
        score,
        major,
        cohort,
        levelYear,
        updatedCohortData
    }) => {
        try {
            const { cohortId, majorId, facultyId, ...data } = updatedCohortData;

            const filterUser = {
                major: major.toLowerCase(),
                cohort: parseInt(cohort),
                [`annualTaskProgress.${levelYear}.completedTaskPrecent`]: {
                    $lt: Number.parseFloat(progressPercentage)
                },
                [`annualTaskProgress.${levelYear}.totalScore`]: {
                    $lt: Number.parseFloat(score)
                }
            };

            if (!progressPercentage) delete filterUser[`annualTaskProgress.${levelYear}.completedTaskPrecent`];
            if (!score) delete filterUser[`annualTaskProgress.${levelYear}.totalScore`];

            if (score || progressPercentage) {
                await Promise.all([
                    User.updateMany(filterUser, {
                        $set: {
                            isActive: false
                        }
                    }),
                    User.updateMany(
                        {
                            major: major.toLowerCase(),
                            cohort: parseInt(cohort)
                        },
                        {
                            $set: {
                                levelYear: levelYear + 1
                            }
                        }
                    ),
                    FacultyService.updateCohortById({ facultyId, majorId, cohortId, data })
                ]);
            } else {
                throw createError.BadRequest('Phải có ít nhất là một điều kiện xét duyệt');
            }
        } catch (error) {
            throw error;
        }
    };

    static setAnnualTaskProgress = async ({ data, pageInfo, userId }) => {
        try {
            await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        [`annualTaskProgress.${pageInfo.pageStudentLevelYear}`]: {
                            ...data,
                            completedTaskPrecent: Number.parseFloat(
                                ((data.completedTask / data.quantityDemanded) * 100).toFixed(2)
                            )
                        }
                    }
                },
                {
                    new: true
                }
            );
        } catch (error) {
            throw error;
        }
    };

    static getAnnualTaskProgress = async ({ major, cohort, levelYear, sortProgress }) => {
        try {
            const studentList = await User.aggregate([
                {
                    $match: {
                        major: major.toLowerCase(),
                        cohort: parseInt(cohort)
                    }
                },
                {
                    $lookup: {
                        from: 'groups',
                        localField: 'group',
                        foreignField: '_id',
                        as: 'group'
                    }
                },
                {
                    $unwind: '$group'
                },
                {
                    $match: {
                        'group.groupCode': { $nin: ['003', '004'] }
                    }
                },
                {
                    $project: {
                        userId: 1,
                        fullName: 1,
                        faculty: 1,
                        major: 1,
                        levelYear: 1,
                        cohort: 1,
                        isActive: 1,
                        group: 1,
                        completedTaskProgress: `$annualTaskProgress.${levelYear || 1}`
                    }
                },
                {
                    $sort: {
                        'completedTaskProgress.completedTaskPrecent': sortProgress === 'true' ? 1 : -1,
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

    static addGroupForUser = async ({ groupId, userId }) => {
        try {
            const result = await Promise.all([
                PermissionService.getGroupById({ groupId }),
                this.findUserAndPopulateGroupById({ id: userId })
            ]);

            if (!result[0]) throw createError.NotFound('Chức vụ không tồn tại');
            if (!result[1]) throw createError.NotFound('Người dùng không tồn tại');

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    group: groupId
                },
                {
                    new: true
                }
            );

            return updatedUser;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = UserService;
