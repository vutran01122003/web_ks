const router = require('express').Router();
const { auth } = require('../../middleware/auth');
const notificationControllers = require('../../controllers/notification.controllers');
const { checkPermission } = require('../../middleware/permission');

router.get('/notifications/:recipientId', auth, checkPermission, notificationControllers.getNotifications);
router.get(
    '/notifications/:recipientId/unread-notifications',
    auth,
    checkPermission,
    notificationControllers.getNumUnreadNotifications
);

router.post('/notifications', auth, checkPermission, notificationControllers.createNotification);

router.patch(
    '/notifications/:notificationId/updated-status',
    auth,
    checkPermission,
    notificationControllers.updateReadStatus
);
router.patch(
    '/notifications/updated-status',
    auth,
    checkPermission,
    notificationControllers.updateAllReadStatusNotification
);

router.delete('/notifications/:notificationId', auth, checkPermission, notificationControllers.deleteNotification);
router.delete('/notifications', auth, checkPermission, notificationControllers.deleteAllNotification);

module.exports = router;
