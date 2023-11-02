const jwtService = require('../services/jwt.service');

module.exports = {
    auth: async (req, res, next) => {
        try {
            const accessToken = req?.headers['x-token'] || req.cookies?.accessToken;
            const data = await jwtService.verifyAccessToken(accessToken);
            res.locals.userId = data.userId;
            next();
        } catch (error) {
            if (['JsonWebTokenError', 'TokenExpiredError'].includes(error.name)) {
                next({ status: 401, code: 401, message: error.message });
            }
            next(error);
        }
    }
};
