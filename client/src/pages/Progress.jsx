import moment from 'moment';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsThreeDots } from 'react-icons/bs';
import { FaSortNumericDown, FaSortNumericDownAlt } from 'react-icons/fa';
import { toFullName } from '../utils/handleString';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { confirmProgress, getAnnualTaskProgress, revertProgress } from '../redux/actions/progressAction';
import SearchFilterComponent from '../components/Filter/SearchFilter';
import StopSubmittingProofModal from '../components/Modal/StopSubmittingProofModal';
import EmptyDataNotification from '../components/Notification/EmptyDataNotification';
import { authSelector, facultySelector, progressSelector } from '../redux/selector';
import { exportProgressStatisticsExcel } from '../redux/actions/excelAction';
import ConfirmModal from '../components/Modal/ConfirmModal';
import GoalDetailsModal from '../components/Modal/GoalDetailsModal';

const { VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE } = import.meta.env;
const LIMIT = import.meta.env.VITE_APP_API_LIMIT;

function ProgressUI() {
    const [PENDING_STATUS, PROGRESS_STATUS] = ['pending', 'process'];
    const [] = [];
    const observer = useRef();
    const dispatch = useDispatch();

    const facultyState = useSelector(facultySelector);
    const { majors, faculty } = facultyState;
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
    const [additionalRegisterInfo, setAdditionalRegisterInfo] = useState('');
    const [visibleConfirmProgressModal, setVisibleConfirmModal] = useState(false);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [isVisibleGoalDetailsModal, setIsVisibleGoalDetailsModal] = useState(false);

    const temporaryTalentEngineerCond =
        talentEngineerType === VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE &&
        additionalRegisterInfo?.levelYear === levelYear &&
        additionalRegisterInfo?.isActive;

    const visibleConfirmBtnConds =
        (temporaryTalentEngineerCond && additionalRegisterInfo?.status === PROGRESS_STATUS) ||
        (talentEngineerType !== VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE &&
            cohort.levelYearInfo &&
            cohort.levelYearInfo.find((item) => item.levelYear === levelYear)?.status === PROGRESS_STATUS);

    const visibleStopBtnConds =
        (temporaryTalentEngineerCond && additionalRegisterInfo?.status === PENDING_STATUS) ||
        (talentEngineerType !== VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE &&
            cohort.currentLevelYear === levelYear &&
            !visibleConfirmBtnConds);

    const onToggleGoalDetailsModal = (index) => {
        setIsVisibleGoalDetailsModal((prev) => !prev);
        if (index === undefined) setCurrentUserData(null);
        else setCurrentUserData(progress?.annualTaskProgress?.data[index]);
    };

    const handleToggelDisplayConfirmProgressModal = () => {
        setVisibleConfirmModal((prev) => !prev);
    };

    const getStatus = (userId) => {
        if (additionalRegisterInfo) {
            return additionalRegisterInfo.status === PENDING_STATUS
                ? 'Chưa Xét Duyệt'
                : additionalRegisterInfo.approvedUsers.includes(userId)
                  ? 'Đã Đạt'
                  : 'Không Đạt';
        }

        if (cohort && talentEngineerType !== VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE) {
            const levelYearInfo = cohort.levelYearInfo.find((item) => item.levelYear === levelYear);

            if (!levelYearInfo) return 'Chưa Xét Duyệt';

            return levelYearInfo?.status === PENDING_STATUS
                ? 'Chưa Xét Duyệt'
                : levelYearInfo.approvedUsers.includes(userId)
                  ? 'Đã Đạt'
                  : 'Không Đạt';
        }

        return 'Chưa Xét Duyệt';
    };

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

    const exportExcelFile = () => {
        dispatch(
            exportProgressStatisticsExcel({
                cohort: cohort.cohortName,
                major: major.majorName,
                levelYear: +levelYear,
                faculty: faculty.facultyName,
                groupCode: talentEngineerType,
                sortProgressPercentage: sortProgressPercentage * 1
            })
        );
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

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: 'Lấy dữ liệu thành công'
                }
            });
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });
        }
    };

    const onConfirmProgress = () => {
        if (cohort && major && talentEngineerType)
            dispatch(
                confirmProgress({
                    major: major.majorName,
                    cohort: cohort.cohortName,
                    faculty: faculty.facultyName,
                    levelYear: parseInt(levelYear),
                    groupCode: talentEngineerType,
                    updatedCohortData: {
                        majorId: major._id,
                        cohortId: cohort._id,
                        nextYearValue: parseInt(levelYear) + 1
                    }
                })
            );
    };

    const onRevertProgress = () => {
        if (cohort && major && talentEngineerType) {
            dispatch(
                revertProgress({
                    cohort: cohort.cohortName,
                    major: major.majorName,
                    groupCode: talentEngineerType,
                    levelYear: +levelYear,
                    faculty: faculty.facultyName
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
        if (major && cohort && talentEngineerType === VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE) {
            const ariList = majors
                .find((majorItem) => majorItem.majorName === major.majorName)
                .cohorts.find((cohortItem) => cohortItem.cohortName === cohort.cohortName).additionalRegisterInfo;
            if (ariList.length > 0) setAdditionalRegisterInfo(ariList.find((ari) => ari.levelYear === levelYear));
        } else setAdditionalRegisterInfo('');
    }, [majors, major, cohort, talentEngineerType, levelYear]);

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
    }, []);

    return auth?.user ? (
        <div className="completion_shedule_container">
            <div className="completion_shedule_wrapper">
                {isVisibleGoalDetailsModal && (
                    <GoalDetailsModal
                        currentUserData={currentUserData}
                        onToggleModalDisplay={onToggleGoalDetailsModal}
                    />
                )}

                {visibleConfirmProgressModal && (
                    <ConfirmModal
                        headerContent="Xác Nhận Kết Thúc Hoạt Động Nộp Minh Chứng"
                        bodyContent="Bạn chắc chắn muốn kết thúc hoạt động nộp minh chứng ?"
                        noteContent="Sau khi xác nhận không thể duyệt lại."
                        onAccept={onConfirmProgress}
                        toggleConfirmModalDisplay={handleToggelDisplayConfirmProgressModal}
                    />
                )}

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
                                userId={userId}
                                handleChangeUserId={handleChangeUserIdValue}
                            />

                            <button className="search_btn" onClick={searchData}>
                                Tìm Kiếm
                            </button>

                            {visibleStopBtnConds &&
                                isVisibleStopSubmitingProofBtn &&
                                progress.annualTaskProgress.data.length > 0 && (
                                    <button
                                        className="btn__end_progress"
                                        onClick={handleVissbleStopSubmittingProofModal}
                                    >
                                        {talentEngineerType === VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE
                                            ? 'Dừng Xét Tuyển Bổ Sung'
                                            : 'Dừng Nộp Minh Chứng'}
                                    </button>
                                )}

                            {visibleConfirmBtnConds && progress.annualTaskProgress.data.length > 0 && (
                                <Fragment>
                                    <button className="btn_revert" onClick={onRevertProgress}>
                                        Duyệt Lại
                                    </button>

                                    <button className="btn_confirm" onClick={handleToggelDisplayConfirmProgressModal}>
                                        Xác Nhận
                                    </button>
                                </Fragment>
                            )}

                            {progress.annualTaskProgress.data.length > 0 && (
                                <button className="export_btn" onClick={exportExcelFile}>
                                    Xuất Excel
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="completion_shedule_table_wrapper">
                        <table className="completion_shedule_table">
                            <thead className="completion_shedule_header">
                                <tr>
                                    <th>STT</th>
                                    <th>Mã Sinh Viên</th>
                                    <th>Tên Sinh Viên</th>
                                    <th>Giới Tính</th>
                                    <th>Ngày Sinh</th>
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
                                    <th>Chi Tiết</th>
                                </tr>
                            </thead>

                            <tbody>
                                {progress.annualTaskProgress.data.map((progressItem, index) => {
                                    const { _id, progressData, lastName, firstName, userId, birthday, gender } =
                                        progressItem;
                                    const progressPercentage = progressData?.progressPercentage ?? 0;
                                    const totalScore = progressData?.totalScore ?? 0;

                                    if (index + 1 === progress.annualTaskProgress.data.length)
                                        return (
                                            <tr key={userId + index} ref={lastStudentElementRef}>
                                                <td>{index + 1}</td>
                                                <td>{userId}</td>
                                                <td>{toFullName({ firstName, lastName })}</td>
                                                <td>{gender}</td>
                                                <td>{moment(birthday).format('DD/MM/yyyy')}</td>
                                                <td>{`${progressPercentage.toFixed(2)}%`}</td>
                                                <td>{totalScore}</td>
                                                <td>{getStatus(_id)}</td>
                                                <td
                                                    className="details_btn"
                                                    onClick={() => onToggleGoalDetailsModal(index)}
                                                >
                                                    <BsThreeDots size={20} />
                                                </td>
                                            </tr>
                                        );

                                    return (
                                        <tr key={userId + index}>
                                            <td>{index + 1}</td>
                                            <td>{userId}</td>
                                            <td>{toFullName({ firstName, lastName })}</td>
                                            <td>{gender}</td>
                                            <td>{moment(birthday).format('DD/MM/yyyy')}</td>
                                            <td>{`${progressPercentage.toFixed(2)}%`}</td>
                                            <td>{totalScore}</td>
                                            <td>{getStatus(_id)}</td>
                                            <td className="details_btn" onClick={() => onToggleGoalDetailsModal(index)}>
                                                <BsThreeDots size={20} />
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
