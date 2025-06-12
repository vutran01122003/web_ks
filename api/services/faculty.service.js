const createHttpError = require("http-errors");
const Faculty = require("../models/faculty.model");
const Major = require("../models/major.model");
const Cohort = require("../models/cohort.model");
const { capitalizeFirstLetter } = require("../utils/handleString");
const User = require("../models/user.model");

const populatedOptions = [
    {
        path: "majors",
        model: "major",
        populate: [
            { path: "managers", model: "user", select: "lastName firstName userId" },
            {
                path: "cohorts",
                model: "cohort"
            }
        ]
    }
];

class FacultyService {
    static createFaculty = async ({ facultyName, managers }) => {
        try {
            const isExists = await Faculty.findOne({ facultyName }).lean();

            if (isExists) throw createHttpError.Conflict("Tên khoa đã tồn tại");

            const createdFaculty = await Faculty.create({
                facultyName,
                managers
            });

            const populatedFaculty = createdFaculty.populate(populatedOptions);

            return populatedFaculty;
        } catch (error) {
            throw error;
        }
    };

    static updateFaculty = async ({ facultyId, data }) => {
        try {
            if (data.facultyName) {
                const checkDuplicateName = await Faculty.findOne({
                    facultyName: data.facultyName,
                    _id: { $ne: facultyId }
                });
                if (checkDuplicateName) throw createHttpError.Conflict("Tên khoa đã tồn tại");
            }

            const updatedFaculty = await Faculty.findByIdAndUpdate(facultyId, data, {
                new: true
            }).populate(populatedOptions);

            if (!updatedFaculty) throw createHttpError.NotFound("Khoa không tồn tại");

            return updatedFaculty;
        } catch (error) {
            throw error;
        }
    };

    static deleteFaculty = async ({ facultyId }) => {
        try {
            const user = await User.findOne({ faculty: facultyId });

            if (user) throw createHttpError.BadRequest("Khoa đã có người tham gia");

            const deletedFaculty = await Faculty.findOneAndDelete({ _id: facultyId });

            if (!deletedFaculty) throw createHttpError.NotFound("Khoa không tồn tại");

            return {
                status: 200,
                msg: `Xóa khoa ${deletedFaculty.facultyName} thành công`,
                data: deletedFaculty
            };
        } catch (error) {
            throw error;
        }
    };

    static getAllFaculties = async () => {
        try {
            const faculties = await Faculty.find({ isActive: true }).populate(populatedOptions).lean();
            const availableFaculties = faculties.filter((faculty) => faculty.isActive === true);

            return availableFaculties;
        } catch (error) {
            throw error;
        }
    };

    static getFacultyById = async ({ facultyId }) => {
        try {
            const faculty = await Faculty.findById(facultyId).populate(populatedOptions);

            if (!faculty) throw createHttpError.NotFound(`Khoa không tồn tại`);

            return faculty;
        } catch (error) {
            throw error;
        }
    };

    static getFacultyByName = async ({ facultyName }) => {
        try {
            const faculty = await Faculty.findOne({ facultyName }).populate(populatedOptions);

            if (!faculty) throw createHttpError.NotFound(`Khoa ${capitalizeFirstLetter(facultyName)} không tồn tại`);

            return faculty;
        } catch (error) {
            throw error;
        }
    };

    static createMajor = async ({ majorName, facultyId, managers }) => {
        try {
            const isExists = await Major.findOne({ majorName });

            if (isExists) throw createHttpError.Conflict("Chuyên ngành đã tồn tại");

            const faculty = await Faculty.findById(facultyId);

            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            const createdMajor = await Major.create({ majorName, managers });

            const populatedMajor = await Major.populate(createdMajor, {
                path: "managers",
                select: "userId lastName firstName"
            });

            faculty.majors.push(createdMajor._id);
            await faculty.save();

            return {
                msg: `Chuyên ngành ${majorName} đã được tạo thành công`,
                status: 201,
                data: populatedMajor
            };
        } catch (error) {
            throw error;
        }
    };

