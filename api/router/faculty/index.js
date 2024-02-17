const router = require('express').Router();
const facultyController = require('../../controllers/faculty.controller');
const { auth } = require('../../middleware/auth');

router
    .route('/faculty')
    .get(auth, facultyController.getAllFaculty)
    .post(auth, facultyController.createFaculty)
    .patch(auth, facultyController.updateFaculty)
    .delete(auth, facultyController.deleteFaculty);

router.get('/faculty/:id', auth, facultyController.getAllMajorsOfFaculty);

router.post('/faculty/major', auth, facultyController.createMajor);

module.exports = router;
