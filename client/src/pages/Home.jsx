import { useEffect, useState } from 'react';
import LayoutInfo from '../components/ComponentHome/LayoutInfo';
import LayoutChart from '../components/ComponentHome/LayoutChart';
import { useDispatch, useSelector } from 'react-redux';
import GoalsInfo from '../components/ComponentGoalsInfo/GoalsInfo';
import { getProgressByYear } from '../redux/actions/progressAction';
import Quantity from '../components/ComponentQuantity/Quantity';
import { progressSelector } from '../redux/selector';
import { GoArrowRight } from 'react-icons/go';
import { Link } from 'react-router-dom';

const Home = ({ auth }) => {
    const { VITE_APP_TALENTED_ENGINEER_CODE } = import.meta.env;

    const dispatch = useDispatch();
    const progress = useSelector(progressSelector);
    const [chartData, setChartData] = useState([]);
    const [goalsInfo, setGoalInfo] = useState([]);
    const [levelYear, setLevelYear] = useState(auth?.user?.levelYear || 1);
    const groupCode = auth?.user.group.groupCode;

    const handleGetProgressByYear = () => {
        if (
            auth?.user &&
            groupCode === VITE_APP_TALENTED_ENGINEER_CODE &&
            !progress.goalsInfoData[levelYear]
        ) {
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
                    return {
                        caterogy: elemProgress.pageName,
                        value: elemProgress.percent,
                        quantityDemanded: elemProgress.quantityDemanded
                    };
                })
            );
        }
    }, [progress.goalsInfoData, levelYear]);

    return (
        <div className="pageHome ">
            <div className="information__welcome">
                <div className="wecome__name">
                    <span>Xin chào, {auth?.user?.fullName} !</span>
                    <div className="to__profile">
                        <Link to="/profile">
                            <GoArrowRight />
                        </Link>
                    </div>
                </div>
                <div className="bio__user">
                    &quot;Hãy thường xuyên kiểm tra tình trạng xét duyệt của các
                    hoạt động để kịp thời xử lý&quot;
                </div>
            </div>

            {auth?.user.group.groupCode === VITE_APP_TALENTED_ENGINEER_CODE && (
                <Quantity
                    annualTaskProgress={auth.user.annualTaskProgress[levelYear]}
                />
            )}

            <div className="container__top transform__animation--top">
                <LayoutInfo user={auth?.user} />
                <>
                    {groupCode === VITE_APP_TALENTED_ENGINEER_CODE && (
                        <LayoutChart
                            chartData={chartData}
                            auth={auth}
                            setLevelYear={setLevelYear}
                        />
                    )}
                </>
            </div>

            <div>
                {groupCode === VITE_APP_TALENTED_ENGINEER_CODE && (
                    <GoalsInfo levelYear={levelYear} goalsInfo={goalsInfo} />
                )}
            </div>
        </div>
    );
};

export default Home;
