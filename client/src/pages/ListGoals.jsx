import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, rowSelector } from '../redux/selector';
import { getDynamicRows } from '../redux/actions/rowAction';
import { ReloadOutlined } from "@ant-design/icons";
import ComponentDynamicRows from '../components/ComponentDynamicRows/ComponentDynamicRows';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Select, Tabs} from 'antd';
import { Input } from 'antd';
const { Search } = Input;

const ListGoals = () => {
    const auth = useSelector(authSelector);
    const row = useSelector(rowSelector);
    const observer = useRef();
    const dispatch = useDispatch();
    const [nextPage, setNextPage] = useState({
        pendingRows: 1,
        acceptedRows: 1,
        rejectedRows: 1
    });

    const [tab, setTab] = useState('pendingRows');
    const [refreshRows, setRefreshRows] = useState(false);
    const limit = 3;

    useEffect(() => {
        if (auth?.user && auth?.user.roles.includes("0004") && nextPage[tab] > row[tab]?.page) {
            dispatch(getDynamicRows(
                {   
                    tab,
                    page: nextPage[tab],
                    currentRows: row[tab]?.currentRows,
                    limit
                }
            ))
        }
    }, [nextPage[tab], auth?.user, tab]);
    
    const handleChangeTabValue = (tabValue) => {
        setTab(tabValue);
    }

    const lastPostElementRef = useCallback(
        (elem) => {
            if (row.loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting && nextPage[tab] === 1 && row.pendingRows.data.length === limit) {
                    setNextPage((prev) => ({...prev, tab: prev.tab + 1}));
                } 
                
                if (entries[0].isIntersecting && nextPage[tab] > 1 && !row.pendingRows.maxPage) {
                    setNextPage((prev) => ({...prev, tab: prev.tab + 1}));
                }
            });
            if (elem) observer.current.observe(elem);
        },
        [row.loading]
    );

    const ComponentSortTab1 = () => {
        return (
            <div className="line__sort">
                <div className='box__left'>
                    <Select
                        labelInValue
                        defaultValue={{
                            value: '',
                            label: 'Chọn Chuyên Ngành',
                        }}
                        style={{
                            width: '20%',
                        }}
                        options={[
                            {
                                value: '',
                                label: 'Chọn Chuyên Ngành',
                            },
                            {
                                value: 'Kỹ Thuật Phần Mềm',
                                label: 'Kỹ Thuật Phần Mềm',
                            },
                            {
                                value: 'Khoa Học Máy Tính',
                                label: 'Khoa Học Máy Tính',
                            },
                        ]}
                    />
                    
                    <Search
                        placeholder="Mã sinh viên"
                        allowClear
                        style={{
                            width: 220,
                        }}
                    />
                </div>
                <div className='box__right'>
                    <Button type="primary" icon={<ReloadOutlined />} className="btn__download">
                        Làm Mới
                    </Button>
                </div>

            </div>
        )
    }

    const RenderListGoas = () => {
        return (
            <>
                <ComponentSortTab1 />
               	<div className="container__center">
                    {auth?.user.roles.includes('0004') && row[tab].data.length > 0 && (
                        <>
                            {row[tab].data.map((dynamicRows, index) => {
                                if(index === row[tab].data.length - 1 && row[tab].data.length != 0) {
                                    return (
                                        <div ref={lastPostElementRef} key={dynamicRows?.table + index} >
                                            <ComponentDynamicRows rowsType={tab} dynamicRows={dynamicRows} />
                                        </div>
                                    )
                                }
                                
                                return (
                                    <div key={dynamicRows?.table + index} >
                                        <ComponentDynamicRows dynamicRows={dynamicRows} />
                                    </div>
                                )
                            })}

                            {
                                row?.loading && 
                                <div className='loading_rows_pendding'>
                                    <CircularProgress />
                                </div>
                            }
                        </>
                    )}
			    </div>
            </>
        )
    };

    const items = [
        {
            key: 'pendingRows',
            label: 'Chỉ Tiêu Chưa Duyệt',
            children: <RenderListGoas />,
        },
        {
            key: 'acceptedRows',
            label: 'Chỉ Tiêu Đã Duyệt',
            children: <RenderListGoas />
        },
        {
            key: 'rejectedRows',
            label: 'Chỉ Tiêu Đã Từ Chối',
            children: <RenderListGoas />
        },
    ];

    return ( 
        <>
            {
                auth?.user && 
                <div className="container__tables">
                    <div className="body__tables transform__animation--top">
                        <Tabs
                            onChange={handleChangeTabValue}
                            defaultActiveKey="1"
                            items={items}
                            className='tab__tables--goal'
                        />
                    </div>
                </div>
            }
        </>
    )
}

export default ListGoals