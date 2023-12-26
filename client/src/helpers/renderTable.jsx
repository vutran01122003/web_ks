export const renderTable = ({ table, dynamicRowsInfo, rowsType}) => {
    const TABLE = {};

    const dynamicTable = dynamicRowsInfo ? dynamicRowsInfo.page[0].tables.find((table) => {
        return table._id === dynamicRowsInfo.table;
    }) : null

    let buttonNameLabel = "";
    if(rowsType) {
        switch (rowsType) {
            case "pendingRows":
                buttonNameLabel = "Xét Duyệt Chỉ Tiêu";
                break;
            case "acceptedRows":
                buttonNameLabel = "Nhấn Để Hủy";
                break;
            case "rejectedRows":
                buttonNameLabel = "Nhấn Để Duyệt";
                break;
            default:
                buttonNameLabel = "Xét Duyệt Chỉ Tiêu";
                break;
        }
    }

    TABLE.tableId = table ? table._id : dynamicTable.table;
    TABLE.title = table ? table.tableName : dynamicTable.tableName;
    const rowTitleList = table ? table.rowTitleList : dynamicTable.rowTitleList;
    
    TABLE.thead = rowTitleList.map((rowTitle) => {
        return {
            textHeading: rowTitle.titleValue,
            fixedValueList: rowTitle.fixedValue,
            typeInput:
                rowTitle.fixedValue.length > 0 ? "select" : "text",
            isShow: true,
        };
    });

    TABLE.thead = [
        ...TABLE.thead,
        {
            textHeading: "Minh Chứng",
            typeInput: "file",
            requiredHeading: true,
            isShow: true,
        },
        {
            textHeading: "Trạng Thái",
            typeInput: "text",
            requiredHeading: true,
            isShow: false,
        }
    ];

    if(!table) {
        TABLE.thead.push({
            textHeading: buttonNameLabel,
            typeInput: "text",
            requiredHeading: true,
            isShow: false,
        });
    }

    const content = table ? table.rowValueList[0]?.content : dynamicRowsInfo?.content;

    if (content && content?.length > 0) {
        TABLE.tbody = content.map(
            (rowValueItem) => {
                const thead = [...TABLE.thead];
                const rowValueItemArr = thead.reduce(
                    (arr, headingItem) => {
                        if (
                            !thead.requiredHeading &&
                            rowValueItem.rowValue[
                                headingItem.textHeading
                            ]
                        )
                            return [
                                ...arr,
                                rowValueItem.rowValue[
                                    headingItem.textHeading
                                ],
                            ];
                        return arr;
                    },
                    []
                );
                return [
                    ...rowValueItemArr,
                    {
                        proofNameLabel: "Xem Minh Chứng",
                        proofFiles: rowValueItem.proofFilesList,
                    },
                    {
                        statusLabel: rowValueItem.status,
                        statusValue:
                            rowValueItem.status === "Chờ Duyệt"
                                ? null
                                : rowValueItem.status === "Đã Duyệt"
                                ? true
                                : false,
                    },
                    {
                        buttonNameLabel: true,
                        textHeadingExists: table ? false : true,
                        rowsType,
                        rowInfoData: {
                            rowListId: dynamicRowsInfo?._id,
                            contentIdList: [rowValueItem?._id]
                        }
                    }
                ];
            }
        );
    }

    return TABLE;
}