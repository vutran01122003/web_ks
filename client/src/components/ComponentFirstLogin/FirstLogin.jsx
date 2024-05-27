import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/actions/authAction';
import ComponentButton from '../ComponentButton/ComponentButton';
import ComponentSelectOption from '../ComponentSelectOption/ComponentSelectOption';
import FormControl from '../ComponentForm/FormControl';

export const createNumberOption = (startNumber, endNumber) => {
    const options = [];
    for (let number = startNumber; number <= endNumber; number++) {
        const fomattedNumber = number.toString().padStart(2, '0');
        options.push({ labelOption: fomattedNumber, value: fomattedNumber });
    }
    return options;
};

function FirstLogin({ userId, birthday }) {
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const formattedBirthday = `${birthday.substr(0, 2)}/${birthday.substr(2, 2)}/${birthday.substr(4)}`;

    const handleChangeData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSumbitForm = (e) => {
        e.preventDefault();
        dispatch(
            register({
                ...data,
                userId,
                birthday: formattedBirthday,
            }),
        );
    };

    return (
        <div className="container__fisrt--login">
            <div className="form__update--info">
                <form className="">
                    <h1 className="heading__text">Cập Nhật Thông Tin </h1>
                    <FormControl
                        id="name_sv"
                        label="Tên Sinh Viên"
                        type="text"
                        name="fullName"
                        placeholder="Nhập tên sinh viên"
                        onChange={handleChangeData}
                    />

                    <FormControl
                        i="password_new"
                        label="Mật khẩu mới"
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        onChange={handleChangeData}
                    />
                    <FormControl
                        id="msv"
                        label="Mã Sinh Viên"
                        name="userId"
                        readonly
                        value={userId}
                    />
                    <FormControl
                        id="bir"
                        label="Ngày Sinh"
                        readonly
                        value={formattedBirthday}
                    />

                    <FormControl
                        id="cohort"
                        label="Khóa Sinh Viên"
                        name="cohort"
                        type="text"
                        placeholder="Nhập khóa sinh viên"
                        onChange={handleChangeData}
                    />

                    <ComponentSelectOption
                        id="faculty"
                        name="faculty"
                        label="Khoa"
                        labelOptionNull="Chọn khoa"
                        options={[
                            {
                                labelOption: 'Công nghệ thông tin',
                                value: 'Công nghệ thông tin',
                            },
                            { labelOption: 'Kế Toán', value: 'Kế Toán' },
                        ]}
                        onChange={handleChangeData}
                    />
                    <ComponentSelectOption
                        id="major"
                        name="major"
                        label="Chuyên Ngành"
                        labelOptionNull="Chọn nghành học"
                        options={[
                            {
                                labelOption: 'Kỹ thuật phần mềm',
                                value: 'Kỹ thuật phần mềm',
                            },
                            {
                                labelOption: 'Khoa học máy tính',
                                value: 'Khoa học máy tính',
                            },
                        ]}
                        onChange={handleChangeData}
                    />
                    <FormControl
                        label="Email"
                        name="email"
                        placeholder="Nhập email"
                        onChange={handleChangeData}
                    />
                    <FormControl
                        label="Số điện thoại liên hệ"
                        name="phone"
                        placeholder="Nhập số điện thoại liên hệ"
                        onChange={handleChangeData}
                    />

                    <ComponentButton
                        textButton="Lưu thông tin"
                        type="submit"
                        onClick={handleSumbitForm}
                    />
                </form>
            </div>
        </div>
    );
}

export default FirstLogin;
