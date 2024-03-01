import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Select, Tabs, Input } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, facultySelector, rowSelector } from '../redux/selector';
import { getDynamicRows } from '../redux/actions/rowAction';
import ComponentDynamicRows from '../components/ComponentDynamicRows/ComponentDynamicRows';
import CircularProgress from '@mui/material/CircularProgress';
import GLOBALTYPES from '../redux/actions/globalTypes';
import no_search_result from '../assets/images/no_search_result.png';
import { getAllFaculties } from '../redux/actions/facultyAction';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';

const ActivityApprovalUi = () => {
    const auth = useSelector(authSelector);
    const row = useSelector(rowSelector);
    const faculty = useSelector(facultySelector);
    const observer = useRef();
    const dispatch = useDispatch();
    const [refreshTabTrigger, setRefreshTabTrigger] = useState(false);
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
    const limit = 10;

    useEffect(() => {
        if (auth?.user && auth?.user.roles.includes('0004')) {
            dispatch(
                getDynamicRows({
                    tab,
                    userData,
                    page: nextPage[tab],
                    currentRows: row[tab]?.currentRows,
                    limit
                })
            );
        }
    }, [nextPage[tab], auth?.user, tab, refreshTabTrigger]);

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

    const handleSearchByStudentMajor = (major) => {
        setUserData((prev) => ({ ...prev, major: major.value }));
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

    return (
        <>
            {auth?.user && (
                <div className='container__tables'>
                    <div className='body__tables'>
                        <div className='heading__text_lg'>Danh Sách Xét Duyệt Hoạt Động</div>
                        <Tabs
                            onChange={handleChangeTabValue}
                            defaultActiveKey='1'
                            items={items}
                            className='tab__tables--goal'
                        />
                        <div className='line__sort'>
                            <div className='box__left'>
                                <Select
                                    labelInValue
                                    onChange={handleSearchByStudentMajor}
                                    defaultValue={{
                                        value: '',
                                        label: 'Chọn Chuyên Ngành'
                                    }}
                                    style={{
                                        width: '20%'
                                    }}
                                    options={[
                                        {
                                            value: '',
                                            label: 'Chọn Chuyên Ngành'
                                        },
                                        ...(faculty?.facultyData
                                            .find((facultyItem) => facultyItem.facultyName === auth?.user.faculty)
                                            ?.majors.map((major) => ({
                                                value: capitalizeFirstLetter(major.majorName),
                                                label: capitalizeFirstLetter(major.majorName)
                                            })) || [])
                                    ]}
                                />

                                <Input
                                    placeholder='Mã sinh viên'
                                    onChange={handleRelativeSearchByStudentId}
                                    value={userData.userId}
                                    style={{
                                        width: 220
                                    }}
                                />

                                <Button
                                    onClick={handleRelativeSearch}
                                    type='primary'
                                    style={{
                                        fontWeight: 600
                                    }}
                                >
                                    Tìm Kiếm
                                </Button>
                            </div>

                            <div className='box__right'>
                                <Button
                                    type='primary'
                                    icon={<ReloadOutlined />}
                                    className='btn__refresh'
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
                        <div className='container__center'>
                            <>
                                {row[tab].data.map((dynamicRows, index) => {
                                    if (index === row[tab].data.length - 1 && row[tab].data.length != 0) {
                                        return (
                                            <div
                                                ref={lastPostElementRef}
                                                className='last'
                                                key={dynamicRows?.table + index}
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
                                        <div key={dynamicRows?.table + index}>
                                            <ComponentDynamicRows
                                                index={index}
                                                rowsType={tab}
                                                dynamicRows={dynamicRows}
                                            />
                                        </div>
                                    );
                                })}

                                {row?.loading && (
                                    <div className='loading_rows_pendding'>
                                        <CircularProgress />
                                    </div>
                                )}
                            </>

                            {!row.loading && row[tab].data.length == 0 && (
                                <div className='no_search_result_img_wrapper'>
                                    <img
                                        className='no_search_result_img'
                                        src={no_search_result}
                                        alt='nothing'
                                        draggable='false'
                                    />
                                    <span className='notify_nothing_content'>
                                        KHÔNG CÓ HOẠT ĐỘNG (LÀM MỚI ĐỂ KIỂM TRA LẠI)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActivityApprovalUi;
