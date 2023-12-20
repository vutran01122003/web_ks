import React, { useEffect, useState } from 'react'
import LayoutInfo from '../components/ComponentHome/LayoutInfo'
import LayoutChart from '../components/ComponentHome/LayoutChart'
import ApplyComponent from '../components/ComponentHome/ApplyComponent'
import { useDispatch, useSelector } from 'react-redux'
import GoalsInfo from '../components/ComponentGoalsInfo/GoalsInfo'
import { getProgressByYear } from '../redux/actions/progressAction'
import Quantity from '../components/ComponentQuantity/Quantity'

// import React, { useCallback, useEffect, useRef, useState } from 'react'
// import ComponentPeddingRows from '../components/ComponentPeddingRows/ComponentPeddingRows'
// import { rowSelector } from '../redux/selector'
// import { getPeddingRows } from '../redux/actions/rowAction'
// import CircularProgress from '@mui/material/CircularProgress';
// import TestPedding from '../components/ComponentPeddingRows/TestPedding'

const Home = ({ auth }) => {
    // const row = useSelector(rowSelector)
    // const observer = useRef();
    // const [nextPage, setNextPage] = useState(1);

    const dispatch = useDispatch();
    const progress = useSelector((state) => state.progress);
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

    // useEffect(() => {
    //     if (auth?.user && auth?.user.roles.includes("0004")) {
    //         dispatch(getPeddingRows(
    //             {
    //                 page: nextPage,
    //                 currentPeddingRows: row.currentPeddingRows,
    //                 limit: 3
    //             }
    //         ))
    //     }
    // }, [nextPage, auth?.user]);

    // const lastPostElementRef = useCallback(
    //     (elem) => {
    //         if (row.loading) return;
    //         if (observer.current) observer.current.disconnect();
    //         observer.current = new IntersectionObserver((entries) => {
    //             if (entries[0].isIntersecting && !row.maxPage) {
    //                 console.log('last elem')
    //                 setNextPage((prev) => prev + 1);
    //             }
    //         });
    //         if (elem) observer.current.observe(elem);
    //     },
    //     [row.loading]
    // );

    // <div className="container__center transform__animation--top">
    //     {auth?.user.roles.includes('0004') && row?.peddingRows.length > 0 && (
    //         <>
    //             {row?.peddingRows.map((penddingRows, index) => {
    //                 if (index === row?.peddingRows.length - 1 && row?.peddingRows.length != 0) {
    //                     return (
    //                         <div
    //                             ref={lastPostElementRef}
    //                             key={penddingRows?.table + index}
    //                         >
    //                             <TestPedding
    //                                 penddingRows={penddingRows}
    //                             />
    //                         </div>
    //                     )
    //                 }

    //                 return (
    //                     <div key={penddingRows?.table + index}>
    //                         <TestPedding penddingRows={penddingRows}/>
    //                     </div>
    //                 )
    //             })}

    //             {
    //                 row?.loading &&
    //                 <div className='loading_rows_pendding'>
    //                     <CircularProgress />
    //                 </div>
    //             }
    //         </>
    //     )}
    // </div> 

    return (
        <div className="pageHome ">
            <Quantity/>
            <div className="container__top transform__animation--top">
                <LayoutInfo auth={auth} />
                <>
                    {
                        (auth?.user.roles.includes('0001') && auth?.user.roles.length === 1) ||
                        auth?.user.roles.length === 0 && <ApplyComponent />
                    }
                    {
                        auth?.user.roles.includes('0002') && chartData.length > 0 &&
                        <LayoutChart>{chartData}</LayoutChart>
                    }
                </>
            </div>

            <div>
                {
                    auth?.user.roles.includes('0002') && goalsInfo.length > 0 &&
                    <GoalsInfo goalsInfo={goalsInfo} />
                }
            </div>
        </div>
    )
}

export default Home
