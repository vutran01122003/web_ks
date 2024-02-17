const router = require('express').Router();
const { auth } = require('../../middleware/auth');
const notificationControllers = require('../../controllers/notification.controllers');

router.get('/notification/:userId', auth, notificationControllers.getNotifications);
router.get(
    '/notification/num_unread_notification/:userId',
    notificationControllers.getNumUnreadNotification
);

router.post('/notification', auth, notificationControllers.createNotification);

router.patch('/notification/read_status', auth, notificationControllers.updateReadStatus);
router.patch(
    '/notification/read_status_all',
    auth,
    notificationControllers.updateAllReadStatusNotification
);

router.delete('/notification', notificationControllers.deleteNotification);
router.delete('/notification/all', notificationControllers.deleteAllNotification);

module.exports = router;
