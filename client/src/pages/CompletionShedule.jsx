import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSortNumericDownAlt, FaSortNumericUpAlt } from 'react-icons/fa';
import { MdDownload } from 'react-icons/md';
import { Button } from 'antd';
import { getAnnualTaskProgress } from '../redux/actions/progressAction';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { progressSelector } from '../redux/selector';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';
import no_search_result from '../assets/images/no_search_result.png';
import StopSubmittingProofModal from '../components/ComponentModal/StopSubmittingProofModal';
import { IoSearch } from "react-icons/io5";
import { LuTimerReset } from "react-icons/lu";

function CompletionShedule() {
    const dispatch = useDispatch();
    const progress = useSelector(progressSelector);
    const [cohort, setCohort] = useState(progress.searchData.cohort);
    const [faculty, setFaculty] = useState(progress.searchData.faculty);
    const [major, setMajor] = useState(progress.searchData.major);
    const [levelYear, setLevelYear] = useState(progress.searchData.levelYear);
    const [studentId, setStudentId] = useState(progress.searchData.studentId);
    const [isCompleted, setIsCompleted] = useState(progress.searchData.isCompleted);
    const [sortProgress, setSortProgress] = useState(false);
    const [triggerRefresh, setTriggerRefresh] = useState(0);
    const [vissibleModal, setVissibleModal] = useState(false);

    const handleSearchAnnualTaskProgress = () => {
        if (cohort && major && levelYear) {
            dispatch(
                getAnnualTaskProgress({
                    cohort,
                    major,
                    levelYear,
                    studentId,
                    isCompleted,
                    sortProgress
                })
            );

            dispatch({
                type: GLOBALTYPES.PROGRESS.SET_SEARCH_DATA,
                payload: {
                    cohort,
                    faculty,
                    major,
                    levelYear,
                    isCompleted,
                    studentId
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

    const handleChangeStudentId = (e) => {
        setStudentId(e.target.value);
    };

    const handleChangeStatusAnnualTaskProgress = (e) => {
        setIsCompleted(e.target.value);
    };

    const handleRefreshFilter = () => {
        setTriggerRefresh(Math.random() + 1);
        setStudentId('');
        setIsCompleted('');
    };

    const handleToggleSortProgress = () => {
        setSortProgress((prev) => !prev);
    };

    const handleVissbleStopSubmittingProofModal = () => {
        if (cohort && levelYear && major && faculty) {
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

    const handleHiddenStopSubmittingProofModal = (e) => {
        setVissibleModal(false);
    };

    useEffect(() => {
        if (progress.annualTaskProgress.data.length > 0 || triggerRefresh) {
            handleSearchAnnualTaskProgress();
        }
    }, [sortProgress, triggerRefresh]);


    return (
        <div className='completion_shedule_wrapper'>
            {vissibleModal && (
                <StopSubmittingProofModal
                    cohort={cohort}
                    major={major}
                    levelYear={levelYear}
                    handleHiddenStopSubmittingProofModal={handleHiddenStopSubmittingProofModal}
                />
            )}
            <div className="line__flex">
                <div className="heading_text--pages">
                    THỐNG KẾ TIẾN ĐỘ HOÀN THÀNH
                </div>
                <button
                    className='btn__end_progress_btn'
                    onClick={handleVissbleStopSubmittingProofModal}
                >
                    <LuTimerReset />
                    Kết Thúc Nộp Minh Chứng
                </button>
            </div>

            {/* <div className='btn_group'>
                    <Button onClick={handleSearchAnnualTaskProgress} className='filter_btn'>
                        Lọc dữ liệu
                    </Button>

                    <Button onClick={handleRefreshFilter} className='refresh_btn'>
                        Làm mới
                    </Button>
                </div> */}


            <div className='completion_shedule_body'>

                <div className="line__sort__completion-Shedule">
                    <div className='line__search'>
                        <div>
                            <input
                                type='text'
                                placeholder='Nhập Khóa Sinh Viên'
                                onChange={(e) => {
                                    setCohort(e.target.value);
                                }}
                                value={cohort}
                            />
                            <select
                                onChange={(e) => {
                                    setFaculty(e.target.value);
                                }}
                                value={faculty}
                            >
                                <option value=''>Chọn Khoa</option>
                                <option value='Công nghệ thông tin'>Công Nghệ Thông Tin</option>
                            </select>
                            <select
                                onChange={(e) => {
                                    setMajor(e.target.value);
                                }}
                                value={major}
                            >
                                <option value=''>Chọn Chuyên Ngành</option>
                                <option value='Kỹ thuật phần mềm'>Kỹ Thuật Phần Mềm</option>
                                <option value='Khoa học máy tính'>khoa Học Máy Tính</option>
                            </select>
                            <select
                                onChange={(e) => setLevelYear(Number.parseInt(e.target.value))}
                                value={levelYear}
                            >
                                <option value=''>Chọn Năm Học</option>
                                <option value='1'>Năm 1</option>
                                <option value='2'>Năm 2</option>
                                <option value='3'>Năm 3</option>
                                <option value='4'>Năm 4</option>
                                <option value='5'>Năm 5</option>
                            </select>

                        </div>
                        <button
                            className='search_btn'
                            onClick={handleSearchAnnualTaskProgress}
                        >
                            <IoSearch />
                            Tìm Kiếm
                        </button>

                    </div>
                    <div>
                        <input
                            placeholder='Theo Mã Sinh Viên'
                            onChange={handleChangeStudentId}
                            value={studentId}
                        />

                        <select value={isCompleted} onChange={handleChangeStatusAnnualTaskProgress}>
                            <option value={''}>Trạng thái tiến độ</option>
                            <option value={true}>Đã hoàn thành</option>
                            <option value={false}>Chưa hoàn thành</option>
                        </select>
                    </div>

                </div>

                {/* <div className='line__btn_down'>
                    <button className='download_icon'>
                        <MdDownload /> Download
                    </button>
                </div> */}
                <table className='completion_shedule_table'>

                    <thead className='completion_shedule_header'>
                        <tr>
                            <th>#</th>
                            <th>Mã Sinh Viên</th>
                            <th>Tên Sinh Viên</th>
                            <th>Chuyên Ngành</th>
                            <th className='progress_header'>
                                <span>Tiến Độ</span>
                                <span
                                    className='progress_header_fiter'
                                    onClick={handleToggleSortProgress}
                                >
                                    <abbr
                                        title={
                                            sortProgress ? 'Sắp xếp tăng dần' : 'Sắp xếp giảm dần'
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
                        </tr>
                    </thead>

                    <tbody >
                        {progress.annualTaskProgress.data.map((progressItem, index) => (
                            <tr key={progressItem?.studentId}>
                                <td>{index}.</td>
                                <td>{progressItem?.studentId}</td>
                                <td>{capitalizeFirstLetter(progressItem?.fullName)}</td>
                                <td>{capitalizeFirstLetter(progressItem?.major)}</td>
                                <td>
                                    {progressItem.completedTaskProgress?.completedTaskPrecent.toFixed(
                                        2
                                    ) + '%'}
                                </td>
                                <td>{progressItem.completedTaskProgress?.totalScore}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {progress.annualTaskProgress.data.length === 0 && (
                    <div className='no_search_result_img_wrapper'>
                        <img
                            className='no_search_result_img'
                            src={no_search_result}
                            alt='nothing'
                            draggable='false'
                        />
                        <span>Dữ liệu thống kê chưa có</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CompletionShedule;
