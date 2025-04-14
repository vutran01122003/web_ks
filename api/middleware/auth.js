const createHttpError = require("http-errors");
const jwtService = require("../services/jwt.service");
const UserService = require("../services/user.service");

module.exports = {
    auth: async (req, res, next) => {
        try {
            const accessToken =
                req?.headers["x-token"] || req.cookies?.accessToken || req?.headers["cookie"].split("=")[1];

            const { data, isExpired, error } = await jwtService.verifyAccessToken(accessToken);

            if (isExpired) {
                return res.status(401).clearCookie("accessToken").json({
                    status: 401,
                    msg: "Hết phiên đăng nhập"
                });
            }

            if (error) throw createHttpError.Unauthorized("Xảy ra lỗi xác thực người dùng");

            const user = await UserService.getUserAndPopulateGroupById({
                id: data.userId,
                selectedFieldArr: ["_id", "userId", "firstName", "lastName", "groups"]
            });

            res.locals.userData = user;
            next();
        } catch (error) {
            next(error);
        }
    }
};
