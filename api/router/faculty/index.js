const router = require('express').Router();
const facultyController = require('../../controllers/faculty.controller');
const { auth } = require('../../middleware/auth');

router.get('/faculties', auth, facultyController.getAllFaculty);
router.post('/faculties', auth, facultyController.createFaculty);
router.patch('/faculties/:facultyId', auth, facultyController.updateFaculty);
router.delete('/faculties/:facultyId', auth, facultyController.deleteFaculty);

router.post('/faculties/:facultyId/majors', auth, facultyController.createMajor);
router.get('/faculties/:facultyId/majors/:majorId', auth, facultyController.getMajorById);
router.patch('/faculties/:facultyId/majors/:majorId', auth, facultyController.updateMajor);
router.delete('/faculties/:facultyId/majors/:majorId', auth, facultyController.deleteMajor);

router.post('/faculties/:facultyId/majors/:majorId/cohorts', auth, facultyController.createCohort);
router.get('/faculties/:facultyId/majors/:majorId/cohorts/:cohortId', auth, facultyController.getCohortById);
router.delete('/faculties/:facultyId/majors/:majorId/cohorts/:cohortId', auth, facultyController.deleteCohortById);
router.patch('/faculties/:facultyId/majors/:majorId/cohorts/:cohortId', auth, facultyController.updateCohortById);

module.exports = router;
