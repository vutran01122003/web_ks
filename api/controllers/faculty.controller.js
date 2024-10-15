const FacultyService = require("../services/faculty.service");
const UserService = require("../services/user.service");
const createError = require("http-errors");

class FacultyController {
    createFaculty = async (req, res, next) => {
        try {
            const { facultyName, managerIdList, majorList } = req.body;

            if (!facultyName.trim()) throw createError.BadRequest("Tên khoa không được để trống");
            if (managerIdList.length === 0) throw createError.BadRequest("Danh sách quản lý khoa không được để trống");
            if (majorList.length === 0) throw createError.BadRequest("Danh sách chuyên ngành không được để trống");

            const userDataList = await UserService.getUserAndPopulateGroupById({ idList: managerIdList });

            const createdFaculty = await FacultyService.createFaculty({
                facultyName,
                userDataList,
                managerIdList,
                majorList,
            });

            res.status(200).json({
                status: 200,
                msg: `Tạo khoa ${facultyName} thành công`,
                data: createdFaculty,
            });
        } catch (error) {
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
                data: updatedFaculty,
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
                msg: deletedFaculty.msg,
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
                data: faculty,
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
                data: faculty,
            });
        } catch (error) {
            next(error);
        }
    };

    createMajor = async (req, res, next) => {
        try {
            const facultyId = req.params.facultyId;
            const { majorName } = req.body;
            const createdMajor = await FacultyService.createMajor({ majorName, facultyId });

            return res.status(201).json({
                msg: createdMajor.msg,
                data: createdMajor.data,
                status: createdMajor.status,
            });
        } catch (error) {
            next(error);
        }
    };

    getMajorById = async (req, res, next) => {
        try {
            const { majorId, facultyId } = req.params;

            const major = await FacultyService.getMajorById({ majorId, facultyId });

            res.status(200).json({
                status: 200,
                msg: "Lấy dữ liệu chuyên ngành thành công",
                data: major,
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
                data: updatedMajor,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteMajor = async (req, res, next) => {
        try {
            const { facultyId, majorId } = req.params;
            const deletedMajor = await FacultyService.deleteMajor({ majorId, facultyId });

            res.status(200).json({
                status: 200,
                msg: "Xóa chuyên ngành thành công",
                data: deletedMajor,
            });
        } catch (error) {
            next(error);
        }
    };

    createCohort = async (req, res, next) => {
        try {
            const { facultyId, majorId } = req.params;
            const { cohortName } = req.body;

            const createdCohort = await FacultyService.createCohort({
                facultyId,
                majorId,
                cohortName,
            });

            return res.status(200).json({
                msg: createdCohort.msg,
                status: createdCohort.status,
                data: createdCohort.data,
            });
        } catch (error) {
            next(error);
        }
    };

    getCohortById = async (req, res, next) => {
        try {
            const { facultyId, majorId, cohortId } = req.params;

            const cohort = await FacultyService.getCohortById({ facultyId, majorId, cohortId });

            res.status(200).json({
                msg: "Lấy danh sách khóa sinh viên thành công",
                status: 200,
                data: cohort,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteCohortById = async (req, res, next) => {
        try {
            const { facultyId, majorId, cohortId } = req.params;

            const deletedCohort = await FacultyService.deleteCohortById({
                majorId,
                facultyId,
                cohortId,
            });

            res.status(200).json({
                msg: "Xóa khóa sinh viên thành công",
                status: 200,
                data: deletedCohort,
            });
        } catch (error) {
            next(error);
        }
    };

    updateCohortById = async (req, res, next) => {
        try {
            const { facultyId, majorId, cohortId } = req.params;
            const data = req.body;

            const updatedCohort = await FacultyService.updateCohortById({
                majorId,
                facultyId,
                cohortId,
                data,
            });

            res.status(200).json({
                msg: "Cập nhật khóa sinh viên thành công",
                status: 200,
                data: updatedCohort,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new FacultyController();
