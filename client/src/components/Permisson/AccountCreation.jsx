import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { capitalizeFirstLetter } from '../../utils/handleString';
import { register } from '../../redux/actions/authAction';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { getFacultyManagers } from '../../redux/actions/permissonAction';
const { VITE_APP_MAJOR_MANAGER_CODE } = import.meta.env;

function AccountCreatetion({ facultyData, onToggleModal }) {
    const dispatch = useDispatch();
    const dateRef = useRef();
    const [currentFaculty, setCurrentFaculty] = useState('');
    const [currentMajor, setCurrentMajor] = useState('');

    const [formData, setFormData] = useState({
        userId: '',
        lastName: '',
        firstName: '',
        birthday: '',
        groupCode: VITE_APP_MAJOR_MANAGER_CODE,
        email: '',
        phone: '',
        gender: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resetFormData = () => {
        setFormData({
            userId: '',
            lastName: '',
            firstName: '',
            birthday: '',
            groupCode: VITE_APP_MAJOR_MANAGER_CODE,
            email: '',
            phone: '',
            gender: ''
        });
    };

    const resetFacultyData = () => {
        setCurrentFaculty('');
        setCurrentMajor('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.userId || !formData.firstName || !formData.groupCode) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui Lòng Nhập Những Trường Bắt Buộc'
                }
            });
        } else {
            dispatch(
                register({
                    ...formData,
                    faculty: currentFaculty?.facultyName,
                    major: currentMajor?.majorName,
                    isDirectRegister: false
                })
            ).then(() => {
                dispatch(
                    getFacultyManagers({
                        groupCode: VITE_APP_MAJOR_MANAGER_CODE
                    })
                );

                onToggleModal();
            });

            resetFormData();
            resetFacultyData();
        }
    };

    const handleChangeFacultySelect = (e) => {
        const value = e.target.value;
        setCurrentFaculty(value ? JSON.parse(value) : '');
    };

    const handleChangeMajorSelect = (e) => {
        const value = e.target.value;
        setCurrentMajor(value ? JSON.parse(value) : '');
    };

    useEffect(() => {
        resetFacultyData();
    }, [formData.groupCode]);

    useEffect(() => {
        setCurrentMajor('');
    }, [currentFaculty]);

    return (
        <div className="user_form_container">
            <form onSubmit={handleSubmit}>
                <div className="input_item">
                    <label>Mã Giảng Viên:</label>
                    <input
                        type="text"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                        placeholder="Nhập Mã Số"
                    />
                </div>

                <div className="input_item">
                    <label>Họ Tên:</label>
                    <input
                        type="text"
                        name="lastName"
                        className="lastname_input"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Nhập Họ Đệm"
                        required
                    />
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Nhập Tên"
                    />
                </div>

                <div className="input_item">
                    <label>Ngày Sinh:</label>
                    <div className="birthday_input_wrapper">
                        <div
                            className="birthday_input"
                            onClick={() => {
                                dateRef.current.showPicker();
                            }}
                        >
                            {formData.birthday ? new Date(formData.birthday).toLocaleDateString('en-GB') : 'dd/mm/yyyy'}
                        </div>
                        <input
                            ref={dateRef}
                            id="date_input"
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                            lang="vi"
                            required
                            max="2006-12-31"
                        />
                    </div>
                </div>

                <div className="input_item">
                    <label>Giới Tính:</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Chọn Giới Tính</option>
                        <option value="nam">Nam</option>
                        <option value="nữ">Nữ</option>
                    </select>
                </div>

                <div className="input_item">
                    <label>Số Điện Thoại:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập Số Điện Thoại"
                        required
                    />
                </div>

                <div className="input_item">
                    <label>Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập Email"
                        required
                    />
                </div>

                <div className="input_item">
                    <label>Khoa:</label>
                    <select
                        value={currentFaculty ? JSON.stringify(currentFaculty) : ''}
                        onChange={handleChangeFacultySelect}
                        required
                    >
                        <option value="">Chọn Khoa</option>
                        {facultyData.map((facultyItem) => (
                            <option key={facultyItem._id} value={JSON.stringify(facultyItem)}>
                                {capitalizeFirstLetter(facultyItem.facultyName)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input_item">
                    <label>Chuyên Ngành:</label>

                    <select
                        value={currentMajor ? JSON.stringify(currentMajor) : ''}
                        onChange={handleChangeMajorSelect}
                        required
                    >
                        <Fragment>
                            <option value="">Chọn Chuyên Ngành</option>
                            {currentFaculty?.majors &&
                                currentFaculty.majors.map((majorItem) => (
                                    <option key={majorItem._id} value={JSON.stringify(majorItem)}>
                                        {capitalizeFirstLetter(majorItem.majorName)}
                                    </option>
                                ))}
                        </Fragment>
                    </select>
                </div>
                <button type="submit">Tạo Tài Khoản</button>
            </form>
        </div>
    );
}

export default AccountCreatetion;
