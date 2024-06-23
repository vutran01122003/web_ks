import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSortNumericDownAlt, FaSortNumericUpAlt } from 'react-icons/fa';
import { getAnnualTaskProgress } from '../redux/actions/progressAction';
import GLOBALTYPES from '../redux/actions/globalTypes';
import {
    authSelector,
    facultySelector,
    progressSelector
} from '../redux/selector';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';
import no_search_result from '../assets/images/no_search_result.png';
import StopSubmittingProofModal from '../components/ComponentModal/StopSubmittingProofModal';
import { IoSearch } from 'react-icons/io5';
import { LuTimerReset } from 'react-icons/lu';
import { getAllFaculties } from '../redux/actions/facultyAction';

function ProgressUI() {
    const dispatch = useDispatch();
    const facultyState = useSelector(facultySelector);
    const progress = useSelector(progressSelector);
    const auth = useSelector(authSelector);
    const [cohort, setCohort] = useState('');
    const [major, setMajor] = useState('');
    const [levelYear, setLevelYear] = useState('');
    const [faculty, setFaculty] = useState(null);
    const [sortProgress, setSortProgress] = useState(false);
    const [vissibleModal, setVissibleModal] = useState(false);

    const handleSearchAnnualTaskProgress = () => {
        if (cohort && major && levelYear) {
            dispatch(
                getAnnualTaskProgress({
                    cohort: cohort?.cohortName,
                    major: major?.majorName,
                    levelYear,
                    sortProgress
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
        setSortProgress((prev) => !prev);
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
        if (facultyState.facultyData.length === 0) dispatch(getAllFaculties());
        if (progress.annualTaskProgress.data.length > 0) {
            dispatch({
                type: GLOBALTYPES.PROGRESS.RESET_ANNUAL_TASK_PROGRESS
            });
        }
    }, []);

    useEffect(() => {
        if (
            progress.annualTaskProgress.data.length > 0 &&
            cohort &&
            major &&
            levelYear
        ) {
            handleSearchAnnualTaskProgress();
        }
    }, [sortProgress]);

    useEffect(() => {
        if (facultyState.facultyData.length > 0) {
            const _faculty = facultyState?.facultyData.find(
                (facultyItem) => facultyItem.facultyName === auth?.user.faculty
            );
            setFaculty(_faculty);
            setMajor('');
            setCohort('');
            setLevelYear('');
        }
    }, [JSON.stringify(facultyState.facultyData)]);

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
                        handleHiddenStopSubmittingProofModal={
                            handleHiddenStopSubmittingProofModal
                        }
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
                            <div className="select_group">
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
                                        <option
                                            key={majorItem._id}
                                            value={JSON.stringify(majorItem)}
                                        >
                                            {capitalizeFirstLetter(
                                                majorItem.majorName
                                            )}
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
                                    {major && major?.cohortList ? (
                                        <>
                                            <option value="">Chọn Khóa</option>
                                            {major.cohortList.map(
                                                (cohortItem) => (
                                                    <option
                                                        key={cohortItem._id}
                                                        value={JSON.stringify(
                                                            cohortItem
                                                        )}
                                                    >
                                                        {cohortItem.cohortName}
                                                    </option>
                                                )
                                            )}
                                        </>
                                    ) : (
                                        <option value="">
                                            Chưa Chọn Ngành
                                        </option>
                                    )}
                                </select>

                                <select
                                    onChange={(e) => {
                                        const year = e.target.value;
                                        if (!year) {
                                            setLevelYear('');
                                            return;
                                        }
                                        setLevelYear(
                                            Number.parseInt(e.target.value)
                                        );
                                    }}
                                    value={levelYear || ''}
                                >
                                    {cohort ? (
                                        <>
                                            <option value="">
                                                Chọn Năm Học
                                            </option>

                                            {Array.from(
                                                {
                                                    length: cohort?.currentLevelYear
                                                },
                                                (_, index) => index + 1
                                            ).map((year) => (
                                                <option key={year} value={year}>
                                                    {`Năm ${year} ${
                                                        cohort?.currentLevelYear ===
                                                        year
                                                            ? '(Hiện tại)'
                                                            : '(Đã kết thúc)'
                                                    }`}
                                                </option>
                                            ))}
                                        </>
                                    ) : (
                                        <option value="">Chưa chọn khóa</option>
                                    )}
                                </select>

                                <div className="line__flex">
                                    {auth?.user.levelYear === levelYear &&
                                        progress.annualTaskProgress.data
                                            .length > 0 && (
                                            <button
                                                className="btn__end_progress"
                                                onClick={
                                                    handleVissbleStopSubmittingProofModal
                                                }
                                            >
                                                <LuTimerReset />
                                                Dừng Nộp Minh Chứng
                                            </button>
                                        )}
                                </div>
                            </div>

                            <button
                                className="search_btn"
                                onClick={handleSearchAnnualTaskProgress}
                            >
                                <IoSearch />
                                Tìm Kiếm
                            </button>
                        </div>
                    </div>

                    <table className="completion_shedule_table">
                        <thead className="completion_shedule_header">
                            <tr>
                                <th>STT</th>
                                <th>Mã Sinh Viên</th>
                                <th>Tên Sinh Viên</th>
                                <th>Chuyên Ngành</th>
                                <th className="progress_header">
                                    <span>Tiến Độ</span>
                                    <span
                                        className="progress_header_fiter"
                                        onClick={handleToggleSortProgress}
                                    >
                                        <abbr
                                            title={
                                                sortProgress
                                                    ? 'Sắp xếp tăng dần'
                                                    : 'Sắp xếp giảm dần'
                                            }
                                        >
                                            {sortProgress ? (
                                                <FaSortNumericUpAlt />
                                            ) : (
                                                <FaSortNumericDownAlt />
                                            )}
                                        </abbr>
                                    </span>
                                </th>
                                <th>Điểm</th>
                                <th>Tình trạng</th>
                            </tr>
                        </thead>

                        <tbody>
                            {progress.annualTaskProgress.data.map(
                                (progressItem, index) => (
                                    <tr key={progressItem?.userId}>
                                        <td>{index + 1}</td>
                                        <td>{progressItem?.userId}</td>
                                        <td>
                                            {capitalizeFirstLetter(
                                                progressItem?.fullName
                                            )}
                                        </td>
                                        <td>
                                            {capitalizeFirstLetter(
                                                progressItem?.major
                                            )}
                                        </td>
                                        <td>
                                            {(progressItem.completedTaskProgress?.completedTaskPrecent.toFixed(
                                                2
                                            ) || 0) + '%'}
                                        </td>
                                        <td>
                                            {progressItem.completedTaskProgress
                                                ?.totalScore || 0}
                                        </td>
                                        <td>
                                            {progressItem.completedTaskProgress
                                                ?.completedTaskPrecent === 100
                                                ? 'Hoàn Thành'
                                                : 'Chưa Hoàn Thành'}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>

                    {progress.annualTaskProgress.data.length === 0 && (
                        <div className="no_search_result_img_wrapper">
                            <img
                                className="no_search_result_img"
                                src={no_search_result}
                                alt="nothing"
                                draggable="false"
                            />
                            <span>Dữ liệu thống kê chưa có</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
}

export default ProgressUI;
