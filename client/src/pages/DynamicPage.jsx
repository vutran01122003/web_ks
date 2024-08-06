import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { pageSelector } from '../redux/selector';
import { renderTable } from '../helpers/renderTable';
import News from '../pages/News';
import LayoutTable from '../components/ComponentTable/LayoutTable';
import EmptyDataNotification from '../components/ComponentEmptyData/EmptyDataNotification';

const DynamicPage = () => {
    const page = useSelector(pageSelector);
    const [tables, setTables] = useState([]);
    const { dynamicPage } = useParams();

    useEffect(() => {
        if (page.pages.length > 0) {
            const tableList = page.pages.find((page) => page.pageName === dynamicPage).tables;
            setTables(
                tableList.map((table) => {
                    return renderTable({ table });
                })
            );
        }
    }, [page.pages, dynamicPage]);

    return (
        <div className="dynamic_page_container">
            {tables.length > 0 ? (
                tables.map((table) => {
                    return <LayoutTable key={table.tableId} table={table} page={page}></LayoutTable>;
                })
            ) : (
                <EmptyDataNotification />
            )}

            {page?.pageType && page?.pageType === 'tin tức' && <News />}
        </div>
    );
};

export default DynamicPage;
