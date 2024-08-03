const mongoose = require('mongoose');
const { Schema } = mongoose;
const conn = require('../dbs/init.mongodb');
const User = require('./user.model');

const [DOC, COL] = ['row', 'rows'];

const RowSchema = new Schema(
    {
        levelYear: Number,
        page: {
            type: Schema.Types.ObjectId,
            ref: 'page'
        },
        table: Schema.Types.ObjectId,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        content: {
            type: [
                new mongoose.Schema(
                    {
                        rowId: Schema.Types.ObjectId,
                        status: {
                            type: String,
                            enum: ['đã duyệt', 'chờ duyệt', 'từ chối', 'phải nộp lại', 'hết hạn'],
                            lowercase: true,
                            default: 'chờ duyệt'
                        },
                        proofFilesList: {
                            type: [
                                {
                                    originalName: String,
                                    fileUrl: String,
                                    fileType: String,
                                    Key: String,
                                    Bucket: String
                                }
                            ],
                            default: []
                        },
                        rowValue: {},
                        note: {
                            type: [
                                new mongoose.Schema(
                                    {
                                        value: String
                                    },
                                    { timestamps: { createdAt: true, updatedAt: false } }
                                )
                            ],
                            default: []
                        },
                        totalScore: {
                            type: Number,
                            default: 0
                        },
                        deadline: Schema.Types.Date
                    },
                    { timestamps: { createdAt: true, updatedAt: false } }
                )
            ],
            default: []
        }
    },
    {
        collection: COL,
        timestamps: true
    }
);

RowSchema.pre('deleteMany', async function (next) {
    try {
        const fieldOfStatus = {
            'chờ duyệt': 'numberOfPendingActivity',
            'đã duyệt': 'numberOfAcceptedActivity',
            'từ chối': 'numberOfRejectedActivity',
            'phải nộp lại': 'numberOfResubmitedActivity'
        };

        const ACCEPTED_STATUS = 'đã duyệt';
        const deletedDocs = await this.model.find(this._conditions).populate('page').lean();

        if (deletedDocs.length > 0) {
            const index = deletedDocs[0].page.pageStudentLevelYear - 1;

            await Promise.all(
                deletedDocs.reduce((arrPendingTask, doc) => {
                    return [
                        ...arrPendingTask,
                        ...doc.content.map((contentItem) =>
                            User.findByIdAndUpdate(doc.user, {
                                $inc: {
                                    [`annualActivitiesProgress.${index}.${fieldOfStatus[contentItem.status]}`]: -1,
                                    [`annualActivitiesProgress.${index}.totalScore`]:
                                        contentItem.status === ACCEPTED_STATUS ? -contentItem.totalScore : 0
                                }
                            })
                        )
                    ];
                }, [])
            );
        }

        return next();
    } catch (error) {
        console.log(error);
        return next(error);
    }
});

const Row = conn.model(DOC, RowSchema);
module.exports = Row;
