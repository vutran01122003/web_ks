const FacultyService = require('../services/faculty.service');

class FacultyController {
    createFaculty = async (req, res, next) => {
        try {
            const { facultyName } = req.body;
            const faculty = await FacultyService.createFaculty({ facultyName });

            res.status(400).json({
                code: faculty.code,
                msg: faculty.msg,
                data: faculty.data
            });
        } catch (error) {
            next(error);
        }
    };

    updateFaculty = async (req, res, next) => {
        try {
            const faculty = await FacultyService.updateFaculty(req.body);

            if (faculty.status === 'success') {
                return res.status(200).json(faculty);
            } else return res.status(400).json(faculty);
        } catch (error) {
            next(error);
        }
    };

    deleteFaculty = async (req, res, next) => {
        try {
            const faculty = await FacultyService.deleteFaculty(req.body);

            if (faculty.status === 'success') {
                return res.status(200).json(faculty);
            } else return res.status(400).json(faculty);
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

    getAllMajorsOfFaculty = async (req, res, next) => {
        try {
            const majors = await FacultyService.getAllMajorsOfFaculty(req.params.id);

            return res.status(200).json(majors);
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
            next(error);
        }
    };
}

module.exports = new FacultyController();
