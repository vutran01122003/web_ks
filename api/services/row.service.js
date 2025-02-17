const Row = require("../models/row.model");
const createError = require("http-errors");
const PageService = require("./page.service");
const convertToObjectId = require("../utils/convertToObjectId");

class RowService {
    static calculateTotalScoreOfRow = async ({ pageId, content, tableId }) => {
        try {
            let totalScore = 0;
            const pageData = await PageService.getPageById({ page: pageId });
            if (!pageData) throw createError.NotFound("Trang Không Tồn Tại");

            const table = pageData.tables.id(tableId);

            if (table) {
                if (table.fixedScore) {
                    totalScore = table.fixedScore;
                } else {
                    table.rowTitleList.forEach((rowTitleItem) => {
                        const fixedValueList = rowTitleItem.fixedValue;

                        if (fixedValueList.length > 0) {
                            const fixedValueOfContent = content[rowTitleItem._id];
                            const score = fixedValueList.find(
                                (fixedValueItem) => fixedValueItem.value === fixedValueOfContent
                            ).score;

                            content[rowTitleItem._id] = {
                                value: fixedValueOfContent,
                                score
                            };
                            totalScore += score;
                        }
                    });
                }
            } else throw createError.NotFound("Chỉ tiêu không tồn tại");

            return {
                pageData,
                totalScore
            };
        } catch (error) {
            throw error;
        }
    };

    static addRow = async ({ data }) => {
        try {
            const { user, table, page, content } = data;
            const contentObj = JSON.parse(content);

            let rowItemId = null;
            let [rowList, { pageData, totalScore }] = await Promise.all([
                Row.findOne({ user, table }),
                this.calculateTotalScoreOfRow({
                    pageId: page,
                    tableId: table,
                    content: contentObj
                })
            ]);

            if (!rowList) {
                rowList = new Row({
                    user,
                    table,
                    page
                });

                rowList.content.push({ rowValue: contentObj });
                rowList.content[0].totalScore = totalScore;
                rowItemId = rowList.content[rowList.content.length - 1]._id;

                await Promise.all([rowList.save(), PageService.addRowIntoTableOfPage({ page, table, rowList })]);
            } else {
                await this.checkquantityDemanded({ page, table, user, pageData });

                rowList.content.push({ rowValue: contentObj });
                rowItemId = rowList?.content[rowList.content.length - 1]._id;
                rowList.content[rowList.content.length - 1].totalScore = totalScore;

                await rowList.save();
            }

            return {
                rowList,
                rowItemId
            };
        } catch (error) {
            throw error;
        }
    };

    static deleteRowByUserId = async ({ userId }) => {
        try {
            await Row.deleteMany({ user: userId });
        } catch (error) {
            throw error;
        }
    };

    static checkquantityDemanded = async ({ table, page, user, pageData }) => {
        try {
            const quantityDemanded = await Row.aggregate([
                {
                    $match: {
                        table: convertToObjectId(table),
                        user: convertToObjectId(user),
                        page: convertToObjectId(page)
                    }
                },
                {
                    $unwind: "$content"
                },
                {
                    $group: {
                        _id: "$_id",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        count: 1
                    }
                }
            ]);

            if (quantityDemanded[0] && quantityDemanded[0].count === pageData.tables.id(table).quantityDemanded)
                throw createError.BadRequest("Số Lượng Đã Đạt Tối Đa");

            return quantityDemanded;
        } catch (error) {
            throw error;
        }
    };

    static resubmitRow = async ({ rowData }) => {
        try {
            const { table, page, content, contentId, rowListId } = rowData;
            const { totalScore } = await this.calculateTotalScoreOfRow({
                pageId: page,
                tableId: table,
                content
            });

            const row = await Row.findById(rowListId);

            if (!row) throw createError.NotFound("Hoạt động không tồn tại");

            const contentData = row.content.id(contentId);

            if (contentData?.deadline && contentData.deadline.getTime() < new Date().getTime())
                throw createError.BadRequest(
                    `Đã quá hạn nộp là ${contentData?.deadline && contentData.deadline.toLocaleString("en-GB")}`
                );

            contentData.status = "chờ duyệt";
            contentData.addProofFiles = [];
            contentData.rowValue = content;
            contentData.totalScore = totalScore;

            const updatedRow = await Row.findOneAndUpdate(
                { _id: rowListId, "content._id": contentId },
                {
                    "content.$": contentData
                },
                { new: true }
            );

            if (!updatedRow) throw createError.NotFound("Hoạt động không tồn tại");

            return {
                status: 200,
                msg: "Nộp lại thành công",
                data: updatedRow ? updatedRow : null
            };
        } catch (error) {
            throw error;
        }
    };

