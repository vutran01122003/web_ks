import React, { useEffect, useState } from "react";
import LayoutTable from "../components/ComponentTable/LayoutTable";
import { useDispatch, useSelector } from "react-redux";
import { pageSelector } from "../redux/selector";
import News from "../pages/News";
import { useLocation } from "react-router-dom";
import { getPage } from "../redux/actions/pageAction";
import { renderTable } from "../helpers/renderTable";

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
                return renderTable({table});
            });
            setTables(arr);
        }
    }, [page?.pageName, page?.pageType, JSON.stringify(page?.tables)]);

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
