const router = require("express").Router();
const { uploadToMemory } = require("../../config/multer.config");
const rowControllers = require("../../controllers/row.controllers");
const { auth } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");
const validateResource = require("../../middleware/validateResource");
const { AddingRowSchema } = require("../../schema/row.schema");

const upload = uploadToMemory({
    fileSize: 10 * 1024 * 1024,
    numberOfiles: 10,
    fileTypes: ["application/pdf"]
});

router.post(
    "/rows",
    auth,
    checkPermission,
    upload.array("files"),
    validateResource({ schema: AddingRowSchema }),
    rowControllers.addRow
);

router.patch("/rows/:rowId", auth, checkPermission, upload.array("files"), rowControllers.resubmitRow);

router.get("/dynamic-rows", auth, checkPermission, rowControllers.getDynamicRows);

router.patch("/dynamic-rows/:rowId", auth, checkPermission, rowControllers.updateRowStatus);

module.exports = router;
