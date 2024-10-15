const router = require("express").Router();
const excelController = require("../../controllers/excel.controllers");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            cb(null, true);
        } else {
            cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
        }
    },
    limits: {
        files: 1,
    },
});

router.route("/excel").get(excelController.exportUserQualified).post(upload.single("file"), excelController.importUser);

module.exports = router;
