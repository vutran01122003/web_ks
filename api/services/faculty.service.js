const Faculty = require('../models/faculty.model');

class FacultyService {
    static createFaculty = async ({ facultyName }) => {
        try {
            const isExists = await Faculty.findOne({ facultyName }).lean();

            if (isExists)
                return {
                    code: 409,
                    msg: 'Tên khoa đã tồn tại',
                    data: null
                };

            const faculty = await Faculty.create({
                facultyName
            });

            return {
                code: 200,
                data: faculty,
                msg: `Khoa ${facultyName} đã được tạo`
            };
        } catch (error) {
            throw error;
        }
    };

    static createMajor = async ({ majorName, facultyId }) => {
        try {
            const updatedFaculty = await Faculty.findByIdAndUpdate(
                facultyId,
                {
                    $push: {
                        majors: {
                            majorName
                        }
                    }
                },
                {
                    new: true
                }
            );

            return {
                msg: `Chuyên ngành ${majorName} đã được tạo thành công`,
                code: 201,
                data: updatedFaculty.majors[updatedFaculty.majors.length - 1]
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
                    status: 'failed',
                    msg: 'Không có facultyId để cập nhật'
                };

            const faculty = await Faculty.findByIdAndUpdate(
                facultyId,
                { facultyName, isActive, majors },
                { new: true }
            ).lean();

            if (!faculty)
                return {
                    code: 400,
                    status: 'failed',
                    msg: 'Cập nhật thất bại'
                };

            return {
                code: 201,
                status: 'success',
                data: faculty
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
                    status: 'failed',
                    msg: 'Không có facultyId để xóa'
                };

            const faculty = await Faculty.findByIdAndDelete(facultyId);

            if (!faculty)
                return {
                    code: 400,
                    status: 'failed',
                    msg: 'Xóa thất bại'
                };

            return {
                code: 200,
                status: 'success',
                data: faculty
            };
        } catch (error) {
            throw error;
        }
    };

    static getAllFaculties = async () => {
        try {
            const faculties = await Faculty.find({ isActive: true }).populate('majors').lean();

            const availableFaculties = faculties.filter((faculty) => faculty.isActive === true);

            return availableFaculties;
        } catch (error) {
            throw error;
        }
    };

    static getAllMajorsOfFaculty = async (facultyId) => {
        console.log(facultyId);
        try {
            const faculties = await Faculty.findById(facultyId).populate('majors');

            console.log(faculties);

            const majors = faculties.majors.filter((major) => major.isActive === true);

            return majors;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = FacultyService;
