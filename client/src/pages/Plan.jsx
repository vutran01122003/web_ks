import React from 'react'
import LayoutTable from '../components/ComponentTable/LayoutTable'

const Plan = () => {
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
					value: 1,
					typeInput: 'text',
					isShow: true,
					disabled: true,
				},
				{
					textHeading: 'Tên mục tiêu',
					typeInput: 'text',
					isShow: true,
				},
				{
					textHeading: 'Loại',
					typeInput: 'text',
					isShow: true,
				},
				{
					textHeading: 'Thời gian còn',
					typeInput: 'date',
					isShow: false,
				},
				{
					textHeading: 'Ngày bắt đầu',
					typeInput: 'date',
					isShow: true,
				},
				{
					textHeading: 'Ngày hoàn thành',
					typeInput: 'date',
					isShow: true,
				},
				{
					textHeading: 'Trạng thái',
					typeInput: 'text',
					isShow: true,
				},
			],
		},
	]

	return (
		<div className="container__plan">
			{DATA_TABLE.map((item, index) => {
				return (
					<LayoutTable
						key={index}
						title={item.title}
						thead={item.thead}
					></LayoutTable>
				)
			})}
		</div>
	)
}

export default Plan
