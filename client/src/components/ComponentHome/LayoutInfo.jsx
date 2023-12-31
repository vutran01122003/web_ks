import React from 'react'
import ComponentAvatar from '../ComponentAvatar/ComponentAvatar'
import { Link } from 'react-router-dom'
import LineItem from '../ComponentHome/LineItem'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

const LayoutInfo = ({ auth }) => {
	const heading =
		auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003')
			? 'Thông tin giảng viên'
			: 'Thông tin sinh viên'
    
	return (
		<div className="container__info">
			<header className="heading-4">{heading}</header>
			<div className="content">
				<div className="info__avatar">
					<ComponentAvatar size="large" />
					<Link className="more__info" to="/profile">
						Xem chi tiết
					</Link>
				</div>
				<div className="info__text">
                    <LineItem info={auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003') ? "Mã giảng viên" : "Mã sinh viên"} 
                        text={auth?.user?.studentId || 'Chưa cập nhật'} />
                    <LineItem info="Họ và tên" text={auth?.user?.fullName ? capitalizeFirstLetter(auth?.user?.fullName) : 'Chưa cập nhật'} />
                    <LineItem info="Ngày sinh" text={new Date(auth?.user.birthday).toLocaleDateString('en-GB') || 'Chưa cập nhật'} />
                    <LineItem info="Khoa" text={auth?.user?.faculty ? capitalizeFirstLetter(auth?.user?.faculty) : 'Chưa cập nhật'} />
                    {auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003') &&
                    <LineItem info="Chuyên Ngành" text={auth?.user?.major || 'Chưa cập nhật'} />}
				</div>
			</div>
		</div>
	)
}

export default LayoutInfo
