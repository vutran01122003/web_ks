import { capitalizeFirstLetter, toFullName } from '../utils/handleString';

export const renderTable = ({ table, dynamicRowsInfo, rowsType }) => {
    const TABLE = {};
    const dynamicTable = dynamicRowsInfo ? dynamicRowsInfo.page.tables : null;

    if (table) TABLE.description = table.description;

    let buttonNameLabel = '';
    if (rowsType) {
        switch (rowsType) {
            case 'pendingRows':
                buttonNameLabel = 'Xét Duyệt';
                break;
            case 'acceptedRows':
            case 'rejectedRows':
                buttonNameLabel = 'Thao Tác';
                break;
            case 'resubmitedRows':
                buttonNameLabel = 'Gia Hạn';
                break;
            default:
                buttonNameLabel = '';
                break;
        }
    }

    TABLE.tableId = table ? table._id : dynamicTable._id;
    TABLE.title = table ? table.tableName : dynamicTable.tableName;
    const rowTitleList = table ? table.rowTitleList : dynamicTable.rowTitleList;
    const fixedScore = table ? table.fixedScore : null;

    TABLE.thead = [];

    if (!table) {
        TABLE.thead = [
            {
                textHeading: 'Mã Sinh Viên',
                fixedValueList: [],
                typeInput: 'text',
                isShow: true,
                requiredHeading: true
            },
            {
                textHeading: 'Tên Sinh Viên',
                fixedValueList: [],
                typeInput: 'text',
                isShow: true,
                requiredHeading: true
            },
            {
                textHeading: 'Ngày Nộp',
                fixedValueList: [],
                typeInput: 'text',
                isShow: true,
                requiredHeading: true
            }
        ];
    }

    if (rowTitleList) {
        TABLE.thead.push(
            ...rowTitleList.map((rowTitle) => {
                const typeInput = rowTitle.fixedValue.length > 0 ? 'select' : 'text';
                const headerData = {
                    _id: rowTitle._id,
                    textHeading: rowTitle.titleValue,
                    fixedValueList: rowTitle.fixedValue,
                    typeInput,
                    isShow: true
                };

                if (typeInput === 'select')
                    return {
                        ...headerData,
                        fixedScore
                    };

                return headerData;
            })
        );
    }

    if (buttonNameLabel === 'Gia Hạn')
        TABLE.thead.push({
            textHeading: 'Hạn Nộp Lại',
            typeInput: 'text',
            requiredHeading: true,
            isShow: false
        });

    TABLE.thead = [
        ...TABLE.thead,
        {
            textHeading: 'Điểm',
            typeInput: 'text',
            requiredHeading: true,
            isShow: false
        },
        {
            textHeading: 'Minh Chứng',
            typeInput: 'file',
            requiredHeading: true,
            isShow: true
        }
    ];

    if (!table) {
        TABLE.thead.push({
            textHeading: buttonNameLabel,
            typeInput: 'text',
            requiredHeading: true,
            isShow: false
        });
    } else {
        TABLE.quantityDemanded = table.quantityDemanded;
        TABLE.thead.push(
            {
                textHeading: 'Trạng Thái',
                typeInput: 'text',
                requiredHeading: true,
                isShow: false
            },
            {
                textHeading: 'Ghi Chú',
                typeInput: 'text',
                requiredHeading: true,
                isShow: false
            },
            {
                textHeading: 'Sửa',
                typeInput: 'text',
                requiredHeading: true,
                isShow: false
            }
        );
    }

    const content = table ? table.rowValueList[0]?.content : dynamicRowsInfo?.content;

    if (content && content?.length > 0) {
        TABLE.tbody = content.map((rowValueItem) => {
            const thead = [...TABLE.thead];
            let rowValueItemArr = null;

            rowValueItemArr = thead.reduce((arr, headingItem) => {
                if (!headingItem?.requiredHeading && rowValueItem?.rowValue) {
                    return [
                        ...arr,
                        rowValueItem?.rowValue[headingItem?._id]
                            ? typeof rowValueItem.rowValue[headingItem._id] === 'object'
                                ? rowValueItem.rowValue[headingItem._id].value
                                : rowValueItem.rowValue[headingItem._id]
                            : 'Trống'
                    ];
                } else return arr;
            }, []);

            if (dynamicRowsInfo) {
                rowValueItemArr = [
                    dynamicRowsInfo?.user[0]?.userId || 'Chưa Cập Nhật',
                    toFullName({
                        lastName: dynamicRowsInfo?.user[0]?.lastName,
                        firstName: dynamicRowsInfo?.user[0]?.firstName
                    }),
                    rowValueItem?.createdAt ? new Date(rowValueItem.createdAt).toLocaleDateString('en-GB') : 'Không có',
                    ...rowValueItemArr
                ];

                if (buttonNameLabel === 'Gia Hạn') {
                    rowValueItemArr.push(
                        rowValueItem?.deadline ? new Date(rowValueItem.deadline).toLocaleString('en-GB') : 'Không Có'
                    );
                }
            }

            const tbody = [
                ...rowValueItemArr,
                {
                    scoreLabel: true,
                    scoreValue: rowValueItem.totalScore
                },
                {
                    proofNameLabel: 'Tải về',
                    proofPreviewLabel: 'Xem',
                    proofFiles: rowValueItem.proofFilesList,
                    tableValue: {
                        ...dynamicTable,
                        rowValueList: [
                            {
                                content: [rowValueItem]
                            }
                        ],
                        user: dynamicRowsInfo?.user[0]
                    }
                }
            ];

            dynamicRowsInfo
                ? tbody.push({
                      buttonNameLabel: true,
                      rowsType,
                      rowInfoData: {
                          tableInfo: {
                              tableId: dynamicTable._id,
                              tableName: dynamicTable.tableName
                          },
                          pageInfo: {
                              pageId: dynamicRowsInfo.page._id,
                              pageName: dynamicRowsInfo.page.pageName,
                              pageStudentMajor: dynamicRowsInfo.page.pageStudentMajor,
                              pageStudentLevelYear: dynamicRowsInfo.page.pageStudentLevelYear,
                              pageStudentCohort: dynamicRowsInfo.page.pageStudentCohort
                          },
                          rowListId: dynamicRowsInfo?._id,
                          contentIdList: [rowValueItem?._id]
                      },
                      userData: dynamicRowsInfo.user[0]
                  })
                : tbody.push(
                      {
                          statusLabel: rowValueItem.status
                              ? capitalizeFirstLetter(rowValueItem.status)
                              : 'Lỗi Trạng Thái',
                          statusValue: rowValueItem.status
                      },
                      {
                          noteLabel: 'Xem Ghi Chú',
                          noteValue: rowValueItem.note
                      },
                      {
                          editLabel: 'Sửa',
                          editValue: rowValueItem.status === 'phải nộp lại' ? true : false,
                          rowInfo: {
                              ...rowValueItem,
                              rowListId: table.rowValueList[0]._id
                          }
                      }
                  );
            return tbody;
        });
    }
    return TABLE;
};
