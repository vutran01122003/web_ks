const createError = require("http-errors");
const UserService = require("../services/user.service");

module.exports = {
    checkPermission: async (req, res, next) => {
        try {
            const userId = res.locals.userData._id;
            let isValid = false;

            if (["/login", "/register"].includes(req.route.path)) {
                isValid = true;
            } else {
                isValid = await UserService.checkRole({
                    userId,
                    path: req.route.path,
                    method: req.method.toLowerCase()
                });
            }

            if (!isValid) throw createError.Forbidden("Người dùng không đủ quyền hạn");

            next();
        } catch (error) {
            next(error);
        }
    }
};
