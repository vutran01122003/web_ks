const UserService = require('../services/user.service');

class UserControlers {
    updateActiveUsers = async (req, res, next) => {
        try {
            const updatedUsers = await UserService.updateActiveUsers(req.body);

            res.status(200).json({
                msg: updatedUsers.msg
            });
        } catch (error) {
            next(error);
        }
    };

    updateTask;
}

module.exports = new UserControlers();
