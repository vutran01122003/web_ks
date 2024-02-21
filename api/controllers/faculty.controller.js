const FacultyService = require('../services/faculty.service');

class FacultyController {
    createFaculty = async (req, res, next) => {
        try {
            const { facultyName } = req.body;
            const createdFaculty = await FacultyService.createFaculty({ facultyName });

            res.status(200).json({
                code: 200,
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
            const { facultyId, data } = req.body;
            const updatedFaculty = await FacultyService.updateFaculty({ facultyId, data });

            res.status(200).json({
                code: 200,
                msg: 'Cập nhật thông tin khoa thành công',
                data: updatedFaculty
            });
        } catch (error) {
            next(error);
        }
    };

    deleteFaculty = async (req, res, next) => {
        try {
            const deletedFaculty = await FacultyService.deleteFaculty(req.body);

            return res.status(200).json({
                code: deletedFaculty.code,
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
            next(error);
        }
    };

    createMajor = async (req, res, next) => {
        try {
            const { majorName, facultyId } = req.body;

            const createdMajor = await FacultyService.createMajor({ majorName, facultyId });

            return res.status(201).json({
                msg: createdMajor.msg,
                data: createdMajor.data,
                code: createdMajor.code
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    getMajorById = async (req, res, next) => {
        try {
            const majorId = req.params.majorId;
            const { facultyId } = req.query;

            const major = await FacultyService.getMajorById({ majorId, facultyId });

            res.status(200).json({
                code: 200,
                msg: 'Lấy dữ liệu chuyên ngành thành công',
                data: major
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    updateMajor = async (req, res, next) => {
        try {
            const { majorId, facultyId, data } = req.body;
            const updatedMajor = await FacultyService.updateMajor({ majorId, facultyId, data });

            res.status(200).json({
                code: 200,
                msg: 'Cập nhật chuyên ngành thành công',
                data: updatedMajor
            });
        } catch (error) {
            next(error);
        }
    };

    deleteMajor = async (req, res, next) => {
        try {
            const { majorId, facultyId } = req.body;
            const deletedMajor = await FacultyService.deleteMajor({ majorId, facultyId });

            res.status(200).json({
                code: 200,
                msg: 'Xóa chuyên ngành thành công',
                data: deletedMajor
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    createCohort = async (req, res, next) => {
        try {
            const { facultyId, majorId, cohortName } = req.body;

            const createdCohort = await FacultyService.createCohort({
                facultyId,
                majorId,
                cohortName
            });

            return res.status(200).json({
                msg: createdCohort.msg,
                code: createdCohort.code,
                data: createdCohort.data
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    getCohortById = async (req, res, next) => {
        try {
            const cohortId = req.params.cohortId;
            const { facultyId, majorId } = req.query;

            const cohort = await FacultyService.getCohortById({ facultyId, majorId, cohortId });

            res.status(200).json({
                msg: 'Lấy danh sách khóa sinh viên thành công',
                code: 200,
                data: cohort
            });
        } catch (error) {
            next(error);
        }
    };

    deleteCohortById = async (req, res, next) => {
        try {
            const { majorId, facultyId, cohortId } = req.body;

            const deletedCohort = await FacultyService.deleteCohortById({
                majorId,
                facultyId,
                cohortId
            });

            res.status(200).json({
                msg: 'Xóa khóa sinh viên thành công',
                code: 200,
                data: deletedCohort
            });
        } catch (error) {
            next(error);
        }
    };

    updateCohortById = async (req, res, next) => {
        try {
            const { majorId, facultyId, cohortId, data } = req.body;

            const updatedCohort = await FacultyService.updateCohortById({
                majorId,
                facultyId,
                cohortId,
                data
            });

            res.status(200).json({
                msg: 'Cập nhật khóa sinh viên thành công',
                code: 200,
                data: updatedCohort
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
}

module.exports = new FacultyController();
