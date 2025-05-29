const createError = require("http-errors");
const DeadlineService = require("../services/deadline.service");

class DeadlineController {
    async createDeadline(req, res, next) {
        try {
            const { facultyId, majorId, cohortId, talentEngineerType, levelYear } = req.body;
            const startDate = req.body?.startDate;
            const endDate = req.body?.endDate;

            const createdDeadline = await DeadlineService.createDeadline({
                facultyId,
                majorId,
                cohortId,
                startDate,
                endDate,
                levelYear,
                talentEngineerType
            });

            res.status(201).json({
                msg: "Tạo thời hạn thành công",
                data: createdDeadline
            });
        } catch (error) {
            next(error);
        }
    }

    async updateDeadline(req, res, next) {
        try {
            const { deadlineId } = req.body;
            const startDate = req.body?.startDate;
            const endDate = req.body?.endDate;

            if (!startDate || !endDate) throw createError.BadRequest("Ngày bắt đầu và ngày kết thúc không được rỗng");
            if (new Date(startDate).getTime() > new Date(endDate).getTime())
                throw createError.BadRequest("Ngày bắt đầu không được lớn hơn ngày kết thúc");

            const updatedDeadline = await DeadlineService.updateDeadline({
                deadlineId,
                startDate,
                endDate
            });

            res.status(200).json({
                msg: "Cập nhật thời hạn thành công",
                data: updatedDeadline
            });
        } catch (error) {
            next(error);
        }
    }

    async getDeadlineList(req, res, next) {
        try {
            const { facultyId, majorId, cohortId, talentEngineerType } = req.query;

            if (!facultyId || !majorId || !cohortId || !talentEngineerType)
                throw createError.BadRequest("Vui lòng chọn đầy đủ thông tin");

            const deadlineList = await DeadlineService.getDeadlineList({
                facultyId,
                majorId,
                cohortId,
                talentEngineerType
            });

            res.status(200).json({
                msg: "Lấy danh sách thời hạn thành công",
                data: deadlineList
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DeadlineController();
