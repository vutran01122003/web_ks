const RowService = require('../services/row.service');
const UploadService = require('../services/upload.service');
const createError = require('http-errors');
const ProgressService = require('../services/progress.service');
const UserService = require('../services/user.service');
const { getLocalDatetime, toISOString } = require('../utils/getDatetime');

class RowControllers {
    addRow = async (req, res, next) => {
        try {
            const rowData = JSON.parse(req.body.rowData);
            const { rowList, rowItemId } = await RowService.addRow({
                data: rowData
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
            const { page, limit, current_rows, rows_type } = req.query;

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
                rowsType: rows_type
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
            const { contentIdList, status, noteValue, pageInfo, deadline, isTimedExtension } = req.body;

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

            const pages = await ProgressService.getProgressByYear(pageInfo);

            let quantityDemanded = 0;
            let completedTask = 0;
            let score = 0;

            pages.forEach((page) => {
                page.tables.forEach((table) => {
                    quantityDemanded += table.quantityDemanded;
                    table.rowValueList[0]?.content.forEach((content) => {
                        if (content.status === 'đã duyệt') {
                            ++completedTask;
                            score += content.totalScore;
                        }
                    });
                });
            });

            await UserService.setAnnualTaskProgress({
                quantityDemanded,
                completedTask,
                score,
                pageInfo
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
