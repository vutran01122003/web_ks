const createError = require("http-errors");
const User = require("../models/user.model");
const Page = require("../models/page.model");
const Row = require("../models/row.model");
const PermissionService = require("./permission.service");
const FacultyService = require("./faculty.service");
const Pagination = require("../utils/Pagination");

const [ACCEPTED_STATUS, PENDING_STATUS, REJECTED_STATUS, RESUBMITED_STATUS] = [
    "đã duyệt",
    "chờ duyệt",
    "từ chối",
    "phải nộp lại",
];
const STATUS = {
    [PENDING_STATUS]: "numberOfPendingActivity",
    [ACCEPTED_STATUS]: "numberOfAcceptedActivity",
    [REJECTED_STATUS]: "numberOfRejectedActivity",
    [RESUBMITED_STATUS]: "numberOfResubmitedActivity",
};
const { TALENT_ENGINEER_TYPE, TALENT_ENGINEER_CODE } = process.env;

class UserService {
    static getUserAndPopulateGroupById = async ({ id, idList, selectedFieldArr }) => {
        try {
            let result = null;

            if (id) {
                result = await User.findById(id).populate("group").select(selectedFieldArr).lean();
            } else if (idList.length > 0) {
                result = await User.find({ _id: { $in: [...idList] } })
                    .populate("group")
                    .select(selectedFieldArr)
                    .lean();
            }

            if (!result) throw createError.NotFound("Người dùng không tồn tại");

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
            if (!user) throw createError.NotFound("Người dùng không tồn tại");
            return user;
        } catch (error) {
            throw error;
        }
    };

    static getUsersByFields = async ({ fields, groupCode, queryString, sort }) => {
        Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);

        const pagination = new Pagination(
            User.aggregate([
                { $match: fields },
                {
                    $lookup: {
                        from: "groups",
                        localField: "group",
                        foreignField: "_id",
                        as: "group",
                    },
                },
                {
                    $unwind: "$group",
                },
                {
                    $match: {
                        "group.groupCode": groupCode,
                    },
                },
                {
                    $sort: sort,
                },
            ]),
            queryString
        );

