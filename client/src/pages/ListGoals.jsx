import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, rowSelector } from '../redux/selector';
import { getPendingRows } from '../redux/actions/rowAction';
import { MdDownload } from "react-icons/md";
import ComponentPendingRows from '../components/ComponentPendingRows/ComponentPendingRows';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Select, Tabs} from 'antd';
import { Input } from 'antd';
const { Search } = Input;

const ListGoals = () => {
    const auth = useSelector(authSelector);
    const row = useSelector(rowSelector);
    const observer = useRef();
    const dispatch = useDispatch();
    const [nextPage, setNextPage] = useState(1);
    
    useEffect(() => {
        if (auth?.user && auth?.user.roles.includes("0004")) {
            dispatch(getPendingRows(
                {
                    page: nextPage,
                    currentPendingRows: row.currentPendingRows,
                    limit: 3
                }
            ))
        }
    }, [nextPage, auth?.user]);

    const lastPostElementRef = useCallback(
        (elem) => {
            if (row.loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting && nextPage === 1 && row.pendingRows.length === 3) {
                    setNextPage((prev) => prev + 1);
                } 
                
                if (entries[0].isIntersecting && nextPage > 1 && !row.maxPage) {
                    setNextPage((prev) => prev + 1);
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
                    <Button type="primary" icon={<MdDownload />} className="btn__download">
                        Download
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
                    {auth?.user.roles.includes('0004') && row?.pendingRows.length > 0 && (
                        <>
                            {row?.pendingRows.map((pendingRows, index) => {
                                if(index === row?.pendingRows.length - 1 && row?.pendingRows.length != 0) {
                                    return (
                                        <div ref={lastPostElementRef} key={pendingRows?.table + index} >
                                            <ComponentPendingRows pendingRows={pendingRows} />
                                        </div>
                                    )
                                }
                                
                                return (
                                    <div key={pendingRows?.table + index} >
                                        <ComponentPendingRows pendingRows={pendingRows} />
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
            key: '1',
            label: 'CHỈ TIÊU CHƯA DUYỆT (' + row?.pendingRows.length + ")",
            children: <RenderListGoas />,
        },
        {
            key: '2',
            label: 'CHỈ TIÊU ĐÃ DUYỆT (0)',
            children: 'Content of Tab Pane 2',
        },
    ];

    return ( 
        <>
            {
                auth?.user && 
                <div className="container__tables">
                    <div className="body__tables transform__animation--top">
                        <Tabs
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