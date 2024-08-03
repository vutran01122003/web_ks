import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Tabs, Input } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { activitiesSelector, authSelector, facultySelector, rowSelector } from '../redux/selector';
import { getDynamicRows } from '../redux/actions/rowAction';
import ComponentDynamicRows from '../components/ComponentDynamicRows/ComponentDynamicRows';
import CircularProgress from '@mui/material/CircularProgress';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { getAllFaculties } from '../redux/actions/facultyAction';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';
import { getActivities } from '../redux/actions/activitiesAction';
import EmptyDataNotification from '../components/ComponentEmptyData/EmptyDataNotification';

const ActivityUi = () => {
    const auth = useSelector(authSelector);
    const row = useSelector(rowSelector);
    const faculty = useSelector(facultySelector);
    const activity = useSelector(activitiesSelector);
    const observer = useRef();
    const dispatch = useDispatch();
    const [refreshTabTrigger, setRefreshTabTrigger] = useState(false);
    const [userData, setUserData] = useState({
        userId: '',
        major: ''
    });

    const [majorValue, setMajorValue] = useState({});
    const [cohortValue, setCohortValue] = useState({});
    const [majorsValue, setMajorsValue] = useState([]);
    const [currentLevelYearValue, setCurrentLevelYearValue] = useState(0);
    const [activityValue, setActivityValue] = useState('');

    const [nextPage, setNextPage] = useState({
        pendingRows: 1,
        acceptedRows: 1,
        rejectedRows: 1,
        resubmitedRows: 1
    });

    const [tab, setTab] = useState('pendingRows');
    const limit = 10;

    const handleMajorValue = (e) => {
        setCohortValue({});
        setCurrentLevelYearValue(0);
        setActivityValue('');
        setMajorValue(JSON.parse(e.target.value || '{}'));
    };

    const handleCohortValue = (e) => {
        setCurrentLevelYearValue(0);
        setActivityValue('');
        setCohortValue(JSON.parse(e.target.value || '{}'));
    };

    const handleCurrentLevelYear = (e) => {
        setActivityValue('');
        setCurrentLevelYearValue(Number.parseInt(e.target.value));
    };

    const handleActivityValue = (e) => {
        setActivityValue(e.target.value);
    };

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
        if (faculty.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    useEffect(() => {
        if (faculty?.facultyData.length > 0 && auth?.user?.faculty) {
            setMajorsValue(
                faculty?.facultyData.find((facultyItem) => facultyItem.facultyName === auth?.user?.faculty).majors
            );
        }
    }, [faculty?.facultyData]);

    useEffect(() => {
        if (majorValue?.majorName && cohortValue?.cohortName && currentLevelYearValue > 0) {
            dispatch(
                getActivities({
                    pageStudentCohort: cohortValue.cohortName,
                    pageStudentLevelYear: currentLevelYearValue,
                    pageStudentMajor: majorValue.majorName
                })
            );
        } else {
            dispatch({
                type: GLOBALTYPES.ACTIVITIES.RESET_ACTIVITIES
            });
        }

        if (majorValue?.majorName && cohortValue?.cohortName && currentLevelYearValue > 0 && activityValue) {
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
        activityValue
    ]);

    return (
        <>
            {auth?.user && (
                <div className="container__tables">
                    <div className="body__tables">
                        <div className="filter_activity_wrapper heading__text_lg">
                            <div className="filter_activity">
                                <select onInput={handleMajorValue}>
                                    <option value="">Chọn Chuyên Ngành</option>
                                    {majorsValue.map((major, index) => (
                                        <option key={index} value={JSON.stringify(major)}>
                                            {capitalizeFirstLetter(major.majorName)}
                                        </option>
                                    ))}
                                </select>

                                <select onInput={handleCohortValue} value={JSON.stringify(cohortValue)}>
                                    <option value="">Chọn khóa</option>
                                    {majorValue?.cohortList &&
                                        majorValue?.cohortList.length > 0 &&
                                        majorValue?.cohortList.map((cohort, index) => (
                                            <option key={index} value={JSON.stringify(cohort)}>
                                                {`Khóa ${cohort.cohortName}`}
                                            </option>
                                        ))}
                                </select>

                                <select onInput={handleCurrentLevelYear} value={currentLevelYearValue}>
                                    <option value={0}>Chọn Năm</option>
                                    {cohortValue?.currentLevelYear &&
                                        new Array(cohortValue?.currentLevelYear).fill(0).map((_, index) => (
                                            <option key={index} value={cohortValue?.currentLevelYear - index}>
                                                {`Năm ${cohortValue?.currentLevelYear - index} ${index === 0 ? '(Hiện tại)' : '(Đã kết thúc)'}`}
                                            </option>
                                        ))}
                                </select>
                                <select value={activityValue} onInput={handleActivityValue}>
                                    <option value="">Chọn Hoạt Động</option>
                                    {currentLevelYearValue &&
                                        activity.length > 0 &&
                                        activity.map((activity, index) => (
                                            <option key={index} value={activity}>
                                                {capitalizeFirstLetter(activity)}
                                            </option>
                                        ))}
                                </select>
                            </div>
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
