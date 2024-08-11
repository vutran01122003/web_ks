const createError = require('http-errors');
const User = require('../models/user.model');
const Page = require('../models/page.model');
const Row = require('../models/row.model');
const PermissionService = require('./permission.service');
const FacultyService = require('./faculty.service');
const Pagination = require('../utils/Pagination');
const [FACULTY_MANAGER, ADMIN] = ['003', '004'];
const [ACCEPTED_STATUS, PENDING_STATUS, REJECTED_STATUS, RESUBMITED_STATUS] = [
    'đã duyệt',
    'chờ duyệt',
    'từ chối',
    'phải nộp lại'
];
const STATUS = {
    [PENDING_STATUS]: 'numberOfPendingActivity',
    [ACCEPTED_STATUS]: 'numberOfAcceptedActivity',
    [REJECTED_STATUS]: 'numberOfRejectedActivity',
    [RESUBMITED_STATUS]: 'numberOfResubmitedActivity'
};

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

    static getUsersByFields = async ({ fields, queryString, sort }) => {
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
                    $sort: sort
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
            const { faculty, major, cohort } = updatedUser;

            const isInfoDifferent = originalUser.major !== major || originalUser.cohort !== cohort;

            if (isInfoDifferent) {
                const currentLevelYear = await FacultyService.getCurrentLevelYearOfCohort({
                    facultyName: faculty,
                    majorName: major,
                    cohortName: cohort
                });

                updatedUser.levelYear = currentLevelYear;

                await Promise.all([
                    this.createNewAnnualActivitiesProgress({
                        pageInfo: {
                            pageStudentCohort: cohort,
                            pageStudentMajor: major
                        },
                        currentLevelYear,
                        userId
                    }),
                    Row.deleteMany({ user: userId })
                ]);
            }

            if (password) updatedUser.encodePassword(password);
            if (isInfoDifferent || password) await updatedUser.save();

            return updatedUser;
        } catch (error) {
            console.log(error);
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

    static getAnnualTaskProgress = async ({ filterData, levelYear, sort, queryString }) => {
        try {
            const studentList = new Pagination(
                User.aggregate([
                    {
                        $match: filterData
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
                        $addFields: {
                            progressData: {
                                $arrayElemAt: ['$annualActivitiesProgress', levelYear - 1]
                            }
                        }
                    },
                    {
                        $set: {
                            progressData: {
                                $mergeObjects: [
                                    '$progressData',
                                    {
                                        progressPercentage: {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        '$progressData.numberOfAcceptedActivity',
                                                        '$progressData.numberOfRequiredActivity'
                                                    ]
                                                },
                                                100
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            userId: 1,
                            faculty: 1,
                            firstName: 1,
                            lastName: 1,
                            major: 1,
                            levelYear: 1,
                            cohort: 1,
                            isActive: 1,
                            group: 1,
                            progressData: 1
                        }
                    }
                ]),
                queryString
            ).paginating();

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
                await this.createNewAnnualActivitiesProgress({
                    pageInfo: {
                        pageStudentCohort: user.cohort,
                        pageStudentMajor: user.major
                    },
                    currentLevelYear: user.levelYear,
                    userId
                });
            } else {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        $inc: updatedInfo
                    },
                    {
                        new: true
                    }
                );

                if ([prevStatus, status].includes(ACCEPTED_STATUS)) {
                    const { numberOfRequiredActivity, numberOfAcceptedActivity } =
                        updatedUser.annualActivitiesProgress[index];

                    updatedUser.annualActivitiesProgress[index].progressPercentage =
                        (numberOfAcceptedActivity / numberOfRequiredActivity) * 100;
                    await updatedUser.save();
                }
            }
        } catch (error) {
            throw error;
        }
    };

    static createNewAnnualActivitiesProgress = async ({ pageInfo, currentLevelYear, userId }) => {
        try {
            let pageIdList = [];
            let progressData = {};
            const annualActivitiyProgress = {
                numberOfRequiredActivity: 0,
                numberOfPendingActivity: 0,
                numberOfAcceptedActivity: 0,
                numberOfRejectedActivity: 0,
                numberOfResubmitedActivity: 0,
                progressPercentage: 0,
                totalScore: 0
            };

            const { pageStudentCohort, pageStudentMajor } = pageInfo;

            const [user, pages] = await Promise.all([
                User.findById(userId),
                Page.find({
                    pageStudentCohort,
                    pageStudentMajor,
                    pageStudentLevelYear: currentLevelYear
                })
            ]);

            const tableList = pages.reduce((tableList, page) => {
                pageIdList.push(page._id);
                if (page.tables.length === 0 || !page.tables) return tableList;
                return [...tableList, ...page.tables];
            }, []);

            const numberOfRequiredActivity = tableList.reduce((quantityDemanded, table) => {
                return quantityDemanded + table.quantityDemanded;
            }, 0);

            const rows = await Row.find({
                user: userId,
                page: { $in: pageIdList }
            });

            if (rows.length > 0) {
                const contentList = rows.reduce((contentList, row) => {
                    if (row.content.length === 0) return contentList;
                    return [...contentList, ...row.content];
                }, []);

                progressData = contentList.reduce((annualActivityProgress, contentItem) => {
                    const status = contentItem.status;
                    const key = STATUS[status];
                    let totalScore = annualActivityProgress.totalScore;
                    return {
                        ...annualActivityProgress,
                        [key]: annualActivityProgress[key] + 1,
                        totalScore: status === ACCEPTED_STATUS ? totalScore + contentItem.totalScore : totalScore
                    };
                }, annualActivitiyProgress);
            }

            user.annualActivitiesProgress = Array(currentLevelYear)
                .fill(null)
                .map((_, index) => {
                    if (index + 1 === currentLevelYear) {
                        const numberOfAcceptedActivity = progressData?.numberOfAcceptedActivity || 0;
                        const progressPercentage = numberOfRequiredActivity
                            ? (numberOfAcceptedActivity / numberOfRequiredActivity) * 100
                            : 0;

                        return {
                            levelYear: index + 1,
                            ...annualActivitiyProgress,
                            ...progressData,
                            numberOfRequiredActivity,
                            progressPercentage
                        };
                    }

                    return {
                        levelYear: index + 1,
                        ...annualActivitiyProgress
                    };
                });

            await user.save();
        } catch (error) {
            throw error;
        }
    };

    static updateNumOfRequiredActivity = async ({ page, tables, isDesc }) => {
        try {
            const index = page.pageStudentLevelYear - 1;

            const quantityDemanded = tables.reduce((quantityDemanded, table) => {
                if (!table?.quantityDemanded) return quantityDemanded;
                return quantityDemanded + table.quantityDemanded;
            }, 0);

            const groupList = await PermissionService.getGroupsByGroupCode({ groupCodeList: [FACULTY_MANAGER, ADMIN] });

            const groupIdList = groupList.map((group) => group._id);

            const filterData = {
                cohort: parseInt(page.pageStudentCohort),
                major: page.pageStudentMajor,
                group: {
                    $nin: groupIdList
                }
            };

            const invalidUserList = await User.find({
                ...filterData,
                [`annualActivitiesProgress.${index}.numberOfRequiredActivity`]: {
                    $exists: false
                }
            }).lean();

            await Promise.all(
                invalidUserList.map((invalidUser) =>
                    this.createNewAnnualActivitiesProgress({
                        pageInfo: {
                            pageStudentMajor: invalidUser.major,
                            pageStudentCohort: invalidUser.cohort
                        },
                        currentLevelYear: invalidUser.levelYear,
                        userId: invalidUser._id
                    })
                )
            );

            const invalidUserIdList = invalidUserList.map((invalidUser) => invalidUser._id);

            const userList = await User.find({
                ...filterData,
                _id: {
                    $nin: invalidUserIdList
                }
            });

            if (userList.length > 0)
                await Promise.all(
                    userList.map((user) => {
                        const annualActivityProgress = user.annualActivitiesProgress[index];
                        const quantity = isDesc ? -quantityDemanded : quantityDemanded;

                        annualActivityProgress.numberOfRequiredActivity += quantity;
                        annualActivityProgress.progressPercentage =
                            annualActivityProgress.numberOfRequiredActivity > 0
                                ? (annualActivityProgress.numberOfAcceptedActivity /
                                      annualActivityProgress.numberOfRequiredActivity) *
                                  100
                                : 0;
                        user.save();
                    })
                );
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
