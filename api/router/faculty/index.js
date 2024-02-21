const router = require('express').Router();
const facultyController = require('../../controllers/faculty.controller');
const { auth } = require('../../middleware/auth');

router
    .route('/faculty')
    .get(auth, facultyController.getAllFaculty)
    .post(auth, facultyController.createFaculty)
    .patch(auth, facultyController.updateFaculty)
    .delete(auth, facultyController.deleteFaculty);

router.post('/faculty/major', auth, facultyController.createMajor);
router.get('/faculty/major/:majorId', auth, facultyController.getMajorById);
router.patch('/faculty/major', auth, facultyController.updateMajor);
router.delete('/faculty/major', auth, facultyController.deleteMajor);

router.post('/faculty/major/cohort', auth, facultyController.createCohort);
router.get('/faculty/major/cohort/:cohortId', auth, facultyController.getCohortById);
router.delete('/faculty/major/cohort', auth, facultyController.deleteCohortById);
router.patch('/faculty/major/cohort', auth, facultyController.updateCohortById);

module.exports = router;
