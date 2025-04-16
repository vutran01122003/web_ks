const router = require("express").Router();
const facultyController = require("../../controllers/faculty.controller");
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");
const validateResource = require("../../middleware/validateResource");
const { CreateFacultySchema, CreateMajorListSchema, CreateCohortSchema } = require("../../schema/faculty.schema");

router.get("/faculties", facultyController.getAllFaculty);
router.get("/faculties/:facultyId", facultyController.getFacultyById);
router.get("/faculties/:facultyName", facultyController.getFacultyByName);
router.post("/faculties", validateResource({ schema: CreateFacultySchema }), facultyController.createFaculty);
router.patch("/faculties/:facultyId", facultyController.updateFaculty);
router.delete("/faculties/:facultyId", facultyController.deleteFaculty);

router.post(
    "/faculties/:facultyId/majors",
    validateResource({ schema: CreateMajorListSchema }),
    facultyController.createMajor
);
router.get("/faculties/:facultyId/majors/:majorId", facultyController.getMajorById);
router.get("/faculties/:facultyId/majors", facultyController.getMajors);
router.patch("/faculties/:facultyId/majors/:majorId", facultyController.updateMajor);
router.delete("/faculties/:facultyId/majors/:majorId", facultyController.deleteMajor);

router.post(
    "/faculties/:facultyId/majors/:majorId/cohorts",
    validateResource({ schema: CreateCohortSchema }),
    facultyController.createCohort
);
router.get("/faculties/:facultyId/majors/:majorId/cohorts/:cohortId", facultyController.getCohortById);
router.delete("/faculties/:facultyId/majors/:majorId/cohorts/:cohortId", facultyController.deleteCohortById);
router.patch("/faculties/:facultyId/majors/:majorId/cohorts/:cohortId", facultyController.updateCohortById);

module.exports = router;
