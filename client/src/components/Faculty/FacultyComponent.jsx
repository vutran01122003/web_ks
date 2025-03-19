import { Fragment, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { MdRemoveCircle } from 'react-icons/md';
import CreateFacultyModal from '../Modal/CreateFacultyModal';
import { IoIosAddCircleOutline, IoMdAddCircle } from 'react-icons/io';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';

function FacultyComponent({ faculty }) {
    const [isDisplayCreateFacultyModal, setIsDisplayCreateFacultyModal] = useState(false);

    const handleToggleDisplayCreateFacultyModal = () => {
        setIsDisplayCreateFacultyModal((prev) => !prev);
    };

    return (
        <Fragment>
            {isDisplayCreateFacultyModal && (
                <CreateFacultyModal onHiddenModal={handleToggleDisplayCreateFacultyModal} />
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
                        <th>Quản Lý Khoa</th>
                        <th>Tình Trạng</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>

                <tbody>
                    {faculty.facultyData.map((facultyItem) => (
                        <tr key={facultyItem._id}>
                            <td>{capitalizeFirstLetter(facultyItem.facultyName)}</td>
                            <td>
                                {facultyItem.managers.map((manager) => {
                                    const { lastName, firstName, userId } = manager;
                                    return (
                                        <div key={userId}>
                                            <span>
                                                {userId} - {toFullName({ lastName, firstName })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </td>
                            <td className={`status ${facultyItem.isActive ? 'active' : 'inactive'}`}>
                                {facultyItem.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
                            </td>
                            <td className="interactive_btn_wrapper">
                                <div className="updated_btn">
                                    <FaPen /> <span>Chỉnh Sửa Khoa</span>
                                </div>
                                <div
                                    className="add_btn"
                                    onClick={() => {
                                        handleToggleDisplayAddMajorsModal(facultyItem._id);
                                    }}
                                >
                                    <IoMdAddCircle /> <span>Thêm Quản Lý Khoa</span>
                                </div>

                                <div className="delete_btn">
                                    <MdRemoveCircle /> <span>Xóa Quản Lý Khoa</span>
                                </div>

                                <div className="delete_btn">
                                    <MdRemoveCircle /> <span>Ẩn Khoa</span>
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
