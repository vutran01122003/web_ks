import { useEffect, useRef, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { LuTimerReset } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { FaSortNumericDown, FaSortNumericDownAlt } from 'react-icons/fa';
import { getAnnualTaskProgress } from '../redux/actions/progressAction';

import { authSelector, facultySelector, progressSelector } from '../redux/selector';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { capitalizeFirstLetter, toFullName } from '../utils/handleString';
import StopSubmittingProofModal from '../components/ComponentModal/StopSubmittingProofModal';
import EmptyDataNotification from '../components/ComponentEmptyData/EmptyDataNotification';

function ProgressUI() {
    const LIMIT = 15;
    const observer = useRef();
    const dispatch = useDispatch();
    const facultyState = useSelector(facultySelector);
    const progress = useSelector(progressSelector);
    const auth = useSelector(authSelector);
    const [cohort, setCohort] = useState('');
    const [major, setMajor] = useState('');
    const [levelYear, setLevelYear] = useState('');
    const [userId, setUserId] = useState('');
    const [faculty, setFaculty] = useState(null);
    const [sortProgressPercentage, setSortProgressPercentage] = useState(1);
    const [vissibleModal, setVissibleModal] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);

    const lastStudentElementRef = (node) => {
        if (progress.annualTaskProgress.isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !progress.annualTaskProgress.isMaxPage) {
                setPageNumber((prev) => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    };

    const onResetAnnualTaskProgress = ({ page, sortProgressPercentage }) => {
        setPageNumber(page);

        dispatch({
            type: GLOBALTYPES.PROGRESS.RESET_ANNUAL_TASK_PROGRESS
        });

        handleSearchAnnualTaskProgress({
            page,
            sortProgressPercentage
        });
    };

    const handleChangeUserIdValue = (e) => {
        setUserId(e.target.value);
    };

    const handleSearchAnnualTaskProgress = ({ page, sortProgressPercentage }) => {
        if (cohort && major && levelYear) {
            dispatch(
                getAnnualTaskProgress({
                    cohort: cohort?.cohortName,
                    major: major?.majorName,
                    userId: userId.trim(),
                    levelYear,
                    sortProgressPercentage,
                    page,
                    limit: LIMIT
                })
            );
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });
        }
    };

    const handleToggleSortProgress = () => {
        if (progress.annualTaskProgress.data.length === 0) return;

        setSortProgressPercentage((prev) => -prev);

        onResetAnnualTaskProgress({
            page: 1,
            sortProgressPercentage: -sortProgressPercentage
        });
    };

    const handleVissbleStopSubmittingProofModal = () => {
        if (cohort && levelYear && major) {
            setVissibleModal(true);
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });
        }
    };

    const handleHiddenStopSubmittingProofModal = () => {
        setVissibleModal(false);
    };

    useEffect(() => {
        if (progress.annualTaskProgress.data.length > 0) {
            dispatch({
                type: GLOBALTYPES.PROGRESS.RESET_ANNUAL_TASK_PROGRESS
            });
        }
    }, []);

    useEffect(() => {
        if (cohort && major && levelYear && pageNumber > 1) {
            handleSearchAnnualTaskProgress({
                page: pageNumber,
                sortProgressPercentage
            });
        }
    }, [pageNumber, sortProgressPercentage]);

    useEffect(() => {
        if (facultyState.faculty) {
            setFaculty(facultyState.faculty);
            setMajor('');
            setCohort('');
            setLevelYear('');
        }
    }, [facultyState.faculty]);

    useEffect(() => {
        setCohort('');
    }, [major]);

    useEffect(() => {
        setLevelYear('');
    }, [cohort]);

    return auth?.user ? (
        <div className="completion_shedule_container">
            <div className="completion_shedule_wrapper">
                {vissibleModal && (
                    <StopSubmittingProofModal
                        cohort={cohort.cohortName}
                        major={major.majorName}
                        levelYear={levelYear}
                        handleHiddenStopSubmittingProofModal={handleHiddenStopSubmittingProofModal}
                        updatedCohortData={{
                            facultyId: faculty._id,
                            majorId: major._id,
                            cohortId: cohort._id,
                            currentLevelYear: cohort.currentLevelYear + 1
                        }}
                    />
                )}

                <div className="completion_shedule_body">
                    <div className="line__sort__completion-Shedule">
                        <div className="line__search">
                            <div className="filter_group">
                                <select
                                    onChange={(e) => {
                                        if (!e.target.value) {
                                            setMajor('');
                                            return;
                                        }
                                        setMajor(JSON.parse(e.target.value));
                                    }}
                                    value={major ? JSON.stringify(major) : ''}
                                >
                                    <option value="">Chọn Chuyên Ngành</option>
                                    {faculty?.majors.map((majorItem) => (
                                        <option key={majorItem._id} value={JSON.stringify(majorItem)}>
                                            {capitalizeFirstLetter(majorItem.majorName)}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    onChange={(e) => {
                                        if (!e.target.value) {
                                            setCohort('');
                                            return;
                                        }
                                        setCohort(JSON.parse(e.target.value));
                                    }}
                                    value={cohort ? JSON.stringify(cohort) : ''}
                                >
                                    <option value="">Chọn Khóa</option>
                                    {major &&
                                        major?.cohortList &&
                                        major.cohortList.map((cohortItem) => (
                                            <option key={cohortItem._id} value={JSON.stringify(cohortItem)}>
                                                {cohortItem.cohortName}
                                            </option>
                                        ))}
                                </select>

                                <select
                                    onChange={(e) => {
                                        const year = e.target.value;
                                        if (!year) {
                                            setLevelYear('');
                                            return;
                                        }
                                        setLevelYear(Number.parseInt(e.target.value));
                                    }}
                                    value={levelYear || ''}
                                >
                                    <option value="">Chọn Năm Học</option>

                                    {cohort &&
                                        new Array(cohort?.currentLevelYear)
                                            .fill(0)
                                            .map((_, index) => (
                                                <option
                                                    value={cohort?.currentLevelYear - index}
                                                    key={index}
                                                >{`Năm ${cohort?.currentLevelYear - index} ${index === 0 ? '(Hiện tại)' : '(Đã kết thúc)'}`}</option>
                                            ))}
                                </select>

                                <input type="text" placeholder="Nhập Mã Sinh Viên" onChange={handleChangeUserIdValue} />
                            </div>

                            <div className="btn_group">
                                <button
                                    className="search_btn"
                                    onClick={() =>
                                        onResetAnnualTaskProgress({
                                            page: 1,
                                            sortProgressPercentage
                                        })
                                    }
                                >
                                    <IoSearch />
                                    Tìm Kiếm
                                </button>
                                <div className="line__flex">
                                    {auth?.user.levelYear === levelYear &&
                                        progress.annualTaskProgress.data.length > 0 && (
                                            <button
                                                className="btn__end_progress"
                                                onClick={handleVissbleStopSubmittingProofModal}
                                            >
                                                <LuTimerReset />
                                                Dừng Nộp Minh Chứng
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="completion_shedule_table_wrapper">
                        <table className="completion_shedule_table">
                            <thead className="completion_shedule_header">
                                <tr>
                                    <th>STT</th>
                                    <th>Mã Sinh Viên</th>
                                    <th>Tên Sinh Viên</th>
                                    <th className="progress_header">
                                        <span>Tổng Tiến Độ</span>
                                        <span className="progress_header_filter" onClick={handleToggleSortProgress}>
                                            {sortProgressPercentage ? <FaSortNumericDown /> : <FaSortNumericDownAlt />}
                                        </span>
                                    </th>
                                    <th>Tổng Điểm</th>
                                    <th>Tình trạng</th>
                                </tr>
                            </thead>

                            <tbody>
                                {progress.annualTaskProgress.data.map((progressItem, index) => {
                                    const { progressData, lastName, firstName, userId } = progressItem;
                                    const { numberOfAcceptedActivity, numberOfRequiredActivity, totalScore } =
                                        progressData;

                                    const completedProgressPrecent =
                                        numberOfAcceptedActivity && numberOfRequiredActivity
                                            ? (numberOfAcceptedActivity / numberOfRequiredActivity) * 100
                                            : 0;

                                    if (index + 1 === progress.annualTaskProgress.data.length)
                                        return (
                                            <tr key={userId + index} ref={lastStudentElementRef}>
                                                <td>{index + 1}</td>
                                                <td>{userId}</td>
                                                <td>{toFullName({ firstName, lastName })}</td>
                                                <td>{`${completedProgressPrecent.toFixed(2)}%`}</td>
                                                <td>{totalScore || 0}</td>
                                                <td>
                                                    {completedProgressPrecent === 100
                                                        ? 'Hoàn Thành'
                                                        : 'Chưa Hoàn Thành'}
                                                </td>
                                            </tr>
                                        );

                                    return (
                                        <tr key={userId + index}>
                                            <td>{index + 1}</td>
                                            <td>{userId}</td>
                                            <td>{toFullName({ firstName, lastName })}</td>
                                            <td>{`${completedProgressPrecent.toFixed(2)}%`}</td>
                                            <td>{totalScore || 0}</td>
                                            <td>
                                                {completedProgressPrecent === 100 ? 'Hoàn Thành' : 'Chưa Hoàn Thành'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {progress.annualTaskProgress.data.length === 0 && <EmptyDataNotification />}
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default ProgressUI;
