const accessService = require("../services/access.service");
const jwtService = require("../services/jwt.service");
const createError = require("http-errors");
const { TALENT_ENGINEER_CODE } = process.env;

class AccessControllers {
    getInfoUser = async (req, res, next) => {
        try {
            const accessToken = req?.headers["x-token"] || req.cookies?.accessToken;
            const user = await accessService.getUserInfo(res.locals.userData._id);

            if (!user.isActive) throw createError.BadRequest("Tài khoản đã bị khóa");

            res.status(200).json({
                user,
                token: {
                    accessToken,
                },
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
                            birthday: req.body.password,
                        },
                    },
                });
            }

            if (loggedUser?.data && !loggedUser?.data.isActive) throw createError.BadRequest("Tài khoản đã bị khóa");

            const accessToken = await jwtService.signAccessToken({
                userData: loggedUser?.data,
            });

            res.status(200)
                .cookie("accessToken", accessToken, {
                    // httpOnly: true,
                    // secure: true
                })
                .send({
                    status: "Đăng nhập thành công",
                    data: {
                        user: loggedUser?.data,
                        token: {
                            accessToken,
                        },
                    },
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
                groupCode,
            });

            if (!createdUser) throw createError.BadRequest("Tạo tài khoản người dùng thất bại");

            const accessToken = await jwtService.signAccessToken({
                userData: createdUser,
            });

            res.status(201)
                .cookie("accessToken", accessToken, {
                    sameSite: "none",
                    secure: true,
                })
                .send({
                    status: "Cập nhật thông tin thành công",
                    data: {
                        user: createdUser,
                        token: {
                            accessToken,
                        },
                    },
                });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            return res
                .cookie("accessToken", "", {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                })
                .send({
                    status: "Đăng xuất thành công",
                });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AccessControllers();
