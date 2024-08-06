const createError = require('http-errors');
const User = require('../models/user.model');
const Row = require('../models/row.model');
const PermissionService = require('./permission.service');
const FacultyService = require('./faculty.service');
const Pagination = require('../utils/Pagination');
const [FACULTY_MANAGER, ADMIN] = ['003', '004'];

class UserService {
    static getUserAndPopulateGroupById = async ({ id, idList }) => {
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

    static getUserById = async (id) => {
        try {
            return await User.findById(id);
        } catch (error) {
            throw error;
        }
    };

    static getUserByUserId = async ({ userId }) => {
        try {
            const user = await User.findOne({ userId: userId }).lean();
            if (!user) throw createError.NotFound('Người dùng không tồn tại');
            return user;
        } catch (error) {
            throw error;
        }
    };

    static getUsersByFields = async ({ fields, queryString }) => {
        Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);

        const pagination = new Pagination(
            User.aggregate([
                { $match: fields },
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
                        'group.groupCode': {
                            $nin: [FACULTY_MANAGER, ADMIN]
                        }
                    }
                },
                {
                    $sort: {
                        fullName: -1
                    }
                }
            ]),
            queryString
        );

        return await pagination.paginating();
    };

    static updateUser = async ({ password, userId, userData }) => {
        try {
            const originalUser = await User.findByIdAndUpdate(userId, {
                ...userData,
                birthday: new Date(userData.birthday)
            });

            const updatedUser = await User.findById(userId);

            const isInfoDifferent =
                originalUser.major !== updatedUser.major || originalUser.cohort !== updatedUser.cohort;

            if (isInfoDifferent) {
                updatedUser.annualActivitiesProgress = Array(updatedUser.levelYear)
                    .fill(null)
                    .map((_, index) => ({
                        levelYear: index + 1,
                        totalScore: 0,
                        numberOfRequiredActivity: 0,
                        numberOfPendingActivity: 0,
                        numberOfAcceptedActivity: 0,
                        numberOfRejectedActivity: 0,
                        numberOfResubmitedActivity: 0
                    }));

                await Row.deleteMany({ user: userId });
            }

            if (password) updatedUser.encodePassword(password);

            if (isInfoDifferent || password) await updatedUser.save();

            return updatedUser;
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

    // Need Fix Right Now
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
                                levelYear
                            },
                            $push: {
                                annualActivitiesProgress: {
                                    $each: [
                                        {
                                            levelYear,
                                            totalScore: 0,
                                            numberOfRequiredActivity: 0,
                                            numberOfPendingActivity: 0,
                                            numberOfAcceptedActivity: 0,
                                            numberOfRejectedActivity: 0,
                                            numberOfResubmitedActivity: 0
                                        }
                                    ],
                                    $position: levelYear
                                }
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

    static updateAnnualActivityProgress = async ({ userId, levelYear, prevStatus, status, totalScore }) => {
        try {
            const ACCEPTED_STATUS = 'đã duyệt';
            const fieldOfStatus = {
                'chờ duyệt': 'numberOfPendingActivity',
                'đã duyệt': 'numberOfAcceptedActivity',
                'từ chối': 'numberOfRejectedActivity',
                'phải nộp lại': 'numberOfResubmitedActivity'
            };

            const index = levelYear - 1;

            const updatedInfo = {
                [`annualActivitiesProgress.${index}.${fieldOfStatus[status]}`]: 1,
                [`annualActivitiesProgress.${index}.${fieldOfStatus[prevStatus]}`]: -1
            };

            if (prevStatus === status) return;

            if (!prevStatus) delete updatedInfo[`annualActivitiesProgress.${index}.${fieldOfStatus[prevStatus]}`];

            if (prevStatus === ACCEPTED_STATUS) {
                updatedInfo[`annualActivitiesProgress.${index}.totalScore`] = -totalScore;
            } else if (status === ACCEPTED_STATUS) {
                updatedInfo[`annualActivitiesProgress.${index}.totalScore`] = totalScore;
            }

            const user = await User.findById(userId);

            if (!user.annualActivitiesProgress[index]) {
                await Promise.all(
                    Array(levelYear)
                        .fill(null)
                        .reduce((arr, _null, index) => {
                            if (!user.annualActivitiesProgress[index])
                                return [
                                    ...arr,
                                    User.findByIdAndUpdate(userId, {
                                        $push: {
                                            annualActivitiesProgress: {
                                                $each: [
                                                    {
                                                        levelYear: index + 1,
                                                        totalScore: 0,
                                                        numberOfRequiredActivity: 0,
                                                        numberOfPendingActivity: 0,
                                                        numberOfAcceptedActivity: 0,
                                                        numberOfRejectedActivity: 0,
                                                        numberOfResubmitedActivity: 0
                                                    }
                                                ],
                                                $position: index
                                            }
                                        }
                                    })
                                ];

                            return arr;
                        }, [])
                );
            }

            await User.findByIdAndUpdate(userId, {
                $inc: updatedInfo
            });
        } catch (error) {
            throw error;
        }
    };

    static updateNumOfRequiredActivity = async ({ page, tables, isDesc }) => {
        try {
            const quantityDemanded = tables.reduce((quantityDemanded, table) => {
                return quantityDemanded + table.quantityDemanded;
            }, 0);

            const updatedUserList = await User.updateMany(
                {
                    cohort: parseInt(page.pageStudentCohort),
                    major: page.pageStudentMajor
                },
                {
                    $inc: {
                        [`annualActivitiesProgress.${page.pageStudentLevelYear - 1}.numberOfRequiredActivity`]: isDesc
                            ? -quantityDemanded
                            : quantityDemanded
                    }
                }
            );

            return updatedUserList;
        } catch (error) {
            throw error;
        }
    };

    static addGroupForUser = async ({ groupId, userId }) => {
        try {
            const result = await Promise.all([
                PermissionService.getGroupById({ groupId }),
                this.getUserAndPopulateGroupById({ id: userId })
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
