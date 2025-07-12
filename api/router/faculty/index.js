const router = require("express").Router();
const facultyController = require("../../controllers/faculty.controller");
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");
const validateResource = require("../../middleware/validateResource");
const { CreateFacultySchema, CreateMajorListSchema, CreateCohortSchema } = require("../../schema/faculty.schema");

router.get("/faculties", facultyController.getAllFaculty);
router.get("/faculties/id/:facultyId", auth, checkPermission, facultyController.getFacultyById);
router.get("/faculties/name/:facultyName", auth, checkPermission, facultyController.getFacultyByName);
router.post(
    "/faculties",
    auth,
    checkPermission,
    validateResource({ schema: CreateFacultySchema }),
    facultyController.createFaculty
);
router.patch("/faculties/:facultyId", auth, checkPermission, facultyController.updateFaculty);
router.delete("/faculties/:facultyId", auth, checkPermission, facultyController.deleteFaculty);

router.post(
    "/faculties/:facultyId/majors",
    auth,
    checkPermission,
    validateResource({ schema: CreateMajorListSchema }),
    facultyController.createMajor
);
router.get("/faculties/:facultyId/majors/:majorId", auth, checkPermission, facultyController.getMajorById);
router.get("/majors", auth, checkPermission, facultyController.getMajors);
router.patch("/faculties/:facultyId/majors/:majorId", auth, checkPermission, facultyController.updateMajor);
router.delete("/faculties/:facultyId/majors/:majorId", auth, checkPermission, facultyController.deleteMajor);

router.post(
    "/faculties/:facultyId/majors/:majorId/cohorts",
    auth,
    checkPermission,
    validateResource({ schema: CreateCohortSchema }),
    facultyController.createCohort
);
router.get(
    "/faculties/:facultyId/majors/:majorId/cohorts/:cohortId",
    auth,
    checkPermission,
    facultyController.getCohortById
);
router.delete(
    "/faculties/:facultyId/majors/:majorId/cohorts/:cohortId",
    auth,
    checkPermission,
    facultyController.deleteCohortById
);
router.patch(
    "/faculties/:facultyId/majors/:majorId/cohorts/:cohortId",
    auth,
    checkPermission,
    facultyController.updateCohortById
);

module.exports = router;
