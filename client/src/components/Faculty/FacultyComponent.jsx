import { Fragment, useEffect, useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import { TiDeleteOutline } from 'react-icons/ti';
import FacultyModal from '../Modal/FacultyModal';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
import { useDispatch } from 'react-redux';
import { deleteFaculty } from '../../redux/actions/facultyAction';
import ConfirmModal from '../Modal/ConfirmModal';
import FacultySearchFilter from '../Filter/FacultySearchFilter';
import { FaRegTrashAlt } from 'react-icons/fa';

function FacultyComponent({ faculty }) {
    const dispatch = useDispatch();
    const facultyData = faculty.facultyData;
    const [facultyList, setFacultyList] = useState([]);
    const [isDisplayCreateFacultyModal, setIsDisplayCreateFacultyModal] = useState(false);
    const [isDisplayUpdateFacultyModal, setIsDisplayUpdateFacultyModal] = useState(false);
    const [isDisplayDeleteFacultyModal, setIsDisplayDeleteFacultyModal] = useState(false);
    const [currentFacultyIndex, setCurrentFacultyIndex] = useState(null);
    const currentFaculty = facultyData[currentFacultyIndex];

    const handleToggleDisplayCreateFacultyModal = () => {
        setIsDisplayCreateFacultyModal((prev) => !prev);
    };

    const handleToggleDisplayUpdateFacultyModal = () => {
        setIsDisplayUpdateFacultyModal((prev) => !prev);
    };

    const handleToggleDisplayDeleteFacultyModal = () => {
        setIsDisplayDeleteFacultyModal((prev) => !prev);
    };

    const handleDeleteFaculty = () => {
        dispatch(deleteFaculty({ facultyId: currentFaculty._id }));
    };

    useEffect(() => {
        if (facultyData.length > 0) setFacultyList(facultyData);
    }, [JSON.stringify(facultyData)]);

    return (
        <Fragment>
            {isDisplayCreateFacultyModal && (
                <FacultyModal onHiddenModal={handleToggleDisplayCreateFacultyModal} header="Tạo Mới Khoa" />
            )}

            {isDisplayUpdateFacultyModal && (
                <FacultyModal
                    onHiddenModal={handleToggleDisplayUpdateFacultyModal}
                    header={`Chỉnh Sửa Khoa ${currentFaculty.facultyName}`}
                    faculty={currentFaculty}
                />
            )}

            {isDisplayDeleteFacultyModal && (
                <ConfirmModal
                    headerContent="Xóa Khoa"
                    bodyContent="Bạn chắc chắn muốn xóa khoa này"
                    noteContent="Chỉ có thể xóa các khoa chưa có người tham gia."
                    onAccept={handleDeleteFaculty}
                    toggleConfirmModalDisplay={handleToggleDisplayDeleteFacultyModal}
                />
            )}

            <div className="table_heading">
                <div className="options">
                    <FacultySearchFilter setFacultyList={setFacultyList} facultyData={facultyData} />
                    <button className="create_faculty_btn" onClick={handleToggleDisplayCreateFacultyModal}>
                        <IoIosAddCircleOutline size={20} />
                        <span>Tạo Khoa Mới</span>
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Tên Khoa</th>
                        <th>Chuyên Ngành</th>
                        <th>Tình Trạng</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>

                <tbody>
                    {facultyList.map((facultyItem, index) => (
                        <tr key={facultyItem._id}>
                            <td>{capitalizeFirstLetter(facultyItem.facultyName)}</td>
                            <td>
                                {facultyItem.majors.map((major, index) => (
                                    <div className="major_item" key={index}>
                                        {capitalizeFirstLetter(major.majorName)}
                                    </div>
                                ))}
                            </td>
                            <td className={`status ${facultyItem.isActive ? 'active' : 'inactive'}`}>
                                {facultyItem.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
                            </td>

                            <td>
                                <div className="interactive_btn_wrapper">
                                    <div
                                        className="updated_btn"
                                        onClick={() => {
                                            handleToggleDisplayUpdateFacultyModal();
                                            setCurrentFacultyIndex(index);
                                        }}
                                    >
                                        <TbEdit size={22} />
                                    </div>
                                    <div
                                        className="delete_btn"
                                        onClick={() => {
                                            setCurrentFacultyIndex(index);
                                            handleToggleDisplayDeleteFacultyModal();
                                        }}
                                    >
                                        <FaRegTrashAlt size={18} />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
}

export default FacultyComponent;
