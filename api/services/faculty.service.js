const { default: mongoose } = require("mongoose");
const Faculty = require("../models/faculty.model");

class FacultyService {
    static createFaculty = async (data) => {
        try {
            const { facultyName, isActive, majors } = data;

            if (!facultyName || !isActive)
                return {
                    code: 400,
                    status: "failed",
                    msg: "Thiếu trường facultyName",
                };

            const isExists = await Faculty.findOne({ facultyName })
                .collation({ locale: "en", strength: 2 })
                .lean();
            if (isExists)
                return {
                    code: 400,
                    status: "failed",
                    msg: "facultyName đã tồn tại",
                };

            const faculty = await Faculty.create({
                facultyName,
                isActive,
                majors,
            });

            if (faculty) return faculty;
            else
                return {
                    code: 400,
                    status: "failed",
                    msg: "Thêm faculty thất bại",
                };
        } catch (error) {
            throw error;
        }
    };

    static updateFaculty = async (data) => {
        try {
            let { facultyId, facultyName, isActive, majors } = data;

            if (!facultyId)
                return {
                    code: 400,
                    status: "failed",
                    msg: "Không có facultyId để cập nhật",
                };

            const faculty = await Faculty.findByIdAndUpdate(
                facultyId,
                { facultyName, isActive, majors },
                { new: true }
            ).lean();

            if (!faculty)
                return {
                    code: 400,
                    status: "failed",
                    msg: "Cập nhật thất bại",
                };

            return {
                code: 201,
                status: "success",
                data: faculty,
            };
        } catch (error) {
            throw error;
        }
    };

    static deleteFaculty = async ({ facultyId }) => {
        try {
            if (!facultyId)
                return {
                    code: 400,
                    status: "failed",
                    msg: "Không có facultyId để xóa",
                };

            const faculty = await Faculty.findByIdAndDelete(facultyId);

            if (!faculty)
                return {
                    code: 400,
                    status: "failed",
                    msg: "Xóa thất bại",
                };

            return {
                code: 200,
                status: "success",
                data: faculty,
            };
        } catch (error) {
            throw error;
        }
    };

    static getAllFaculties = async () => {
        try {
            const faculties = await Faculty.find({ isActive: true })
                .populate("majors")
                .lean();

            const availableFaculties = faculties.filter(
                (faculty) => faculty.isActive === true
            );

            return availableFaculties;
        } catch (error) {
            throw error;
        }
    };

    static getAllMajorsOfFaculty = async (facultyId) => {
        console.log(facultyId);
        try {
            const faculties = await Faculty.findById(facultyId).populate(
                "majors"
            );

            console.log(faculties);

            const majors = faculties.majors.filter(
                (major) => major.isActive === true
            );

            return majors;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = FacultyService;
