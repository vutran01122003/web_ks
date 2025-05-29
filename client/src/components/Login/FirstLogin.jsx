import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/actions/authAction';
import ComponentButton from '../Button/ComponentButton';
import ComponentSelectOption from '../Select/ComponentSelectOption';
import FormControl from '../Form/FormControl';
import { getAllFaculties } from '../../redux/actions/facultyAction';
import { facultySelector } from '../../redux/selector';
import { capitalizeFirstLetter } from '../../utils/handleString';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { IoEyeOffSharp, IoEyeSharp } from 'react-icons/io5';

const { VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE } = import.meta.env;

function FirstLogin() {
    const dispatch = useDispatch();
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const { facultyData } = useSelector(facultySelector);
    const [data, setData] = useState({});
    const [majorList, setMajorList] = useState([]);
    const [cohortList, setCohortList] = useState([]);
    const [isValid, setIsValid] = useState(false);

    const onCheckInfo = () => {
        if (data?.major && data?.faculty && data?.cohort && data?.levelYear) {
            setIsValid(true);
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập thông tin đầy đủ'
                }
            });
        }
    };

    const handleChangeData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSumbitForm = (e) => {
        e.preventDefault();
        if (
            !data.lastName ||
            !data.firstName ||
            !data.password ||
            !data.confirmPassword ||
            !data.userId ||
            !data.birthday ||
            !data.gender ||
            !data.email ||
            !data.phone
        ) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });
            return;
        }

        if (data.password !== data.confirmPassword) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Mật khẩu không giống nhau'
                }
            });
            return;
        }

        delete data.confirmPassword;

        dispatch(
            register({
                ...data,
                levelYear: parseInt(data.levelYear),
                groupCode: VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE,
                isDirectRegister: true
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
            setCohortList(specificMajor ? specificMajor.cohorts : []);
        }
    }, [data?.major]);

    useEffect(() => {
        if (data.cohort) {
            const additionalRegisterInfo = cohortList.find(
                (cohort) => cohort.cohortName === data.cohort
            )?.additionalRegisterInfo;

            if (additionalRegisterInfo?.isActive) {
                setData((prev) => ({ ...prev, levelYear: additionalRegisterInfo.levelYear }));
            } else {
                setData((prev) => ({ ...prev, levelYear: '' }));
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: 'Chuyên ngành của khóa hiện tại không thể đăng ký bổ sung'
                    }
                });
            }
        }
    }, [data?.cohort]);

    return (
        <div className="container__fisrt--login">
            <div className="form__update--info">
                <h1 className="heading__text">{isValid ? 'Thông Tin Sinh Viên' : 'ĐĂNG KÝ BỔ SUNG'}</h1>
                <form>
                    {!isValid && (
                        <Fragment>
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
                                              value: cohort.cohortName
                                          }))
                                        : []
                                }
                                onChange={handleChangeData}
                            />

                            <FormControl
                                id="lvlYear"
                                label="Năm Đăng Ký Bổ Sung"
                                name="levelYear"
                                value={data?.levelYear || ''}
                                readonly={true}
                                placeholder="Năm Đăng Ký"
                                onChange={handleChangeData}
                                classNameInputItem="not_allow"
                            />

                            <ComponentButton
                                textButton="Tiếp Tục"
                                className="apply_btn text-sm"
                                type="button"
                                onClick={onCheckInfo}
                            />
                        </Fragment>
                    )}

                    {isValid && (
                        <Fragment>
                            <FormControl
                                id="lastname_sv"
                                label="Họ Đệm"
                                type="text"
                                name="lastName"
                                placeholder="Nguyễn Văn"
                                value={data?.lastName || ''}
                                onChange={handleChangeData}
                                required={true}
                            />

                            <FormControl
                                id="firstname_sv"
                                label="Tên Sinh Viên"
                                type="text"
                                name="firstName"
                                value={data?.firstName || ''}
                                placeholder="An"
                                onChange={handleChangeData}
                                required={true}
                            />

                            <FormControl
                                id="password_new"
                                label="Mật Khẩu"
                                type={isVisiblePassword ? 'text' : 'password'}
                                name="password"
                                value={data?.password || ''}
                                onClickBeforeIcon={() => {
                                    setIsVisiblePassword((prev) => !prev);
                                }}
                                placeholder="Nhập mật khẩu"
                                iconBefore={isVisiblePassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
                                onChange={handleChangeData}
                                required={true}
                            />

                            <FormControl
                                id="confirm_password"
                                label="Nhập Lại Mật Khẩu"
                                type={isVisiblePassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={data?.confirmPassword || ''}
                                onClickBeforeIcon={() => {
                                    setIsVisiblePassword((prev) => !prev);
                                }}
                                placeholder="Nhập lại mật khẩu"
                                iconBefore={isVisiblePassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
                                onChange={handleChangeData}
                                required={true}
                            />

                            <FormControl
                                id="msv"
                                label="Mã Sinh Viên"
                                name="userId"
                                value={data?.userId || ''}
                                placeholder="Nhập mã sinh viên"
                                onChange={handleChangeData}
                                required={true}
                            />

                            <FormControl
                                id="bir"
                                type="date"
                                label="Ngày Sinh"
                                name="birthday"
                                value={data?.birthday || ''}
                                data-date-format="DD MMMM YYYY"
                                placeholder="Nhập ngày sinh"
                                max="2006-12-31"
                                onChange={handleChangeData}
                                required={true}
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

                            <FormControl
                                label="Email"
                                name="email"
                                placeholder="Nhập email"
                                onChange={handleChangeData}
                                required={true}
                            />

                            <FormControl
                                label="Số điện thoại liên hệ"
                                name="phone"
                                placeholder="Nhập số điện thoại liên hệ"
                                onChange={handleChangeData}
                                required={true}
                            />

                            <ComponentButton textButton="Lưu thông tin" type="submit" onClick={handleSumbitForm} />
                        </Fragment>
                    )}
                </form>
            </div>
        </div>
    );
}

export default FirstLogin;
