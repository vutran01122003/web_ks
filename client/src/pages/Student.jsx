import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit } from 'react-icons/fi';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { getStudents } from '../redux/actions/studentAction';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { exportQualifiedUsersExcel } from '../redux/actions/excelAction';
import { facultySelector, studentSelector } from '../redux/selector';
import { capitalizeFirstLetter, toFullName } from '../utils/handleString';
import SearchFilterComponent from '../components/Filter/SearchFilter';
import StudentDetailsModal from '../components/Modal/StudentDetailsModal';
import GoalDetailsModal from '../components/Modal/GoalDetailsModal';
import EmptyDataNotification from '../components/Notification/EmptyDataNotification';
import ImportExcelModal from '../components/Modal/ImportExcelModal';

const Student = ({ isAdmin }) => {
    const { VITE_APP_API_LIMIT, VITE_APP_TALENT_ENGINEER_CODE } = import.meta.env;
    const dispatch = useDispatch();
    const observe = useRef();

    const facultyState = useSelector(facultySelector);
    const studentState = useSelector(studentSelector);
    const studentList = studentState.studentList;

    const [userId, setUserId] = useState('');
    const [faculty, setFaculty] = useState('');
    const [major, setMajor] = useState('');
    const [cohort, Setcohort] = useState('');
    const [talentEngineerType, setTalentEngineerType] = useState('');
    const [status, setStatus] = useState('');

    const [pageNumber, setPageNumber] = useState(1);
    const [sortByName, setSortByName] = useState(1);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [isVisibleGoalDetailsModal, setIsVisibleGoalDetailsModal] = useState(false);
    const [isVisibleStudentDetailsModal, setIsVisibleStudentDetailsModal] = useState(false);
    const [isVisibleExcelModal, setIsVisibleExcelModal] = useState(false);

    const handleChangeUserId = (e) => {
        setUserId(e.target.value);
    };

    const onToggleVisibleStudentDetailsModal = (index) => {
        setIsVisibleStudentDetailsModal((prev) => !prev);
        if (index === undefined) setCurrentUserData(null);
        else setCurrentUserData(studentList[index]);
    };

    const onToggleGoalDetailsModal = (index) => {
        setIsVisibleGoalDetailsModal((prev) => !prev);
        if (index === undefined) setCurrentUserData(null);
        else setCurrentUserData(studentList[index]);
    };

    const onToggleExcelModal = () => {
        setIsVisibleExcelModal((prev) => !prev);
    };

    const lastStudentElement = useCallback(
        (node) => {
            if (studentState.isLoading) return;
            if (observe.current) observe.current.disconnect();

            observe.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !studentState.isMaxPage) {
                    setPageNumber((prev) => prev + 1);
                }
            });

            if (node) observe.current.observe(node);
        },
        [studentState.isLoading, studentState.isMaxPage]
    );

    const handleStringValue = (stringValue) => {
        if (!stringValue) return 'Chưa Cập Nhật';
        return stringValue;
    };

    const exportExcelFile = () => {
        dispatch(
            exportQualifiedUsersExcel({
                major: major.majorName,
                cohort: cohort.cohortName,
                groupCode: talentEngineerType,
                status: status,
                sortByName
            })
        );
    };

    const onGetStudents = ({ page, sortByName }) => {
        if (!major || !cohort || !status) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập thông tin đầy đủ'
                }
            });
            return;
        }

        dispatch(
            getStudents({
                major: major.majorName,
                cohort: cohort.cohortName,
                groupCode: talentEngineerType,
                status: status,
                userId: userId,
                limit: VITE_APP_API_LIMIT,
                page: page,
                sortByName
            })
        );
    };

    const onToggleSortByName = () => {
        setSortByName((prev) => -prev);
        onClickGetStudentListBtn({ page: 1, sortByName: -sortByName });
    };

    const onClickGetStudentListBtn = ({ page, sortByName }) => {
        setPageNumber(1);

        dispatch({
            type: GLOBALTYPES.STUDENT.RESET_STUDENT_LIST
        });

        onGetStudents({ page, sortByName });
    };

    useEffect(() => {
        if (pageNumber > 1) {
            onGetStudents({ page: pageNumber, sortByName });
        }
    }, [pageNumber, sortByName]);

    useEffect(() => {
        dispatch({
            type: GLOBALTYPES.STUDENT.RESET_STUDENT_LIST
        });
    }, []);

    return (
        <>
            {isVisibleStudentDetailsModal && (
                <StudentDetailsModal
                    currentUserData={currentUserData}
                    onToggleModal={onToggleVisibleStudentDetailsModal}
                    facultyState={facultyState}
                />
            )}

            {isVisibleGoalDetailsModal && (
                <GoalDetailsModal currentUserData={currentUserData} onToggleModalDisplay={onToggleGoalDetailsModal} />
            )}

            {isVisibleExcelModal && (
                <ImportExcelModal
                    searchInput={{
                        major: major.majorName,
                        cohort: cohort.cohortName,
                        groupCode: talentEngineerType,
                        status: status,
                        userId: userId,
                        limit: VITE_APP_API_LIMIT,
                        page: 1,
                        sortByName: 1
                    }}
                    headerTitle="Thêm Danh Sách Kỹ Sư Tài Năng"
                    columns={[
                        'STT',
                        'MSSV',
                        'Họ đệm',
                        'Tên',
                        'Giới tính',
                        'Ngày sinh',
                        'Khoa',
                        'Chuyên ngành',
                        'Khóa',
                        'Email',
                        'Điện thoại'
                    ]}
                    onCloseModal={onToggleExcelModal}
                />
            )}

            <div className="container_st__manager">
                <div className="body__data--st">
                    <div className="line__sort">
                        <div className="filter_group">
                            <div className="left-section">
                                <SearchFilterComponent
                                    setFacultyValue={isAdmin ? setFaculty : null}
                                    facultyData={isAdmin ? facultyState.facultyData : null}
                                    setMajorValue={setMajor}
                                    setCohortValue={Setcohort}
                                    setTalentEngineerType={setTalentEngineerType}
                                    setStatus={setStatus}
                                    facultyValue={faculty}
                                    majorValue={major}
                                    cohortValue={cohort}
                                    talentEngineerType={talentEngineerType}
                                    statusValue={status}
                                    userId={userId}
                                    handleChangeUserId={handleChangeUserId}
                                />
                            </div>

                            <div className="right_section">
                                <div className="btn_group">
                                    <button
                                        className="search_btn"
                                        onClick={() => {
                                            onClickGetStudentListBtn({
                                                page: 1,
                                                sortByName
                                            });
                                        }}
                                    >
                                        <span>Tìm Kiếm</span>
                                    </button>

                                    {talentEngineerType === VITE_APP_TALENT_ENGINEER_CODE && (
                                        <div className="add_student_wrapper" onClick={onToggleExcelModal}>
                                            <span>Thêm Kỹ Sư</span>
                                        </div>
                                    )}

                                    {studentList.length > 0 && (
                                        <button className="export_btn" onClick={exportExcelFile}>
                                            <span>Xuất Excel</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table_wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã Sinh Viên</th>
                                    <th className="th_name">
                                        <span>Họ Tên</span>
                                        <span className="th_name_sort_icon_wrapper" onClick={onToggleSortByName}>
                                            {sortByName === 1 ? <FaSortAlphaDown /> : <FaSortAlphaDownAlt />}
                                        </span>
                                    </th>
                                    <th>Ngày Sinh</th>
                                    <th>Giới Tính</th>
                                    <th>Số Điện Thoại</th>
                                    <th>Trạng Thái</th>
                                    <th>Hoạt Động</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList.length > 0 &&
                                    studentList.map((student, index) => (
                                        <tr
                                            key={student._id + index}
                                            ref={index + 1 === studentList.length ? lastStudentElement : null}
                                        >
                                            <td>{index + 1}</td>
                                            <td className="msv_st">{handleStringValue(student.userId)}</td>
                                            <td className="name_st">
                                                {toFullName({
                                                    lastName: student.lastName,
                                                    firstName: student.firstName
                                                })}
                                            </td>
                                            <td className="dob_st">
                                                {student?.birthday
                                                    ? new Date(student.birthday).toLocaleDateString('en-GB')
                                                    : handleStringValue('')}
                                            </td>
                                            <td className="gender_st">
                                                {handleStringValue(capitalizeFirstLetter(student?.gender || ''))}
                                            </td>
                                            <td className="phone_st">{handleStringValue(student.phone)}</td>
                                            <td>
                                                <span
                                                    className={`state ${student.isActive ? 'hoat_dong' : 'da_khoa'} `}
                                                >
                                                    {student.isActive ? 'Hoạt Động' : 'Đã Khóa'}
                                                </span>
                                            </td>
                                            <td
                                                onClick={() => {
                                                    onToggleGoalDetailsModal(index);
                                                }}
                                                className="goal_details_btn"
                                            >
                                                Xem Chi Tiết
                                            </td>
                                            <td>
                                                <abbr title="Chỉnh sửa thông tin">
                                                    <button
                                                        className="editing_student_btn"
                                                        onClick={() => {
                                                            onToggleVisibleStudentDetailsModal(index);
                                                        }}
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                </abbr>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        {studentList.length === 0 && <EmptyDataNotification />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Student;
