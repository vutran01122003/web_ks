import { useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import { capitalizeFirstLetter } from '../../utils/handleString';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/actions/studentAction';
import ConfirmModal from '../Modal/ConfirmModal';

function StudentDetailsModal({ currentUserData, onToggleModal, facultyState }) {
    const dispatch = useDispatch();

    const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);

    const dateParts = currentUserData?.birthday
        ? new Date(currentUserData?.birthday).toLocaleDateString().split('/')
        : '';

    const addZeroPrefix = (number) => {
        return number < 10 ? '0' + number : number;
    };

    const [userData, setUserData] = useState({
        userId: currentUserData?.userId || '',
        firstName: capitalizeFirstLetter(currentUserData?.firstName) || '',
        lastName: capitalizeFirstLetter(currentUserData?.lastName) || '',
        gender: capitalizeFirstLetter(currentUserData?.gender) || '',
        email: currentUserData?.email || '',
        phone: currentUserData?.phone || '',
        birthday: dateParts
            ? `${dateParts[2]}-${addZeroPrefix(dateParts[1])}-${addZeroPrefix(dateParts[0])}`
            : dateParts,
        major: currentUserData?.major || '',
        cohort: currentUserData?.cohort || '',
        isActive: currentUserData?.isActive || false,
        password: ''
    });

    const onToggleConfirmModal = () => {
        setIsVisibleConfirmModal((prev) => !prev);
    };

    const onUpdateUser = () => {
        dispatch(
            updateUser({
                userId: currentUserData._id,
                userData
            })
        );
        onToggleModal();
    };

    const onCloseModal = (e) => {
        if (e.target === e.currentTarget) onToggleModal();
    };

    const onChangeUserData = (e) => {
        const key = e.target.name;
        const value = e.target.value;

        const obj = { [key]: value };

        if (key === 'major') {
            obj.cohort = '';
        } else if (key === 'isActive') {
            obj[key] = value === 'true';
        }

        setUserData((prev) => ({
            ...prev,
            ...obj
        }));
    };

    return (
        <div className="modal_overlap" onDoubleClick={onCloseModal}>
            <div className="box_wrapper student_details_modal">
                <div className="modal_header student_details_header">
                    <h3>Thông tin kỹ sư</h3>
                    <span className="modal_close_icon_wrapper" onClick={onToggleModal}>
                        <HiMiniXMark />
                    </span>
                </div>
                <div className="student_details_body">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="userId">
                                        Mã Sinh Viên:
                                    </label>
                                </td>
                                <td>
                                    <input
                                        className="input_item"
                                        id="userId"
                                        name="userId"
                                        type="text"
                                        placeholder="Nhập Mã Sinh Viên"
                                        value={userData.userId}
                                        onChange={onChangeUserData}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="lastName">
                                        Họ Đệm:
                                    </label>
                                </td>
                                <td>
                                    <input
                                        className="input_item"
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Nhập Họ Đệm"
                                        value={userData.lastName}
                                        onChange={onChangeUserData}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="firstName">
                                        Tên Sinh Viên:
                                    </label>
                                </td>
                                <td>
                                    <input
                                        className="input_item"
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="Nhập Tên"
                                        value={userData.firstName}
                                        onChange={onChangeUserData}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="email">
                                        Địa Chỉ Email:
                                    </label>
                                </td>
                                <td>
                                    <input
                                        className="input_item"
                                        id="email"
                                        name="email"
                                        type="text"
                                        placeholder="Nhập Email"
                                        value={userData.email}
                                        onChange={onChangeUserData}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="gender">
                                        Giới Tính:
                                    </label>
                                </td>
                                <td>
                                    <select
                                        value={userData.gender}
                                        className="select_item"
                                        name="gender"
                                        onChange={onChangeUserData}
                                    >
                                        <option value="nam">Nam</option>
                                        <option value="nữ">Nữ</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="dob">
                                        Ngày Sinh:
                                    </label>
                                </td>
                                <td>
                                    <input
                                        className="input_item"
                                        id="dob"
                                        name="birthday"
                                        type="date"
                                        onChange={onChangeUserData}
                                        value={userData.birthday.toString()}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="phone">
                                        Số Điện Thoại:
                                    </label>
                                </td>
                                <td>
                                    <input
                                        className="input_item"
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        placeholder="Nhập Số Điện Thoại"
                                        value={userData.phone}
                                        onChange={onChangeUserData}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="major">
                                        Chuyên Ngành:
                                    </label>
                                </td>
                                <td>
                                    <select
                                        className="select_item"
                                        id="major"
                                        name="major"
                                        value={userData.major}
                                        onChange={onChangeUserData}
                                    >
                                        <option value="">Chọn Chuyên Ngành</option>
                                        {facultyState.faculty.majors.length > 0 &&
                                            facultyState.faculty.majors.map((major) => (
                                                <option key={major._id} value={major.majorName}>
                                                    {capitalizeFirstLetter(major.majorName)}
                                                </option>
                                            ))}
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="cohort">
                                        Khóa Sinh Viên:
                                    </label>
                                </td>
                                <td>
                                    <select
                                        className="select_item"
                                        id="cohort"
                                        name="cohort"
                                        value={userData.cohort}
                                        onChange={onChangeUserData}
                                    >
                                        <option value="">Chọn Khóa</option>
                                        {userData.major &&
                                            facultyState.faculty.majors
                                                .find((major) => major.majorName === userData.major)
                                                .cohortList.map((cohort) => (
                                                    <option key={cohort._id} value={cohort.cohortName}>
                                                        {cohort.cohortName}
                                                    </option>
                                                ))}
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item" htmlFor="password">
                                        Mật Khẩu Mới:
                                    </label>
                                </td>
                                <td>
                                    <input
                                        className="input_item"
                                        id="password"
                                        name="password"
                                        type="text"
                                        placeholder="Không Bắt Buộc"
                                        value={userData.password}
                                        onChange={onChangeUserData}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label className="label_item">Trạng Thái:</label>
                                </td>
                                <td>
                                    <div className="radio_group">
                                        <div className="radio_item">
                                            <input
                                                id="active"
                                                type="radio"
                                                name="isActive"
                                                value={true}
                                                onChange={onChangeUserData}
                                                checked={true === userData.isActive}
                                            />
                                            <label htmlFor="active">Hoạt Động</label>
                                        </div>

                                        <div className="radio_item">
                                            <input
                                                id="inactive"
                                                type="radio"
                                                name="isActive"
                                                value={false}
                                                onChange={onChangeUserData}
                                                checked={false === userData.isActive}
                                            />
                                            <label htmlFor="inactive">Đã Khóa</label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="student_details_footer">
                    <button className="close_btn" onClick={onToggleModal}>
                        Thoát
                    </button>

                    {isVisibleConfirmModal && (
                        <ConfirmModal
                            headerContent="Cập Nhật Thông Tin Kỹ Sư"
                            bodyContent="Bạn chắn chắn muốn cập nhật thông tin kỹ sư"
                            noteContent="Nếu bạn thay đổi chuyên ngành hoặc khóa sinh viên thì toàn bộ tiến độ và điểm của sinh viên sẽ mất đi và không bao giờ khôi phục lại được. Vui lòng cân nhắc kỹ trước khi chỉnh sửa !"
                            onAccept={onUpdateUser}
                            toggleConfirmModalDisplay={onToggleConfirmModal}
                        />
                    )}

                    <button className="update_btn" onClick={onToggleConfirmModal}>
                        Cập Nhật
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudentDetailsModal;
