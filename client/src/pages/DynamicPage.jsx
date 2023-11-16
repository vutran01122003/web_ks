import React, { useEffect, useState } from "react";
import LayoutTable from "../components/ComponentTable/LayoutTable";
import { useDispatch, useSelector } from "react-redux";
import { pageSelector } from "../redux/selector";
import News from "../pages/News";
import { useLocation } from "react-router-dom";
import { getPage } from "../redux/actions/pageAction";

const DynamicPage = () => {
    const dispatch = useDispatch();
    const page = useSelector(pageSelector);
    const [tables, setTables] = useState([]);
    const location = useLocation();
    const pathName = location.pathname;

    useEffect(() => {
        if (!page.pageType && !page.pageName) {
            dispatch(getPage({ pathName }));
        }
    }, [pathName]);

    useEffect(() => {
        if (page?.tables && page.pageType === "Chỉ Tiêu") {
            const arr = page.tables.map((table) => {
                const TABLE = {};
                TABLE.tableId = table._id;
                TABLE.title = table.tableName;
                TABLE.thead = table.rowTitleList.map((rowTitle) => {
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

                if (table?.rowValueList?.length > 0) {
                    TABLE.tbody = table.rowValueList[0].content.map(
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
                                    proofImages: rowValueItem.proofImageList,
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
            });
            setTables(arr);
        }
    }, [page?.pageName, page?.pageType, JSON.stringify(page?.tables)]);

    console.log(tables);
    return (
        <div className="dynamic_page_container">
            {page?.pageType &&
                page?.pageType === "Chỉ Tiêu" &&
                tables.map((table) => {
                    return (
                        <LayoutTable
                            key={table.tableId}
                            table={table}
                            page={page}
                        ></LayoutTable>
                    );
                })}
            {page?.pageType && page?.pageType === "Tin Tức" && <News />}
        </div>
    );
};

export default DynamicPage;
