const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;

const [DOC, COL] = ['user', 'users'];

const UserSchema = new Schema(
    {
        studentId: {
            type: String,
            required: true
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
        major: {
            type: String,
            required: true
        },
        roles: {
            type: Array,
            default: []
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
