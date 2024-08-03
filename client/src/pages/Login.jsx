import LogoIUH from '../assets/images/logo_iuh_full.png';
import ImageIntro2 from '../assets/images/image_intro.png';
import FormLogin from '../components/FormLogin/FormLogin';

import { useSelector } from 'react-redux';
import { authSelector } from '../redux/selector';
import { Navigate } from 'react-router-dom';
import imgBackGround from '../assets/images/background_form_login.jpg';

const Login = () => {
    const auth = useSelector(authSelector);

    if (auth.user || auth.firstLogin) return <Navigate to="/" />;

    return (
        <div className="container__login">
            <div className="flex__layout">
                <div className="box__introducation">
                    <img src={LogoIUH} alt="logo_iuh" className="img_logo_header" />
                    <img src={imgBackGround} alt="background_iuh" className="box__introducation__background" />
                    <div className="box__image_intro">
                        <img src={ImageIntro2} alt="intro" className="image_intro" />
                        <div className="box_text_present">
                            <div className="text_heading_prt">HỆ THỐNG ĐÀO TẠO KỸ SƯ TÀI NĂNG THÔNG QUA KPIS</div>
                        </div>
                    </div>
                </div>
                <div className="box__form">
                    <div className="container__form--login">
                        <img src={imgBackGround} alt="background_iuh" className="container__form__background" />
                        <div className="footer__form"></div>
                        <FormLogin />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
