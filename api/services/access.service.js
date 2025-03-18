const User = require("../models/user.model");
const { createNewAnnualActivitiesProgress } = require("./user.service");
const FacultyService = require("./faculty.service");
const PermissionService = require("./permission.service");
const createHttpError = require("http-errors");

const { TALENT_ENGINEER_CODE, TEMPORARY_TALENT_ENGINEER_CODE } = process.env;
const populatedOptions = [
    {
        path: "groups",
        model: "group"
    },
    {
        path: "faculty",
        model: "faculty"
    },
    {
        path: "major",
        model: "major"
    },
    {
        path: "cohort",
        model: "cohort"
    }
];

class AccessService {
    static login = async (data) => {
        try {
            const { userId, password } = data;
            const user = await User.findOne({ userId }).populate(populatedOptions);

            if (user) {
                const isValidPassword = user.checkPassword(password);
                user.password = undefined;

                return {
                    isSuccessLogin: isValidPassword,
                    typePassword: "password",
                    data: user
                };
            } else throw createHttpError.Unauthorized("Mã sinh viên hoặc mật khẩu không đúng");
        } catch (error) {
            throw error;
        }
    };

    static register = async ({ data, groupCode, transaction }) => {
        try {
            const { userId, lastName, firstName, password, birthday, major, cohort, faculty, email, phone } = data;
            let levelYear = 0;

            const results = await Promise.all([
                User.findOne({ userId }),
                User.findOne({ email }),
                User.findOne({ phone })
            ]);

            if (results[0]) throw createHttpError.Conflict(`Mã sinh viên ${userId} đã tồn tại`);
            if (results[1]) throw createHttpError.Conflict(`Email ${email} đã tồn tại`);
            if (results[2]) throw createHttpError.Conflict(`Số điện thoại ${phone} đã tồn tại`);

            const [facultyData, majorData, cohortData] = await Promise.all([
                FacultyService.getFacultyByName({ facultyName: faculty.toLowerCase() }),
                FacultyService.getMajorByName({ majorName: major.toLowerCase() }),
                FacultyService.getCohortByName({ majorName: major.toLowerCase(), cohortName: cohort.toLowerCase() })
            ]);

            if (!facultyData) throw createHttpError.NotFound("Khoa không tồn tại");
            if (!majorData) throw createHttpError.NotFound("Chuyên ngành không tồn tại");
            if (!cohortData) throw createHttpError.NotFound("Khóa sinh viên không tồn tại");

            const group = await PermissionService.getGroupByGroupCode(groupCode);

            const createdUser = new User({
                userId,
                firstName,
                lastName,
                birthday: new Date(birthday),
                faculty: facultyData._id,
                major: majorData._id,
                cohort: cohortData._id,
                email,
                phone,
                groups: [group._id]
            });

            if (TALENT_ENGINEER_CODE === groupCode) {
                levelYear = await FacultyService.getCurrentLevelYearOfCohort({
                    majorName: major,
                    cohortName: String(cohort)
                });
                createdUser.levelYear = levelYear;
            } else if (TEMPORARY_TALENT_ENGINEER_CODE === groupCode) {
                const additionalRegisterInfo = await FacultyService.getAdditionalRegisterInfo({
                    majorName: major,
                    cohortName: cohort
                });

                levelYear = additionalRegisterInfo.levelYear;

                if (!additionalRegisterInfo.isActive)
                    throw createHttpError.BadRequest("Năm học đăng ký bổ sung đã kết thúc");

                createdUser.levelYear = levelYear;
            }

            createdUser.encodePassword(password);

            if (transaction) await createdUser.save(transaction);
            else await createdUser.save();

            const populatedUser = await User.populate(createdUser, populatedOptions);

            if ([TEMPORARY_TALENT_ENGINEER_CODE, TALENT_ENGINEER_CODE].includes(groupCode)) {
                await createNewAnnualActivitiesProgress({
                    pageInfo: {
                        pageFaculty: faculty.toLowerCase(),
                        pageStudentMajor: major.toLowerCase(),
                        pageStudentCohort: cohort,
                        pageTalentEngineerType: groupCode
                    },
                    currentLevelYear: levelYear,
                    user: populatedUser
                });
            }

            return populatedUser;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    static getUserInfo = async (userId) => {
        try {
            const user = await User.findById(userId).select("-password").populate(populatedOptions).lean();
            if (!user) throw createHttpError.NotFound("Tài khoản người dùng không tồn tại");
            return user;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = AccessService;