    static getMajorById = async ({ majorId }) => {
        try {
            return await Major.findById(majorId);
        } catch (error) {
            throw error;
        }
    };

    static getMajors = async (filterData) => {
        try {
            return await Major.find(filterData).populate("cohorts");
        } catch (error) {
            throw error;
        }
    };

    static getMajorByName = async ({ majorName }) => {
        try {
            const major = await Major.findOne({ majorName });
            if (!major)
                throw createHttpError.NotFound(`Chuyên ngành ${capitalizeFirstLetter(majorName)} không tồn tại`);
            return major;
        } catch (error) {
            throw error;
        }
    };

    static updateMajor = async ({ majorId, data }) => {
        try {
            if (data.majorName) {
                const isExists = await Major.findOne({ majorName: data.majorName, _id: { $ne: majorId } });
                if (isExists) throw createHttpError.Conflict("Chuyên ngành đã tồn tại");
            }

            return await Major.findByIdAndUpdate(majorId, data, {
                new: true
            });
        } catch (error) {
            throw error;
        }
    };

    static deleteMajor = async ({ facultyId, majorId }) => {
        try {
            const user = await User.findOne({ major: majorId });

            if (user) throw createHttpError.BadRequest("Chuyên ngành đã có người tham gia");

            await Major.findOneAndDelete({ _id: majorId });
            await Faculty.findByIdAndUpdate(facultyId, {
                $pull: {
                    majors: majorId
                }
            });
        } catch (error) {
            throw error;
        }
    };

    static createCohort = async ({ majorId, cohortName }) => {
        try {
            const major = await Major.findById(majorId).populate("cohorts", "cohortName");

            if (!major) throw createHttpError.NotFound("Chuyên ngành không tồn tại");

            if (major.cohorts.some((cohort) => cohort.cohortName === cohortName))
                throw createHttpError.Conflict(`Khoá ${cohortName} đã tồn tại`);

            const createdCohort = await Cohort.create({ cohortName });

            major.cohorts.push(createdCohort._id);
            await major.save();

            return {
                status: 201,
                msg: `Khóa ${cohortName} được tạo thành công`,
                data: createdCohort
            };
        } catch (error) {
            throw error;
        }
    };

    static addManagerToMajor = async ({ userId, majorName }) => {
        try {
            const updatedMajor = await Major.findOneAndUpdate(
                {
                    majorName,
                    managers: {
                        $nin: [userId]
                    }
                },
                {
                    $push: {
                        managers: userId
                    }
                },
                { new: true }
            );

            return updatedMajor;
        } catch (error) {
            throw error;
        }
    };

    static getCohortById = async ({ cohortId }) => {
        try {
            return await Cohort.findById(cohortId);
        } catch (error) {
            throw error;
        }
    };

    static getCohortByName = async ({ majorName, cohortName }) => {
        try {
            const major = await this.getMajorByName({ majorName });
            const populatedMajor = await major.populate("cohorts");

            const cohort = populatedMajor.cohorts.find((cohort) => cohort.cohortName === cohortName.toLowerCase());
            if (!cohort) throw createHttpError.NotFound("Khóa sinh viên không tồn tại");

            return cohort;
        } catch (error) {
            throw createHttpError.BadRequest("Xảy ra lỗi khi lấy dữ liệu khóa sinh viên");
        }
    };

