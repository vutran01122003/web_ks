const jwtService = require('../services/jwt.service');

module.exports = {
    auth: async (req, res, next) => {
        try {
            const accessToken = req?.headers['x-token'] || req.cookies?.accessToken;
            const data = await jwtService.verifyAccessToken(accessToken);

            res.locals.userId = data.userId;
            res.locals.roles = data.roles;
            next();
        } catch (error) {
            if (['JsonWebTokenError', 'TokenExpiredError'].includes(error.name)) {
                next({ status: 401, message: 'Hết phiên đăng nhập' });
            }
            next(error);
        }
    }
};
