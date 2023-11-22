const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const [DOC, COL] = ['page', 'pages'];

const ApplySchema = new Schema(
    {
        studentId: {
            type: String,
            require: true
        },
        fullName: {
            type: String,
            require: true
        },
        birthday: {
            type: Schema.Types.Date,
            require: true
        },
        faculty: {
            type: String,
            require: true
        },
        year: {
            type: String
        },
        graduationScore: {
            type: Number
        },
        proofGraduation: {
            type: [String],
            default: []
        },
        certificate: {
            type: [
                {
                    name: {
                        type: String,
                        required: true
                    },
                    score: {
                        type: Number
                    },
                    proof: {
                        type: [String]
                    }
                }
            ]
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        status: {
            type: String,
            enum: ['Đã Duyệt', 'Chờ Duyệt', 'Từ Chối'],
            default: 'Chờ duyệt'
        }
    },
    {
        collection: COL,
        timestamps: true
    }
);

ApplySchema.pre('findOneAndUpdate', async function (next) {
    try {
        const { _id } = this.getQuery();
        const { status } = this.getUpdate();

        const applyStudent = await Apply.findById(_id);

        if (applyStudent && status === 'Đã Duyệt') {
            const User = require('../models/user.model');

            const newUser = await User.create({
                studentId: applyStudent.studentId,
                fullName: applyStudent.fullName,
                password: '1111',
                birthday: applyStudent.birthday,
                major: applyStudent.faculty,
                roles: '0001',
                email: applyStudent.email,
                phone: applyStudent.phone
            });
        }
    } catch (error) {}
});

const Apply = model(DOC, ApplySchema);

module.exports = Apply;
