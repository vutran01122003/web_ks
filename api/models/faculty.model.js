const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const [DOC, COL] = ["faculty", "faculties"];

const FacultySchema = new Schema(
    {
        facultyName: {
            type: String,
            required: true,
            unique: true,
            collation: { locale: "vi", strength: 2 },
        },
        isActive: {
            type: Schema.Types.Boolean,
            required: true,
        },
        majors: [
            {
                majorName: {
                    type: String,
                    unique: true,
                    collation: { locale: "vi", strength: 2 },
                },
                isActive: Schema.Types.Boolean,
            },
        ],
    },
    {
        collection: COL,
    }
);

const Faculty = model(DOC, FacultySchema);

module.exports = Faculty;
