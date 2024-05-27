const createError = require('http-errors');
const PageService = require('../services/page.service');
const UserService = require('../services/user.service');

class UserControllers {
    updateUserActivityStatusByMajor = async (req, res, next) => {
        try {
            const { major, cohort, levelYear } = req.body;

            // const isExists = await PageService.getPageByFields({
            //     pageStudentMajor: major,
            //     pageStudentCohort: cohort,
            //     pageStudentLevelYear: levelYear
            // });

            // if (!isExists) throw createError.NotFound(`Không có hoạt động năm ${levelYear} được tạo để kết thúc`);

            await UserService.updateUserActivityStatusByMajor(req.body);

            res.status(200).json({
                status: 200,
                msg: `Kết thúc hoạt động nộp minh chứng của sinh viên khóa ${cohort} ngành ${major}`
            });
        } catch (error) {
            next(error);
        }
    };

    addGroupForUser = async (req, res, next) => {
        try {
            const { groupId, userId } = req.params;

            const updatedUser = await UserService.addGroupForUser({ groupId, userId });

            res.status(200).json({
                msg: 'Thêm chức vụ cho người dùng thành công',
                status: 200,
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    };

    getUserByUserId = async (req, res, next) => {
        try {
            const userId = req.params.userId;

            const user = await UserService.findUserByUserId({ userId });

            res.status(200).json({
                msg: 'Lấy dữ liệu người dùng thành công',
                status: 200,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new UserControllers();
