import React, { useContext } from 'react';
import LogoIUH from '../assets/images/logo_iuh.png';
import ImageIntro2 from '../assets/images/image_intro.png';
import FormLogin from '../components/FormLogin/FormLogin';

import { ContextFromWindowResize } from '../components/ComponentWindow/RenderGetSizeWindow';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/selector';
import { Navigate } from 'react-router-dom';
import { getLogged } from '../utils/handleLogged';

const Login = () => {
    const getSizeWidthWindow = useContext(ContextFromWindowResize);
    const auth = useSelector(authSelector);

    if (auth.user || auth.firstLogin) return <Navigate to='/' />;
    if (getLogged()) return <></>;

    return (
        <div className='container__login'>
            <div className='flex__layout'>
                <div className='box__introducation'>
                    <img src={LogoIUH} atl='logo_iuh' className='img_logo_header' />

                    <div className='box__image_intro'>
                        <img src={ImageIntro2} alt='intro' className='image_intro' />
                        <div className='box_text_present'>
                            <div className='text_heading_prt'>
                                HỆ THỐNG ĐÀO TẠO KỸ SƯ TÀI NĂNG THÔNG QUA KPIS
                            </div>
                        </div>
                    </div>
                </div>
                <div className='box__form'>
                    <div className='container__form--login'>
                        <div className='footer__form'></div>
                        <FormLogin />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
