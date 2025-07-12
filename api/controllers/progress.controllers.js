const fs = require("fs");
const createError = require("http-errors");
const { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType } = require("docx");
const FacultyService = require("../services/faculty.service");
const ProgressService = require("../services/progress.service");
const UserService = require("../services/user.service");
const PermissionService = require("../services/permission.service");
const PageService = require("../services/page.service");
const Row = require("../models/row.model");
const { capitalizeFirstLetter } = require("../utils/handleString");

const [ACCEPTED_STATUS, PENDING_STATUS, REJECTED_STATUS, RESUMBITED_STATUS] = [
    "đã duyệt",
    "chờ duyệt",
    "từ chối",
    "phải nộp lại"
];
const [PENDING, PROCESS, DONE] = ["pending", "process", "done"];
const { TALENT_ENGINEER_CODE, TEMPORARY_TALENT_ENGINEER_CODE } = process.env;

class ProgressControllers {
    getProgressByYear = async (req, res, next) => {
        try {
            const { userId, pageStudentMajor, pageStudentLevelYear, pageStudentCohort } = req.query;
            const pageDetailsList = await ProgressService.getProgressByYear({
                pageStudentMajor,
                pageStudentLevelYear,
                pageStudentCohort,
                userId: userId
            });

            const completedTasks = pageDetailsList.reduce((arr, page) => {
                const tables = {};

                let quantityDemanded = 0;
                let completedTasksNum = 0;

                page.tables.forEach((table) => {
                    quantityDemanded += table.quantityDemanded;

                    tables[table.tableName] = {
                        tableId: table._id,
                        quantityDemanded: table.quantityDemanded,
                        tableDescription: table?.description,
                        totalScore: table?.totalScore || 0,
                        currentTotalScore: 0,
                        acceptedTasksNum: 0,
                        rejectedTasksNum: 0,
                        resubmitedTasksNum: 0,
                        pendingTasksNum: 0,
                        isActive: table.isActive
                    };

                    table.rowValueList[0]?.content.forEach((content) => {
                        switch (content.status) {
                            case ACCEPTED_STATUS:
                                tables[table.tableName].acceptedTasksNum += 1;
                                tables[table.tableName].currentTotalScore += content.totalScore;
                                if (tables[table.tableName].quantityDemanded !== 0) completedTasksNum += 1;
                                break;
                            case REJECTED_STATUS:
                                tables[table.tableName].rejectedTasksNum += 1;
                                break;
                            case PENDING_STATUS:
                                tables[table.tableName].pendingTasksNum += 1;
                                break;
                            case RESUMBITED_STATUS:
                                tables[table.tableName].resubmitedTasksNum += 1;
                                break;
                            default:
                                break;
                        }
                    });
                });

                return [
                    ...arr,
                    {
                        pageId: page._id,
                        pageName: page.pageName,
                        quantityDemanded,
                        completedTasksNum,
                        percent: Number.parseFloat((completedTasksNum / quantityDemanded) * 100),
                        tables
                    }
                ];
            }, []);

            res.status(200).json({
                status: 200,
                msg: "Lấy Quá Trình Hoàn Thành Chỉ Tiêu Theo Năm Thành Công",
                data: completedTasks
            });
        } catch (error) {
            next(error);
        }
    };

