import React, { useEffect, useState } from 'react';
import LayoutInfo from '../components/ComponentHome/LayoutInfo';
import LayoutChart from '../components/ComponentHome/LayoutChart';
import ApplyComponent from '../components/ComponentHome/ApplyComponent';
import { useDispatch, useSelector } from 'react-redux';
import GoalsInfo from '../components/ComponentGoalsInfo/GoalsInfo';
import { getProgressByYear } from '../redux/actions/progressAction';
import Quantity from '../components/ComponentQuantity/Quantity';
import { progressSelector } from '../redux/selector';

const Home = ({ auth }) => {
    const dispatch = useDispatch();
    const progress = useSelector(progressSelector);
    const [chartData, setChartData] = useState([]);
    const [goalsInfo, setGoalInfo] = useState([]);
    const [levelYear, setLevelYear] = useState(auth.user?.levelYear || 1);
    const determineAuth = auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003');

    const handleGetProgressByYear = () => {
        if (auth?.user && auth?.user.roles.includes('0002') && !progress.goalsInfoData[levelYear]) {
            dispatch(
                getProgressByYear({
                    studentMajor: auth.user?.major,
                    studentCohort: auth.user?.cohort,
                    studentLevelYear: levelYear
                })
            );
        }
    };

    useEffect(() => {
        handleGetProgressByYear();
    }, [auth?.user, levelYear]);

    useEffect(() => {
        if (progress.goalsInfoData[levelYear]) {
            setGoalInfo(progress.goalsInfoData[levelYear]);
            setChartData(
                progress.goalsInfoData[levelYear].map((elemProgress) => {
                    return { caterogy: elemProgress.pageName, value: elemProgress.percent };
                })
            );
        }
    }, [progress.goalsInfoData, levelYear]);

    return (
        <div className='pageHome '>
            {determineAuth ? <Quantity /> : ''}

            <div className='container__top transform__animation--top'>
                <LayoutInfo auth={auth} />
                <>
                    {(auth?.user.roles.includes('0001') && auth?.user.roles.length === 1) ||
                        (auth?.user.roles.length === 0 && <ApplyComponent />)}
                    {auth?.user.roles.includes('0002') && (
                        <LayoutChart
                            chartData={chartData}
                            auth={auth}
                            setLevelYear={setLevelYear}
                        />
                    )}
                </>
            </div>

            <div>
                {auth?.user.roles.includes('0002') && (
                    <GoalsInfo levelYear={levelYear} goalsInfo={goalsInfo} />
                )}
            </div>
        </div>
    );
};

export default Home;
