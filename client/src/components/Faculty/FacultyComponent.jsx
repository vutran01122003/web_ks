import { Fragment, useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import { TiDeleteOutline } from 'react-icons/ti';
import FacultyModal from '../Modal/FacultyModal';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
import { useDispatch } from 'react-redux';
import { deleteFaculty } from '../../redux/actions/facultyAction';
import ConfirmModal from '../Modal/ConfirmModal';
import { formatTimeStr } from '../../utils/formatDatetime';

function FacultyComponent({ faculty }) {
    const dispatch = useDispatch();
    const facultyData = faculty.facultyData;
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
                <h3 className="heading">Danh Sách Khoa</h3>
                <button className="create_faculty_btn" onClick={handleToggleDisplayCreateFacultyModal}>
                    <IoIosAddCircleOutline size={20} />
                    <span>Tạo Khoa Mới</span>
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Tên Khoa</th>
                        <th>Tình Trạng</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>

                <tbody>
                    {facultyData.map((facultyItem, index) => (
                        <tr key={facultyItem._id}>
                            <td>{capitalizeFirstLetter(facultyItem.facultyName)}</td>

                            <td className={`status ${facultyItem.isActive ? 'active' : 'inactive'}`}>
                                {facultyItem.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
                            </td>

                            <td className="interactive_btn_wrapper">
                                <div
                                    className="updated_btn"
                                    onClick={() => {
                                        handleToggleDisplayUpdateFacultyModal();
                                        setCurrentFacultyIndex(index);
                                    }}
                                >
                                    <TbEdit size={18} /> <span>Chỉnh Sửa Khoa</span>
                                </div>
                                <div
                                    className="delete_btn"
                                    onClick={() => {
                                        setCurrentFacultyIndex(index);
                                        handleToggleDisplayDeleteFacultyModal();
                                    }}
                                >
                                    <TiDeleteOutline size={18} /> <span>Xóa Khoa</span>
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