    exportRegisterForm = async (req, res, next) => {
        try {
            let initialCohort = 20;
            let initialYear = 2024;
            let levelYear = null;
            const mappingTable = {};
            const currDate = new Date();

            const { _id, firstName, lastName, email, phone, userId, groups, faculty, major, cohort } =
                res.locals.userData;

            const [facultyData, majorData, cohortData] = await Promise.all([
                FacultyService.getFacultyById({
                    facultyId: faculty
                }),
                FacultyService.getMajorById({
                    majorId: major
                }),
                FacultyService.getCohortById({
                    cohortId: cohort
                })
            ]);

            const diffCohort = parseInt(cohortData.cohortName.replace(/\D/g, "")) - initialCohort;
            const docxYear = initialYear + diffCohort;

            if (groups[0].groupCode === TEMPORARY_TALENT_ENGINEER_CODE)
                levelYear = (
                    await FacultyService.getAdditionalRegisterInfo({
                        majorName: majorData.majorName,
                        cohortName: cohortData.cohortName
                    })
                ).levelYear;
            else levelYear = cohortData.currentLevelYear;

            const pages = await PageService.getPages({
                pageTalentEngineerType: groups[0].groupCode,
                pageFaculty: facultyData.facultyName,
                pageStudentMajor: majorData.majorName,
                pageStudentCohort: cohortData.cohortName,
                pageStudentLevelYear: levelYear
            });

            const tableIdList = pages.reduce((arr, page) => {
                return [
                    ...arr,
                    ...page.tables.map((table) => {
                        mappingTable[table._id] = table.tableName;
                        return table._id;
                    })
                ];
            }, []);

            const rows = await Row.find({
                table: { $in: tableIdList },
                user: _id
            });

            const data = rows.map((row) => ({
                tableName: mappingTable[row.table],
                content: row.content
                    .map((contentItem) => contentItem.rowValue)
                    .map((rowValueItem) => {
                        const keys = Object.keys(rowValueItem);

                        return keys
                            .map((key) => {
                                if (typeof rowValueItem[key] === "string") return rowValueItem[key];
                                else return rowValueItem[key].value;
                            })
                            .join(" - ");
                    })
            }));

            const doc = new Document({
                styles: {
                    default: {
                        document: {
                            run: {
                                size: 26,
                                font: "Times New Roman"
                            },
                            paragraph: {
                                spacing: {
                                    line: 288
                                }
                            }
                        }
                    }
                },
                creator: "System",
                title: "Phieu Dang Ky",
                description: "Phiếu đăng ký xét tuyển lớp kỹ sư tài năng",
                sections: []
            });

            doc.addSection({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "ĐẠI HỌC CÔNG NGHIỆP TPHCM",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "KHOA CÔNG NGHỆ THÔNG TIN",
                                bold: true,
                                underline: UnderlineType.SINGLE
                            })
                        ],
                        alignment: AlignmentType.LEFT
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "PHIẾU ĐĂNG KÝ XÉT TUYỂN LỚP KỸ SƯ TÀI NĂNG",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `(Khóa tuyển sinh: ${docxYear}, năm học xét tuyển: ${docxYear + 1}-${
                                    docxYear + 2
                                })`,
                                italics: true
                            })
                        ],
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                        text: ""
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Kính gửi: Hội đồng xét tuyển lớp kỹ sư tài năng",
                                bold: true
                            })
                        ],
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun("Họ tên sinh viên: "),
                            new TextRun({
                                text: capitalizeFirstLetter(`${lastName} ${firstName}`)
                            }),
                            new TextRun("  MSSV: "),
                            new TextRun({
                                text: userId
                            }),
                            new TextRun("  Lớp: "),
                            new TextRun({
                                text: "………………………….."
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun("Điện thoại: "),
                            new TextRun({
                                text: phone || "………………………….."
                            }),
                            new TextRun("        Email: "),
                            new TextRun({
                                text: email || "………………………….."
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `I. Thành tích đạt được trong năm học ${docxYear + 1}-${docxYear + 2}`,
                                bold: true
                            })
                        ]
                    }),
                    ...data.map(
                        (item, index) =>
                            new Paragraph({
                                children:
                                    item.content.length > 1
                                        ? [
                                              new TextRun({
                                                  text: `${index + 1}. ${capitalizeFirstLetter(item.tableName)}:`
                                              }),

                                              ...item.content.map(
                                                  (contentItem, index) =>
                                                      new TextRun({
                                                          text: `    ${contentItem}`,
                                                          break: 1
                                                      })
                                              )
                                          ]
                                        : [
                                              new TextRun({
                                                  text: `${index + 1}. ${capitalizeFirstLetter(item.tableName)}: ${
                                                      item.content[0]
                                                  }`
                                              })
                                          ],
                                indent: {
                                    left: 310
                                },
                                spacing: {
                                    after: 150
                                }
                            })
                    ),
                    new Paragraph({
                        text: ""
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "II. Kế hoạch học tập toàn khóa ",
                                bold: true
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "(SV xây dựng kế hoạch học tập theo từng học kỳ, bám sát các yêu cầu của chương trình kỹ sư tài năng)",
                                italics: true
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Sau khi được tư vấn thông tin từ Khoa CNTT và tìm hiểu các quy định về chương trình học, tôi đăng ký được xét tuyển vào lớp kỹ sư tài năng khóa tuyển sinh ${docxYear}, năm học: ${
                                            docxYear + 1
                                        }-${docxYear + 2}, ngành: ${capitalizeFirstLetter(majorData.majorName)}`,
                                        break: 1
                                    }),
                                    new TextRun({
                                        text: "Nếu được tuyển vào lớp Kỹ sư tài năng, tôi cam kết chấp hành các quy định của nhà trường đề ra.",
                                        break: 1
                                    }),
                                    new TextRun({
                                        text: "Trân trọng cảm ơn.",
                                        break: 1
                                    })
                                ]
                            })
                        ],
                        indent: {
                            left: 310
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `TP.Hồ Chí Minh, ngày ${currDate.getDate()} tháng ${
                                    currDate.getMonth() + 1
                                } năm ${currDate.getFullYear()}`,
                                italics: true
                            })
                        ],
                        alignment: AlignmentType.RIGHT
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Sinh viên",
                                italics: true
                            })
                        ],
                        indent: {
                            left: 6310
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "(Ký, ghi rõ họ tên)",
                                italics: true
                            })
                        ],
                        indent: {
                            left: 310 * 19
                        }
                    })
                ]
            });

            const buffer = await Packer.toBuffer(doc);

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            res.setHeader("Content-Disposition", `attachment; filename=${Math.floor(new Date() / 1000)}.docx`);
            res.end(buffer);
        } catch (error) {
            next(error);
        }
    };

    getCheckPassingUserStatus = async (req, res, next) => {
        try {
            let status = null;
            const { userId, groupCode, cohortName, majorName } = req.query;

            if (TEMPORARY_TALENT_ENGINEER_CODE === groupCode) {
                const { status, approvedUsers, rejectedUsers } = await FacultyService.getAdditionalRegisterInfo({
                    cohortName,
                    majorName
                });

                if (status === PROCESS && approvedUsers.includes(userId)) status = true;
                else if (status === PROCESS && rejectedUsers.includes(userId)) status = false;
            } else if (TALENT_ENGINEER_CODE === groupCode) {
                const { approvedUsers, rejectedUsers } = await FacultyService.getCohortByName({
                    cohortName,
                    majorName
                });

                if (approvedUsers.includes(userId)) status = true;
                else if (rejectedUsers.includes(userId)) status = false;
            }

            res.status(200).json({
                msg: "Kiểm tra trạng thái thành công",
                data: {
                    status
                }
            });
        } catch (error) {
            next(error);
        }
    };

    getAllProgress = async (req, res, next) => {
        try {
            const { major, cohort, groupCode, levelYear, userId, sortProgressPercentage, page, limit } = req.query;

            const studentList = await ProgressService.getAllProgress({
                major,
                cohort,
                userId,
                levelYear,
                groupCode,
                sortProgressPercentage: parseInt(sortProgressPercentage),
                queryString: {
                    page,
                    limit
                }
            });

            res.status(200).json({
                msg: "Lấy danh sách tiến độ hoàn thành hoạt động thành công",
                data: studentList
            });
        } catch (error) {
            next(error);
        }
    };

    updateUserActivityStatusByMajor = async (req, res, next) => {
        try {
            const { major, cohort, faculty, levelYear, groupCode, updatedCohortData, limit } = req.body;
            const [currentLevelYear, group] = await Promise.all([
                FacultyService.getCurrentLevelYearOfCohort({
                    majorName: major.toLowerCase(),
                    cohortName: cohort.toLowerCase()
                }),
                PermissionService.getGroupByGroupCode(groupCode)
            ]);

            if (levelYear < currentLevelYear)
                throw createError.BadRequest(`Hoạt động nộp minh chứng năm ${levelYear} đã kết thúc`);

            await UserService.updateUserActivityStatusByMajor({
                faculty,
                major,
                cohort,
                levelYear,
                updatedCohortData,
                limit,
                groupData: {
                    groupCode: groupCode,
                    groupId: group._id
                }
            });

            res.status(200).json({
                status: 200,
                msg:
                    groupCode === TALENT_ENGINEER_CODE
                        ? `Kết thúc hoạt động nộp minh chứng`
                        : "Kết thúc hoạt động xét tuyển bổ sung"
            });
        } catch (error) {
            next(error);
        }
    };

    confirmUpdateUserActivityStatusByMajor = async (req, res, next) => {
        try {
            const { major, cohort, levelYear, groupCode, updatedCohortData } = req.body;

            const currentLevelYear = FacultyService.getCurrentLevelYearOfCohort({
                majorName: major.toLowerCase(),
                cohortName: cohort.toLowerCase()
            });

            if (levelYear < currentLevelYear)
                throw createError.BadRequest(`Hoạt động nộp minh chứng năm ${levelYear} đã kết thúc`);

            await UserService.confirmUpdateUserActivityStatusByMajor({
                major,
                cohort,
                levelYear,
                updatedCohortData,
                groupData: {
                    groupCode: groupCode
                }
            });

            res.status(200).json({
                status: 200,
                msg:
                    groupCode === TALENT_ENGINEER_CODE
                        ? `Xác nhận kết thúc hoạt động nộp minh chứng`
                        : "Xác nhận kết thúc hoạt động xét tuyển bổ sung"
            });
        } catch (error) {
            next(error);
        }
    };

    revertProgress = async (req, res, next) => {
        try {
            const { majorName, cohortName, groupCode, levelYear } = req.body;

            await ProgressService.revertProgress({
                majorName,
                cohortName,
                groupCode,
                levelYear
            });

            res.status(200).json({
                status: 200,
                msg: "Duyệt lại thành công"
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new ProgressControllers();
