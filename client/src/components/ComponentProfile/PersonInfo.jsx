import React from 'react'
import moment from 'moment'
import LineItem from '../ComponentHome/LineItem'
const PersonInfo = ({ auth }) => {
	return (
		<div className="person__info">
			<h1 className="heading-4 info__title">Thông tin cá nhân</h1>
			<div className="info__items">
				<div className="info__text">
					<LineItem
						info="Ngày sinh"
						text={moment(auth?.user?.birthday).format('DD/MM/YYYY') || 'Chưa cập nhật'}
					/>
					<LineItem info="Số chứng minh nhân dân" text={'Chưa cập nhật'} />
					<LineItem info="Đối tượng" text="Chưa cập nhật" />
					<LineItem info="Ngày vào đoàn" text={'Chưa cập nhật'} />
					<LineItem info="Số điện thoại" text={auth?.user?.phone || 'Chưa cập nhật'} />
				</div>
				<div className="info__text">
					<LineItem info="Dân tộc" text={'Chưa cập nhật'} />
					<LineItem info="Ngày cấp" text={'Chưa cập nhật'} />
					<LineItem info="Diện chính sách" text="Chưa cập nhật" />
					<LineItem info="Ngày vào đảng" text={'Chưa cập nhật'} />
					<LineItem info="Email" text={auth?.user?.email || 'Chưa cập nhật'} />
				</div>
				<div className="info__text">
					<LineItem info="Tôn giáo" text={'Chưa cập nhật'} />
					<LineItem info="Nơi cấp" text={'Chưa cập nhật'} />
					<LineItem info="Khu vực" text={'Chưa cập nhật'} />
				</div>
				<div className="info__text item__full">
					<LineItem info="Tôn giáo" text={'Chưa cập nhật'} className="" />
				</div>
				<div className="info__text item__full">
					<LineItem info="Nơi sinh" text={'Chưa cập nhật'} className="" />
				</div>
				<div className="info__text item__full">
					<LineItem info="Hộ khẩu thường trú" text={'Chưa cập nhật'} className="" />
				</div>
				<div className="info__text">
					<LineItem info="Tên ngân hàng" text={'Chưa cập nhật'} />
					<LineItem info="Tên chủ tài khoản" text={'Chưa cập nhật'} />
				</div>
				<div className="info__text">
					<LineItem info="Tên chi nhánh" text={'Chưa cập nhật'} />
					<LineItem info="Số tài khoản" text={'Chưa cập nhật'} />
				</div>
			</div>
		</div>
	)
}

export default PersonInfo
