import React from 'react'
import ReactApexChart from 'react-apexcharts'
const RadialBarChart = ({ children }) => {
	const state = {
		series: [...children.dataValue],
		options: {
			chart: {
				type: 'radialBar',
			},
			colors: [...children.colors],

			plotOptions: {
				radialBar: {
					dataLabels: {
						name: {
							fontSize: '22px',
						},
						value: {
							fontSize: '16px',
						},
						total: {
							show: true,
							label: 'Tiến độ',
							formatter: function (w) {
								return children.average + '%'
							},
						},
					},
				},
			},
			labels: [...children.dataCategory],
		},
	}
	return (
		<>
			<ReactApexChart
				options={state.options}
				series={state.series}
				type="radialBar"
				height="280px"
			/>
		</>
	)
}

const SubChart = ({ caterogy, color }) => {
	return (
		<div className="subchart__item">
			<div
				className="color"
				style={{ backgroundColor: color, width: '70px', height: '25px' }}
			></div>
			<div className="sub" style={{ color: color }}>
				{caterogy}
			</div>
		</div>
	)
}

const LayoutChart = ({ children }) => {
	const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
	const dataValue = children.map((item) => item.value)
	const dataCategory = children.map((item) => item.caterogy)
	const sum = dataValue.reduce((total, num) => total + num, 0)
	const average = (sum / dataValue.length).toFixed(2)

	const statistical = {
		dataValue,
		dataCategory,
		average,
		colors,
	}
	return (
		<div className="container__chart">
			<header className="heading-4">Tiến độ</header>
			<div className="content">
				<div className="chart__graph">
					<RadialBarChart>{statistical}</RadialBarChart>
				</div>
				<div className="chart__sub">
					{dataCategory.map((item, index) => (
						<SubChart key={index} caterogy={item} color={colors[index]} />
					))}
				</div>
			</div>
		</div>
	)
}

export default LayoutChart
