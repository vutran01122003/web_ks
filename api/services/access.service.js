const User = require("../models/user.model");
const { createNewAnnualActivitiesProgress } = require("./user.service");
const FacultyService = require("./faculty.service");
const PermissionService = require("./permission.service");
const createHttpError = require("http-errors");
const { capitalizeFirstLetter } = require("../utils/handleString");

const { TALENT_ENGINEER_CODE, TEMPORARY_TALENT_ENGINEER_CODE, ADMIN_CODE, MAJOR_MANAGER_CODE } = process.env;
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
            } else throw createHttpError.Unauthorized("Mã tài khoản hoặc mật khẩu không đúng");
        } catch (error) {
            throw error;
        }
    };

    static register = async ({ data, groupCode, isExcelImport }) => {
        try {
            let levelYear = 0;
            const { userId, lastName, firstName, password, birthday, major, cohort, faculty, email, phone } = data;

            if (!isExcelImport && (await User.findOne({ userId })))
                throw createHttpError.BadRequest(`Người dùng ${userId} đã tồn tại trong hệ thống`);

            const [facultyData, majorData, cohortData] = await Promise.all([
                faculty ? FacultyService.getFacultyByName({ facultyName: faculty }) : null,
                major ? FacultyService.getMajorByName({ majorName: major }) : null,
                cohort ? FacultyService.getCohortByName({ majorName: major, cohortName: cohort }) : null
            ]);

            const group = await PermissionService.getGroupByGroupCode(groupCode);

            const createdUser = new User({
                userId,
                firstName,
                lastName,
                birthday: birthday ? new Date(birthday) : null,
                faculty: facultyData?._id,
                major: majorData?._id,
                cohort: cohortData?._id,
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

                if (!additionalRegisterInfo)
                    throw createHttpError.BadRequest(
                        `Chuyên ngành ${capitalizeFirstLetter(major)} chưa tổ chức tuyển bổ sung`
                    );

                if (!additionalRegisterInfo.isActive)
                    throw createHttpError.BadRequest("Năm học đăng ký bổ sung đã kết thúc");

                createdUser.levelYear = levelYear;
            }

            createdUser.encodePassword(password ? password : process.env.DEFAULT_PASSWORD);

            await createdUser.save();

            const populatedUser = await User.populate(createdUser, populatedOptions);

            if (groupCode === MAJOR_MANAGER_CODE) {
                await FacultyService.addManagerToMajor({
                    majorName: major,
                    userId: populatedUser._id
                });
            }

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
