import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, rowSelector } from '../redux/selector';
import { getPeddingRows } from '../redux/actions/rowAction';
import { MdDownload } from "react-icons/md";
import ComponentPeddingRows from '../components/ComponentPeddingRows/ComponentPeddingRows';
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
            dispatch(getPeddingRows(
                {
                    page: nextPage,
                    currentPeddingRows: row.currentPeddingRows,
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
                if (entries[0].isIntersecting && !row.maxPage) {
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
                            value: 'all',
                            label: 'TẤT CẢ',
                        }}
                        style={{
                            width: 120,
                        }}
                        options={[
                            {
                                value: 'all',
                                label: 'TẤT CẢ',
                            },
                            {
                                value: 'Nnew',
                                label: 'MỚI NHẤT',
                            },
                        ]}
                    />
                    <Search
                        placeholder="Name, Student id"
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
                {
                    auth?.user && 
                    <>  
                        <ComponentSortTab1 />
                        <div className="mg__content">
                            <div className="container__center">
                                {auth?.user.roles.includes('0004') && row?.peddingRows.length > 0 && (
                                    <>
                                        {row?.peddingRows.map((penddingRows, index) => {
                                            if(index === row?.peddingRows.length - 1 && row?.peddingRows.length != 0) {
                                                return (
                                                    <div 
                                                        ref={lastPostElementRef}
                                                        key={penddingRows?.table + index}     
                                                    >
                                                        <ComponentPeddingRows 
                                                            penddingRows={penddingRows} 
                                                        />
                                                    </div>
                                                )
                                            }
                                            
                                            return (
                                                <div key={penddingRows?.table + index}>
                                                    <ComponentPeddingRows className="last" penddingRows={penddingRows} />
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
                        </div>
                    </>
                }
            </>
        )
    };


    const items = [
        {
            key: '1',
            label: 'CHỈ TIÊU CHƯA DUYỆT (' + row?.peddingRows.length + ")",
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