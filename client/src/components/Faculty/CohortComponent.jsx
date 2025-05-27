import { Fragment, useEffect, useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import { IoIosAddCircleOutline } from 'react-icons/io';
import CohortModal from '../Modal/CohortModal';
import { capitalizeFirstLetter } from '../../utils/handleString';
import { useDispatch } from 'react-redux';
import { deleteCohort } from '../../redux/actions/facultyAction';
import ConfirmModal from '../Modal/ConfirmModal';
import FacultySearchFilter from '../Filter/FacultySearchFilter';
import { FaRegTrashAlt } from 'react-icons/fa';

function CohortComponent({ faculty }) {
    const dispatch = useDispatch();
    const facultyData = faculty?.facultyData;
    const [facultyList, setFacultyList] = useState([]);
    const [isDisplayCreateCohortModal, setIsDisplayCreateCohortModal] = useState(false);
    const [isDisplayUpdateCohortModal, setIsDisplayUpdateCohortModal] = useState(false);
    const [isDisplayDeleteCohortModal, setIsDisplayDeleteCohortModal] = useState(false);
    const [currentFacultyIndex, setCurrentFacultyIndex] = useState('');
    const [currentMajorIndex, setCurrentMajorIndex] = useState('');
    const [currentCohortIndex, setCurrentCohortIndex] = useState('');
    const currentFaculty = facultyData[currentFacultyIndex];
    const currentMajor = currentFaculty?.majors[currentMajorIndex];
    const currentCohort = currentMajor?.cohorts[currentCohortIndex];

    const handleToggleDisplayAddCohortModal = () => {
        setIsDisplayCreateCohortModal((prev) => !prev);
    };

    const handleToggleDisplayUpdateCohortModal = () => {
        setIsDisplayUpdateCohortModal((prev) => !prev);
    };

    const handleToggleDisplayDeleteCohortModal = () => {
        setIsDisplayDeleteCohortModal((prev) => !prev);
    };

    const handleDeleteCohort = () => {
        if (!currentFaculty || !currentMajor || !currentCohort) return;

        dispatch(
            deleteCohort({
                facultyId: currentFaculty._id,
                majorId: currentMajor._id,
                cohortId: currentCohort._id
            })
        );
    };

    useEffect(() => {
        if (facultyData.length > 0) setFacultyList(facultyData);
    }, [JSON.stringify(facultyData)]);

    return (
        <Fragment>
            {isDisplayCreateCohortModal && (
                <CohortModal
                    onHiddenModal={handleToggleDisplayAddCohortModal}
                    facultyState={faculty}
                    header="Tạo Khoá Sinh Viên"
                />
            )}

            {isDisplayUpdateCohortModal && (
                <CohortModal
                    onHiddenModal={handleToggleDisplayUpdateCohortModal}
                    faculty={currentFaculty}
                    major={currentMajor}
                    cohort={currentCohort}
                    header="Cập Nhật Khóa Sinh Viên"
                />
            )}

            {isDisplayDeleteCohortModal && (
                <ConfirmModal
                    headerContent="Xóa khóa sinh viên"
                    bodyContent="Bạn chắn chắn muốn xóa khóa sinh viên này"
                    noteContent="Chỉ có thể xóa các khóa sinh viên chưa có người tham gia."
                    onAccept={handleDeleteCohort}
                    toggleConfirmModalDisplay={handleToggleDisplayDeleteCohortModal}
                />
            )}

            <div className="table_heading">
                <div className="options">
                    <FacultySearchFilter
                        setFacultyList={setFacultyList}
                        majorFilter={true}
                        cohortFilter={true}
                        facultyData={facultyData}
                    />

                    <button className="create_major_btn" onClick={handleToggleDisplayAddCohortModal}>
                        <IoIosAddCircleOutline size={20} />
                        <span>Tạo Khóa Mới</span>
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Tên Khoa</th>
                        <th>Chuyên Ngành</th>
                        <th>Khóa Sinh Viên</th>
                        <th>Tình Trạng</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>

                <tbody>
                    {facultyList.reduce((arr, facultyItem, facultyIndex) => {
                        const majors = facultyItem.majors;
                        if (majors.length === 0) return arr;

                        const cohortsLength = majors.reduce((total, major) => {
                            return total + major.cohorts.length;
                        }, 0);

                        return [
                            ...arr,
                            ...majors.reduce((arr, major, majorIndex) => {
                                const cohorts = major.cohorts;

                                return [
                                    ...arr,
                                    cohorts.map((cohort, index) => {
                                        return (
                                            <tr key={cohort._id}>
                                                {majorIndex === 0 && index === 0 && (
                                                    <td rowSpan={cohortsLength}>
                                                        {capitalizeFirstLetter(facultyItem.facultyName)}
                                                    </td>
                                                )}

                                                {index === 0 && (
                                                    <td rowSpan={cohorts.length}>
                                                        <div className="major_item" key={major._id}>
                                                            <span>{capitalizeFirstLetter(major.majorName)}</span>
                                                        </div>
                                                    </td>
                                                )}

                                                <td className="cohort_td">
                                                    {capitalizeFirstLetter(cohort.cohortName)}
                                                </td>
                                                <td className={`status ${cohort.isActive ? 'active' : 'inactive'}`}>
                                                    {cohort.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
                                                </td>
                                                <td>
                                                    <div className="interactive_btn_wrapper">
                                                        <div
                                                            className="updated_btn"
                                                            onClick={() => {
                                                                setCurrentFacultyIndex(facultyIndex);
                                                                setCurrentMajorIndex(majorIndex);
                                                                setCurrentCohortIndex(index);
                                                                handleToggleDisplayUpdateCohortModal();
                                                            }}
                                                        >
                                                            <TbEdit size={22} />
                                                        </div>

                                                        <div
                                                            className="delete_btn"
                                                            onClick={() => {
                                                                setCurrentFacultyIndex(facultyIndex);
                                                                setCurrentMajorIndex(majorIndex);
                                                                setCurrentCohortIndex(index);
                                                                handleToggleDisplayDeleteCohortModal();
                                                            }}
                                                        >
                                                            <FaRegTrashAlt size={18} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ];
                            }, [])
                        ];
                    }, [])}
                </tbody>
            </table>
        </Fragment>
    );
}

export default CohortComponent;
