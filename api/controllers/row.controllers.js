const RowService = require("../services/row.service");
const UploadService = require("../services/upload.service");

class RowControllers {
    addRow = async (req, res, next) => {
        try {
            const { rowList, rowItemId } = await RowService.addRow({
                data: req.body,
            });

            const uploadedImages = await UploadService.uploadImageFromFiles({
                files: req.files,
                data: req.body,
                rowListId: rowList._id,
            });

            await RowService.addProofImages({
                data: req.body,
                uploadedImages,
                rowListId: rowList._id,
                rowItemId,
            });

            res.status(200).json({
                status: "Thêm Thông Tin Thành Công",
                data: rowList,
            });
        } catch (error) {
            next(error);
        }
    };

    getPeddingRows = async (req, res, next) => {
        try {
            const peddingRow = await RowService.getPeddingRows();
            res.status(200).json({
                code: peddingRow.code,
                msg: peddingRow.msg,
                data: peddingRow.data,
            });
        } catch (error) {
            next(error);
        }
    };

    updateRowStatus = async (req, res, next) => {
        try {
            const { rowListId, rowItemId, status } = req.body;

            const updatedRow = await RowService.updateRowStatus({
                rowListId,
                rowItemId,
                status,
            });

            res.status(200).json({
                code: updatedRow.code,
                msg: updatedRow.msg,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new RowControllers();
