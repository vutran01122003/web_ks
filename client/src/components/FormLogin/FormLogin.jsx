import { useState } from 'react';
import { RiAccountCircleFill } from 'react-icons/ri';
import { BiSolidLock } from 'react-icons/bi';
import { ImSpinner11 } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authAction';
import ComponentButton from '../ComponentButton/ComponentButton';
import FormControl from '../ComponentForm/FormControl';
import GLOBALTYPES from '../../redux/actions/globalTypes';

const RandomString = (length) => {
    const charRanDom = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const ranDomIndex = Math.floor(Math.random() * charRanDom.length);
        result = result + charRanDom.charAt(ranDomIndex);
    }
    return result;
};

const FormLogin = () => {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const [captchaLogin, setCaptchaLogin] = useState(RandomString(4));
    const [userInputCaptcha, setUserInputCaptcha] = useState('');
    const [isCapcha, setIsCapcha] = useState(false);

    const registerAccount = () => {
        dispatch({
            type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
            payload: {
                firstLogin: true
            }
        });
    };

    const refreshCaptcha = () => {
        setUserInputCaptcha('');
        setCaptchaLogin(RandomString(4));
    };

    const handleInputChange = (e) => {
        setUserInputCaptcha(e.target.value.toUpperCase());
    };

    const handleSubmit = () => {
        if (userInputCaptcha === captchaLogin) {
            setIsCapcha(true);
        } else {
            setUserInputCaptcha('');
            refreshCaptcha();
            setIsCapcha(false);
        }
    };

    const handleChangeStudentId = (e) => {
        setUserId(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSumbitFormLogin = (e) => {
        e.preventDefault();
        if (isCapcha) {
            dispatch(
                login({
                    userId,
                    password
                })
            );
        } else {
            alert('sai captcha');
        }
    };

    return (
        <div className="form_group">
            <div>
                <div className="heading_text--login">ĐĂNG NHẬP HỆ THỐNG</div>
                <form onSubmit={handleSumbitFormLogin}>
                    <FormControl
                        label="Mã sinh viên"
                        type="text"
                        id="user"
                        iconBefore={<RiAccountCircleFill />}
                        value={userId}
                        onChange={handleChangeStudentId}
                    />
                    <FormControl
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        iconBefore={<BiSolidLock />}
                        value={password}
                        onChange={handleChangePassword}
                    />

                    <div className="tr_line-captcha">
                        <input
                            type="text"
                            value={userInputCaptcha}
                            onChange={handleInputChange}
                            placeholder="Nhập Catpcha"
                        />
                        <div className="text__catpcha">
                            <div className="text__render--captcha">
                                {captchaLogin.split('').map((char, index) => (
                                    <span key={index}>{char}</span>
                                ))}
                            </div>
                            <div onClick={refreshCaptcha} type="button" className="btn_refresh_catcha">
                                <ImSpinner11 />
                            </div>
                        </div>
                    </div>
                    <ComponentButton className="text-sm" textButton="ĐĂNG NHẬP" type="submit" onClick={handleSubmit} />
                    <ComponentButton
                        textButton="ĐĂNG KÝ BỔ SUNG"
                        className="apply_btn text-sm"
                        type="submit"
                        onClick={registerAccount}
                    />
                </form>
            </div>
        </div>
    );
};

export default FormLogin;
