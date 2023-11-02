import React from 'react';
import avatar from '../../assets/avatar_default.jpg';
import ComponentAvatar from '../ComponentAvatar/ComponentAvatar';
const LineItem = ({ info, text }) => {
	return (
		<div className="line">
			<span>{info}</span>:<p>{text}</p>
		</div>
	)
}

const LayoutInfo = ({ auth }) => {
	return (
		<div className="container__info">
			<header className="heading-4">Thông tin sinh viên</header>
			<div className="content">
				<ComponentAvatar size="large" />
				<div className="info__text">
					<LineItem info="Mã sinh viên" text={auth?.user?.studentId || 'Chưa cập nhật'} />
					<LineItem info="Họ và tên" text={auth?.user?.fullName || 'Chưa cập nhật'} />
                    <LineItem info="Ngày sinh" text={(new Date(auth?.user.birthday)).toLocaleDateString('en-GB') || 'Chưa cập nhật'} />
					<LineItem info="Khoa" text={auth?.user?.major || 'Chưa cập nhật'} />
					<LineItem info="Chuyên Ngành" text={'Chưa cập nhật'} />
					<LineItem info="Email" text={auth?.user?.email || 'Chưa cập nhật'} />
				</div>
			</div>
		</div>
	)
}

export default LayoutInfo