        return await pagination.paginating();
    };

    static updateUser = async ({ password, userId, userData }) => {
        try {
            const originalUser = await User.findByIdAndUpdate(userId, {
                ...userData,
                birthday: new Date(userData.birthday),
            });

            if (!originalUser) throw createError.NotFound("Người dùng không tồn tại");

            const updatedUser = await User.findById(userId);
            const { faculty, major, cohort } = updatedUser;

            const isInfoDifferent = originalUser.major !== major || originalUser.cohort !== cohort;

            if (isInfoDifferent) {
                const currentLevelYear = await FacultyService.getCurrentLevelYearOfCohort({
                    facultyName: faculty,
                    majorName: major,
                    cohortName: cohort,
                });

                updatedUser.levelYear = currentLevelYear;

                await Promise.all([
                    this.createNewAnnualActivitiesProgress({
                        pageInfo: {
                            pageStudentCohort: cohort,
                            pageStudentMajor: major,
                        },
                        currentLevelYear,
                        userId,
                    }),
                    Row.deleteMany({ user: userId }),
                ]);
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
                    path: "group",
                    model: "group",
                    populate: {
                        path: `method.${method}`,
                        model: "role",
                    },
                })
                .lean();

            if (!user) throw createError.NotFound("Người dùng không tồn tại");

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
        conditions,
        major,
        cohort,
        levelYear,
        updatedCohortData,
        groupData,
    }) => {
        try {
            const { progressPercentage, score } = conditions;
            const { nextYearValue } = updatedCohortData;
            const index = levelYear - 1;
            const isTalentEngineer = groupData.groupCode === TALENT_ENGINEER_TYPE;

            const filterUser = {
                major: major.toLowerCase(),
                cohort: parseInt(cohort),
                [`annualActivitiesProgress.${index}.progressPercentage`]: {
                    $lt: Number.parseFloat(progressPercentage),
                },
                [`annualActivitiesProgress.${index}.totalScore`]: {
                    $lt: Number.parseFloat(score),
                },
            };

            const invalidUserList = await User.find({
                [`annualActivitiesProgress.${index}.progressPercentage`]: {
                    $exists: false,
                },
                group: groupData.groupId,
            });

            if (invalidUserList.length > 0) {
                await Promise.all(
                    invalidUserList.map((invalidUser) =>
                        this.createNewAnnualActivitiesProgress({
                            pageInfo: {
                                pageStudentCohort: invalidUser.cohort,
                                pageStudentMajor: invalidUser.major,
                            },
                            currentLevelYear: invalidUser.levelYear,
                            userId: invalidUser._id,
                        })
                    )
                );
            }

            await Promise.all([
                User.updateMany(
                    {
                        ...filterUser,
                        group: groupData.groupId,
                    },
                    {
                        $set: {
                            isActive: false,
                        },
                    }
                ),
                User.updateMany(
                    {
                        major: major.toLowerCase(),
                        cohort: parseInt(cohort),
                    },
                    {
                        $set: {
                            levelYear: isTalentEngineer ? nextYearValue : levelYear,
                            [`annualActivitiesProgress.${isTalentEngineer ? index + 1 : index}`]: {
                                levelYear: isTalentEngineer ? nextYearValue : levelYear,
                                totalScore: 0,
                                numberOfRequiredActivity: 0,
                                numberOfPendingActivity: 0,
                                numberOfAcceptedActivity: 0,
                                numberOfRejectedActivity: 0,
                                numberOfResubmitedActivity: 0,
                                progressPercentage: 0,
                            },
                        },
                        // $push: {
                        //     annualActivitiesProgress: {
                        //         $each: [
                        //             {
                        //                 levelYear: isTalentEngineer ? nextYearValue : levelYear,
                        //                 totalScore: 0,
                        //                 numberOfRequiredActivity: 0,
                        //                 numberOfPendingActivity: 0,
                        //                 numberOfAcceptedActivity: 0,
                        //                 numberOfRejectedActivity: 0,
                        //                 numberOfResubmitedActivity: 0,
                        //                 progressPercentage: 0,
                        //             },
                        //         ],
                        //         // If user is the temporary talent engineer, replace the temporary activity progress with the official activy progress
                        //         $position: isTalentEngineer ? index + 1 : index,
                        //     },
                        // },
                    }
                ),
                isTalentEngineer ? FacultyService.updateCohortById(updatedCohortData) : null,
            ]);

            if (!isTalentEngineer) {
                const group = await PermissionService.getGroupByGroupCode(TALENT_ENGINEER_CODE);

                await User.updateMany(
                    {
                        major: major.toLowerCase(),
                        cohort: parseInt(cohort),
                        group: groupData.groupId,
                        isActive: true,
                    },
                    {
                        $set: {
                            group: group._id,
                        },
                    }
                );
            }
        } catch (error) {
            throw error;
        }
    };

    static getAnnualTaskProgress = async ({
        filterData,
        levelYear,
        groupCode,
        sortProgressPercentage,
        queryString,
    }) => {
        try {
            const studentList = new Pagination(
                User.aggregate([
                    {
                        $match: filterData,
                    },
                    {
                        $lookup: {
                            from: "groups",
                            localField: "group",
                            foreignField: "_id",
                            as: "group",
                        },
                    },
                    {
                        $unwind: "$group",
                    },
                    {
                        $match: {
                            "group.groupCode": groupCode,
                        },
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
                            progressData: {
                                $arrayElemAt: ["$annualActivitiesProgress", levelYear - 1],
                            },
                        },
                    },
                    {
                        $sort: {
                            "progressData.progressPercentage": sortProgressPercentage,
                            "progressData.totalScore": sortProgressPercentage,
                        },
                    },
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
            const ACCEPTED_STATUS = "đã duyệt";
            const fieldOfStatus = {
                "chờ duyệt": "numberOfPendingActivity",
                "đã duyệt": "numberOfAcceptedActivity",
                "từ chối": "numberOfRejectedActivity",
                "phải nộp lại": "numberOfResubmitedActivity",
            };

            const index = levelYear - 1;

            const updatedInfo = {
                [`annualActivitiesProgress.${index}.${fieldOfStatus[status]}`]: 1,
                [`annualActivitiesProgress.${index}.${fieldOfStatus[prevStatus]}`]: -1,
            };

            if (prevStatus === status) return;

            if (!prevStatus) delete updatedInfo[`annualActivitiesProgress.${index}.${fieldOfStatus[prevStatus]}`];

            if (prevStatus === ACCEPTED_STATUS) {
                updatedInfo[`annualActivitiesProgress.${index}.totalScore`] = -totalScore;
            } else if (status === ACCEPTED_STATUS) {
                updatedInfo[`annualActivitiesProgress.${index}.totalScore`] = totalScore;
            }

            const user = await User.findById(userId);

            if (!user) throw createError.NotFound("Người dùng không tồn tại");

            if (!user.annualActivitiesProgress[index]) {
                await this.createNewAnnualActivitiesProgress({
                    pageInfo: {
                        pageStudentCohort: user.cohort,
                        pageStudentMajor: user.major,
                    },
                    currentLevelYear: user.levelYear,
                    userId,
                });
            } else {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        $inc: updatedInfo,
                    },
                    {
                        new: true,
                    }
                );

                const keys = Object.keys(fieldOfStatus);
                const annualActivityProgress = updatedUser.annualActivitiesProgress[index];
                let isExistsNetigaveValue = false;

                // In the worst case, the negative value exists so we must reset and calculate all field
                for (let i = 0; i < keys.length; i++) {
                    const field = fieldOfStatus[keys[i]];
                    if (annualActivityProgress[field] < 0) {
                        await this.createNewAnnualActivitiesProgress({
                            pageInfo: {
                                pageStudentCohort: user.cohort,
                                pageStudentMajor: user.major,
                            },
                            currentLevelYear: user.levelYear,
                            userId,
                        });
                        isExistsNetigaveValue = true;
                        break;
                    }
                }

                if (!isExistsNetigaveValue && [prevStatus, status].includes(ACCEPTED_STATUS)) {
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

    static calculateCurrentActivitiesProgress = async ({ userId, pageInfo }) => {
        try {
            let pageIdList = [];
            let progressData = {};
            const { pageStudentCohort, pageStudentMajor, pageStudentLevelYear } = pageInfo;
            const annualActivitiyProgress = {
                numberOfRequiredActivity: 0,
                numberOfPendingActivity: 0,
                numberOfAcceptedActivity: 0,
                numberOfRejectedActivity: 0,
                numberOfResubmitedActivity: 0,
                progressPercentage: 0,
                totalScore: 0,
            };

            const [pages, user] = await Promise.all([
                Page.find({
                    pageStudentCohort,
                    pageStudentMajor,
                    pageStudentLevelYear,
                }),
                User.findById(userId),
            ]);

            if (!user) throw createError.NotFound("Người dùng không tồn tại");

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
                page: { $in: pageIdList },
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
                        totalScore: status === ACCEPTED_STATUS ? totalScore + contentItem.totalScore : totalScore,
                    };
                }, annualActivitiyProgress);
            }

            const numberOfAcceptedActivity = progressData?.numberOfAcceptedActivity || 0;

            const progressPercentage = numberOfRequiredActivity
                ? (numberOfAcceptedActivity / numberOfRequiredActivity) * 100
                : 0;

            user.annualActivitiesProgress[pageStudentLevelYear - 1] = {
                levelYear: pageStudentLevelYear,
                ...annualActivitiyProgress,
                ...progressData,
                numberOfRequiredActivity,
                progressPercentage,
            };
            await user.save();
        } catch (error) {
            throw error;
        }
    };

    static createNewAnnualActivitiesProgress = async ({ pageInfo, currentLevelYear, userId }) => {
        try {
            await Promise.all(
                Array(currentLevelYear)
                    .fill(null)
                    .map((_, index) =>
                        this.calculateCurrentActivitiesProgress({
                            userId,
                            pageInfo: {
                                pageStudentCohort: pageInfo.pageStudentCohort,
                                pageStudentMajor: pageInfo.pageStudentMajor,
                                pageStudentLevelYear: index + 1,
                            },
                        })
                    )
            );
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

            const group = await PermissionService.getGroupByGroupCode(page.pageTalentEngineerType);
            const groupId = group._id;

            const filterData = {
                cohort: parseInt(page.pageStudentCohort),
                major: page.pageStudentMajor,
                group: groupId,
            };

            const invalidUserList = await User.find({
                ...filterData,
                [`annualActivitiesProgress.${index}.numberOfRequiredActivity`]: {
                    $exists: false,
                },
            }).lean();

            await Promise.all(
                invalidUserList.map((invalidUser) =>
                    this.createNewAnnualActivitiesProgress({
                        pageInfo: {
                            pageStudentMajor: invalidUser.major,
                            pageStudentCohort: invalidUser.cohort,
                        },
                        currentLevelYear: invalidUser.levelYear,
                        userId: invalidUser._id,
                    })
                )
            );

            const invalidUserIdList = invalidUserList.map((invalidUser) => invalidUser._id);

            const userList = await User.find({
                ...filterData,
                _id: {
                    $nin: invalidUserIdList,
                },
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
                this.getUserAndPopulateGroupById({ id: userId }),
            ]);

            if (!result[0]) throw createError.NotFound("Chức vụ không tồn tại");
            if (!result[1]) throw createError.NotFound("Người dùng không tồn tại");

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    group: groupId,
                },
                {
                    new: true,
                }
            );

            return updatedUser;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = UserService;
