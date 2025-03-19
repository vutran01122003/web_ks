import { Fragment, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { MdRemoveCircle } from 'react-icons/md';
import CreateMajorModal from '../Modal/CreateMajorModal';
import { IoIosAddCircleOutline, IoMdAddCircle } from 'react-icons/io';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';

function MajorComponent({ faculty }) {
    const [isDisplayAddMajorsModal, setIsDisplayAddMajorsModal] = useState(false);

    const handleToggleDisplayAddMajorsModal = (facultyId) => {
        setIsDisplayAddMajorsModal((prev) => !prev);
    };

    return (
        <Fragment>
            {isDisplayAddMajorsModal && (
                <CreateMajorModal onHiddenModal={handleToggleDisplayAddMajorsModal} faculty={faculty} />
            )}

            <div className="table_heading">
                <h3 className="heading">Danh Sách Chuyên Ngành</h3>
                <button className="create_major_btn" onClick={handleToggleDisplayAddMajorsModal}>
                    <IoIosAddCircleOutline size={20} />
                    <span>Tạo Chuyên Ngành Mới</span>
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Tên Khoa</th>
                        <th>Chuyên Ngành</th>
                        <th>Quản Lý Chuyên Ngành</th>
                        <th>Tình Trạng</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>

                <tbody>
                    {faculty.facultyData.reduce((arr, facultyItem) => {
                        const majors = facultyItem.majors;

                        return [
                            ...arr,
                            ...majors.map((major, index) => {
                                return (
                                    <tr key={major._id}>
                                        {index === 0 && (
                                            <td rowSpan={majors.length}>
                                                {capitalizeFirstLetter(facultyItem.facultyName)}
                                            </td>
                                        )}

                                        <td>
                                            <div className="major_item" key={major._id}>
                                                <span>{capitalizeFirstLetter(major.majorName)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {major.managers.map((manager) => {
                                                const { lastName, firstName, userId } = manager;
                                                return (
                                                    <div key={userId}>
                                                        {`${userId || 'Chưa Cập Nhật'} - ${toFullName({ lastName, firstName })}`}
                                                    </div>
                                                );
                                            })}
                                        </td>
                                        <td className={`status ${major.isActive ? 'active' : 'inactive'}`}>
                                            {major.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
                                        </td>
                                        <td className="interactive_btn_wrapper">
                                            <div className="updated_btn">
                                                <FaPen /> <span>Chỉnh Sửa Chuyên Ngành</span>
                                            </div>
                                            <div
                                                className="add_btn"
                                                onClick={() => {
                                                    handleToggleDisplayAddMajorsModal(facultyItem._id);
                                                }}
                                            >
                                                <IoMdAddCircle /> <span>Thêm Quản Lý Chuyên Ngành</span>
                                            </div>

                                            <div className="delete_btn">
                                                <MdRemoveCircle /> <span>Xóa Quản Lý Chuyên Ngành</span>
                                            </div>

                                            <div className="delete_btn">
                                                <MdRemoveCircle /> <span>Ẩn Chuyên Ngành</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ];
                    }, [])}
                </tbody>
            </table>
        </Fragment>
    );
}

export default MajorComponent;
