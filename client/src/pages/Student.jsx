import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getStudents } from '../redux/actions/studentAction';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import ConfirmModal from '../components/ComponentModal/ConfirmModal';
import { importUser } from '../redux/actions/excelAction';
import { facultySelector, studentSelector } from '../redux/selector';
import { capitalizeFirstLetter, toFullName } from '../utils/handleString';
import SearchFilterComponent from '../components/ComponentFilterData/SearchFilter';
import StudentDetailsModal from '../components/ComponentModal/StudentDetailsModal';
import GoalDetailsModal from '../components/ComponentModal/GoalDetailsModal';
import EmptyDataNotification from '../components/ComponentEmptyData/EmptyDataNotification';

const Student = () => {
    const LIMIT = import.meta.env.VITE_APP_API_LIMIT;
    const dispatch = useDispatch();
    const observe = useRef();
    const fileRef = useRef();

    const facultyState = useSelector(facultySelector);
    const studentState = useSelector(studentSelector);

    const [userId, setUserId] = useState('');
    const [major, setMajor] = useState('');
    const [cohort, Setcohort] = useState('');
    const [talentEngineerType, setTalentEngineerType] = useState('');
    const [status, setStatus] = useState('');

    const [pageNumber, setPageNumber] = useState(1);
    const [sortByName, setSortByName] = useState(1);
    const [file, setFile] = useState('');
    const [currentUserData, setCurrentUserData] = useState(null);
    const [isVisibleGoalDetailsModal, setIsVisibleGoalDetailsModal] = useState(false);
    const [isVisibleStudentDetailsModal, setIsVisibleStudentDetailsModal] = useState(false);

    const handleChangeUserId = (e) => {
        setUserId(e.target.value);
    };

    const handleFileSelected = (e) => {
        const file = Array.from(e.target.files)[0];
        setFile(file);
    };

    const onHiddenExcelModalDisplay = () => {
        setFile('');
        fileRef.current.value = '';
    };

    const onImportUser = () => {
        const formData = new FormData();
        formData.set('file', file);

        dispatch(importUser(formData));
        onHiddenExcelModalDisplay();
    };

    const onToggleVisibleStudentDetailsModal = (index) => {
        setIsVisibleStudentDetailsModal((prev) => !prev);
        if (index === undefined) setCurrentUserData(null);
        else setCurrentUserData(studentState.studentList[index]);
    };

    const onToggleGoalDetailsModal = (index) => {
        setIsVisibleGoalDetailsModal((prev) => !prev);
        if (index === undefined) setCurrentUserData(null);
        else setCurrentUserData(studentState.studentList[index]);
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
                limit: LIMIT,
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

            {file && (
                <ConfirmModal
                    headerContent={'Thêm Sinh Viên Mới'}
                    bodyContent={'Bạn chắc chắn muốn thêm những sinh viên có trong file này không ?'}
                    noteContent={
                        'Yêu cầu định dạng excel và đặt đúng tên và vị trí các cột như sau: STT | MSSV | Họ đệm | Tên | Ngày sinh | Khoa | Chuyên ngành | Khóa | Email | Điện thoại'
                    }
                    toggleConfirmModalDisplay={onHiddenExcelModalDisplay}
                    onAccept={onImportUser}
                />
            )}

            <div className="container_st__manager">
                <div className="body__data--st">
                    <div className="line__sort">
                        <div className="filter_group">
                            <SearchFilterComponent
                                setMajorValue={setMajor}
                                setCohortValue={Setcohort}
                                setTalentEngineerType={setTalentEngineerType}
                                setStatus={setStatus}
                                majorValue={major}
                                cohortValue={cohort}
                                talentEngineerType={talentEngineerType}
                                statusValue={status}
                            />

                            <input
                                type="text"
                                name="userId"
                                placeholder="Nhập Mã Sinh Viên"
                                onChange={handleChangeUserId}
                            />
                        </div>

                        <div className="search_wrapper">
                            <div className="btn_group">
                                <button
                                    className="student_search_btn"
                                    onClick={() => {
                                        onClickGetStudentListBtn({
                                            page: 1,
                                            sortByName
                                        });
                                    }}
                                >
                                    Tìm Kiếm
                                </button>

                                <div className="add_student_btn_wrapper">
                                    <label htmlFor="excelfile">Thêm Kỹ Sư</label>
                                    <input
                                        type="file"
                                        id="excelfile"
                                        name="excelfile"
                                        hidden
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        onChange={handleFileSelected}
                                        ref={fileRef}
                                    />
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
                                {studentState.studentList.length > 0 &&
                                    studentState.studentList.map((student, index) => (
                                        <tr
                                            key={student._id + index}
                                            ref={
                                                index + 1 === studentState.studentList.length
                                                    ? lastStudentElement
                                                    : null
                                            }
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

                        {studentState.studentList.length === 0 && <EmptyDataNotification />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Student;
