const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = process.env;

class JwtService {
    static signAccessToken = async ({ userData }) => {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { userId: userData._id, roles: userData.roles },
                ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "5h"
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                }
            );
        });
    };

    static verifyAccessToken = async (accessToken) => {
        try {
            return new Promise((resolve, reject) => {
                jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (error, data) => {
                    if (error) {
                        resolve({
                            isExpired: error instanceof jwt.TokenExpiredError,
                            data: null,
                            error
                        });
                    }
                    resolve({
                        isExpired: false,
                        error: null,
                        data
                    });
                });
            });
        } catch (error) {
            throw error;
        }
    };
}

module.exports = JwtService;
