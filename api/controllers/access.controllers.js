const accessService = require("../services/access.service");
const jwtService = require("../services/jwt.service");
const createError = require("http-errors");

class AccessControllers {
    getInfoUser = async (req, res, next) => {
        try {
            const accessToken =
                req?.headers["x-token"] || req.cookies?.accessToken;
            const user = await accessService.getUserInfo(res.locals.userId);
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
            const checkLogin = await accessService.login(req.body);

            if (checkLogin.isSuccessLogin) {
                if (checkLogin.typePassword === "password") {
                    const accessToken = await jwtService.signAccessToken({
                        userData: checkLogin.user,
                    });

                    res.status(200)
                        .cookie("accessToken", accessToken, {
                            sameSite: "none",
                            secure: true,
                        })
                        .send({
                            status: "Đăng nhập thành công",
                            data: {
                                user: checkLogin.user,
                                token: {
                                    accessToken,
                                },
                            },
                        });
                } else {
                    res.status(200).send({
                        status: "Đăng nhập thành công",
                        data: {
                            firstLogin: {
                                studentId: req.body.studentId,
                                birthday: req.body.password,
                            },
                        },
                    });
                }
            } else {
                throw createError.Unauthorized("Đăng nhập không thành công");
            }
        } catch (error) {
            next(error);
        }
    };

    register = async (req, res, next) => {
        try {
            const createdUser = await accessService.register(req.body);
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
