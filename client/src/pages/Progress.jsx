import { Fragment, useEffect, useRef, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { LuTimerReset } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { FaSortNumericDown, FaSortNumericDownAlt } from 'react-icons/fa';
import { getAnnualTaskProgress } from '../redux/actions/progressAction';
import { authSelector, facultySelector, progressSelector } from '../redux/selector';
import { toFullName } from '../utils/handleString';
import StopSubmittingProofModal from '../components/Modal/StopSubmittingProofModal';
import EmptyDataNotification from '../components/Notification/EmptyDataNotification';
import SearchFilterComponent from '../components/Filter/SearchFilter';

const { VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE } = import.meta.env;

function ProgressUI() {
    const LIMIT = import.meta.env.VITE_APP_API_LIMIT;
    const observer = useRef();
    const dispatch = useDispatch();

    const facultyState = useSelector(facultySelector);
    const faculty = facultyState.faculty;
    const progress = useSelector(progressSelector);
    const auth = useSelector(authSelector);

    const [userId, setUserId] = useState('');
    const [major, setMajor] = useState('');
    const [cohort, setCohort] = useState('');
    const [talentEngineerType, setTalentEngineerType] = useState('');
    const [levelYear, setLevelYear] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [vissibleModal, setVissibleModal] = useState(false);
    const [sortProgressPercentage, setSortProgressPercentage] = useState(-1);
    const [isVisibleStopSubmitingProofBtn, setIsVisibleStopSubmitingProofBtn] = useState(false);

    const additionalApplyData =
        major && cohort && talentEngineerType === VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE
            ? facultyState.faculty.majors
                  .find((_major) => _major.majorName === major.majorName)
                  .cohortList.find((_cohort) => _cohort.cohortName === cohort.cohortName).additionalApplyData
            : null;

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

        onSearchAnnualTaskProgress({
            page,
            sortProgressPercentage
        });
    };

    const handleChangeUserIdValue = (e) => {
        setUserId(e.target.value);
    };

    const onSearchAnnualTaskProgress = ({ page, sortProgressPercentage }) => {
        if (cohort && major && levelYear) {
            dispatch(
                getAnnualTaskProgress({
                    cohort: cohort.cohortName,
                    major: major.majorName,
                    levelYear: +levelYear,
                    faculty: faculty.facultyName,
                    groupCode: talentEngineerType,
                    userId: userId.trim(),
                    sortProgressPercentage: sortProgressPercentage * 1,
                    page: +page,
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

    const searchData = () => {
        onResetAnnualTaskProgress({
            page: 1,
            sortProgressPercentage
        });
        setIsVisibleStopSubmitingProofBtn(cohort?.currentLevelYear === levelYear);
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
            onSearchAnnualTaskProgress({
                page: pageNumber,
                sortProgressPercentage
            });
        }
    }, [pageNumber, sortProgressPercentage]);

    useEffect(() => {
        if (progress.annualTaskProgress.data.length > 0) {
            dispatch({
                type: GLOBALTYPES.PROGRESS.RESET_ANNUAL_TASK_PROGRESS
            });
        }
    }, [major, cohort, talentEngineerType, levelYear]);

    return auth?.user ? (
        <div className="completion_shedule_container">
            <div className="completion_shedule_wrapper">
                {vissibleModal && (
                    <StopSubmittingProofModal
                        cohort={cohort.cohortName}
                        major={major.majorName}
                        faculty={faculty.facultyName}
                        levelYear={levelYear}
                        groupCode={talentEngineerType}
                        handleHiddenStopSubmittingProofModal={handleHiddenStopSubmittingProofModal}
                        updatedCohortData={{
                            facultyId: faculty._id,
                            majorId: major._id,
                            cohortId: cohort._id,
                            nextYearValue: cohort.currentLevelYear + 1
                        }}
                    />
                )}

                <div className="completion_shedule_body">
                    <div className="line__sort__completion-Shedule">
                        <div className="line__search">
                            <SearchFilterComponent
                                setMajorValue={setMajor}
                                setCohortValue={setCohort}
                                setCurrentLevelYearValue={setLevelYear}
                                setTalentEngineerType={setTalentEngineerType}
                                majorValue={major}
                                cohortValue={cohort}
                                talentEngineerType={talentEngineerType}
                                currentLevelYearValue={levelYear}
                            />
                            <input type="text" placeholder="Nhập Mã Sinh Viên" onChange={handleChangeUserIdValue} />
                            <div className="btn_group">
                                <button className="search_btn" onClick={searchData}>
                                    <IoSearch />
                                    Tìm Kiếm
                                </button>
                                <div className="line__flex">
                                    {((talentEngineerType === VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE &&
                                        additionalApplyData.levelYear === levelYear &&
                                        additionalApplyData.isActive) ||
                                        talentEngineerType !== VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE) && (
                                        <Fragment>
                                            {isVisibleStopSubmitingProofBtn &&
                                                progress.annualTaskProgress.data.length > 0 && (
                                                    <button
                                                        className="btn__end_progress"
                                                        onClick={handleVissbleStopSubmittingProofModal}
                                                    >
                                                        <LuTimerReset />
                                                        {talentEngineerType === VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE
                                                            ? 'Dừng Xét Tuyển Bổ Sung'
                                                            : 'Dừng Nộp Minh Chứng'}
                                                    </button>
                                                )}
                                        </Fragment>
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
                                            {sortProgressPercentage === -1 ? (
                                                <FaSortNumericDownAlt />
                                            ) : (
                                                <FaSortNumericDown />
                                            )}
                                        </span>
                                    </th>
                                    <th>Tổng Điểm</th>
                                    <th>Trạng Thái</th>
                                </tr>
                            </thead>

                            <tbody>
                                {progress.annualTaskProgress.data.map((progressItem, index) => {
                                    const { progressData, lastName, firstName, userId, isActive } = progressItem;
                                    const { progressPercentage, totalScore } = progressData;

                                    if (index + 1 === progress.annualTaskProgress.data.length)
                                        return (
                                            <tr key={userId + index} ref={lastStudentElementRef}>
                                                <td>{index + 1}</td>
                                                <td>{userId}</td>
                                                <td>{toFullName({ firstName, lastName })}</td>
                                                <td>{`${progressPercentage ? progressPercentage.toFixed(2) : 0}%`}</td>
                                                <td>{totalScore || 0}</td>
                                                <td className={isActive ? 'active' : 'inactive'}>
                                                    {isActive ? 'Hoạt Động' : 'Đã Khóa'}
                                                </td>
                                            </tr>
                                        );

                                    return (
                                        <tr key={userId + index}>
                                            <td>{index + 1}</td>
                                            <td>{userId}</td>
                                            <td>{toFullName({ firstName, lastName })}</td>
                                            <td>{`${progressPercentage ? progressPercentage.toFixed(2) : 0}%`}</td>
                                            <td>{totalScore || 0}</td>
                                            <td className={isActive ? 'active' : 'inactive'}>
                                                {isActive ? 'Hoạt Động' : 'Đã Khóa'}
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
