import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';

export const renderTable = ({ table, dynamicRowsInfo, rowsType }) => {
    const TABLE = {};

    const dynamicTable = dynamicRowsInfo
        ? dynamicRowsInfo.page[0].tables.find((table) => {
              return table._id === dynamicRowsInfo.table;
          })
        : null;

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

    if (table) {
        TABLE.thead = rowTitleList.map((rowTitle) => {
            return {
                textHeading: rowTitle.titleValue,
                fixedValueList: rowTitle.fixedValue,
                typeInput: rowTitle.fixedValue.length > 0 ? 'select' : 'text',
                isShow: true
            };
        });
    } else {
        TABLE.thead = [
            {
                textHeading: 'Mã Sinh Viên',
                fixedValueList: [],
                typeInput: 'text',
                isShow: true
            },
            {
                textHeading: 'Tên Sinh Viên',
                fixedValueList: [],
                typeInput: 'text',
                isShow: true
            },
            {
                textHeading: 'Tên Hoạt Động',
                fixedValueList: [],
                typeInput: 'text',
                isShow: true
            },
            {
                textHeading: 'Ngày Nộp',
                fixedValueList: [],
                typeInput: 'text',
                isShow: true
            },
            {
                textHeading: 'Chi Tiết HĐ',
                typeInput: 'text',
                requiredHeading: true,
                isShow: false
            }
        ];
    }

    if (buttonNameLabel === 'Gia Hạn')
        TABLE.thead.splice(-1, 0, {
            textHeading: 'Hạn Nộp Lại',
            typeInput: 'text',
            requiredHeading: true,
            isShow: false
        });

    TABLE.thead = [
        ...TABLE.thead,
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

            if (dynamicRowsInfo) {
                rowValueItemArr = [
                    dynamicRowsInfo?.user[0].studentId,
                    capitalizeFirstLetter(dynamicRowsInfo?.user[0].fullName),
                    capitalizeFirstLetter(TABLE.title),
                    rowValueItem?.createdAt
                        ? new Date(rowValueItem.createdAt).toLocaleDateString('en-GB')
                        : 'Chưa Cập Nhật'
                ];

                if (buttonNameLabel === 'Gia Hạn') {
                    rowValueItemArr.push(
                        rowValueItem?.deadline
                            ? new Date(rowValueItem.deadline).toLocaleDateString('en-GB')
                            : 'Không Có'
                    );
                }

                rowValueItemArr.push({
                    rowLabel: 'Xem Chi Tiết',
                    tableValue: {
                        ...dynamicRowsInfo.page[0].tables.find((table) => {
                            return table._id === dynamicRowsInfo.table;
                        }),
                        rowValueList: [
                            {
                                content: [rowValueItem]
                            }
                        ],
                        user: dynamicRowsInfo?.user[0]
                    }
                });
            } else {
                rowValueItemArr = thead.reduce((arr, headingItem) => {
                    if (
                        table &&
                        !thead?.requiredHeading &&
                        rowValueItem?.rowValue &&
                        rowValueItem?.rowValue[headingItem?.textHeading]
                    )
                        return [
                            ...arr,
                            typeof rowValueItem.rowValue[headingItem.textHeading] === 'object'
                                ? rowValueItem.rowValue[headingItem.textHeading].value
                                : rowValueItem.rowValue[headingItem.textHeading]
                        ];
                    else return arr;
                }, []);
            }

            const tbody = [
                ...rowValueItemArr,
                {
                    proofNameLabel: 'Download',
                    proofFiles: rowValueItem.proofFilesList
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
                              pageId: dynamicRowsInfo.page[0]._id,
                              pageName: dynamicRowsInfo.page[0].pageName
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
