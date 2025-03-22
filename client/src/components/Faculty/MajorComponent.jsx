import { Fragment, useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import MajorModal from '../Modal/MajorModal';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
import { useDispatch } from 'react-redux';
import { deleteMajor } from '../../redux/actions/facultyAction';
import ConfirmModal from '../Modal/ConfirmModal';
import { TiDeleteOutline } from 'react-icons/ti';

function MajorComponent({ faculty }) {
    const dispatch = useDispatch();
    const facultyData = faculty?.facultyData;
    const [currentFacultyIndex, setCurrentFacultyIndex] = useState(null);
    const [currentMajorIndex, setCurrentMajorIndex] = useState(null);
    const [isDisplayAddMajorModal, setIsDisplayAddMajorModal] = useState(false);
    const [isDisplayUpdateMajorModal, setIsDisplayUpdateMajorModal] = useState(false);
    const [isDisplayDeleteMajorModal, setIsDisplayDeleteMajorModal] = useState(false);
    const currentFaculty = facultyData[currentFacultyIndex];
    const currentMajor = currentFaculty?.majors[currentMajorIndex];

    const handleToggleDisplayAddMajorModal = () => {
        setIsDisplayAddMajorModal((prev) => !prev);
    };

    const handleToggleDisplayUpdateMajorModal = () => {
        setIsDisplayUpdateMajorModal((prev) => !prev);
    };

    const handleToggleDisplayDeleteMajorModal = () => {
        setIsDisplayDeleteMajorModal((prev) => !prev);
    };

    const handleDeleteMajor = () => {
        if (!currentFaculty || !currentMajor) return;

        dispatch(deleteMajor({ facultyId: currentFaculty._id, majorId: currentMajor._id }));
    };

    return (
        <Fragment>
            {isDisplayAddMajorModal && (
                <MajorModal
                    onHiddenModal={handleToggleDisplayAddMajorModal}
                    facultyState={faculty}
                    header="Tạo Mới Chuyên Ngành"
                />
            )}

            {isDisplayUpdateMajorModal && (
                <MajorModal
                    onHiddenModal={handleToggleDisplayUpdateMajorModal}
                    faculty={currentFaculty}
                    header="Cập Nhật Chuyên Ngành"
                    major={currentMajor}
                />
            )}

            {isDisplayDeleteMajorModal && (
                <ConfirmModal
                    headerContent="Xóa Chuyên Ngành"
                    bodyContent="Bạn chắn chắc muốn xóa chuyên ngành này"
                    noteContent="Chỉ có thể xóa các chuyên ngành chưa có người tham gia."
                    onAccept={handleDeleteMajor}
                    toggleConfirmModalDisplay={handleToggleDisplayDeleteMajorModal}
                />
            )}

            <div className="table_heading">
                <h3 className="heading">Danh Sách Chuyên Ngành</h3>
                <button className="create_major_btn" onClick={handleToggleDisplayAddMajorModal}>
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
                    {faculty.facultyData.reduce((arr, facultyItem, facultyIndex) => {
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
                                            {major.managers.length === 0 ? (
                                                <span>Trống</span>
                                            ) : (
                                                major.managers.map((manager) => {
                                                    const { lastName, firstName, userId } = manager;
                                                    return (
                                                        <div key={userId} className="manager_item">
                                                            {`${userId || 'Chưa Cập Nhật'} - ${toFullName({ lastName, firstName })}`}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </td>
                                        <td className={`status ${major.isActive ? 'active' : 'inactive'}`}>
                                            {major.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
                                        </td>
                                        <td className="interactive_btn_wrapper">
                                            <div
                                                className="updated_btn"
                                                onClick={() => {
                                                    setCurrentFacultyIndex(facultyIndex);
                                                    setCurrentMajorIndex(index);
                                                    handleToggleDisplayUpdateMajorModal();
                                                }}
                                            >
                                                <TbEdit /> <span>Chỉnh Sửa Chuyên Ngành</span>
                                            </div>

                                            <div
                                                className="delete_btn"
                                                onClick={() => {
                                                    handleToggleDisplayDeleteMajorModal();
                                                    setCurrentFacultyIndex(facultyIndex);
                                                    setCurrentMajorIndex(index);
                                                }}
                                            >
                                                <TiDeleteOutline size={18} /> <span>Xóa Chuyên Ngành</span>
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
