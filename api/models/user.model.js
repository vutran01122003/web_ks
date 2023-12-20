const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;

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
        faculty: {
            // Khoa giảng dạy của sinh viên (Ví dụ: Khoa Công Nghệ Thông Tin,...)
            type: String,
            required: true
        },
        major: {
            // Chuyên ngành của sinh viên (Ví Dụ: Kỹ Thuật Phần Mềm,...)
            type: String
        },
        cohort: {
            // Khóa sinh viên nhập học (Ví Dụ: K17, K18,...)
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
        email: String,
        phone: String
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

const User = model(DOC, UserSchema);

module.exports = User;
