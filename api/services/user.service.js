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
    "phải nộp lại"
];
const STATUS = {
    [PENDING_STATUS]: "numberOfPendingActivity",
    [ACCEPTED_STATUS]: "numberOfAcceptedActivity",
    [REJECTED_STATUS]: "numberOfRejectedActivity",
    [RESUBMITED_STATUS]: "numberOfResubmitedActivity"
};
const { TALENT_ENGINEER_CODE } = process.env;

class UserService {
    static getUserAndPopulateGroupById = async ({ id, idList, selectedFieldArr }) => {
        try {
            let result = null;

            if (id) {
                result = await User.findById(id).populate("groups").select(selectedFieldArr);
            } else if (idList && idList.length > 0) {
                result = await User.find({ _id: { $in: [...idList] } })
                    .populate("groups")
                    .select(selectedFieldArr);
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

        const aggregatePipe = [
            { $match: fields },
            {
                $lookup: {
                    from: "groups",
                    localField: "groups",
                    foreignField: "_id",
                    as: "groups"
                }
            },
            {
                $unwind: "$groups"
            },
            {
                $match: {
                    "groups.groupCode": groupCode
                }
            },
            {
                $project: {
                    "groups.method": 0,
                    "groups.description": 0
                }
            },
            {
                $group: {
                    _id: "$_id",
                    avatar: { $first: "$avatar" },
                    userId: { $first: "$userId" },
                    firstName: { $first: "$firstName" },
                    lastName: { $first: "$lastName" },
                    gender: { $first: "$gender" },
                    birthday: { $first: "$birthday" },
                    faculty: { $first: "$faculty" },
                    major: { $first: "$major" },
                    cohort: { $first: "$cohort" },
                    isActive: { $first: "$isActive" },
                    email: { $first: "$email" },
                    phone: { $first: "$phone" },
                    annualTemporaryActivitiesProgress: { $first: "$annualTemporaryActivitiesProgress" },
                    annualActivitiesProgress: { $first: "$annualActivitiesProgress" },
                    levelYear: { $first: "$levelYear" },
                    groups: {
                        $push: "$groups"
                    }
                }
            },
            {
                $sort: sort
            }
        ];

        if (!fields) aggregatePipe.splice(0, 1);
        if (!groupCode) aggregatePipe.splice(1, 3);
        if (!sort) aggregatePipe.splice(-1, 1);

        const pagination = new Pagination(User.aggregate(aggregatePipe), queryString);

        return await pagination.paginating();
    };

    static updateUser = async ({ password, userId, userData }) => {
        try {
            const originalUser = await User.findByIdAndUpdate(userId, {
                ...userData,
                birthday: new Date(userData.birthday)
            });

            if (!originalUser) throw createError.NotFound("Người dùng không tồn tại");

            const updatedUser = await this.getUserAndPopulateGroupById({ id: userId });
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
                            pageTalentEngineerType: updatedUser.groups[0].groupCode,
                            pageFaculty: faculty.toLowerCase(),
                            pageStudentCohort: cohort,
                            pageStudentMajor: major.toLowerCase()
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
            throw error;
        }
    };

    static checkRole = async ({ userId, path, method }) => {
        try {
            const user = await User.findById(userId)
                .populate({
                    path: "groups",
                    model: "group",
                    populate: {
                        path: `method.${method}`,
                        model: "role"
                    }
                })
                .lean();

            if (!user) throw createError.NotFound("Người dùng không tồn tại");

            const groups = user.groups;

            for (let i = 0; i < groups.length; i++) {
                const roles = groups[i].method[method];

                for (let j = 0; j < roles.length; j++) {
                    if (roles[j].url === path) return true;
                }
            }

            return false;
        } catch (error) {
            throw error;
        }
    };

    static updateUserActivityStatusByMajor = async ({
        faculty,
        major,
        cohort,
        levelYear,
        groupData,
        conditions,
        updatedCohortData
    }) => {
        try {
            const index = levelYear - 1;
            const { groupId, groupCode } = groupData;
            const { progressPercentage, score } = conditions;
            const { nextYearValue } = updatedCohortData;
            const studentInfo = { faculty, major, cohort, groups: { $in: groupId } };
            const isTalentEngineer = groupCode === TALENT_ENGINEER_CODE;
            const annualActivitiesField = isTalentEngineer
                ? "annualActivitiesProgress"
                : "annualTemporaryActivitiesProgress";

            const filterUser = {
                ...studentInfo,
                [`${annualActivitiesField}.${index}.progressPercentage`]: {
                    $lt: Number.parseFloat(progressPercentage)
                }
            };

            const invalidUserList = await User.find({
                ...studentInfo,
                [`${annualActivitiesField}.${index}.progressPercentage`]: {
                    $exists: false
                }
            });

            if (invalidUserList.length > 0) {
                await Promise.all(
                    invalidUserList.map((invalidUser) =>
                        this.createNewAnnualActivitiesProgress({
                            pageInfo: {
                                pageTalentEngineerType: groupCode,
                                pageFaculty: invalidUser.faculty,
                                pageStudentCohort: invalidUser.cohort,
                                pageStudentMajor: invalidUser.major
                            },
                            currentLevelYear: invalidUser.levelYear,
                            userId: invalidUser._id
                        })
                    )
                );
            }

            if (isTalentEngineer) {
                await User.updateMany(filterUser, {
                    $set: {
                        isActive: false
                    }
                });

                await Promise.all([
                    User.updateMany(
                        {
                            ...studentInfo,
                            isActive: true
                        },
                        {
                            $set: {
                                levelYear: nextYearValue,
                                [`${annualActivitiesField}.${index + 1}`]: {
                                    levelYear: nextYearValue,
                                    totalScore: 0,
                                    numberOfRequiredActivity: 0,
                                    numberOfPendingActivity: 0,
                                    numberOfAcceptedActivity: 0,
                                    numberOfRejectedActivity: 0,
                                    numberOfResubmitedActivity: 0,
                                    progressPercentage: 0,
                                    isActive: true
                                }
                            }
                        }
                    ),
                    FacultyService.updateCohortById(updatedCohortData)
                ]);
            } else {
                const [_, talentEngineerGroup] = await Promise.all([
                    User.updateMany(filterUser, {
                        $set: {
                            levelYear: nextYearValue,
                            [`${annualActivitiesField}.${index + 1}`]: {
                                levelYear: nextYearValue,
                                totalScore: 0,
                                numberOfRequiredActivity: 0,
                                numberOfPendingActivity: 0,
                                numberOfAcceptedActivity: 0,
                                numberOfRejectedActivity: 0,
                                numberOfResubmitedActivity: 0,
                                progressPercentage: 0,
                                isActive: false
                            }
                        }
                    }),
                    PermissionService.getGroupByGroupCode(TALENT_ENGINEER_CODE)
                ]);

                await Promise.all([
                    User.updateMany(
                        {
                            ...studentInfo,
                            levelYear
                        },
                        {
                            $set: {
                                groups: [talentEngineerGroup._id]
                            }
                        }
                    ),
                    FacultyService.updateAdditionalApplyCohort({
                        facultyName: faculty.toLowerCase(),
                        majorName: major.toLowerCase(),
                        cohortName: cohort,
                        levelYear: parseInt(levelYear),
                        isActive: false
                    })
                ]);
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
        queryString
    }) => {
        try {
            const index = levelYear - 1;
            const annualActivitiesField =
                groupCode === TALENT_ENGINEER_CODE ? "annualActivitiesProgress" : "annualTemporaryActivitiesProgress";

            const studentList = new Pagination(
                User.aggregate([
                    {
                        $match: filterData
                    },
                    {
                        $lookup: {
                            from: "groups",
                            localField: "groups",
                            foreignField: "_id",
                            as: "groups"
                        }
                    },
                    {
                        $unwind: "$groups"
                    },
                    {
                        $match: {
                            "groups.groupCode": groupCode,
                            [`${annualActivitiesField}.${index}.isActive`]: true
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
                            birthday: 1,
                            isActive: 1,
                            "groups.name": 1,
                            "groups.groupCode": 1,
                            "groups._id": 1,
                            progressData: {
                                $arrayElemAt: [`$${annualActivitiesField}`, index]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            avatar: { $first: "$avatar" },
                            userId: { $first: "$userId" },
                            firstName: { $first: "$firstName" },
                            lastName: { $first: "$lastName" },
                            gender: { $first: "$gender" },
                            birthday: { $first: "$birthday" },
                            faculty: { $first: "$faculty" },
                            major: { $first: "$major" },
                            cohort: { $first: "$cohort" },
                            isActive: { $first: "$isActive" },
                            email: { $first: "$email" },
                            phone: { $first: "$phone" },
                            annualTemporaryActivitiesProgress: { $first: "$annualTemporaryActivitiesProgress" },
                            annualActivitiesProgress: { $first: "$annualActivitiesProgress" },
                            levelYear: { $first: "$levelYear" },
                            groups: {
                                $push: "$groups"
                            }
                        }
                    },
                    {
                        $match: {
                            "progressData.isActive": true
                        }
                    },
                    {
                        $sort: {
                            "progressData.totalScore": sortProgressPercentage,
                            "progressData.progressPercentage": sortProgressPercentage
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
            const user = await this.getUserAndPopulateGroupById({ id: userId });

            if (!user) throw createError.NotFound("Người dùng không tồn tại");

            const annualActivitiesField =
                user.groups[0].groupCode === TALENT_ENGINEER_CODE
                    ? "annualActivitiesProgress"
                    : "annualTemporaryActivitiesProgress";

            const ACCEPTED_STATUS = "đã duyệt";
            const fieldOfStatus = {
                "chờ duyệt": "numberOfPendingActivity",
                "đã duyệt": "numberOfAcceptedActivity",
                "từ chối": "numberOfRejectedActivity",
                "phải nộp lại": "numberOfResubmitedActivity"
            };

            const index = levelYear - 1;

            const updatedInfo = {
                [`${annualActivitiesField}.${index}.${fieldOfStatus[status]}`]: 1,
                [`${annualActivitiesField}.${index}.${fieldOfStatus[prevStatus]}`]: -1
            };

            if (prevStatus === status) return;

            if (!prevStatus) delete updatedInfo[`${annualActivitiesField}.${index}.${fieldOfStatus[prevStatus]}`];

            if (prevStatus === ACCEPTED_STATUS) {
                updatedInfo[`${annualActivitiesField}.${index}.totalScore`] = -totalScore;
            } else if (status === ACCEPTED_STATUS) {
                updatedInfo[`${annualActivitiesField}.${index}.totalScore`] = totalScore;
            }

            if (!user[annualActivitiesField] || !user[annualActivitiesField][index]) {
                await this.createNewAnnualActivitiesProgress({
                    pageInfo: {
                        pageTalentEngineerType: user.groups[0].groupCode,
                        pageFaculty: user.faculty,
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

                const keys = Object.keys(fieldOfStatus);
                const annualActivityProgress = updatedUser[annualActivitiesField][index];
                let isExistsNetigaveValue = false;

                // In the worst case, the negative value exists so we must reset and calculate all field
                for (let i = 0; i < keys.length; i++) {
                    const field = fieldOfStatus[keys[i]];
                    if (annualActivityProgress[field] < 0) {
                        await this.createNewAnnualActivitiesProgress({
                            pageInfo: {
                                pageTalentEngineerType: user.groups[0].groupCode,
                                pageFaculty: user.faculty,
                                pageStudentCohort: user.cohort,
                                pageStudentMajor: user.major
                            },
                            currentLevelYear: user.levelYear,
                            userId
                        });
                        isExistsNetigaveValue = true;
                        break;
                    }
                }

                if (!isExistsNetigaveValue && [prevStatus, status].includes(ACCEPTED_STATUS)) {
                    const { numberOfRequiredActivity, numberOfAcceptedActivity } =
                        updatedUser[annualActivitiesField][index];

                    updatedUser[annualActivitiesField][index].progressPercentage =
                        (numberOfAcceptedActivity / numberOfRequiredActivity) * 100;
                    await updatedUser.save();
                }
            }
        } catch (error) {
            throw error;
        }
    };

    static calculateCurrentActivitiesProgress = async ({
        user,
        pages,
        levelYearLastest,
        pageStudentLevelYear,
        annualActivitiesField
    }) => {
        try {
            let pageIdList = [];
            let progressData = {};

            const index = pageStudentLevelYear - 1;
            const annualActivityProgress = {
                numberOfRequiredActivity: 0,
                numberOfPendingActivity: 0,
                numberOfAcceptedActivity: 0,
                numberOfRejectedActivity: 0,
                numberOfResubmitedActivity: 0,
                progressPercentage: 0,
                totalScore: 0
            };

            if (!user[annualActivitiesField] || user[annualActivitiesField].length < levelYearLastest) {
                user[annualActivitiesField] = Array(levelYearLastest).fill(null);
            }

            const tableList = pages.reduce((tableList, page) => {
                pageIdList.push(page._id);
                if (page.tables.length === 0 || !page.tables) return tableList;
                return [...tableList, ...page.tables];
            }, []);

            const numberOfRequiredActivity = tableList.reduce((quantityDemanded, table) => {
                return quantityDemanded + table.quantityDemanded;
            }, 0);

            const rows = await Row.find({
                user: user._id,
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
                }, annualActivityProgress);
            }

            const numberOfAcceptedActivity = progressData?.numberOfAcceptedActivity || 0;
            const progressPercentage = numberOfRequiredActivity
                ? (numberOfAcceptedActivity / numberOfRequiredActivity) * 100
                : 0;

            user[annualActivitiesField][index] = {
                levelYear: pageStudentLevelYear,
                ...annualActivityProgress,
                ...progressData,
                numberOfRequiredActivity,
                progressPercentage
            };

            if (
                Object.values(annualActivityProgress).every((value) => value === 0) &&
                pageStudentLevelYear < levelYearLastest
            )
                user[annualActivitiesField][index].isActive = false;
            else user[annualActivitiesField][index].isActive = true;

            if (!levelYearLastest || pageStudentLevelYear === levelYearLastest) await user.save();
        } catch (error) {
            throw error;
        }
    };

    static createNewAnnualActivitiesProgress = async ({ pageInfo, currentLevelYear, userId }) => {
        try {
            const user = await this.getUserAndPopulateGroupById({ id: userId });

            if (!user) throw createError.NotFound("Người dùng không tồn tại");

            const annualActivitiesField =
                user.groups[0].groupCode === TALENT_ENGINEER_CODE
                    ? `annualActivitiesProgress`
                    : `annualTemporaryActivitiesProgress`;

            const annualPagesList = await Promise.all(
                Array(currentLevelYear)
                    .fill(null)
                    .map((_, index) =>
                        Page.find({
                            ...pageInfo,
                            pageStudentLevelYear: index + 1
                        })
                    )
            );

            await Promise.all(
                Array(currentLevelYear)
                    .fill(null)
                    .map((_, index) =>
                        this.calculateCurrentActivitiesProgress({
                            user,
                            levelYearLastest: currentLevelYear,
                            annualActivitiesField,
                            pages: annualPagesList[index],
                            pageStudentLevelYear: index + 1
                        })
                    )
            );
        } catch (error) {
            throw error;
        }
    };

    static updateNumOfRequiredActivity = async ({ page, tables, isDesc }) => {
        try {
            const { pageStudentLevelYear, pageTalentEngineerType, pageStudentCohort, pageStudentMajor } = page;
            const index = pageStudentLevelYear - 1;
            const group = await PermissionService.getGroupByGroupCode(pageTalentEngineerType);
            const annualActivitiesField =
                group.groupCode === TALENT_ENGINEER_CODE
                    ? "annualActivitiesProgress"
                    : "annualTemporaryActivitiesProgress";

            const quantityDemanded = tables.reduce((quantityDemanded, table) => {
                if (!table?.quantityDemanded) return quantityDemanded;
                return quantityDemanded + table.quantityDemanded;
            }, 0);

            const filterData = {
                cohort: pageStudentCohort,
                major: pageStudentMajor,
                groups: {
                    $in: group._id
                }
            };

            const invalidUserList = await User.find({
                ...filterData,
                [`${annualActivitiesField}.${index}.numberOfRequiredActivity`]: {
                    $exists: false
                }
            }).lean();

            const invalidUserIdList = invalidUserList.map((invalidUser) => invalidUser._id);

            if (invalidUserIdList.length > 0) {
                await Promise.all(
                    invalidUserList.map((invalidUser) =>
                        this.createNewAnnualActivitiesProgress({
                            pageInfo: {
                                pageTalentEngineerType: pageTalentEngineerType,
                                pageFaculty: invalidUser.faculty,
                                pageStudentMajor: invalidUser.major,
                                pageStudentCohort: invalidUser.cohort
                            },
                            currentLevelYear: invalidUser.levelYear,
                            userId: invalidUser._id
                        })
                    )
                );
            }

            const userList = await User.find({
                ...filterData,
                _id: {
                    $nin: invalidUserIdList
                }
            });

            if (userList.length > 0) {
                await Promise.all(
                    userList.map((user) => {
                        const annualActivityProgress = user[annualActivitiesField][index];
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
            }
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

            if (!result[0]) throw createError.NotFound("Chức vụ không tồn tại");
            if (!result[1]) throw createError.NotFound("Người dùng không tồn tại");

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        groups: groupId
                    }
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
