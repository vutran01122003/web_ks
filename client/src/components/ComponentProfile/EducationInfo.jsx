import React from 'react'
import ComponentAvatar from '../ComponentAvatar/ComponentAvatar'
import LineItem from '../ComponentHome/LineItem'
import moment from 'moment'
const EducationInfo = ({ auth }) => {
	return (
		<div className="education__info">
			<div className="info__text">
				<ComponentAvatar size="large" />
				<LineItem
					info="Mã sinh viên"
					text={auth?.user?.studentId || 'Chưa cập nhật'}
					className="id__info"
				/>
			</div>
			<div className="main__info">
				<div className="heading-4 info__title">Thông tin học vấn</div>
				<div className="info__items">
					<div className="info__text">
						<LineItem info="Tên sinh viên" text={auth?.user?.fullName || 'Chưa cập nhật'} />

						<LineItem info="Giới tính" text="Chưa cập nhật" />
						<LineItem info="Trạng thái" text={'Chưa cập nhật'} />
						<LineItem info="Lớp" text={'Chưa cập nhật'} />
						<LineItem info="Chuyên ngành" text={'Chưa cập nhật'} />
					</div>
					<div className="info__text">
						<LineItem info="Ngày vào trường" text={'Chưa cập nhật'} />
						<LineItem info="Ngày vào hệ thống" text="Chưa cập nhật" />
						<LineItem info="Cơ sở" text={'Chưa cập nhật'} />
						<LineItem info="Khoa" text={auth?.user?.major || 'Chưa cập nhật'} />
						<LineItem info="Loại hình đào tạo" text={'Chưa cập nhật'} />
					</div>
					<div className="info__text">
						<LineItem info="Ngành" text={'Chưa cập nhật'} />
						<LineItem info="Bậc đào tạo" text="Chưa cập nhật" />
						<LineItem info="Khoá học" text={'Chưa cập nhật'} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default EducationInfo
