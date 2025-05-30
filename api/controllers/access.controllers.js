const AccessService = require("../services/access.service");
const accessService = require("../services/access.service");
const jwtService = require("../services/jwt.service");
const createError = require("http-errors");
const { TALENT_ENGINEER_CODE } = process.env;

class AccessControllers {
    getInfoUser = async (req, res, next) => {
        try {
            const accessToken = res.locals.accessToken;
            const userId = res.locals.userData._id;

            const user = await accessService.getUserInfo(userId);

            if (!user.isActive) throw createError.BadRequest("Tài khoản đã bị khóa");

            res.status(200).json({
                user,
                token: {
                    accessToken
                }
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const loggedUser = await accessService.login(req.body);

            if (!loggedUser.isSuccessLogin) throw createError.Unauthorized("Đăng nhập không thành công");

            if (loggedUser.typePassword !== "password") {
                return res.status(200).send({
                    status: "Đăng nhập thành công",
                    data: {
                        firstLogin: {
                            userId: req.body.userId,
                            birthday: req.body.password
                        }
                    }
                });
            }

            if (loggedUser?.data && !loggedUser?.data.isActive) throw createError.BadRequest("Tài khoản đã bị khóa");

            const accessToken = await jwtService.signAccessToken({
                userData: loggedUser?.data
            });

            res.status(200).json({
                msg: "Đăng nhập thành công",
                data: {
                    user: loggedUser?.data,
                    token: {
                        accessToken
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    };

    createAccountByAdmin = async (req, res, next) => {
        try {
            const data = req.body;
            const groupCode = data.groupCode || TALENT_ENGINEER_CODE;

            const createdUser = await accessService.register({
                data: {
                    ...data,
                    password: process.env.DEFAULT_PASSWORD
                },
                groupCode
            });

            if (!createdUser) throw createError.BadRequest("Tạo tài khoản người dùng thất bại");

            res.status(201).json({
                status: "Tạo tài khoản người dùng thành công",
                data: {
                    user: createdUser
                }
            });
        } catch (error) {
            next(error);
        }
    };

    register = async (req, res, next) => {
        try {
            const data = req.body;
            const groupCode = data.groupCode || TALENT_ENGINEER_CODE;

            const createdUser = await accessService.register({
                data,
                groupCode
            });

            if (!createdUser) throw createError.BadRequest("Tạo tài khoản người dùng thất bại");

            const accessToken = await jwtService.signAccessToken({
                userData: createdUser
            });

            res.status(201).json({
                msg: "Tạo tài khoản thành công",
                data: {
                    user: createdUser,
                    token: {
                        accessToken
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            return res.json({
                msg: "Đăng xuất thành công"
            });
        } catch (error) {
            next(error);
        }
    };

    changePassword = async (req, res, next) => {
        try {
            const userData = res.locals.userData;
            const { password, newPassword } = req.body;

            if (!password.trim() || !newPassword.trim())
                throw createError.BadRequest("Vui lòng nhập đầy đủ thông tin mật khẩu");

            await AccessService.changePassword({
                userId: userData._id,
                password,
                newPassword
            });

            res.status(200).json({
                msg: "Đổi mật khẩu thành công"
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AccessControllers();
