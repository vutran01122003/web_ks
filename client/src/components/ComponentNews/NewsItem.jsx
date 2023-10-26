import React from 'react'
export const NewsItem = ({ children }) => {
	const time = new Date(children.time)
	const day = time.getDate()
	const month = time.getMonth() + 1
	return (
		<div className="container__item">
			<div className="left__item">
				<div className="time__month">{`Tháng ${month}`}</div>
				<div className="time__day">{day}</div>
			</div>
			<a className="right__item" href={children.link}>
				<div className="news__title ">
					<div className={`news__title-text ${children.hot ? 'uppercase' : ''}`}>
						{children.title}
					</div>
					{children.hot ? <div className="news__title-status">New</div> : ''}
				</div>
				<div className={`news__description ${children.hot ? 'uppercase' : ''}`}>{children.des}</div>
				<div className="news__more">Xem chi tiết</div>
			</a>
		</div>
	)
}
