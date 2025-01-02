import { Tabs } from 'antd';
import { IoSearch } from 'react-icons/io5';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, rowSelector } from '../redux/selector';
import { getDynamicRows } from '../redux/actions/rowAction';
import CircularProgress from '@mui/material/CircularProgress';
import GLOBALTYPES from '../redux/actions/globalTypes';
import ComponentDynamicRow from '../components/DynamicRow/ComponentDynamicRow';
import SearchFilterComponent from '../components/Filter/SearchFilter';
import EmptyDataNotification from '../components/Notification/EmptyDataNotification';

const items = [
    {
        key: 'pendingRows',
        label: 'Hoạt Động Chưa Duyệt',
        children: null
    },
    {
        key: 'acceptedRows',
        label: 'Hoạt Động Đã Duyệt',
        children: null
    },
    {
        key: 'rejectedRows',
        label: 'Hoạt Động Đã Từ Chối',
        children: null
    },
    {
        key: 'resubmitedRows',
        label: 'Hoạt Động Phải Nộp Lại',
        children: null
    }
];

const ActivityUi = () => {
    const limit = import.meta.env.VITE_APP_API_LIMIT;

    const observer = useRef();
    const dispatch = useDispatch();

    const auth = useSelector(authSelector);
    const row = useSelector(rowSelector);

    const [tab, setTab] = useState('pendingRows');
    const [majorValue, setMajorValue] = useState({});
    const [cohortValue, setCohortValue] = useState({});
    const [talentEngineerType, setTalentEngineerType] = useState('');
    const [currentLevelYearValue, setCurrentLevelYearValue] = useState('');
    const [activityName, setActivityName] = useState('');
    const [userId, setUserId] = useState('');
    const [nextPage, setNextPage] = useState({
        pendingRows: 1,
        acceptedRows: 1,
        rejectedRows: 1,
        resubmitedRows: 1
    });

    const majorName = majorValue.majorName;
    const cohortName = cohortValue.cohortName;

    const onChangeUserId = (e) => {
        setUserId(e.target.value);
    };

    const handleChangeTabValue = (tabValue) => {
        setTab(tabValue);
    };

    const validateFilterData = () => {
        if (majorName && cohortName && currentLevelYearValue > 0 && talentEngineerType && activityName) return true;
        return false;
    };

    const getTheFirstActivityList = ({ tab, userId }) => {
        dispatch({
            type: GLOBALTYPES.ROW.RESET_ALL_TAB
        });

        setNextPage({
            pendingRows: 1,
            acceptedRows: 1,
            rejectedRows: 1,
            resubmitedRows: 1
        });

        getActivities({ tab, page: 1, userId });
    };

    const getActivities = ({ tab, page, userId }) => {
        dispatch(
            getDynamicRows({
                tab,
                page,
                limit,
                userId,
                currentRows: row[tab]?.currentRows,
                pageStudentMajor: majorName,
                pageStudentCohort: cohortName,
                pageTalentEngineerType: talentEngineerType,
                pageStudentLevelYear: currentLevelYearValue,
                activity: activityName
            })
        );
    };

    const onSearch = async () => {
        if (!validateFilterData()) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });
            return;
        }

        getTheFirstActivityList({ tab, userId });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: 'Tìm kiếm thành công'
            }
        });
    };

    const lastPostElementRef = useCallback(
        (elem) => {
            if (row.loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !row[tab]?.maxPage) {
                    setNextPage((prev) => ({ ...prev, [tab]: prev[tab] + 1 }));
                }
            });
            if (elem) observer.current.observe(elem);
        },
        [row.loading]
    );

    useEffect(() => {
        if (nextPage[tab] > 1) getActivities({ tab, page: nextPage[tab] });
    }, [tab, nextPage[tab]]);

    useEffect(() => {
        setUserId('');
        if (validateFilterData()) {
            getTheFirstActivityList({ tab });
        }
    }, [tab, majorName, cohortName, talentEngineerType, currentLevelYearValue, activityName]);

    return (
        <>
            {auth?.user && (
                <div className="container__tables">
                    <div className="body__tables">
                        <div className="filter_group">
                            <SearchFilterComponent
                                setMajorValue={setMajorValue}
                                setCohortValue={setCohortValue}
                                setTalentEngineerType={setTalentEngineerType}
                                setCurrentLevelYearValue={setCurrentLevelYearValue}
                                setActivityName={setActivityName}
                                majorValue={majorValue}
                                cohortValue={cohortValue}
                                talentEngineerType={talentEngineerType}
                                currentLevelYearValue={currentLevelYearValue}
                                activityName={activityName}
                            />

                            <div className="search_wrapper">
                                <input
                                    className="search_input"
                                    placeholder="Mã sinh viên"
                                    value={userId}
                                    onChange={onChangeUserId}
                                />

                                <button className="search_btn" onClick={() => onSearch(tab)} type="primary">
                                    <IoSearch size={20} />
                                    <span>Tìm Kiếm</span>
                                </button>
                            </div>
                        </div>

                        <Tabs
                            onChange={handleChangeTabValue}
                            defaultActiveKey="1"
                            items={items}
                            className="tab__tables--goal"
                        />

                        <div className="container__center">
                            {row[tab].data.length > 0 &&
                                row[tab].data.map((dynamicRows, index) => {
                                    return (
                                        <div
                                            ref={index === row[tab].data.length - 1 ? lastPostElementRef : null}
                                            key={dynamicRows?._id + index}
                                        >
                                            <ComponentDynamicRow
                                                index={index}
                                                rowsType={tab}
                                                talentEngineerType={talentEngineerType}
                                                dynamicRows={dynamicRows}
                                            />
                                        </div>
                                    );
                                })}

                            {row?.loading && (
                                <div className="loading_rows_pendding">
                                    <CircularProgress />
                                </div>
                            )}

                            {!row.loading && row[tab].data.length == 0 && <EmptyDataNotification />}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActivityUi;
