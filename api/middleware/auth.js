const jwtService = require("../services/jwt.service");
const UserService = require("../services/user.service");

module.exports = {
    auth: async (req, res, next) => {
        try {
            const accessToken = req?.headers["x-token"] || req.cookies?.accessToken;

            const { data, isExpired, error } = await jwtService.verifyAccessToken(accessToken);

            if (isExpired) {
                res.status(401).clearCookie("accessToken").json({
                    status: 401,
                    msg: "Hết phiên đăng nhập",
                });
                res.end();
            }

            if (error) throw error;

            const user = await UserService.getUserAndPopulateGroupById({
                id: data.userId,
                selectedFieldArr: ["_id", "userId", "firstName", "lastName", "group"],
            });

            res.locals.userData = user;
            next();
        } catch (error) {
            next(error);
        }
    },
};
