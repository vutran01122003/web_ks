import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, rowSelector } from '../redux/selector'
import { getPeddingRows } from '../redux/actions/rowAction'
import { MdDownload } from "react-icons/md";
import TestPedding from '../components/ComponentPeddingRows/TestPedding'
import { Button, Select, Tabs} from 'antd'
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
                    console.log('last elem')
                    setNextPage((prev) => prev + 1);
                }
            });
            if (elem) observer.current.observe(elem);
        },
        [row.loading]
    );
    console.log(row?.peddingRows)

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
                <ComponentSortTab1 />
                <div className="mg__content">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>HỌ TÊN</th>
                                <th>MÃ SINH VIÊN</th>
                                <th>SỐ FILE MINH CHỨNG</th>
                                <th>NGÀY NỘP</th>
                                <th>TRẠNG THÁI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auth?.user.roles.includes('0004') && row?.peddingRows.length > 0 && (
                                <>
                                    {row?.peddingRows.map((penddingRows, index) => {
                                        if (index === row?.peddingRows.length - 1 && row?.peddingRows.length != 0) {
                                            return (
                                                <TestPedding
                                                    ref={lastPostElementRef}
                                                    key={penddingRows?.table + index}
                                                    penddingRows={penddingRows}
                                                    index={index + 1}
                                                />
                                            )
                                        }

                                        return (
                                            <TestPedding
                                                key={penddingRows?.table + index}
                                                penddingRows={penddingRows}
                                                index={index + 1}
                                            />
                                        )
                                    })}

                                    {
                                        row?.loading &&
                                        <div className='loading_rows_pendding'>
                                            loading...
                                        </div>
                                    }
                                </>
                            )}

                        </tbody>
                    </table>

                </div>
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
            <div className="container__tables">
                <div className="body__tables transform__animation--top">
                    <Tabs
                        defaultActiveKey="1"
                        items={items}
                        className='tab__tables--goal'
                    />
                </div>
            </div>

        </>
    )
}

export default ListGoals