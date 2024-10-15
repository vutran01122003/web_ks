const User = require("../models/user.model");
const { createNewAnnualActivitiesProgress } = require("./user.service");
const FacultyService = require("./faculty.service");
const PermissionService = require("./permission.service");
const createHttpError = require("http-errors");

const { TALENT_ENGINEER_CODE, TEMPORARY_TALENT_ENGINEER_CODE } = process.env;

class AccessService {
    static login = async (data) => {
        try {
            const { userId, password } = data;
            const user = await User.findOne({ userId }).populate([
                {
                    path: "group",
                    model: "group",
                },
            ]);

            if (user) {
                const isValidPassword = user.checkPassword(password);
                user.password = undefined;

                return {
                    isSuccessLogin: isValidPassword,
                    typePassword: "password",
                    data: user,
                };
            } else throw createHttpError.Unauthorized("Mã sinh viên hoặc mật khẩu không đúng");
        } catch (error) {
            throw error;
        }
    };

    static register = async ({ data, groupCode }) => {
        try {
            const { userId, lastName, firstName, password, birthday, major, cohort, faculty, email, phone } = data;

            const result = await Promise.all([
                User.findOne({ userId }),
                User.findOne({ email }),
                User.findOne({ phone }),
            ]);

            if (result[0]) throw createHttpError.Conflict("Mã sinh viên đã tồn tại");
            if (result[1]) throw createHttpError.Conflict("Email đã tồn tại");
            if (result[2]) throw createHttpError.Conflict("Số điện thoại đã tồn tại");

            const [currentLevelYear, group] = await Promise.all([
                FacultyService.getCurrentLevelYearOfCohort({
                    facultyName: faculty.toLowerCase(),
                    majorName: major.toLowerCase(),
                    cohortName: +cohort,
                }),
                PermissionService.getGroupByGroupCode({ groupCode }),
            ]);

            const createdUser = new User({
                userId,
                firstName,
                lastName,
                birthday: new Date(birthday),
                major,
                cohort,
                faculty,
                email,
                phone,
                group: group._id,
            });

            if ([TALENT_ENGINEER_CODE, TEMPORARY_TALENT_ENGINEER_CODE].includes(groupCode))
                createdUser.levelYear = currentLevelYear;

            createdUser.encodePassword(password);

            await createdUser.save();

            const populatedUser = await User.populate(createdUser, { path: "group" });

            await createNewAnnualActivitiesProgress({
                pageInfo: {
                    pageStudentMajor: major,
                    pageStudentCohort: cohort,
                },
                currentLevelYear,
                userId: populatedUser._id,
            });

            return populatedUser;
        } catch (error) {
            throw error;
        }
    };

    static getUserInfo = async (userId) => {
        try {
            const user = await User.findById(userId)
                .select("-password")
                .populate([
                    {
                        path: "group",
                        model: "group",
                    },
                ])
                .lean();
            if (!user) throw createHttpError.NotFound("Tài khoản người dùng không tồn tại");
            return user;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = AccessService;
