const { Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const conn = require("../dbs/init.mongodb");
const ProgressSchema = require("./progress.schema");

const [DOC, COL] = ["user", "users"];

const UserSchema = new Schema(
    {
        avatar: {
            type: String,
            default: process.env.S3_DEFAULT_AVATAR
        },
        userId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        firstName: {
            type: String,
            lowercase: true,
            trim: true
        },
        lastName: {
            type: String,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            trim: true
        },
        groups: {
            type: [Schema.Types.ObjectId],
            ref: "group"
        },
        gender: {
            type: String,
            enum: ["nam", "nữ"],
            lowercase: true,
            default: "nam"
        },
        birthday: {
            type: Schema.Types.Date
        },
        faculty: {
            type: Schema.Types.ObjectId,
            ref: "faculty"
        },
        major: {
            type: Schema.Types.ObjectId,
            ref: "major"
        },
        // Thuộc tính cohort cho biết Khóa sinh viên nhập học (Ví Dụ: K17, K18,...)
        cohort: {
            type: Schema.Types.ObjectId,
            ref: "cohort"
        },
        // Cấp bậc năm học của sinh viên (1, 2, 3, 4, 5, ...)
        levelYear: {
            type: Number
        },
        // Cấp bậc năm học đăng ký bổ sung của sinh viên (1, 2, 3, 4, 5, ...)
        isActive: {
            type: Boolean,
            default: true
        },
        email: {
            type: String,
            lowercase: true
        },
        phone: {
            type: String,
            lowercase: true
        },
        // Thuộc tính annualTaskProgress cho biết tiến độ hoàn thành nhiệm vụ mỗi năm của sinh viên
        annualTemporaryActivitiesProgress: {
            type: [ProgressSchema]
        },
        annualActivitiesProgress: {
            type: [ProgressSchema]
        }
    },
    {
        collection: COL,
        timestamps: true
    }
);

UserSchema.methods.encodePassword = function (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    this.password = hashedPassword;
};

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = conn.model(DOC, UserSchema);

module.exports = User;
