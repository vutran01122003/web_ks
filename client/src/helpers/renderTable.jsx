export const renderTable = ({ table, pendingGoalsInfo }) => {
    const TABLE = {};

    const pendingTable = pendingGoalsInfo ? pendingGoalsInfo.page[0].tables.find((table) => {
        return table._id === pendingGoalsInfo.table;
    }) : null

    TABLE.tableId = table ? table._id : pendingTable.table;
    TABLE.title = table ? table.tableName : pendingTable.tableName;
    const rowTitleList = table ? table.rowTitleList : pendingTable.rowTitleList;
    
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
        },
    ];

    const content = table ? table.rowValueList[0]?.content : pendingGoalsInfo?.content;

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
                ];
            }
        );
    }

    return TABLE;
}