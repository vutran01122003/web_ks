const conn = require("../dbs/init.mongodb");
const mongoose = require("mongoose");
const [COL, DOC] = ["notifications", "notification"];
const NotificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "user",
            required: true
        },
        // Nếu thuộc tính recipient không tồn tại thì thông báo sẽ được gửi cho toàn bộ mọi người
        recipient: {
            type: mongoose.Types.ObjectId,
            ref: "user"
        },
        // Thuộc tính Page chỉ hoạt động khi liên quan đến xét duyệt hoạt động
        // Chức năng: Điều hướng sinh viên đến page chứa hoạt động được xét duyệt
        page: {
            type: mongoose.Types.ObjectId,
            ref: "page"
        },
        isRead: Boolean,
        banedUserList: Array,
        readedUserList: Array,
        content: String
    },
    {
        timestamps: true,
        collection: COL
    }
);

const Notification = conn.model(DOC, NotificationSchema);

module.exports = Notification;
