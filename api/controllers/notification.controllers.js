const NotificationService = require('../services/notification.service');

class NotificationControllers {
    async createNotification(req, res, next) {
        try {
            const { title, content, senderId, recipientId, pageId } = req.body;
            const createdNotification = await NotificationService.createNotification({
                title,
                content,
                senderId,
                recipientId,
                pageId
            });

            res.status(201).json({
                code: 201,
                msg: 'Tạo thông báo thành công',
                data: createdNotification
            });
        } catch (error) {
            next(error);
        }
    }

    async getNotifications(req, res, next) {
        try {
            const userId = req.params.userId;
            const queryString = req.query;

            const notifications = await NotificationService.getNotifications({
                userId,
                queryString
            });

            res.status(200).json({
                code: 200,
                msg: 'Lấy dữ liệu thông báo thành công',
                data: notifications
            });
        } catch (error) {
            next(error);
        }
    }

    async updateReadStatus(req, res, next) {
        try {
            const { notificationId, status, recipientId } = req.body;

            const updatedNotification = await NotificationService.updateReadStatus({
                notificationId,
                status,
                recipientId
            });

            res.status(200).json({
                code: 200,
                msg: 'Cập nhật trạng thái đọc của thông báo thành công',
                data: updatedNotification
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAllReadStatusNotification(req, res, next) {
        try {
            const recipientId = req.body.recipientId;

            await NotificationService.updateAllReadStatusNotification({
                recipientId
            });

            res.status(200).json({
                code: 200,
                msg: 'Đánh dấu đã đọc tất cả thông báo thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteNotification(req, res, next) {
        try {
            const { notificationId, recipientId } = req.body;

            const deletedNotifications = await NotificationService.deleteNotification({
                notificationId,
                recipientId
            });

            res.status(200).json({
                code: 200,
                msg: 'Xóa thông báo thành công',
                data: deletedNotifications
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAllNotification(req, res, next) {
        try {
            const { recipientId } = req.body;

            await NotificationService.deleteAllNotification({
                recipientId
            });

            res.status(200).json({
                code: 200,
                msg: 'Xóa tất cả thông báo thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    async getNumUnreadNotification(req, res, next) {
        try {
            const recipientId = req.params.userId;

            const numUnreadNotification = await NotificationService.getNumUnreadNotification({
                recipientId
            });

            res.status(200).json({
                code: 200,
                msg: 'Lấy số lượng bài viết chưa đọc thành công',
                data: {
                    numUnreadNotification
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NotificationControllers();
