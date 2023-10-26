import React, {useState } from 'react'
import ComponentInput from '../ComponentForm/ComponentInput';
import { RiAccountCircleFill } from 'react-icons/ri'
import { BiSolidLock } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authAction';
import ComponentButton from '../ComponentButton/ComponentButton';


const FormLogin = () => {
    const dispatch = useDispatch();
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeStudentId = (e) => {
        setStudentId(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSumbitFormLogin = (e) => {
        e.preventDefault();
        dispatch(login({
            studentId,
            password
        }))
    }

    return (
        <div className='form_group'>
            <div>

                <div className='heading_text--login'>ĐĂNG NHẬP HỆ THỐNG</div>
                <form onSubmit={handleSumbitFormLogin}>
                    <ComponentInput
                        label="Tên đăng nhập"
                        type="text"
                        id="user"
                        iconBefore={<RiAccountCircleFill />}
                        value={studentId}
                        onChange={handleChangeStudentId}
                    />
                    <ComponentInput
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        iconBefore={<BiSolidLock />}
                        value={password}
                        onChange={handleChangePassword}
                    />

                    <div className="tr__flex">
                        <div className="check__box--remb">
                            <input type="checkbox" id="remember_account" defaultChecked />
                            <label htmlFor="remember_account">Lưu thông tin đăng nhập</label>
                        </div>
                        <Link to="#" className="btn_prm_password">Quên mật khẩu</Link>
                    </div>
                    <ComponentButton textButton="Đăng nhập" type="submit"/>
                </form>
            </div>
        </div>
    )
}

export default FormLogin