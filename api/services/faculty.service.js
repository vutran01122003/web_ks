const createHttpError = require("http-errors");
const Faculty = require("../models/faculty.model");
const Major = require("../models/major.model");
const Cohort = require("../models/cohort.model");
const { capitalizeFirstLetter } = require("../utils/handleString");

const populatedOptions = [
    { path: "managers", model: "user", select: "lastName firstName userId" },
    {
        path: "majors",
        model: "major",
        populate: {
            path: "cohorts",
            model: "cohort"
        }
    }
];

class FacultyService {
    static createFaculty = async ({ facultyName, managers }) => {
        try {
            console.log(managers);
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
                const checkDuplicateName = await Faculty.findOne({ facultyName: data.facultyName });
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
                const isExists = await Major.findOne({ majorName: data.majorName });
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
            const populatedMajor = await major.populate("cohorts", "cohortName");
            const cohort = populatedMajor.cohorts.find((cohort) => cohort.cohortName === cohortName);

            if (!cohort) throw createHttpError.NotFound("Khóa sinh viên không tồn tại");

            return cohort;
        } catch (error) {
            throw createHttpError.BadRequest("Xảy ra lỗi khi lấy dữ liệu năm hiện tại");
        }
    };

    static updateAdditionalApplyCohort = async ({ majorName, cohortName, levelYear, isActive }) => {
        try {
            const cohort = await this.getCohortByName({ cohortName, majorName });

            cohort.additionalRegisterInfo = {
                levelYear,
                isActive
            };

            await cohort.save();
        } catch (error) {
            throw createHttpError.BadRequest("Xảy ra lỗi khi lấy dữ liệu năm hiện tại");
        }
    };

    static deleteCohortById = async ({ majorId, cohortId }) => {
        try {
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

    static updateCohortById = async ({ cohortId, data }) => {
        try {
            return await Cohort.findByIdAndUpdate(cohortId, data, {
                new: true
            });
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

            return cohort.additionalRegisterInfo;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = FacultyService;