    static addProofFiles = async ({ uploadedFiles, rowListId, rowItemId }) => {
        try {
            const updatedRow = await Row.findOneAndUpdate(
                { _id: rowListId, "content._id": rowItemId },
                {
                    $set: {
                        "content.$.proofFilesList": uploadedFiles.map((uploadedFile) => ({
                            fileUrl: uploadedFile.Location,
                            fileType: uploadedFile.Key.split(".").slice(-1)[0],
                            originalName: uploadedFile.Key.split("/").slice(-1)[0],
                            Key: uploadedFile.key,
                            Bucket: uploadedFile.Bucket
                        }))
                    }
                }
            );

            if (!updatedRow) throw createError.NotFound("Hoạt động không tồn tại");
        } catch (error) {
            throw error;
        }
    };

    static getDynamicRows = async ({
        page,
        limit,
        userFilterConditions,
        currentRows,
        rowsType,
        activity,
        pageStudentMajor,
        pageStudentCohort,
        pageStudentLevelYear,
        pageTalentEngineerType
    }) => {
        let rowStatus = null;
        let skip = (page - 1) * limit;
        const removedDynamicRows = skip - currentRows;
        if (removedDynamicRows > 0) skip = skip - removedDynamicRows;

        switch (rowsType) {
            case "pendingRows":
                rowStatus = "chờ duyệt";
                break;
            case "acceptedRows":
                rowStatus = "đã duyệt";
                break;
            case "rejectedRows":
                rowStatus = "từ chối";
                break;
            case "resubmitedRows":
                rowStatus = "phải nộp lại";
                break;
            default:
                throw createError.BadRequest();
        }

        try {
            const dynamicRows = await Row.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $match: userFilterConditions
                },
                {
                    $lookup: {
                        from: "pages",
                        localField: "page",
                        foreignField: "_id",
                        as: "page"
                    }
                },
                {
                    $unwind: {
                        path: "$page",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "page.pageStudentMajor": pageStudentMajor,
                        "page.pageStudentCohort": pageStudentCohort,
                        "page.pageStudentLevelYear": parseInt(pageStudentLevelYear),
                        "page.pageTalentEngineerType": pageTalentEngineerType
                    }
                },
                {
                    $unwind: {
                        path: "$content",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "content.status": rowStatus
                    }
                },

                {
                    $skip: skip * 1
                },
                {
                    $limit: limit * 1
                },
                {
                    $unwind: {
                        path: "$page.tables",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "page.tables.tableName": activity,

                        $expr: {
                            $eq: ["$table", "$page.tables._id"]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        user: 1,
                        page: 1,
                        content: ["$content"]
                    }
                }
            ]);

            return {
                status: 200,
                msg: `Lấy dữ liệu chỉ tiêu ${rowStatus.toLowerCase()} thành công`,
                data: dynamicRows
            };
        } catch (error) {
            throw error;
        }
    };

    static updateRowStatus = async ({ noteValue, rowListId, contentIdList, status, deadline, isTimedExtension }) => {
        try {
            let content = "";
            switch (status) {
                case "phải nộp lại":
                    content = `${isTimedExtension ? "Gia hạn thành công" : "Cho phép nộp lại thành công"} `;
                    break;
                case "đã duyệt":
                    content = "Duyệt thành công";
                    break;
                case "từ chối":
                    content = "Đã Từ chối hoạt động";
                    break;
                default:
                    content = "Có lỗi hệ thống xảy ra";
                    break;
            }

            const row = await Row.findById(rowListId);

            if (!row) throw createError.NotFound("Hoạt động không tồn tại");

            if (row.content.id(contentIdList[0]).status !== "phải nộp lại" && isTimedExtension) {
                status = row.content.id(contentIdList[0]).status;
                content = "Hoạt động đã được nộp lại trước đó";
            }

            row.content.id(contentIdList[0]).status = status;
            if (deadline) row.content.id(contentIdList[0]).deadline = deadline;

            await row.save();

            if (noteValue) {
                await Row.findOneAndUpdate(
                    { _id: rowListId, "content._id": contentIdList[0] },
                    {
                        $push: {
                            "content.$.note": {
                                value: noteValue
                            }
                        }
                    }
                );
            }

            return {
                code: 200,
                msg: content
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = RowService;
