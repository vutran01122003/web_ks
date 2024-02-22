const router = require('express').Router();
const { auth } = require('../../middleware/auth');
const notificationControllers = require('../../controllers/notification.controllers');

router.get('/notifications/:recipientId', auth, notificationControllers.getNotifications);
router.get('/notifications/:recipientId/unread-notifications', notificationControllers.getNumUnreadNotifications);

router.post('/notifications', auth, notificationControllers.createNotification);

router.patch('/notifications/:notificationId/updated-status', auth, notificationControllers.updateReadStatus);
router.patch('/notifications/updated-status', auth, notificationControllers.updateAllReadStatusNotification);

router.delete('/notifications/:notificationId', notificationControllers.deleteNotification);
router.delete('/notifications', notificationControllers.deleteAllNotification);

module.exports = router;
