const FacultyService = require("../services/faculty.service");

class FacultyController {
    createFaculty = async (req, res, next) => {
        try {
            const faculty = await FacultyService.createFaculty(req.body);

            if (faculty.status === "success") {
                return res.status(201).json(faculty);
            } else return res.status(400).json(faculty);
        } catch (error) {
            next(error);
        }
    };

    updateFaculty = async (req, res, next) => {
        try {
            const faculty = await FacultyService.updateFaculty(req.body);

            if (faculty.status === "success") {
                return res.status(200).json(faculty);
            } else return res.status(400).json(faculty);
        } catch (error) {
            next(error);
        }
    };

    deleteFaculty = async (req, res, next) => {
        try {
            const faculty = await FacultyService.deleteFaculty(req.body);

            if (faculty.status === "success") {
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
            console.log(req.params);
            const majors = await FacultyService.getAllMajorsOfFaculty(
                req.params.id
            );

            return res.status(200).json(majors);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new FacultyController();
