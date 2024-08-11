import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { facultySelector, studentSelector } from '../redux/selector';
import { capitalizeFirstLetter, toFullName } from '../utils/handleString';
import { getStudents } from '../redux/actions/studentAction';
import GLOBALTYPES from '../redux/actions/globalTypes';
import StudentDetailsModal from '../components/ComponentModal/StudentDetailsModal';
import GoalDetailsModal from '../components/ComponentModal/GoalDetailsModal';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';

const Student = () => {
    const LIMIT = 20;
    const dispatch = useDispatch();
    const observe = useRef();

    const facultyState = useSelector(facultySelector);
    const studentState = useSelector(studentSelector);

    const [filterData, setFilterData] = useState({});
    const [pageNumber, setPageNumber] = useState(1);
    const [sortByName, setSortByName] = useState(1);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [isVisibleGoalDetailsModal, setIsVisibleGoalDetailsModal] = useState(false);
    const [isVisibleStudentDetailsModal, setIsVisibleStudentDetailsModal] = useState(false);

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

    const onChangeFilterData = (e) => {
        const value = e.target.value;
        const key = e.target.name;

        const temp = { ...filterData, [key]: value ? JSON.parse(value) : undefined };

        if (temp[key] === undefined) delete temp[key];

        setFilterData(temp);
    };

    const handleStringValue = (stringValue) => {
        if (!stringValue) return 'Chưa Cập Nhật';
        return stringValue;
    };

    const isValidfilterData = () => {
        const keys = Object.keys(filterData);
        if (!keys.includes('major') || !keys.includes('cohort')) return false;
        return true;
    };

    const onGetStudents = ({ page, sortByName }) => {
        const { major, cohort, status, userId } = filterData;

        if (!isValidfilterData()) {
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

    useEffect(() => {
        const temp = { ...filterData };
        if (temp?.cohort) delete temp.cohort;
        setFilterData(temp);
    }, [filterData?.major]);

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

            <div className="container_st__manager">
                <div className="body__data--st">
                    <div className="line__sort">
                        <div className="filter_group">
                            <select name="major" onChange={onChangeFilterData}>
                                <option value="">Chọn Chuyên Ngành</option>
                                {facultyState?.faculty &&
                                    facultyState.faculty.majors.map((major) => (
                                        <option key={major._id} value={JSON.stringify(major)}>
                                            {capitalizeFirstLetter(major.majorName)}
                                        </option>
                                    ))}
                            </select>

                            <select name="cohort" onChange={onChangeFilterData}>
                                <option value="">Chọn Khóa</option>
                                {filterData.major &&
                                    filterData.major.cohortList.map((cohort) => (
                                        <option key={cohort._id} value={JSON.stringify(cohort)}>
                                            {cohort.cohortName}
                                        </option>
                                    ))}
                            </select>

                            <select name="status" onChange={onChangeFilterData}>
                                <option value="">Tất cả</option>
                                <option value={true}>Đang Hoạt Động</option>
                                <option value={false}>Đã Khóa</option>
                            </select>

                            <input
                                type="text"
                                name="userId"
                                placeholder="Nhập Mã Sinh Viên"
                                onChange={onChangeFilterData}
                            />
                        </div>

                        <div className="search_wrapper">
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Student;
