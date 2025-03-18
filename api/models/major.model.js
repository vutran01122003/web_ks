const conn = require("../dbs/init.mongodb");
const { Schema } = require("mongoose");
const Cohort = require("./cohort.model");

const [DOC, COL] = ["major", "majors"];

const MajorSchema = new Schema(
    {
        majorName: {
            type: String,
            lowercase: true
        },
        managers: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "user"
                }
            ],
            default: []
        },
        cohorts: {
            type: [{ type: Schema.Types.ObjectId, ref: "cohort" }],
            default: []
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: COL
    }
);

MajorSchema.pre("deleteMany", async function (next) {
    try {
        const docs = await this.model.find(this._conditions);
        const cohortIds = docs.reduce((arr, doc) => {
            return [...arr, ...doc.cohorts];
        }, []);

        await Cohort.deleteMany({ _id: { $in: cohortIds } });
        next();
    } catch (error) {
        next(error);
    }
});

MajorSchema.pre("findOneAndDelete", async function (next) {
    try {
        const { _id } = this.getQuery();
        const major = await this.model.findById(_id);

        await Cohort.deleteMany({ _id: { $in: major.cohorts } });
        next();
    } catch (error) {
        next(error);
    }
});
const Major = conn.model(DOC, MajorSchema);

module.exports = Major;
