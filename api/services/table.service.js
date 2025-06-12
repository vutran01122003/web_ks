const Page = require("../models/page.model");
const createError = require("http-errors");
const UserService = require("./user.service");
const Row = require("../models/row.model");
const User = require("../models/user.model");
const PermissionService = require("./permission.service");
const FacultyService = require("./faculty.service");
const { TALENT_ENGINEER_CODE } = process.env;

class TableService {
    static addTable = async ({ pageId, tables }) => {
        try {
            const tableNameList = tables.map((table) => table.tableName);

            const page = await Page.findById(pageId).lean();

            if (!page) throw createError.NotFound("Không tìm thấy page");

            const isExistsTable = await Page.find({
                _id: pageId,
                "tables.tableName": { $in: tableNameList }
            }).lean();

            if (isExistsTable.length > 0) throw createError.Conflict("Tên chỉ tiêu đã tồn tại");

            const updatedPage = await Page.findByIdAndUpdate(
                pageId,
                {
                    $push: {
                        tables: { $each: tables }
                    }
                },
                {
                    new: true
                }
            );

            if (!updatedPage) throw createError.NotFound("Page không tồn tại");

            await UserService.updateNumOfRequiredActivity({
                page,
                tables,
                isDesc: false
            });

            return {
                msg: "Thêm chỉ tiêu thành công",
                page: updatedPage,
                status: 201
            };
        } catch (error) {
            throw error;
        }
    };

    static removeTable = async ({ pageId, tableId }) => {
        try {
            const page = await Page.findById(pageId);

            if (!page) throw createError.NotFound("Không tìm thấy page");

            const updatedPage = await Page.findOneAndUpdate(
                { _id: pageId },
                {
                    $pull: {
                        tables: { _id: tableId }
                    }
                },
                {
                    new: true
                }
            );

            await UserService.updateNumOfRequiredActivity({
                page,
                tables: [page.tables.id(tableId)],
                isDesc: true
            });

            return {
                msg: "Xóa chỉ tiêu thành công",
                page: updatedPage,
                status: 201
            };
        } catch (error) {
            throw error;
        }
    };

    static updateTable = async ({ pageId, table }) => {
        try {
            const page = await Page.findById(pageId);

            if (!page) throw createError.NotFound("Page không tồn tại");

            const { pageFaculty, pageStudentMajor, pageStudentCohort, pageTalentEngineerType, pageStudentLevelYear } =
                page;
            const newQuantityDemanded = table.quantityDemanded;
            const originalTable = await page.tables.id(table._id);
            const isDiffQuantity = originalTable.quantityDemanded !== newQuantityDemanded;

            if (isDiffQuantity) {
                const newLargestIndex = newQuantityDemanded - 1;

                const row = await Row.findOne({
                    table: table._id,
                    [`content.${newLargestIndex + 1}`]: { $exists: true }
                });
            }

            const updatedData = Object.keys(table).reduce((obj, key) => {
                return {
                    ...obj,
                    ["tables.$." + key]: table[key]
                };
            }, {});

            const updatedPage = await Page.findOneAndUpdate(
                { _id: pageId, "tables._id": table._id },
                {
                    $set: updatedData
                }
            );

            if (!updatedPage) throw createError.NotFound("Page không tồn tại");

            if (isDiffQuantity) {
                const group = await PermissionService.getGroupByGroupCode(pageTalentEngineerType);
                const [facultyData, majorData, cohortData] = await Promise.all([
                    FacultyService.getFacultyByName({ facultyName: pageFaculty }),
                    FacultyService.getMajorByName({ majorName: pageStudentMajor }),
                    FacultyService.getCohortByName({ cohortName: pageStudentCohort, majorName: pageStudentMajor })
                ]);

                const [userList, pageList] = await Promise.all([
                    User.find({
                        faculty: facultyData._id,
                        major: majorData._id,
                        cohort: cohortData._id,
                        groups: {
                            $in: group._id
                        }
                    }),
                    Page.find({
                        pageFaculty,
                        pageStudentMajor,
                        pageStudentCohort,
                        pageTalentEngineerType,
                        pageStudentLevelYear
                    })
                ]);

                if (userList.length > 0) {
                    const annualActivitiesField =
                        pageTalentEngineerType === TALENT_ENGINEER_CODE
                            ? "annualActivitiesProgress"
                            : "annualTemporaryActivitiesProgress";

                    await Promise.all(
                        userList.map((user) =>
                            UserService.calculateCurrentActivitiesProgress({
                                user,
                                pages: pageList,
                                pageStudentLevelYear,
                                annualActivitiesField
                            })
                        )
                    );
                }
            }

            return {
                status: 200,
                msg: "Cập nhật chỉ tiêu thành công"
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = TableService;
