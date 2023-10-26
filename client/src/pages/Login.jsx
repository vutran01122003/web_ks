import React, { useContext, useEffect } from 'react'
import LogoIUH from '../assets/logo_iuh.png'
import ImageIntro from '../assets/image_loading_intro.png'
import FormLogin from '../components/FormLogin/FormLogin'

import { ContextFromWindowResize } from '../components/ComponentWindow/RenderGetSizeWindow'
import { useSelector } from 'react-redux'
import { authSelector } from '../redux/selector'
import { Navigate } from 'react-router-dom'
import { getLogged } from '../utils/handleLogged'

const Login = () => {
	const getSizeWidthWindow = useContext(ContextFromWindowResize)
	const sizeWidth = getSizeWidthWindow.getWidthWindow
    const auth = useSelector(authSelector);
 
    if(auth.user || auth.firstLogin) return <Navigate to="/"/>
    if(getLogged()) return <></>

	return (
		<div className="container__login">
			<div className="flex__layout">
				<div className="box__form">
					<div className={`footer__form ${sizeWidth <= 900 ? 'set__size__header' : undefined}`}>
						<div>
							<img src={LogoIUH} atl="logo_iuh" className="img_logo_header" />
							<div className="text_name_sl">Đại học Công Nghiệp TP.HCM</div>
						</div>
						<div className="text_heading_prt">
							<div className="display_text">HỆ THỐNG ĐÀO TẠO KĨ SƯ TÀI NĂNG</div>
						</div>

						<img src={ImageIntro} alt="intro" className="img_intro" />
					</div>
					<FormLogin />
				</div>
				<div className="box_intro">
					<div className="width__img--intro">
						<img src={ImageIntro} alt="intro" />
						<div className="box_text_present">
							<div className="text_heading_prt">
								HỆ THỐNG ĐÀO TẠO <br /> KĨ SƯ TÀI NĂNG
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
