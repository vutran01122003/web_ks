import React, { useEffect, useState } from 'react'
import LayoutInfo from '../components/ComponentHome/LayoutInfo'
import LayoutChart from '../components/ComponentHome/LayoutChart'
import ApplyComponent from '../components/ComponentHome/ApplyComponent'
import { useDispatch, useSelector } from 'react-redux'
import GoalsInfo from '../components/ComponentGoalsInfo/GoalsInfo'
import { getProgressByYear } from '../redux/actions/progressAction'
import Quantity from '../components/ComponentQuantity/Quantity'

const Home = ({ auth }) => {
    const dispatch = useDispatch();
    const progress = useSelector((state) => state.progress);
    const [chartData, setChartData] = useState([]);
    const [goalsInfo, setGoalInfo] = useState([]);
    
    const determineAuth = auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003');

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

    return (
        <div className="pageHome ">
            {determineAuth ? <Quantity/> : ""}
            
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
