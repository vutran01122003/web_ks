const createHttpError = require("http-errors");
const Faculty = require("../models/faculty.model");

class FacultyService {
    static createFaculty = async ({ facultyName, userDataList, managerIdList, majorList }) => {
        try {
            const isExists = await Faculty.findOne({ facultyName }).lean();

            if (isExists) throw createHttpError.Conflict("Tên khoa đã tồn tại");
            if (userDataList.length !== managerIdList.length)
                throw createHttpError.NotFound(`Có người dùng trong danh sách đã bị xóa hoặc không tồn tại`);

            const createdFaculty = await Faculty.create({
                facultyName,
                managerList: managerIdList,
                majors: majorList.map((major) => ({
                    majorName: major,
                    cohortList: [],
                })),
            });

            const populatedFaculty = createdFaculty.populate({
                path: "managerList",
                model: "user",
                select: "lastName firstName userId",
            });

            return populatedFaculty;
        } catch (error) {
            throw error;
        }
    };

    static createMajor = async ({ majorName, facultyId }) => {
        try {
            const faculty = await Faculty.findById(facultyId);

            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            if (!majorName.trim()) throw createHttpError.BadRequest("Chuyên ngành không để trống");

            if (!faculty.majors.some((major) => major.majorName === majorName.trim().toLowerCase())) {
                faculty.majors.push({
                    majorName,
                });
                await faculty.save();
            } else throw createHttpError.Conflict("Chuyên ngành đã tồn tại");

            return {
                msg: `Chuyên ngành ${majorName} đã được tạo thành công`,
                status: 201,
                data: faculty.majors[faculty.majors.length - 1],
            };
        } catch (error) {
            throw error;
        }
    };

    static getMajorById = async ({ facultyId, majorId }) => {
        try {
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            return faculty.majors.id(majorId);
        } catch (error) {
            throw error;
        }
    };

    static updateMajor = async ({ facultyId, majorId, data }) => {
        try {
            const faculty = await Faculty.findById(facultyId);

            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");
            if (
                data.majorName &&
                faculty.majors.some((major) => major.majorName === data.majorName.trim().toLowerCase())
            )
                throw createHttpError.Conflict("Chuyên ngành đã tồn tại");

            Object.keys(data).forEach((key) => {
                faculty.majors.id(majorId)[key] = data[key];
            });
            await faculty.save();

            return faculty.majors.id(majorId);
        } catch (error) {
            throw error;
        }
    };

    static deleteMajor = async ({ facultyId, majorId }) => {
        try {
            let deletedMajor = null;
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            faculty.majors = faculty.majors.filter((major) => {
                if (major._id == majorId) deletedMajor = major;
                return major._id != majorId;
            });

            await faculty.save();

            return deletedMajor;
        } catch (error) {
            throw error;
        }
    };

    static createCohort = async ({ facultyId, majorId, cohortName }) => {
        try {
            const faculty = await Faculty.findById(facultyId);

            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");
            if (!cohortName) throw createHttpError.BadRequest("Khóa sinh viên không được để trống");

            const cohortList = faculty.majors.id(majorId).cohortList;
            if (cohortList.some((cohort) => cohort.cohortName === cohortName))
                throw createHttpError.Conflict(`Khóa ${cohortName} đã tồn tại`);

            cohortList.push({
                cohortName,
            });

            await faculty.save();

            return {
                status: 201,
                msg: `Khóa ${cohortName} được tạo thành công`,
                data: cohortList[cohortList.length - 1],
            };
        } catch (error) {
            throw error;
        }
    };

    static getCohortById = async ({ facultyId, majorId, cohortId }) => {
        try {
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            return faculty.majors.id(majorId).cohortList.id(cohortId);
        } catch (error) {
            throw error;
        }
    };

    static deleteCohortById = async ({ facultyId, majorId, cohortId }) => {
        try {
            let deletedCohort = null;
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            const cohortList = faculty.majors.id(majorId).cohortList;
            faculty.majors.id(majorId).cohortList = cohortList.filter((cohort) => {
                if (cohort._id == cohortId) deletedCohort = cohort;
                return cohort._id != cohortId;
            });

            await faculty.save();
            return deletedCohort;
        } catch (error) {
            throw error;
        }
    };

    static updateCohortById = async ({ cohortId, majorId, facultyId, nextYearValue }) => {
        try {
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            const cohort = await faculty.majors.id(majorId).cohortList.id(cohortId);
            cohort.currentLevelYear = nextYearValue;

            await faculty.save();
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
                new: true,
            }).lean();

            if (!updatedFaculty) throw createHttpError.NotFound("Khoa không tồn tại");

            return updatedFaculty;
        } catch (error) {
            throw error;
        }
    };

    static deleteFaculty = async ({ facultyId }) => {
        try {
            const deletedFaculty = await Faculty.findByIdAndDelete(facultyId);

            if (!deletedFaculty) throw createHttpError.NotFound("Khoa không tồn tại");

            return {
                status: 200,
                msg: `Xóa khoa ${deletedFaculty.facultyName} thành công`,
                data: deletedFaculty,
            };
        } catch (error) {
            throw error;
        }
    };

    static getAllFaculties = async () => {
        try {
            const faculties = await Faculty.find({ isActive: true })
                .populate({ path: "managerList", model: "user", select: "lastName firstName userId" })
                .lean();

            const availableFaculties = faculties.filter((faculty) => faculty.isActive === true);

            return availableFaculties;
        } catch (error) {
            throw createHttpError.BadRequest("Xảy ra lỗi khi lấy dữ liệu các khoa");
        }
    };

    static getFacultyById = async ({ facultyId }) => {
        try {
            const faculty = await Faculty.findById(facultyId).lean();

            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            return faculty;
        } catch (error) {
            throw createHttpError.BadRequest("Xảy ra lỗi khi lấy dữ liệu khoa");
        }
    };

    static getFacultyByName = async ({ facultyName }) => {
        try {
            const faculty = await Faculty.findOne({ facultyName });

            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            return faculty;
        } catch (error) {
            throw createHttpError.BadRequest("Xảy ra lỗi khi lấy dữ liệu khoa");
        }
    };

    static getCurrentLevelYearOfCohort = async ({ facultyName, majorName, cohortName }) => {
        try {
            const faculty = await Faculty.findOne({ facultyName });

            if (!faculty) throw createHttpError.NotFound("Khoa không tồn tại");

            const major = faculty.majors.find((major) => major.majorName === majorName);

            if (!major) throw createHttpError.NotFound("Chuyên ngành không tồn tại");

            const currentLevelYear = major.cohortList.find(
                (cohort) => cohort.cohortName === parseInt(cohortName)
            ).currentLevelYear;

            return currentLevelYear;
        } catch (error) {
            throw createHttpError.BadRequest("Xảy ra lỗi khi lấy dữ liệu năm hiện tại");
        }
    };
}

module.exports = FacultyService;
