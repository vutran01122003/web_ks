const RowService = require('../services/row.service');
const UploadService = require('../services/upload.service');
const createError = require('http-errors');

class RowControllers {
    addRow = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0002'))
                throw createError.Forbidden('Chỉ có kỹ sư tài năng mới thêm được chỉ tiêu');

            const { rowList, rowItemId } = await RowService.addRow({
                data: req.body
            });

            const uploadedImages = await UploadService.uploadImageFromFiles({
                files: req.files,
                data: req.body,
                folderName: `${process.env.CLOUDINARY_ROOT_FOLDER}/proof_images/user_${req.body.user}`
            });

            await RowService.addProofImages({
                data: req.body,
                uploadedImages,
                rowListId: rowList._id,
                rowItemId
            });

            res.status(200).json({
                status: 'Thêm Thông Tin Thành Công',
                data: rowList
            });
        } catch (error) {
            next(error);
        }
    };

    getPeddingRows = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ quyền lấy dữ liệu chỉ tiêu chờ duyệt');

            const peddingRow = await RowService.getPeddingRows();
            res.status(200).json({
                code: peddingRow.code,
                msg: peddingRow.msg,
                data: peddingRow.data
            });
        } catch (error) {
            next(error);
        }
    };

    updateRowStatus = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ quyền cập nhật trạng thái chỉ tiêu');
            const { rowListId, contentIdList, status } = req.body;

            const updatedRow = await RowService.updateRowStatus({
                rowListId,
                contentIdList,
                status
            });

            res.status(200).json({
                code: updatedRow.code,
                msg: updatedRow.msg
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new RowControllers();
