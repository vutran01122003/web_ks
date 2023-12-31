import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

export const renderTable = ({ table, dynamicRowsInfo, rowsType}) => {
    const TABLE = {};

    const dynamicTable = dynamicRowsInfo ? dynamicRowsInfo.page[0].tables.find((table) => {
        return table._id === dynamicRowsInfo.table;
    }) : null

    let buttonNameLabel = "";
    if(rowsType) {
        switch (rowsType) {
            case "pendingRows":
                buttonNameLabel = "Xét Duyệt";
                break;
            case "acceptedRows":
            case "rejectedRows":
                buttonNameLabel = "Thao Tác";
                break;
            default:
                buttonNameLabel = "";
                break;
        }
    }

    TABLE.tableId = table ? table._id : dynamicTable.table;
    TABLE.title = table ? table.tableName : dynamicTable.tableName;
    const rowTitleList = table ? table.rowTitleList : dynamicTable.rowTitleList;
    
    if(table) {
        TABLE.thead = rowTitleList.map((rowTitle) => {
            return {
                textHeading: rowTitle.titleValue,
                fixedValueList: rowTitle.fixedValue,
                typeInput:
                    rowTitle.fixedValue.length > 0 ? "select" : "text",
                isShow: true,
            };
        });
    } else {
        TABLE.thead= [
            {
                textHeading: "Mã Sinh Viên",
                fixedValueList: [],
                typeInput: "text",
                isShow: true,
            },
            {
                textHeading: "Tên Sinh Viên",
                fixedValueList: [],
                typeInput: "text",
                isShow: true,
            },
            {
                textHeading: "Hoạt Động",
                fixedValueList: [],
                typeInput: "text",
                isShow: true,
            },
            {
                textHeading: "Ngày Nộp",
                fixedValueList: [],
                typeInput: "text",
                isShow: true,
            },
        ]
    }
   
    TABLE.thead = [
        ...TABLE.thead,
        {
            textHeading: "Minh Chứng",
            typeInput: "file",
            requiredHeading: true,
            isShow: true,
        }
    ];

    if(!table) {
        TABLE.thead.push({
            textHeading: buttonNameLabel,
            typeInput: "text",
            requiredHeading: true,
            isShow: false,
        });
    } else {
        TABLE.thead.push({
            textHeading: "Trạng Thái",
            typeInput: "text",
            requiredHeading: true,
            isShow: false,
        }, {
            textHeading: "Ghi Chú",
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
                let rowValueItemArr = null;

                if(dynamicRowsInfo) {
                    rowValueItemArr =  [
                        dynamicRowsInfo?.user[0].studentId,
                        capitalizeFirstLetter(dynamicRowsInfo?.user[0].fullName),
                        capitalizeFirstLetter(TABLE.title),
                        new Date(rowValueItem.createdAt).toLocaleDateString('en-GB')
                    ]
                } else {
                    rowValueItemArr = thead.reduce(
                        (arr, headingItem) => {
                            if (table && !thead.requiredHeading && rowValueItem.rowValue[headingItem.textHeading])
                                return [
                                    ...arr,
                                    rowValueItem.rowValue[
                                        headingItem.textHeading
                                    ],
                                ];
                            else 
                            return arr;
                        },
                        []
                    );
                }
                
                const tbody = [...rowValueItemArr, {
                    proofNameLabel: "Xem Minh Chứng",
                    proofFiles: rowValueItem.proofFilesList,
                }];

                dynamicRowsInfo ? 
                tbody.push({
                    buttonNameLabel: true,
                    rowsType,
                    rowInfoData: {
                        rowListId: dynamicRowsInfo?._id,
                        contentIdList: [rowValueItem?._id]
                    }
                }) : 
                tbody.push({
                    statusLabel: rowValueItem.status,
                    statusValue: rowValueItem.status === "Chờ Duyệt" ? null : 
                        rowValueItem.status === "Đã Duyệt" ? true : false,
                }, {
                    noteLabel: "Xem Ghi Chú",
                    noteValue: rowValueItem.note
                })
                return tbody;
            }
        );
    }

    return TABLE;
}