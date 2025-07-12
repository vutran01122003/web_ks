const Deadline = require("../models/deadline.model");
const FacultyService = require("./faculty.service");
const createError = require("http-errors");
const [NOT_STARTED, IN_PROGRESS, COMPLETED, NOT_UPDATED] = ["not-started", "in-progress", "completed", "not-updated"];

class DeadlineService {
    static async createDeadline({ facultyId, majorId, cohortId, talentEngineerType, levelYear, startDate, endDate }) {
        try {
            const [facultyData, majorData, cohortData] = await Promise.all([
                FacultyService.getFacultyById({ facultyId }),
                FacultyService.getMajorById({ majorId }),
                FacultyService.getCohortById({ cohortId })
            ]);

            if (!facultyData || !majorData || !cohortData) throw createError.BadRequest("Dữ liệu khoa không tồn tại");

            if (startDate && endDate)
                if (new Date(startDate).getTime() > new Date(endDate).getTime())
                    throw createError.BadRequest("Ngày giờ bắt đầu không được lớn hơn ngày giờ kết thúc");

            const deadline = await this.getDeadline({
                faculty: facultyId,
                major: majorId,
                cohort: cohortId,
                talentEngineerType,
                levelYear
            });

            if (deadline) throw createError.Conflict("Thời hạn đã tồn tại");

            const createdDeadline = await Deadline.create({
                faculty: facultyId,
                major: majorId,
                cohort: cohortId,
                talentEngineerType,
                levelYear,
                startDate,
                endDate
            });

            return createdDeadline;
        } catch (error) {
            throw error;
        }
    }

    static async updateDeadline({ deadlineId, startDate, endDate, status }) {
        try {
            const updatedData = {
                startDate,
                endDate,
                status
            };

            if (!startDate) delete updatedData.startDate;
            if (!endDate) delete updatedData.endDate;
            if (!status) delete updatedData.status;

            if (startDate && endDate && !status) {
                const sDate = new Date(startDate).getTime();
                const eDate = new Date(endDate).getTime();
                const cDate = new Date().getTime();

                if (sDate > cDate) updatedData.status = NOT_STARTED;
                else if (sDate <= cDate && eDate > cDate) updatedData.status = IN_PROGRESS;
                else if (eDate <= cDate) updatedData.status = COMPLETED;
                else updatedData.status = NOT_UPDATED;
            }

            const updatedDeadline = await Deadline.findByIdAndUpdate(deadlineId, updatedData, {
                new: true
            });

            return updatedDeadline;
        } catch (error) {
            throw error;
        }
    }

    static async getDeadlineList({ facultyId, majorId, cohortId, talentEngineerType }) {
        try {
            const cohortData = await FacultyService.getCohortById({ cohortId });

            if (!cohortData) throw createError.BadRequest("Khóa không tồn tại");

            const currentLevelYear = cohortData.currentLevelYear;
            const deadlineList = await Deadline.find({
                faculty: facultyId,
                major: majorId,
                cohort: cohortId,
                talentEngineerType
            });

            if (deadlineList.length < currentLevelYear) {
                const result = await Promise.all(
                    Array(currentLevelYear)
                        .fill(null)
                        .map((_, index) =>
                            Deadline.findOneAndUpdate(
                                {
                                    faculty: facultyId,
                                    major: majorId,
                                    cohort: cohortId,
                                    talentEngineerType,
                                    levelYear: index + 1
                                },
                                {
                                    faculty: facultyId,
                                    major: majorId,
                                    cohort: cohortId,
                                    talentEngineerType,
                                    levelYear: index + 1
                                },
                                {
                                    new: true,
                                    upsert: true
                                }
                            )
                        )
                );

                return result.sort((a, b) => a.levelYear - b.levelYear);
            }

            return deadlineList.sort((a, b) => a.levelYear - b.levelYear);
        } catch (error) {
            throw error;
        }
    }

    static async getDeadline({ facultyId, majorId, cohortId, talentEngineerType, levelYear }) {
        try {
            const deadline = await Deadline.findOne({
                faculty: facultyId,
                major: majorId,
                cohort: cohortId,
                talentEngineerType,
                levelYear
            });

            return deadline;
        } catch (error) {
            throw error;
        }
    }

    static async deleteDeadline({ deadlineId }) {
        try {
            await Deadline.findByIdAndDelete(deadlineId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DeadlineService;