    static updateAdditionalApplyCohort = async ({
        majorName,
        cohortName,
        levelYear,
        isActive,
        userId,
        approvedUsers,
        rejectedUsers,
        status
    }) => {
        try {
            const cohort = await this.getCohortByName({ cohortName, majorName });
            const length = cohort.additionalRegisterInfo.length;

            if (levelYear) {
                let isExist = false;
                for (let i = 0; i < length; i++) {
                    if (cohort.additionalRegisterInfo[i].levelYear === levelYear) {
                        cohort.additionalRegisterInfo[i].levelYear = levelYear;
                        cohort.additionalRegisterInfo[i].isActive = isActive;

                        isExist = true;
                        break;
                    }
                }

                if (!isExist)
                    cohort.additionalRegisterInfo.push({
                        levelYear,
                        isActive
                    });
            }

            if (userId) cohort.additionalRegisterInfo[length - 1].users.push(userId);

            if (rejectedUsers && approvedUsers) {
                console.log("ok");
                console.log({
                    rejectedUsers,
                    approvedUsers
                });
                cohort.additionalRegisterInfo[length - 1].approvedUsers = approvedUsers;
                cohort.additionalRegisterInfo[length - 1].rejectedUsers = rejectedUsers;
            }

            if (status) cohort.additionalRegisterInfo[length - 1].status = status;

            await cohort.save();
        } catch (error) {
            throw createHttpError.BadRequest("Xảy ra lỗi khi lấy dữ liệu năm hiện tại");
        }
    };

    static deleteCohortById = async ({ majorId, cohortId }) => {
        try {
            const user = await User.findOne({ cohort: cohortId });

            if (user) throw createHttpError.BadRequest("Khóa đã có người tham gia");

            await Cohort.findByIdAndDelete(cohortId);

            await Major.findByIdAndUpdate(majorId, {
                $pull: {
                    cohorts: cohortId
                }
            });
        } catch (error) {
            throw error;
        }
    };

    static updateCohortById = async ({ majorId, cohortId, data }) => {
        try {
            let result = null;
            const major = await Major.findById(majorId).populate("cohorts");

            if (!major) throw createHttpError.NotFound("Chuyên ngành không tồn tại");

            if (
                data?.cohortName &&
                major.cohorts.find(
                    (cohort) => cohort.cohortName === data.cohortName && cohort._id.toString() !== cohortId
                )
            )
                throw createHttpError.Conflict(`Khoá ${data.cohortName} đã tồn tại`);

            if (data?.isActive !== undefined && data?.status) {
                const { status, isActive, levelYear, currentLevelYear } = data;
                const cohort = await Cohort.findById(cohortId);
                const levelYearInfo = cohort.levelYearInfo.find((item) => item.levelYear === levelYear);
                cohort.currentLevelYear = currentLevelYear;
                cohort.levelYearInfo.id(levelYearInfo._id).isActive = isActive;
                cohort.levelYearInfo.id(levelYearInfo._id).status = status;
                result = await cohort.save();
            }

            if (data?.approvedUsers && data?.rejectedUsers) {
                const { approvedUsers, rejectedUsers, levelYear, status } = data;
                const cohort = await Cohort.findById(cohortId);
                const levelYearInfo = cohort?.levelYearInfo
                    ? cohort.levelYearInfo.find((item) => item.levelYear === levelYear)
                    : false;

                if (levelYearInfo) {
                    cohort.levelYearInfo.id(levelYearInfo._id).approvedUsers = approvedUsers;
                    cohort.levelYearInfo.id(levelYearInfo._id).rejectedUsers = rejectedUsers;
                    cohort.levelYearInfo.id(levelYearInfo._id).status = status;
                } else
                    cohort.levelYearInfo.push({
                        approvedUsers,
                        rejectedUsers,
                        levelYear,
                        status
                    });

                result = await cohort.save();
            } else {
                result = await Cohort.findByIdAndUpdate(cohortId, data, {
                    new: true
                });
            }

            return result;
        } catch (error) {
            throw error;
        }
    };

    static getCurrentLevelYearOfCohort = async ({ majorName, cohortName }) => {
        try {
            const cohort = await this.getCohortByName({ majorName, cohortName });
            return cohort.currentLevelYear;
        } catch (error) {
            throw error;
        }
    };

    static getAdditionalRegisterInfo = async ({ majorName, cohortName }) => {
        try {
            const cohort = await this.getCohortByName({ majorName, cohortName });

            return cohort.additionalRegisterInfo.sort((b, a) => a.levelYear - b.levelYear)[0];
        } catch (error) {
            throw error;
        }
    };
}

module.exports = FacultyService;
