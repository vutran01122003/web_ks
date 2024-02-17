const conn = require('../dbs/init.mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const [DOC, COL] = ['user', 'users'];

const UserSchema = new Schema(
    {
        avatar: {
            type: String,
            default:
                'https://tesf.s3.ap-southeast-1.amazonaws.com/avatar/avatar_default/avatar_default.jpg'
        },
        studentId: {
            type: String,
            required: true,
            trim: true
        },
        fullName: {
            type: String,
            lowercase: true,
            required: true
        },
        password: {
            type: String,
            trim: true
        },
        birthday: {
            type: Schema.Types.Date,
            required: true
        },
        // Thuộc tính faculty cho biết khoa giảng dạy của sinh viên (Ví dụ: Khoa Công Nghệ Thông Tin,...)
        faculty: {
            type: String,
            lowercase: true,
            required: true
        },
        // Thuộc tính major cho biết chuyên ngành của sinh viên (Ví Dụ: Kỹ Thuật Phần Mềm,...)
        major: {
            type: String,
            lowercase: true
        },
        // Thuộc tính cohort cho biết Khóa sinh viên nhập học (Ví Dụ: 17, 18, 19, 20,...)
        cohort: {
            type: Number,
            required: true
        },
        roles: {
            type: Array,
            default: []
        },
        levelYear: {
            type: Number,
            default: 1
        },
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
        annualTaskProgress: {}
    },
    {
        collection: COL,
        timestamps: true
    }
);

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function (next) {
    try {
        const hashedPassword = bcrypt.hashSync(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const User = conn.model(DOC, UserSchema);

module.exports = User;
