const FacultyService = require("../services/faculty.service");
const createError = require("http-errors");
const UserService = require("../services/user.service");

class FacultyController {
    createFaculty = async (req, res, next) => {
        try {
            const { facultyName, managerIdList } = req.body;

            if (managerIdList && managerIdList.length > 0) {
                const users = await UserService.getUserAndPopulateGroupById({ idList: managerIdList });
                if (users.length !== managerIdList.length) throw createError.NotFound(`Quản lý khoa không tồn tại`);
            }

            if (!facultyName.trim()) throw createError.BadRequest("Tên khoa không được để trống");

            const createdFaculty = await FacultyService.createFaculty({
                facultyName,
                managers: managerIdList
            });

            res.status(200).json({
                status: 200,
                msg: `Tạo khoa ${facultyName} thành công`,
                data: createdFaculty
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    updateFaculty = async (req, res, next) => {
        try {
            const facultyId = req.params.facultyId;
            const data = req.body.data;

            const updatedFaculty = await FacultyService.updateFaculty({ facultyId, data });

            res.status(200).json({
                status: 200,
                msg: "Cập nhật thông tin khoa thành công",
                data: updatedFaculty
            });
        } catch (error) {
            next(error);
        }
    };

    deleteFaculty = async (req, res, next) => {
        try {
            const facultyId = req.params.facultyId;

            const deletedFaculty = await FacultyService.deleteFaculty({ facultyId });

            return res.status(200).json({
                status: deletedFaculty.status,
                msg: deletedFaculty.msg
            });
        } catch (error) {
            next(error);
        }
    };

    getAllFaculty = async (req, res, next) => {
        try {
            const faculties = await FacultyService.getAllFaculties();

            return res.status(200).json(faculties);
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    getFacultyById = async (req, res, next) => {
        try {
            const { facultyId } = req.params;
            const faculty = await FacultyService.getFacultyById({ facultyId });

            return res.status(200).json({
                status: 200,
                msg: "Lấy dữ liệu khoa thành công",
                data: faculty
            });
        } catch (error) {
            next(error);
        }
    };

    getFacultyByName = async (req, res, next) => {
        try {
            const { facultyName } = req.params;
            const faculty = await FacultyService.getFacultyByName({ facultyName });

            return res.status(200).json({
                status: 200,
                msg: "Lấy dữ liệu khoa thành công",
                data: faculty
            });
        } catch (error) {
            next(error);
        }
    };

    createMajor = async (req, res, next) => {
        try {
            const { facultyId } = req.params;
            const { majorName, managerIdList } = req.body;

            if (managerIdList && managerIdList.length > 0) {
                const users = await UserService.getUserAndPopulateGroupById({ idList: managerIdList });
                if (users.length !== managerIdList.length)
                    throw createError.NotFound(`Quản lý chuyên ngành không tồn tại`);
            }

            if (!majorName.trim()) throw createError.BadRequest("Tên chuyên ngành không được rỗng");

            const createdMajor = await FacultyService.createMajor({ majorName, managers: managerIdList, facultyId });

            return res.status(201).json({
                msg: createdMajor.msg,
                data: createdMajor.data,
                status: createdMajor.status
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    getMajorById = async (req, res, next) => {
        try {
            const { majorId } = req.params;

            const major = await FacultyService.getMajorById({ majorId });

            res.status(200).json({
                status: 200,
                msg: "Lấy dữ liệu chuyên ngành thành công",
                data: major
            });
        } catch (error) {
            next(error);
        }
    };

    updateMajor = async (req, res, next) => {
        try {
            const { majorId, facultyId } = req.params;
            const data = req.body;

            const updatedMajor = await FacultyService.updateMajor({ majorId, facultyId, data });

            res.status(200).json({
                status: 200,
                msg: "Cập nhật chuyên ngành thành công",
                data: updatedMajor
            });
        } catch (error) {
            next(error);
        }
    };

    deleteMajor = async (req, res, next) => {
        try {
            const { facultyId, majorId } = req.params;
            await FacultyService.deleteMajor({ majorId, facultyId });

            res.status(200).json({
                status: 200,
                msg: "Xóa chuyên ngành thành công"
            });
        } catch (error) {
            next(error);
        }
    };

    createCohort = async (req, res, next) => {
        try {
            const { majorId } = req.params;
            const { cohortName } = req.body;

            if (!cohortName) throw createError.BadRequest("Tên Khoá không được để trống");

            const createdCohort = await FacultyService.createCohort({
                majorId,
                cohortName
            });

            return res.status(200).json({
                msg: createdCohort.msg,
                status: createdCohort.status,
                data: createdCohort.data
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    getCohortById = async (req, res, next) => {
        try {
            const { cohortId } = req.params;

            const cohort = await FacultyService.getCohortById({ cohortId });

            res.status(200).json({
                msg: "Lấy danh sách khóa sinh viên thành công",
                status: 200,
                data: cohort
            });
        } catch (error) {
            next(error);
        }
    };

    deleteCohortById = async (req, res, next) => {
        try {
            const { majorId, cohortId } = req.params;

            const deletedCohort = await FacultyService.deleteCohortById({
                majorId,
                cohortId
            });

            res.status(200).json({
                msg: "Xóa khóa sinh viên thành công",
                status: 200,
                data: deletedCohort
            });
        } catch (error) {
            next(error);
        }
    };

    updateCohortById = async (req, res, next) => {
        try {
            const { cohortId } = req.params;
            const data = req.body;

            const updatedCohort = await FacultyService.updateCohortById({
                cohortId,
                data
            });

            res.status(200).json({
                msg: "Cập nhật khóa sinh viên thành công",
                status: 200,
                data: updatedCohort
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new FacultyController();
