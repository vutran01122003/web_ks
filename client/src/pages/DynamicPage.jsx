import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { authSelector, deadlineSelector, pageSelector } from '../redux/selector';
import { renderTable } from '../helpers/renderTable';
import News from '../pages/News';
import LayoutTable from '../components/Table/LayoutTable';
import EmptyDataNotification from '../components/Notification/EmptyDataNotification';
import { setPageInfo } from '../redux/actions/pageAction';

const { VITE_APP_GOAL_PAGE, VITE_APP_NEWS_PAGE } = import.meta.env;

const DynamicPage = () => {
    const dispatch = useDispatch();
    const page = useSelector(pageSelector);
    const { deadlineList } = useSelector(deadlineSelector);
    const { user } = useSelector(authSelector);
    const [tables, setTables] = useState([]);
    const [currentDeadline, setCurrentDeadline] = useState(null);
    const { dynamicPage } = useParams();
    const { pathname } = useLocation();

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

            setTables(tableList.map((table) => renderTable({ table })));
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

    useEffect(() => {
        const pageLevelYear = page.pageStudentLevelYear;
        if (user && pageLevelYear) {
            const { faculty, major, cohort } = user;
            setCurrentDeadline(
                deadlineList.find(
                    (deadline) =>
                        deadline.faculty === faculty._id &&
                        deadline.major === major._id &&
                        deadline.cohort === cohort._id &&
                        deadline.levelYear === pageLevelYear
                )
            );
        }
    }, [user, page.pageStudentLevelYear]);

    return (
        <div className="dynamic_page_container">
            {page?.pageType && page.pageType === VITE_APP_GOAL_PAGE && (
                <Fragment>
                    {tables.length > 0 ? (
                        tables.map((table) => {
                            return (
                                <LayoutTable
                                    key={table.tableId}
                                    table={table}
                                    page={page}
                                    currentDeadline={currentDeadline}
                                />
                            );
                        })
                    ) : (
                        <EmptyDataNotification />
                    )}
                </Fragment>
            )}

            {page?.pageType && page.pageType === VITE_APP_NEWS_PAGE && <News />}
        </div>
    );
};

export default DynamicPage;
