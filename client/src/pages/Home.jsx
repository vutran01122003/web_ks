import React, { useEffect, useState } from 'react';
import LayoutInfo from '../components/ComponentHome/LayoutInfo';
import LayoutChart from '../components/ComponentHome/LayoutChart';
import ApplyComponent from '../components/ComponentHome/ApplyComponent';
import { useDispatch, useSelector } from 'react-redux';
import GoalsInfo from '../components/ComponentGoalsInfo/GoalsInfo';
import { getProgressByYear } from '../redux/actions/progressAction';
import Quantity from '../components/ComponentQuantity/Quantity';
import { progressSelector } from '../redux/selector';
import { RiErrorWarningLine } from "react-icons/ri";
import { TbCheckupList } from "react-icons/tb";
import { GoArrowRight } from "react-icons/go";
import { Link } from 'react-router-dom';

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
            <div className="noti__wn">
                <RiErrorWarningLine />
                Website đang trong quá trình phát triển nên có thể phát sinh lỗi ! (v3.18)
            </div>
            <div className="information__wecome">
                <div className="wecome__name">
                    <span>Xin chào, {auth?.user?.fullName} !</span>
                    <div className="to__profile">
                        <Link to="/profile">
                            <GoArrowRight />
                        </Link>
                    </div>
                </div>
                <div className="bio__user"> "Khi gặp khó khăn đừng chỉ ngồi than thở mà hãy tìm cách giải quyết"</div>
            </div>
            {determineAuth ? <Quantity /> : ''}

            <div className='container__top transform__animation--top'>
                {/* <LayoutInfo auth={auth} /> */}
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
            <div className="container__table--home">
                <div>
                    <div className="heading_text_table">
                        <TbCheckupList />
                        Danh Sách Chưa Nộp Minh Chứng (0002)
                    </div>
                </div>
                <div className='table__body'>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Họ Tên</th>
                                <th>MSSV</th>
                                <th>Minh chứng</th>
                                <th>Thời gian còn lại</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1.</td>
                                <td>Nguyễn Văn Phong</td>
                                <td>21002815</td>
                                <td>...</td>
                                <td>8 Hours</td>
                            </tr>
                            <tr>
                                <td>2.</td>
                                <td>Nguyễn Chí Linh</td>
                                <td>21001235</td>
                                <td>...</td>
                                <td>19 Hours</td>
                            </tr>
                            <tr>
                                <td>3.</td>
                                <td>Phan Đình Diệm</td>
                                <td>21001222</td>
                                <td>...</td>
                                <td>1 Hours</td>
                            </tr>
                            <tr>
                                <td>4.</td>
                                <td>Phan Đình Đăng</td>
                                <td>21001222</td>
                                <td>...</td>
                                <td>1 Hours</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;
