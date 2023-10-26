import React from 'react'
import { NewsItem } from '../components/ComponentNews/NewsItem'
import { useState } from 'react'
const News = () => {
	const ARRAY_NEWS = [
		{
			time: '2023-09-22T12:34:56Z',
			title: 'Tin Tức Mẫu 1',
			des: 'Vào ngày 22 tháng 09 năm 2023 vừa qua, Bộ môn Hệ thống thông tin đã tổ chức đón tiếp Đoàn tham quan Trường Đại học Trà Vinh đến Phòng thực hành H4 nhằm giao lưu và trao đổi kinh',
			link: '#',
			hot: true,
		},
		{
			time: '2023-09-22T12:34:56Z',
			title: 'Tin Tức Mẫu 2',
			des: 'Vào ngày 22 tháng 09 năm 2023 vừa qua, Bộ môn Hệ thống thông tin đã tổ chức đón tiếp Đoàn tham quan Trường Đại học Trà Vinh đến Phòng thực hành H4 nhằm giao lưu và trao đổi kinh',
			link: '#',
			hot: false,
		},
		{
			time: '2023-09-22T12:34:56Z',
			title: 'Tin Tức Mẫu 3',
			des: 'Vào ngày 22 tháng 09 năm 2023 vừa qua, Bộ môn Hệ thống thông tin đã tổ chức đón tiếp Đoàn tham quan Trường Đại học Trà Vinh đến Phòng thực hành H4 nhằm giao lưu và trao đổi kinh',
			link: '#',
			hot: true,
		},
		{
			time: '2023-09-22T12:34:56Z',
			title: 'Tin Tức Mẫu 4',
			des: 'Vào ngày 22 tháng 09 năm 2023 vừa qua, Bộ môn Hệ thống thông tin đã tổ chức đón tiếp Đoàn tham quan Trường Đại học Trà Vinh đến Phòng thực hành H4 nhằm giao lưu và trao đổi kinh',
			link: '#',
			hot: false,
		},
	]
	const sortedNews = [...ARRAY_NEWS].sort((a, b) => b.hot - a.hot)

	const renderNews = sortedNews.map((item, index) => {
		return <NewsItem key={index}>{item}</NewsItem>
	})

    const [title, setTitle] = useState('');
	return (
		<div className="pageNews">
			<header className="heading-4">Tin tức - Sự kiện</header>
			<div>{renderNews}</div>
		</div>
	)
}

export default News
