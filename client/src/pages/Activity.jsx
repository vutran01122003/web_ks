import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Tabs, Input } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, rowSelector } from '../redux/selector';
import { getDynamicRows } from '../redux/actions/rowAction';
import ComponentDynamicRows from '../components/ComponentDynamicRows/ComponentDynamicRows';
import CircularProgress from '@mui/material/CircularProgress';
import GLOBALTYPES from '../redux/actions/globalTypes';

import EmptyDataNotification from '../components/ComponentEmptyData/EmptyDataNotification';
import SearchFilterComponent from '../components/ComponentFilterData/SearchFilter';

const ActivityUi = () => {
    const observer = useRef();
    const dispatch = useDispatch();

    const auth = useSelector(authSelector);
    const row = useSelector(rowSelector);

    const [refreshTabTrigger, setRefreshTabTrigger] = useState(false);
    const [majorValue, setMajorValue] = useState({});
    const [cohortValue, setCohortValue] = useState({});
    const [talentEngineerType, setTalentEngineerType] = useState('');
    const [currentLevelYearValue, setCurrentLevelYearValue] = useState('');
    const [activityValue, setActivityValue] = useState('');
    const [userData, setUserData] = useState({
        userId: '',
        major: ''
    });
    const [nextPage, setNextPage] = useState({
        pendingRows: 1,
        acceptedRows: 1,
        rejectedRows: 1,
        resubmitedRows: 1
    });

    const [tab, setTab] = useState('pendingRows');
    const limit = import.meta.env.VITE_APP_API_LIMIT;

    const handleRefreshTab = () => {
        dispatch({
            type: GLOBALTYPES.ROW.REFRESH_TAB,
            payload: {
                rowsType: tab
            }
        });
        setRefreshTabTrigger((prev) => !prev);
        setNextPage((prev) => ({ ...prev, [tab]: 1 }));
    };

    const handleChangeTabValue = (tabValue) => {
        setUserData({
            userId: '',
            major: ''
        });

        setTab(tabValue);
    };

    const handleRelativeSearchByStudentId = (e) => {
        setUserData((prev) => ({ ...prev, userId: e.target.value }));
    };

    const handleRelativeSearch = () => {
        handleRefreshTab();
    };

    const lastPostElementRef = useCallback(
        (elem) => {
            if (row.loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && nextPage[tab] === 1 && row[tab]?.data.length === limit) {
                    setNextPage((prev) => ({ ...prev, [tab]: prev[tab] + 1 }));
                } else if (entries[0].isIntersecting && nextPage[tab] > 1 && !row[tab]?.maxPage) {
                    setNextPage((prev) => ({ ...prev, [tab]: prev[tab] + 1 }));
                }
            });
            if (elem) observer.current.observe(elem);
        },
        [row.loading]
    );

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

    useEffect(() => {
        if (
            majorValue?.majorName &&
            cohortValue?.cohortName &&
            currentLevelYearValue > 0 &&
            talentEngineerType &&
            activityValue
        ) {
            dispatch(
                getDynamicRows({
                    tab,
                    limit,
                    userData,
                    page: nextPage[tab],
                    currentRows: row[tab]?.currentRows,
                    pageStudentCohort: cohortValue.cohortName,
                    pageStudentLevelYear: currentLevelYearValue,
                    pageStudentMajor: majorValue.majorName,
                    activity: activityValue
                })
            );
        } else {
            dispatch({
                type: GLOBALTYPES.ROW.RESET_ALL_TAB
            });
        }
    }, [
        tab,
        dispatch,
        nextPage[tab],
        refreshTabTrigger,
        majorValue?.majorName,
        cohortValue?.cohortName,
        currentLevelYearValue,
        activityValue,
        talentEngineerType
    ]);

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
                                setActivityValue={setActivityValue}
                                majorValue={majorValue}
                                cohortValue={cohortValue}
                                talentEngineerType={talentEngineerType}
                                currentLevelYearValue={currentLevelYearValue}
                                activityValue={activityValue}
                            />
                        </div>
                        <Tabs
                            onChange={handleChangeTabValue}
                            defaultActiveKey="1"
                            items={items}
                            className="tab__tables--goal"
                        />
                        <div className="line__sort">
                            <div className="box__left">
                                <Input
                                    placeholder="Mã sinh viên"
                                    onChange={handleRelativeSearchByStudentId}
                                    value={userData.userId}
                                    style={{
                                        width: 220
                                    }}
                                />

                                <Button
                                    onClick={handleRelativeSearch}
                                    type="primary"
                                    style={{
                                        fontWeight: 600
                                    }}
                                >
                                    Tìm Kiếm
                                </Button>
                            </div>

                            <div className="box__right">
                                <Button
                                    type="primary"
                                    icon={<ReloadOutlined />}
                                    className="btn__refresh"
                                    onClick={() => {
                                        handleRefreshTab();
                                        setUserData({
                                            userId: '',
                                            major: ''
                                        });
                                    }}
                                >
                                    Làm Mới
                                </Button>
                            </div>
                        </div>
                        <div className="container__center">
                            <>
                                {row[tab].data.map((dynamicRows, index) => {
                                    if (index === row[tab].data.length - 1 && row[tab].data.length != 0) {
                                        return (
                                            <div
                                                ref={lastPostElementRef}
                                                className="last"
                                                key={dynamicRows?._id + index}
                                            >
                                                <ComponentDynamicRows
                                                    index={index}
                                                    rowsType={tab}
                                                    dynamicRows={dynamicRows}
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={dynamicRows?._id + index}>
                                            <ComponentDynamicRows
                                                index={index}
                                                rowsType={tab}
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
                            </>

                            {!row.loading && row[tab].data.length == 0 && <EmptyDataNotification />}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActivityUi;
