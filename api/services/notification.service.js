const createError = require("http-errors");
const Notification = require("../models/notification.model");
const Pagination = require("../utils/Pagination");
const client = require("../dbs/init.redis");

class NotificationService {
    static async createNotification({ title, content, senderId, recipientId, pageId }) {
        try {
            let createdNotification = null;
            if (recipientId) {
                createdNotification = new Notification({
                    title,
                    content,
                    sender: senderId,
                    recipient: recipientId,
                    page: pageId,
                    isRead: false,
                });

                createdNotification.banedUserList = undefined;
                createdNotification.readedUserList = undefined;

                await createdNotification.save();

                const socketId = await client.get(`socketId:${recipientId}`);
                const populatedCreatedNotification = await createdNotification.populate([
                    {
                        path: "page",
                        model: "page",
                        select: "pageName tables",
                    },
                    {
                        path: "sender",
                        model: "user",
                        select: "avatar fullname",
                    },
                ]);
                _io.to(socketId).emit("notify", populatedCreatedNotification);
            } else {
                createdNotification = await Notification.create({
                    title,
                    content,
                    sender: senderId,
                    banedUserList: [],
                    readedUserList: [],
                });

                const populatedCreatedNotification = await createdNotification.populate([
                    {
                        path: "sender",
                        model: "user",
                        select: "avatar fullname",
                    },
                ]);
                _io.emit("notify", populatedCreatedNotification);
            }

            return createdNotification;
        } catch (error) {
            throw error;
        }
    }

    static async getNotifications({ recipientId, queryString }) {
        try {
            const pagination = new Pagination(
                Notification.find({
                    $or: [
                        { recipient: recipientId },
                        {
                            $and: [{ recipient: { $exists: false } }, { banedUserList: { $nin: [recipientId] } }],
                        },
                    ],
                })
                    .populate([
                        {
                            path: "page",
                            model: "page",
                            select: "pageName tables",
                        },
                        {
                            path: "sender",
                            model: "user",
                            select: "avatar fullname",
                        },
                    ])
                    .sort({ createdAt: -1 }),
                queryString
            );

            const notifications = await pagination.paginating();

            return notifications;
        } catch (error) {
            throw error;
        }
    }

    static async updateReadStatus({ notificationId, status, recipientId }) {
        try {
            const notification = await Notification.findById(notificationId);
            if (!notification) throw createError.NotFound("Thông báo không tồn tại");

            let updatedNotification = null;

            if (notification?.recipient) {
                updatedNotification = await Notification.findOneAndUpdate(
                    {
                        _id: notificationId,
                    },
                    {
                        isRead: status,
                    },
                    { new: true }
                );
            } else {
                if (status) {
                    if (notification.readedUserList.includes(recipientId)) return;
                    notification.readedUserList.push(recipientId);
                } else notification.readedUserList.pull(recipientId);
                updatedNotification = await notification.save();
            }

            return updatedNotification;
        } catch (error) {
            throw error;
        }
    }

    static async updateAllReadStatusNotification({ recipientId }) {
        try {
            await Promise.all([
                Notification.updateMany(
                    {
                        recipient: recipientId,
                        isRead: false,
                    },
                    {
                        isRead: true,
                    }
                ),
                Notification.updateMany(
                    {
                        recipient: { $exists: false },
                        readedUserList: { $nin: [recipientId] },
                        banedUserList: { $nin: [recipientId] },
                    },
                    {
                        $push: {
                            readedUserList: recipientId,
                        },
                    }
                ),
            ]);
        } catch (error) {
            throw error;
        }
    }

    static async deleteNotification({ notificationId, recipientId }) {
        try {
            const notification = await Notification.findById(notificationId);

            if (notification.recipient) {
                await Notification.findByIdAndRemove({
                    _id: notificationId,
                });
            } else {
                if (notification.banedUserList.includes(recipientId)) return;
                notification.banedUserList.push(recipientId);
                await notification.save();
            }
        } catch (error) {
            throw error;
        }
    }

    static async deleteAllNotification({ recipientId }) {
        try {
            await Promise.all([
                Notification.deleteMany({
                    recipient: recipientId,
                }),
                Notification.updateMany(
                    {
                        recipient: { $exists: false },
                        banedUserList: { $nin: [recipientId] },
                    },
                    {
                        $push: { banedUserList: recipientId },
                    }
                ),
            ]);
        } catch (error) {
            throw error;
        }
    }

    static async getNumUnreadNotifications({ recipientId }) {
        try {
            const numUnreadNotifications = await Notification.find({
                $or: [
                    { recipient: recipientId, isRead: false },
                    {
                        recipient: { $exists: false },
                        readedUserList: { $nin: [recipientId] },
                        banedUserList: { $nin: [recipientId] },
                    },
                ],
            }).count();

            return numUnreadNotifications;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NotificationService;
