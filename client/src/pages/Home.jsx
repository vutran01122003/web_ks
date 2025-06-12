import { Fragment, useEffect, useState } from 'react';
import LayoutInfo from '../components/Home/LayoutInfo';
import LayoutChart from '../components/Home/LayoutChart';
import { useDispatch, useSelector } from 'react-redux';
import GoalsInfo from '../components/Goal/GoalsInfo';
import { getProgressByYear } from '../redux/actions/progressAction';
import Quantity from '../components/Notification/Quantity';
import { deadlineSelector, progressSelector } from '../redux/selector';
import { GoArrowRight } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { toFullName } from '../utils/handleString';
import { formatTimeStr } from '../utils/formatDatetime';

const { VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE } = import.meta.env;

const Home = ({ auth }) => {
    const user = auth?.user;
    const { deadlineList } = useSelector(deadlineSelector);
    const dispatch = useDispatch();
    const progress = useSelector(progressSelector);
    const [chartData, setChartData] = useState([]);
    const [goalsInfo, setGoalInfo] = useState([]);
    const currentLevelYear = user?.levelYear;
    const [levelYear, setLevelYear] = useState(currentLevelYear || 1);
    const [deadline, setDeadline] = useState('');
    const groupCodeList = user.groups.map((group) => group.groupCode);
    const condition =
        groupCodeList.includes(VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE) ||
        groupCodeList.includes(VITE_APP_TALENT_ENGINEER_CODE);

    const handleGetProgressByYear = () => {
        if (user && condition && !progress.goalsInfoData[levelYear]) {
            dispatch(
                getProgressByYear({
                    userId: user._id,
                    studentMajor: auth.user?.major.majorName,
                    studentCohort: auth.user?.cohort.cohortName,
                    studentLevelYear: levelYear
                })
            );
        }
    };

    useEffect(() => {
        handleGetProgressByYear();
        if (deadlineList.length > 0) setDeadline(deadlineList[levelYear - 1]);
    }, [user, levelYear, deadlineList]);

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

    return condition ? (
        <div className="pageHome ">
            <div className="information__welcome">
                <div className="wecome__name">
                    <span>
                        {`Xin chào,
                    ${toFullName({
                        lastName: user?.lastName,
                        firstName: user?.firstName
                    })}!`}
                    </span>
                </div>
                <div className="bio__user">
                    {user.isActive
                        ? !deadline.startDate || !deadline.endDate
                            ? 'Thời hạn nộp minh chứng chưa công bố'
                            : `Thời hạn nộp minh chứng: ${formatTimeStr(deadline.startDate)} đến ${formatTimeStr(deadline.endDate)}`
                        : 'Bạn đã không đạt yêu cầu để trở thành kỹ sư tài năng.'}
                </div>
            </div>

            {groupCodeList.includes(VITE_APP_TALENT_ENGINEER_CODE) && auth.user?.annualActivitiesProgress && (
                <Quantity annualActivitiesProgress={auth.user.annualActivitiesProgress[levelYear - 1]} />
            )}

            {groupCodeList.includes(VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE) &&
                auth.user?.annualTemporaryActivitiesProgress && (
                    <Quantity annualActivitiesProgress={auth.user.annualTemporaryActivitiesProgress[levelYear - 1]} />
                )}

            <div className="container__top transform__animation--top">
                <LayoutInfo user={user} />
                <Fragment>
                    {condition && <LayoutChart chartData={chartData} auth={auth} setLevelYear={setLevelYear} />}
                </Fragment>
            </div>

            <div>{condition && <GoalsInfo levelYear={levelYear} goalsInfo={goalsInfo} />}</div>
        </div>
    ) : null;
};

export default Home;
