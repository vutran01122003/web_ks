const router = require('express').Router();
const facultyController = require('../../controllers/faculty.controller');
const { auth } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.get('/faculties', facultyController.getAllFaculty);
router.post('/faculties', facultyController.createFaculty);
router.patch('/faculties/:facultyId', facultyController.updateFaculty);
router.delete('/faculties/:facultyId', facultyController.deleteFaculty);

router.post('/faculties/:facultyId/majors', facultyController.createMajor);
router.get('/faculties/:facultyId/majors/:majorId', facultyController.getMajorById);
router.patch('/faculties/:facultyId/majors/:majorId', facultyController.updateMajor);
router.delete('/faculties/:facultyId/majors/:majorId', facultyController.deleteMajor);

router.post('/faculties/:facultyId/majors/:majorId/cohorts', facultyController.createCohort);
router.get('/faculties/:facultyId/majors/:majorId/cohorts/:cohortId', facultyController.getCohortById);
router.delete('/faculties/:facultyId/majors/:majorId/cohorts/:cohortId', facultyController.deleteCohortById);
router.patch('/faculties/:facultyId/majors/:majorId/cohorts/:cohortId', facultyController.updateCohortById);

module.exports = router;
