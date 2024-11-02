const createError = require("http-errors");
const RowService = require("../services/row.service");
const UploadService = require("../services/upload.service");
const UserService = require("../services/user.service");
const Row = require("../models/row.model");
const FacultyService = require("../services/faculty.service");

const [PENDING_STATUS, RESUBMITED_STATUS] = ["chờ duyệt", "phải nộp lại"];
const { TALENT_ENGINEER_CODE } = process.env;

class RowControllers {
    addRow = async (req, res, next) => {
        try {
            const rowData = JSON.parse(req.body.rowData);
            const { faculty, major, cohort, userId, tableName, user, levelYear, pageStudentLevelYear } = rowData;

            if (pageStudentLevelYear < levelYear)
                throw createError.BadRequest(`Đã kết thúc hoạt động nộp minh chứng năm ${pageStudentLevelYear}`);

            const { rowList, rowItemId } = await RowService.addRow({
                data: rowData
            });

            const uploadedFiles = await UploadService.uploadFilesToS3({
                files: req.files,
                folderName: `proof_files/${faculty}/${major}/${cohort}/${userId}/${tableName}`
            });

            await Promise.all([
                RowService.addProofFiles({
                    data: req.body,
                    uploadedFiles,
                    rowListId: rowList._id,
                    rowItemId
                }),
                UserService.updateAnnualActivityProgress({
                    userId: user,
                    levelYear: levelYear,
                    prevStatus: null,
                    status: PENDING_STATUS
                })
            ]);

            res.status(200).json({
                msg: "Thêm Thông Tin Thành Công",
                data: rowList
            });
        } catch (error) {
            next(error);
        }
    };

    resubmitRow = async (req, res, next) => {
        try {
            const rowData = JSON.parse(req.body.rowData);
            rowData.content = JSON.parse(rowData.content);
            const {
                faculty,
                major,
                cohort,
                userId,
                tableName,
                rowListId,
                contentId,
                levelYear,
                pageStudentLevelYear,
                user
            } = rowData;

            if (pageStudentLevelYear < levelYear)
                throw createError.BadRequest(`Đã kết thúc hoạt động nộp minh chứng năm ${pageStudentLevelYear}`);

            const updatedRow = await RowService.resubmitRow({ rowData });

            const uploadedFiles = await UploadService.uploadFilesToS3({
                files: req.files,
                folderName: `proof_files/${faculty}/${major}/${cohort}/${userId}/${tableName}`
            });

            await Promise.all([
                RowService.addProofFiles({
                    data: req.body,
                    uploadedFiles,
                    rowListId: rowListId,
                    rowItemId: contentId
                }),
                UserService.updateAnnualActivityProgress({
                    userId: user,
                    levelYear: levelYear,
                    prevStatus: RESUBMITED_STATUS,
                    status: PENDING_STATUS
                })
            ]);

            res.status(200).json({
                status: 200,
                msg: updatedRow?.msg
            });
        } catch (error) {
            next(error);
        }
    };

    getDynamicRows = async (req, res, next) => {
        try {
            const {
                page,
                limit,
                current_rows,
                rows_type,
                activity,
                userId,
                pageStudentMajor,
                pageStudentCohort,
                pageStudentLevelYear,
                pageTalentEngineerType
            } = req.query;

            const userFilterConditions = {
                ["user.userId"]: userId
                    ? {
                          ["$regex"]: new RegExp(`^${userId}`)
                      }
                    : null
            };

            Object.keys(userFilterConditions).forEach((key) => {
                if (!userFilterConditions[key]) delete userFilterConditions[key];
            });

            const dynamicRows = await RowService.getDynamicRows({
                page,
                limit,
                userFilterConditions,
                currentRows: current_rows,
                rowsType: rows_type,
                activity,
                pageStudentMajor,
                pageStudentCohort,
                pageStudentLevelYear,
                pageTalentEngineerType
            });

            res.status(200).json({
                status: dynamicRows.status,
                msg: dynamicRows.msg,
                data: dynamicRows.data
            });
        } catch (error) {
            next(error);
        }
    };

    updateRowStatus = async (req, res, next) => {
        try {
            const rowListId = req.params.rowId;
            const {
                contentIdList,
                prevStatus,
                status,
                noteValue,
                pageInfo,
                deadline,
                isTimedExtension,
                userId: _id,
                groupCode
            } = req.body;

            const levelYear = pageInfo.pageStudentLevelYear;

            const user = await UserService.getUserAndPopulateGroupById({ id: _id });

            if (!user.isActive) throw createError.BadRequest("Người dùng đã bị khóa tài khoản");
            if (user.group.groupCode !== groupCode) {
                throw createError.BadRequest(
                    `Sinh viên này không còn là ${
                        groupCode === TALENT_ENGINEER_CODE ? "kỹ sư tài năng" : "kỹ sư tài năng bổ sung"
                    }`
                );
            }

            const currentLevelYear = await FacultyService.getCurrentLevelYearOfCohort({
                facultyName: user.faculty,
                majorName: user.major,
                cohortName: user.cohort
            });

            if (levelYear < currentLevelYear)
                throw createError.BadRequest(`Các hoạt động năm ${levelYear} đã dừng xét duyệt`);

            const deadlineDatetime = deadline ? new Date(deadline) : undefined;
            const currentDatetime = new Date();

            if (isTimedExtension && !deadline) throw createError.BadRequest("Chưa nhập thời gian hạn gia");

            if (deadlineDatetime && currentDatetime.getTime() > deadlineDatetime.getTime())
                throw createError.BadRequest("Hạn nộp phải lớn hơn ngày giờ hiện tại");

            const { code, msg } = await RowService.updateRowStatus({
                rowListId,
                contentIdList,
                status,
                noteValue,
                deadline: deadlineDatetime,
                isTimedExtension
            });

            const row = await Row.findById(rowListId);

            await UserService.updateAnnualActivityProgress({
                userId: _id,
                levelYear,
                prevStatus,
                status,
                totalScore: row.content.id(contentIdList).totalScore
            });

            res.status(200).json({
                status: code,
                msg
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new RowControllers();
