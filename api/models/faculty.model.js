const conn = require("../dbs/init.mongodb");
const { Schema } = require("mongoose");
const Major = require("./major.model");

const [DOC, COL] = ["faculty", "faculties"];

const FacultySchema = new Schema(
    {
        facultyName: {
            type: String,
            lowercase: true,
            unique: true
        },
        majors: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "major"
                }
            ],
            default: []
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true, collection: COL }
);

FacultySchema.pre("findOneAndDelete", async function (next) {
    try {
        const { _id } = this.getQuery();
        const faculty = await this.model.findById(_id);
        const majorIds = faculty.majors;

        await Major.deleteMany({ _id: { $in: majorIds } });
        next();
    } catch (error) {
        throw error;
    }
});

const Faculty = conn.model(DOC, FacultySchema);

module.exports = Faculty;
