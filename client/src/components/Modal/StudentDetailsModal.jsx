import { useRef, useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import { capitalizeFirstLetter } from '../../utils/handleString';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/actions/studentAction';
import GLOBALTYPES from '../../redux/actions/globalTypes';

function StudentDetailsModal({ currentUserData, onToggleModal }) {
    const dispatch = useDispatch();
    const dateRef = useRef();

    const [userData, setUserData] = useState({
        userId: currentUserData?.userId || '',
        firstName: capitalizeFirstLetter(currentUserData?.firstName) || '',
        lastName: capitalizeFirstLetter(currentUserData?.lastName) || '',
        gender: currentUserData?.gender || '',
        email: currentUserData?.email || '',
        phone: currentUserData?.phone || '',
        birthday: currentUserData?.birthday || '',
        isActive: currentUserData?.isActive || false,
        password: ''
    });

    console.log(userData);

    const onUpdateUser = () => {
        const newUserData = { ...userData };
        delete newUserData.password;

        if (!Object.values(newUserData).every((value) => value)) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });
        }

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
                                        <option value="">Chọn giới tính</option>
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
                                <td className="dob_td">
                                    <input
                                        ref={dateRef}
                                        className="input_item input_item_ref"
                                        id="dob"
                                        name="birthday"
                                        type="date"
                                        onChange={onChangeUserData}
                                        value={userData.birthday}
                                        max="2006-12-31"
                                    />
                                    <input
                                        className="input_item input_item_display"
                                        type="text"
                                        onChange={onChangeUserData}
                                        readOnly
                                        value={new Date(userData.birthday).toLocaleDateString('en-GB')}
                                        onClick={() => {
                                            if (dateRef.current) dateRef.current.showPicker();
                                        }}
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

                    <button className="update_btn" onClick={onUpdateUser}>
                        Cập Nhật
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudentDetailsModal;
