const createError = require('http-errors');
const { getLocalDatetime, toISOString } = require('../utils/getDatetime');
const RowService = require('../services/row.service');
const UploadService = require('../services/upload.service');
const UserService = require('../services/user.service');
const Page = require('../models/page.model');
const Row = require('../models/row.model');

class RowControllers {
    addRow = async (req, res, next) => {
        try {
            const PENDING_STATUS = 'chờ duyệt';
            const rowData = JSON.parse(req.body.rowData);
            const { totalScore, rowList, rowItemId } = await RowService.addRow({
                data: rowData
            });

            await UserService.updateAnnualActivityProgress({
                userId: rowData.user,
                levelYear: rowData.levelYear,
                prevStatus: null,
                status: PENDING_STATUS,
                totalScore
            });

            const uploadedFiles = await UploadService.uploadFilesToS3({
                files: req.files,
                folderName: `proof_files/${rowData.faculty}/${rowData.major}/${rowData.cohort}/${rowData.userId}/${rowData.tableName}`
            });

            await RowService.addProofFiles({
                data: req.body,
                uploadedFiles,
                rowListId: rowList._id,
                rowItemId
            });

            res.status(200).json({
                msg: 'Thêm Thông Tin Thành Công',
                data: rowList
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    resubmitRow = async (req, res, next) => {
        try {
            const rowData = JSON.parse(req.body.rowData);
            rowData.content = JSON.parse(rowData.content);

            const updatedRow = await RowService.resubmitRow({ rowData });

            const uploadedFiles = await UploadService.uploadFilesToS3({
                files: req.files,
                folderName: `proof_files/${rowData.faculty}/${rowData.major}/${rowData.cohort}/${rowData.userId}/${rowData.tableName}`
            });

            await RowService.addProofFiles({
                data: req.body,
                uploadedFiles,
                rowListId: rowData.rowListId,
                rowItemId: rowData.contentId
            });

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
                pageStudentMajor,
                pageStudentCohort,
                pageStudentLevelYear
            } = req.query;

            const userFilterConditions = {
                ['user.major']: req.query?.major ? req.query?.major.toLowerCase() : null,
                ['user.userId']: req.query?.student_id
                    ? {
                          ['$regex']: new RegExp(`^${req.query?.student_id}`)
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
                pageStudentLevelYear
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
            const { contentIdList, prevStatus, status, noteValue, pageInfo, deadline, isTimedExtension, userId } =
                req.body;
            const { pageStudentMajor, pageStudentLevelYear, pageStudentCohort } = pageInfo;
            const deadlineDatetime = toISOString(deadline);

            if (isTimedExtension && !deadline) throw createError.BadRequest('Chưa nhập thời gian hạn gia');

            if (deadline && getLocalDatetime().getTime() > deadlineDatetime.getTime())
                throw createError.BadRequest('Hạn nộp phải lớn hơn ngày giờ hiện tại');

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
                userId,
                levelYear: pageStudentLevelYear,
                prevStatus,
                status,
                totalScore: row.content.id(contentIdList).totalScore
            });

            let quantityDemanded = 0;
            let resubmitedTask = 0;
            let completedTask = 0;
            let rejectedTask = 0;
            let pendingTask = 0;
            let totalScore = 0;

            const pages = await Page.find({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort
            });

            const tables = pages.reduce((tables, page) => {
                return [...tables, ...page.tables];
            }, []);

            const rowIdList = tables.reduce((rowIdList, table) => {
                quantityDemanded += table.quantityDemanded;
                return [...rowIdList, ...table.rowValueList];
            }, []);

            const rowList = await Row.find({ _id: { $in: rowIdList }, user: userId });

            const contentList = rowList.reduce((contentList, rowItem) => {
                return [...contentList, ...rowItem.content];
            }, []);

            contentList.forEach((content) => {
                switch (content.status) {
                    case 'đã duyệt':
                        ++completedTask;
                        totalScore += content.totalScore;
                        break;
                    case 'chờ duyệt':
                        ++pendingTask;
                        break;
                    case 'từ chối':
                        ++rejectedTask;
                        break;
                    case 'phải nộp lại':
                        ++resubmitedTask;
                        break;
                    default:
                        break;
                }
            });

            await UserService.setAnnualTaskProgress({
                data: {
                    quantityDemanded,
                    resubmitedTask,
                    rejectedTask,
                    completedTask,
                    pendingTask,
                    totalScore
                },
                pageInfo,
                userId
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
