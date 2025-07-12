const router = require("express").Router();
const excelController = require("../../controllers/excel.controllers");
const multer = require("multer");
const { auth } = require("../../middleware/auth");

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
        files: 1
    }
});

router.get("/qualified-users/export", auth, excelController.exportQualifiedUsersExcel);
router.get("/progress-statistics/export", auth, excelController.exportProgressStatisticsExcel);
router.post("/users-excel/import", auth, upload.single("file"), excelController.importUsers);

module.exports = router;
