import React, { useCallback, useEffect, useRef, useState } from 'react'
import LayoutInfo from '../components/ComponentHome/LayoutInfo'
import LayoutChart from '../components/ComponentHome/LayoutChart'
import ApplyComponent from '../components/ComponentHome/ApplyComponent'
import ComponentPeddingRows from '../components/ComponentPeddingRows/ComponentPeddingRows'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, rowSelector } from '../redux/selector'
import { getPeddingRows } from '../redux/actions/rowAction'
import CircularProgress from '@mui/material/CircularProgress';
import GoalsInfo from '../components/ComponentGoalsInfo/GoalsInfo'
import { getProgressByYear } from '../redux/actions/progressAction'
import TestPedding from '../components/ComponentPeddingRows/TestPedding'
import { Space, Table, Tag } from 'antd'

const ListGoals = () => {
    const auth = useSelector(authSelector);
    const row = useSelector(rowSelector);
    const observer = useRef();
    const dispatch = useDispatch();
    const progress = useSelector((state) => state.progress);
    const [nextPage, setNextPage] = useState(1);
    const [chartData, setChartData] = useState([]);
    const [goalsInfo, setGoalInfo] = useState([]);

    useEffect(() => {
        if (auth?.user && auth?.user.roles.includes("0002")) {
            dispatch(getProgressByYear({
                studentMajor: auth.user?.major,
                studentCohort: auth.user?.cohort,
                studentLevelYear: auth.user?.levelYear || 1
            }))
        }
    }, [auth?.user]);

    useEffect(() => {
        if (progress.goalsInfoData.length > 0) {
            setGoalInfo(progress.goalsInfoData);
            setChartData(progress.goalsInfoData.map((elemProgress) => {
                return { caterogy: elemProgress.pageName, value: elemProgress.percent }
            }));
        }
    }, [progress.goalsInfoData]);

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


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'studentId',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            
        },
        {
            title: 'Action',
            key: 'action',
        },
    ];



    console.log(row?.peddingRows)

    return (
        <>
            <div className="container__tables transform__animation--top">
                {auth?.user.roles.includes('0004') && row?.peddingRows.length > 0 && (
                    <>
                        {row?.peddingRows.map((penddingRows, index) => {
                            if (index === row?.peddingRows.length - 1 && row?.peddingRows.length != 0) {
                                return (
                                    <div
                                        ref={lastPostElementRef}
                                        key={penddingRows?.table + index}
                                    >
                                        <TestPedding
                                            penddingRows={penddingRows}
                                        />
                                    </div>
                                )
                            }

                            return (
                                <div key={penddingRows?.table + index}>
                                    <TestPedding penddingRows={penddingRows} />
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
}

export default ListGoals