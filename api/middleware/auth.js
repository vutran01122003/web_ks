const createHttpError = require("http-errors");
const jwtService = require("../services/jwt.service");
const UserService = require("../services/user.service");

module.exports = {
    auth: async (req, res, next) => {
        try {
            const accessToken = req?.headers["authorization"].split(" ")[1];

            if (!accessToken) throw createHttpError.Unauthorized("Người dùng chưa đăng nhập");

            const { data, isExpired, error } = await jwtService.verifyAccessToken(accessToken);

            if (isExpired) {
                return res.status(401).json({
                    status: 301,
                    msg: "Hết phiên đăng nhập"
                });
            }

            if (error) throw createHttpError.Unauthorized("Xảy ra lỗi xác thực người dùng");

            const user = await UserService.getUserAndPopulateGroupById({
                id: data.userId,
                selectedFieldArr: ["_id", "userId", "firstName", "lastName", "groups"]
            });

            res.locals.userData = user;
            res.locals.accessToken = accessToken;

            next();
        } catch (error) {
            next(error);
        }
    }
};
