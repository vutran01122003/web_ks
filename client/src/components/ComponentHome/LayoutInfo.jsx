import React from 'react'
import ComponentAvatar from '../ComponentAvatar/ComponentAvatar'
import { Link } from 'react-router-dom'
import LineItem from '../ComponentHome/LineItem'

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
					{auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003') ? (
						<div>
							<LineItem info="Mã giảng viên" text={auth?.user?.studentId || 'Chưa cập nhật'} />
							<LineItem info="Họ và tên" text={auth?.user?.fullName || 'Chưa cập nhật'} />
							<LineItem
								info="Ngày sinh"
								text={new Date(auth?.user.birthday).toLocaleDateString('en-GB') || 'Chưa cập nhật'}
							/>
							<LineItem info="Khoa" text={auth?.user?.faculty || 'Chưa cập nhật'} />
						</div>
					) : (
						<div>
							<LineItem info="Mã sinh viên" text={auth?.user?.studentId || 'Chưa cập nhật'} />
							<LineItem info="Họ và tên" text={auth?.user?.fullName || 'Chưa cập nhật'} />
							<LineItem
								info="Ngày sinh"
								text={new Date(auth?.user.birthday).toLocaleDateString('en-GB') || 'Chưa cập nhật'}
							/>
							<LineItem info="Khoa" text={auth?.user?.faculty || 'Chưa cập nhật'} />
                            <LineItem info="Chuyên Ngành" text={auth?.user?.major || 'Chưa cập nhật'} />

						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default LayoutInfo
