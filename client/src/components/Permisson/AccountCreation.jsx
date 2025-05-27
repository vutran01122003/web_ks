import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { capitalizeFirstLetter } from '../../utils/handleString';
import { register } from '../../redux/actions/authAction';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { getFacultyManagers } from '../../redux/actions/permissonAction';
const { VITE_APP_MAJOR_MANAGER_CODE, VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE } =
    import.meta.env;

function AccountCreatetion({ faculty }) {
    const dispatch = useDispatch();
    const facultyData = faculty.facultyData;
    const dateRef = useRef();
    const [currentFaculty, setCurrentFaculty] = useState('');
    const [currentMajor, setCurrentMajor] = useState('');
    const [currentCohort, setCurrentCohort] = useState('');
    const levelYear = currentCohort ? currentCohort.currentLevelYear : '';

    const [formData, setFormData] = useState({
        userId: '',
        lastName: '',
        firstName: '',
        birthday: '',
        groupCode: '',
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
            groupCode: '',
            email: '',
            phone: '',
            gender: ''
        });
    };

    const resetFacultyData = () => {
        setCurrentFaculty('');
        setCurrentMajor('');
        setCurrentCohort('');
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
                    cohort: currentCohort?.cohortName,
                    levelYear,
                    isDirectRegister: false
                })
            ).then(() => {
                dispatch(
                    getFacultyManagers({
                        groupCode: VITE_APP_MAJOR_MANAGER_CODE
                    })
                );
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

    const handleChangeCohortSelect = (e) => {
        const value = e.target.value;
        setCurrentCohort(value ? JSON.parse(value) : '');
    };

    useEffect(() => {
        resetFacultyData();
    }, [formData.groupCode]);

    useEffect(() => {
        setCurrentMajor('');
        setCurrentCohort('');
    }, [currentFaculty]);

    useEffect(() => {
        setCurrentCohort('');
    }, [currentMajor]);

    return (
        <div className="user_form_container">
            <h2>Thông Tin Tài Khoản</h2>
            <form onSubmit={handleSubmit}>
                <div className="input_item">
                    <label>Mã Số:</label>
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
                        placeholder="Nhập Họ Tên Đệm"
                        required
                    />
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Nhập Tên Người Dùng"
                    />
                </div>

                <div className="input_item">
                    <label>Thông tin:</label>
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

                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Chọn Giới Tính</option>
                        <option value="nam">Nam</option>
                        <option value="nữ">Nữ</option>
                    </select>
                </div>

                <div className="input_item">
                    <label>Liên Hệ:</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập Email"
                        required
                    />
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
                    <label>Quyền Hạn</label>
                    <select name="groupCode" value={formData.groupCode} onChange={handleChange} required>
                        <option value="">Chọn Quyền Hạn</option>
                        <option value={VITE_APP_MAJOR_MANAGER_CODE}>Quản Lý Chuyên Ngành</option>
                        <option value={VITE_APP_TALENT_ENGINEER_CODE}>Kỹ Sư Tài Năng</option>
                        <option value={VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE}>Kỹ Sư Tài Năng Tạm Thời</option>
                    </select>
                </div>

                <div className="input_item">
                    <label>Chọn Khoa:</label>
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

                    {[VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE].includes(
                        formData.groupCode
                    ) && (
                        <Fragment>
                            <select
                                value={currentCohort ? JSON.stringify(currentCohort) : ''}
                                onChange={handleChangeCohortSelect}
                                required
                            >
                                <option value="">Chọn Khoá</option>
                                {currentMajor?.cohorts &&
                                    currentMajor.cohorts.map((cohort) => {
                                        if (formData.groupCode === VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE) {
                                            return cohort.additionalRegisterInfo ? (
                                                <option key={cohort._id} value={JSON.stringify(cohort)}>
                                                    {cohort.cohortName}
                                                </option>
                                            ) : null;
                                        }

                                        return (
                                            <option key={cohort._id} value={JSON.stringify(cohort)}>
                                                {cohort.cohortName}
                                            </option>
                                        );
                                    })}
                            </select>
                        </Fragment>
                    )}
                </div>

                {[VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE].includes(
                    formData.groupCode
                ) && (
                    <div className="input_item">
                        <label>Năm học</label>
                        <input type="text" className="level_year_input" value={levelYear} readOnly required />
                    </div>
                )}

                <button type="submit">Tạo Tài Khoản</button>
            </form>
        </div>
    );
}

export default AccountCreatetion;
