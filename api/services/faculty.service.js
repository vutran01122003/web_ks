const Faculty = require('../models/faculty.model');
const createError = require('http-errors');
const UserService = require('./user.service');

class FacultyService {
    static createFaculty = async ({ facultyName, managerIdList, majorList }) => {
        try {
            if (!facultyName.trim()) throw createError.BadRequest('Tên khoa không được để trống');
            if (managerIdList.length === 0) throw createError.BadRequest('Danh sách quản lý khoa không được để trống');
            if (majorList.length === 0) throw createError.BadRequest('Danh sách chuyên ngành không được để trống');

            const result = await Promise.all([
                Faculty.findOne({ facultyName }).lean(),
                UserService.findUserById({ userIdList: managerIdList })
            ]);

            const isExists = result[0];
            const userDataList = result[1];

            if (isExists) throw createError.Conflict('Tên khoa đã tồn tại');
            if (userDataList.length !== managerIdList.length)
                throw createError.NotFound(`Có người dùng trong danh sách đã bị xóa hoặc không tồn tại`);

            const createdFaculty = await Faculty.create({
                facultyName,
                managerList: managerIdList,
                majors: majorList.map((major) => ({
                    majorName: major,
                    cohortList: []
                }))
            });

            const populatedFaculty = createdFaculty.populate({
                path: 'managerList',
                model: 'user',
                select: 'fullName userId'
            });

            return populatedFaculty;
        } catch (error) {
            throw error;
        }
    };

    static createMajor = async ({ majorName, facultyId }) => {
        try {
            const faculty = await Faculty.findById(facultyId);

            if (!faculty)
                return {
                    msg: 'Khoa không tồn tại',
                    status: 404,
                    data: null
                };

            if (!majorName.trim()) throw createError.BadRequest('Chuyên ngành không để trống');

            if (!faculty.majors.some((major) => major.majorName === majorName.trim().toLowerCase())) {
                faculty.majors.push({
                    majorName
                });

                await faculty.save();
            } else {
                return {
                    msg: 'Chuyên ngành đã tồn tại',
                    status: 409,
                    data: null
                };
            }

            return {
                msg: `Chuyên ngành ${majorName} đã được tạo thành công`,
                status: 201,
                data: faculty.majors[faculty.majors.length - 1]
            };
        } catch (error) {
            throw error;
        }
    };

    static getMajorById = async ({ facultyId, majorId }) => {
        try {
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createError.NotFound('Khoa không tồn tại');

            return faculty.majors.id(majorId);
        } catch (error) {
            throw error;
        }
    };

    static updateMajor = async ({ facultyId, majorId, data }) => {
        try {
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createError.NotFound('Khoa không tồn tại');
            if (
                data.majorName &&
                faculty.majors.some((major) => major.majorName === data.majorName.trim().toLowerCase())
            )
                throw createError.Conflict('Chuyên ngành đã tồn tại');

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
            if (!faculty) throw createError.NotFound('Khoa không tồn tại');

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

            if (!faculty) throw createError.NotFound('Khoa không tồn tại');
            if (!cohortName) throw createError.BadRequest('Khóa sinh viên không được để trống');

            const cohortList = faculty.majors.id(majorId).cohortList;
            if (cohortList.some((cohort) => cohort.cohortName === cohortName))
                throw createError.Conflict(`Khóa ${cohortName} đã tồn tại`);

            cohortList.push({
                cohortName
            });

            await faculty.save();

            return {
                status: 201,
                msg: `Khóa ${cohortName} được tạo thành công`,
                data: cohortList[cohortList.length - 1]
            };
        } catch (error) {
            throw error;
        }
    };

    static getCohortById = async ({ facultyId, majorId, cohortId }) => {
        try {
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createError.NotFound('Khoa không tồn tại');

            return faculty.majors.id(majorId).cohortList.id(cohortId);
        } catch (error) {
            throw error;
        }
    };

    static deleteCohortById = async ({ facultyId, majorId, cohortId }) => {
        try {
            let deletedCohort = null;
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createError.NotFound('Khoa không tồn tại');

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

    static updateCohortById = async ({ facultyId, majorId, cohortId, data }) => {
        try {
            let updatedCohort = null;
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) throw createError.NotFound('Khoa không tồn tại');

            const cohortList = faculty.majors.id(majorId).cohortList;
            for (let i = 0; i < cohortList.length; i++) {
                if (cohortList[i]._id == cohortId) {
                    Object.keys(data).forEach((key) => {
                        if (data.cohortName && cohortList.some((cohort) => cohort.cohortName === data.cohortName))
                            throw createError.Conflict(`Khóa ${data.cohortName} đã tồn tại`);
                        cohortList[i][key] = data[key];
                    });

                    updatedCohort = cohortList[i];
                    break;
                }
            }

            faculty.majors.id(majorId).cohortList = cohortList;
            await faculty.save();

            return updatedCohort;
        } catch (error) {
            throw error;
        }
    };

    static updateFaculty = async ({ facultyId, data }) => {
        try {
            if (data.facultyName) {
                const checkDuplicateName = await Faculty.findOne({ facultyName: data.facultyName });
                if (checkDuplicateName) throw createError.Conflict('Tên khoa đã tồn tại');
            }

            const updatedFaculty = await Faculty.findByIdAndUpdate(facultyId, data, {
                new: true
            }).lean();

            if (!updatedFaculty) throw createError.NotFound('Khoa không tồn tại');

            return updatedFaculty;
        } catch (error) {
            throw error;
        }
    };

    static deleteFaculty = async ({ facultyId }) => {
        try {
            const deletedFaculty = await Faculty.findByIdAndDelete(facultyId);

            if (!deletedFaculty) throw createError.NotFound('Khoa không tồn tại');

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
            const faculties = await Faculty.find({ isActive: true })
                .populate({ path: 'managerList', model: 'user', select: 'fullName userId' })
                .lean();

            const availableFaculties = faculties.filter((faculty) => faculty.isActive === true);

            return availableFaculties;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = FacultyService;
