import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/actions/authAction';
import ComponentButton from '../ComponentButton/ComponentButton';
import ComponentSelectOption from '../ComponentSelectOption/ComponentSelectOption';
import FormControl from '../ComponentForm/FormControl';
import { getAllFaculties } from '../../redux/actions/facultyAction';
import { facultySelector } from '../../redux/selector';
import { capitalizeFirstLetter } from '../../utils/handleString';

const { VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE } = import.meta.env;

export const createNumberOption = (startNumber, endNumber) => {
    const options = [];
    for (let number = startNumber; number <= endNumber; number++) {
        const fomattedNumber = number.toString().padStart(2, '0');
        options.push({ labelOption: fomattedNumber, value: fomattedNumber });
    }
    return options;
};

function FirstLogin() {
    const dispatch = useDispatch();
    const { facultyData } = useSelector(facultySelector);
    const [data, setData] = useState({});
    const [majorList, setMajorList] = useState([]);
    const [cohortList, setCohortList] = useState([]);

    const handleChangeData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSumbitForm = (e) => {
        e.preventDefault();
        dispatch(
            register({
                ...data,
                levelYear: +data.levelYear,
                groupCode: VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE
            })
        );
    };

    useEffect(() => {
        dispatch(getAllFaculties());
    }, []);

    useEffect(() => {
        setData((prev) => ({ ...prev, major: '', cohort: '', levelYear: '' }));
        if (data.faculty) {
            setMajorList(facultyData.find((faculty) => faculty.facultyName === data?.faculty).majors);
        }
    }, [data?.faculty]);

    useEffect(() => {
        setData((prev) => ({ ...prev, cohort: '', levelYear: '' }));
        if (data.major) {
            const specificMajor = majorList.find((major) => major.majorName === data.major);
            setCohortList(specificMajor ? specificMajor.cohortList : []);
        }
    }, [data?.major]);

    useEffect(() => {
        if (data.cohort) {
            const levelYear = cohortList.find((cohort) => cohort.cohortName === +data.cohort)?.currentLevelYear;
            setData((prev) => ({ ...prev, levelYear: levelYear || 1 }));
        }
    }, [data?.cohort]);

    return (
        <div className="container__fisrt--login">
            <div className="form__update--info">
                <form className="">
                    <h1 className="heading__text">ĐĂNG KÝ BỔ SUNG KỸ SƯ TÀI NĂNG</h1>
                    <FormControl
                        id="name_sv"
                        label="Họ Đệm"
                        type="text"
                        name="lastName"
                        placeholder="Nguyễn Văn"
                        value={data?.lastName || ''}
                        onChange={handleChangeData}
                    />

                    <FormControl
                        id="name_sv"
                        label="Tên Sinh Viên"
                        type="text"
                        name="firstName"
                        value={data?.firstName || ''}
                        placeholder="An"
                        onChange={handleChangeData}
                    />

                    <FormControl
                        i="password_new"
                        label="Mật Khẩu"
                        type="password"
                        name="password"
                        value={data?.password || ''}
                        placeholder="Nhập mật khẩu"
                        onChange={handleChangeData}
                    />

                    <FormControl
                        id="msv"
                        label="Mã Sinh Viên"
                        name="userId"
                        value={data?.userId || ''}
                        placeholder="Nhập mã sinh viên"
                        onChange={handleChangeData}
                    />

                    <FormControl
                        id="bir"
                        type="date"
                        label="Ngày Sinh"
                        name="birthday"
                        value={data?.birthday || ''}
                        data-date-format="DD MMMM YYYY"
                        placeholder="Nhập ngày sinh"
                        onChange={handleChangeData}
                    />

                    <ComponentSelectOption
                        id="gd"
                        name="gender"
                        label="Giới Tính"
                        labelOptionNull="Chọn giới tính"
                        value={data?.gender || ''}
                        options={[
                            {
                                labelOption: 'Nam',
                                value: 'nam'
                            },
                            {
                                labelOption: 'Nữ',
                                value: 'nữ'
                            }
                        ]}
                        onChange={handleChangeData}
                    />

                    <ComponentSelectOption
                        id="faculty"
                        name="faculty"
                        label="Khoa"
                        labelOptionNull="Chọn khoa"
                        value={data?.faculty || ''}
                        options={facultyData.map((faculty) => ({
                            labelOption: capitalizeFirstLetter(faculty.facultyName),
                            value: faculty.facultyName
                        }))}
                        onChange={handleChangeData}
                    />

                    <ComponentSelectOption
                        id="major"
                        name="major"
                        label="Chuyên Ngành"
                        labelOptionNull="Chọn ngành học"
                        value={data?.major || ''}
                        options={
                            majorList.length > 0
                                ? majorList.map((major) => ({
                                      labelOption: capitalizeFirstLetter(major.majorName),
                                      value: major.majorName
                                  }))
                                : []
                        }
                        onChange={handleChangeData}
                    />

                    <ComponentSelectOption
                        id="cohort"
                        label="Khóa Sinh Viên"
                        name="cohort"
                        labelOptionNull="Chọn khóa"
                        value={data?.cohort || ''}
                        options={
                            cohortList
                                ? cohortList.map((cohort) => ({
                                      labelOption: cohort.cohortName,
                                      value: +cohort.cohortName
                                  }))
                                : []
                        }
                        onChange={handleChangeData}
                    />

                    <FormControl
                        id="lvlYear"
                        label="Năm Học"
                        name="levelYear"
                        value={data?.levelYear || ''}
                        readonly={true}
                        placeholder="Năm hiện tại"
                        onChange={handleChangeData}
                    />

                    <FormControl label="Email" name="email" placeholder="Nhập email" onChange={handleChangeData} />

                    <FormControl
                        label="Số điện thoại liên hệ"
                        name="phone"
                        placeholder="Nhập số điện thoại liên hệ"
                        onChange={handleChangeData}
                    />

                    <ComponentButton textButton="Lưu thông tin" type="submit" onClick={handleSumbitForm} />
                </form>
            </div>
        </div>
    );
}

export default FirstLogin;
