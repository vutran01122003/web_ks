const jwtService = require("../services/jwt.service");
const UserService = require("../services/user.service");

module.exports = {
    auth: async (req, res, next) => {
        try {
            const accessToken = req?.headers["x-token"] || req.cookies?.accessToken;

            const data = await jwtService.verifyAccessToken(accessToken);
            const user = await UserService.getUserAndPopulateGroupById({
                id: data.userId,
                selectedFieldArr: ["_id", "userId", "firstName", "lastName", "group"],
            });

            res.locals.userData = user;
            next();
        } catch (error) {
            if (["JsonWebTokenError", "TokenExpiredError"].includes(error.name)) {
                next({ status: 401, message: "Hết phiên đăng nhập" });
            }
            next(error);
        }
    },
};
