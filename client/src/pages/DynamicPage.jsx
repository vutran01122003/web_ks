import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { pageSelector } from '../redux/selector';
import { renderTable } from '../helpers/renderTable';
import News from '../pages/News';
import LayoutTable from '../components/ComponentTable/LayoutTable';
import EmptyDataNotification from '../components/ComponentEmptyData/EmptyDataNotification';
import { setPageInfo } from '../redux/actions/pageAction';

const DynamicPage = () => {
    const dispatch = useDispatch();
    const page = useSelector(pageSelector);
    const [tables, setTables] = useState([]);
    const { dynamicPage } = useParams();
    const { pathname } = useLocation();
    const [NEWS, GOAL] = ['tin tức', 'chỉ tiêu'];

    useEffect(() => {
        if (page.pages.length > 0 && dynamicPage) {
            const pageData = page.pages.find((page) => {
                if (page.pageName === dynamicPage) {
                    dispatch(
                        setPageInfo({
                            pageId: page._id,
                            pageType: page.pageType,
                            pageName: page.pageName,
                            pageStudentLevelYear: page.pageStudentLevelYear
                        })
                    );
                    return true;
                }
                return false;
            });

            const tableList = pageData?.tables || [];

            setTables(
                tableList.map((table) => {
                    return renderTable({ table });
                })
            );
        }
    }, [page.pages, dynamicPage]);

    useEffect(() => {
        if (pathname) {
            dispatch(
                setPageInfo({
                    pathName: pathname
                })
            );
        }
    }, [pathname]);
    return (
        <div className="dynamic_page_container">
            {page?.pageType && page.pageType === GOAL && (
                <>
                    {tables.length > 0 ? (
                        tables.map((table) => {
                            return <LayoutTable key={table.tableId} table={table} page={page}></LayoutTable>;
                        })
                    ) : (
                        <EmptyDataNotification />
                    )}
                </>
            )}

            {page?.pageType && page.pageType === NEWS && <News />}
        </div>
    );
};

export default DynamicPage;
