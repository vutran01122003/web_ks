import { useEffect, useState } from 'react';
import LayoutInfo from '../components/Home/LayoutInfo';
import LayoutChart from '../components/Home/LayoutChart';
import { useDispatch, useSelector } from 'react-redux';
import GoalsInfo from '../components/Goal/GoalsInfo';
import { getProgressByYear } from '../redux/actions/progressAction';
import Quantity from '../components/Notification/Quantity';
import { progressSelector } from '../redux/selector';
import { GoArrowRight } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { toFullName } from '../utils/handleString';

const Home = ({ auth }) => {
    const { VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE } = import.meta.env;

    const dispatch = useDispatch();
    const progress = useSelector(progressSelector);
    const [chartData, setChartData] = useState([]);
    const [goalsInfo, setGoalInfo] = useState([]);
    const [levelYear, setLevelYear] = useState(auth?.user?.levelYear || 1);
    const groupCode = auth?.user.group.groupCode;

    const handleGetProgressByYear = () => {
        if (
            auth?.user &&
            [VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE, VITE_APP_TALENT_ENGINEER_CODE].includes(groupCode) &&
            !progress.goalsInfoData[levelYear]
        ) {
            dispatch(
                getProgressByYear({
                    userId: auth?.user._id,
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

    return [VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE].includes(groupCode) ? (
        <div className="pageHome ">
            <div className="information__welcome">
                <div className="wecome__name">
                    <span>
                        {`Xin chào,
                    ${toFullName({
                        lastName: auth?.user?.lastName,
                        firstName: auth?.user?.firstName
                    })}!`}
                    </span>
                    <div className="to__profile">
                        <Link to="/profile">
                            <GoArrowRight />
                        </Link>
                    </div>
                </div>
                <div className="bio__user">
                    &quot;Hãy thường xuyên kiểm tra tình trạng xét duyệt của các hoạt động để kịp thời xử lý&quot;
                </div>
            </div>

            {VITE_APP_TALENT_ENGINEER_CODE === groupCode && auth.user?.annualActivitiesProgress && (
                <Quantity annualActivitiesProgress={auth.user.annualActivitiesProgress[levelYear - 1]} />
            )}

            {VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE === groupCode && auth.user?.annualTemporaryActivitiesProgress && (
                <Quantity annualActivitiesProgress={auth.user.annualTemporaryActivitiesProgress[levelYear - 1]} />
            )}

            <div className="container__top transform__animation--top">
                <LayoutInfo user={auth?.user} />
                <>
                    {[VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE, VITE_APP_TALENT_ENGINEER_CODE].includes(groupCode) && (
                        <LayoutChart chartData={chartData} auth={auth} setLevelYear={setLevelYear} />
                    )}
                </>
            </div>

            <div>
                {[VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE, VITE_APP_TALENT_ENGINEER_CODE].includes(groupCode) && (
                    <GoalsInfo levelYear={levelYear} goalsInfo={goalsInfo} />
                )}
            </div>
        </div>
    ) : null;
};

export default Home;
