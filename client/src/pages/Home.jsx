import React from 'react'
import LayoutInfo from '../components/ComponentHome/LayoutInfo'
import LayoutChart from '../components/ComponentHome/LayoutChart'
import avatar from '../assets/avatar.png'
import LayoutTable from '../components/ComponentTable/LayoutTable'
import ApplyComponent from '../components/ComponentHome/ApplyComponent'
import CreatedNewsHistory from '../components/ComponentHome/CreatedNewsHistory'
import ChangeWebsiteHistory from '../components/ComponentHome/ChangeWebsiteHistory'

const Home = ({ auth }) => {
	const DATA_INFO = {
		image: avatar,
		mssv: 21000991,
		name: 'Nguyễn Văn A',
		gender: 'Nam',
		dept: 'Công nghệ thông tin',
		joinDate: '2023-09-22T12:34:56Z',
		address: '123 Nguyễn Văn A, Q.1, TP.HCM',
	}
	const DATA_CHART = [
		{ caterogy: 'Hoạt động', value: 80 },
		{ caterogy: 'Chứng chỉ', value: 60 },
		{ caterogy: 'Nghiên cứu', value: 40 },
		{ caterogy: 'Thể thao', value: 50 },
	]

	const DATA_ROW = [
		{
			_id: 0,
			name: 'Tên mục tiêu',
			type: 'Loại',
			startDate: '2023-08-22T12:34:56Z',
			endDate: '2023-10-20T12:34:56Z',
			complete: true,
		},
		{
			_id: 1,
			name: 'Tên mục tiêu',
			type: 'Loại',
			startDate: '2023-07-12T12:34:56Z',
			endDate: '2024-09-22T12:34:56Z',
			complete: true,
		},
		{
			_id: 2,
			name: 'Tên mục tiêu',
			type: 'Loại',
			startDate: '2023-04-20T12:34:56Z',
			endDate: '2024-01-22T12:34:56Z',
			complete: true,
		},
		{
			_id: 3,
			name: 'Tên mục tiêu',
			type: 'Loại',
			startDate: '2023-04-20T12:34:56Z',
			endDate: '2024-01-22T12:34:56Z',
			complete: true,
		},
	]
	const DATA_TABLE = [
		{
			_id: 0,
			title: 'Lịch trình',
			thead: [
				{
					textHeading: 'STT',
					typeInput: 'text',
				},
				{
					textHeading: 'Tên mục tiêu',
					typeInput: 'text',
				},
				{
					textHeading: 'Loại',
					typeInput: 'text',
				},
				{
					textHeading: 'Thời gian còn',
					typeInput: 'date',
					disabled: true,
				},
				{
					textHeading: 'Ngày bắt đầu',
					typeInput: 'date',
				},
				{
					textHeading: 'Ngày hoàn thành',
					typeInput: 'date',
				},
				{
					textHeading: 'Trạng thái',
					typeInput: 'text',
				},
			],
		},
	]
	return (
		<div className="pageHome">
			<div className="container__top">
				<LayoutInfo>{DATA_INFO}</LayoutInfo>
                <>
                    {((auth?.user.roles.includes("0001") && auth?.user.roles.length === 1) || (auth?.user.roles.length === 0)) && <ApplyComponent />}
                    {auth?.user.roles.includes("0002") && <LayoutChart>{DATA_CHART}</LayoutChart>}
                    {auth?.user.roles.includes("0003") && <CreatedNewsHistory />}
                    {auth?.user.roles.includes("0004") &&  <ChangeWebsiteHistory />}
                </>
				
			</div>
			<div className="container__center">
				{DATA_TABLE.map((item, index) => {
					return (
						<LayoutTable
							key={index}
							row={DATA_ROW}
							title={item.title}
							thead={item.thead}
						></LayoutTable>
					)
				})}
			</div>
		</div>
	)
}

export default Home
