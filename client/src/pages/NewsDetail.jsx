import React from 'react'
import moment from 'moment'
import { FaSquareFacebook, FaLinkedin, FaSquareXTwitter } from 'react-icons/fa6'
import ScrollToTopButton from '../components/ScrollToTopButton/ScrollToTopButton'
const newsData = {
	title: 'Tiêu đề tin tức',
	time: '2023-09-22T12:34:56Z',
	content:
		'Chiều ngày 19/11/2019, Trường Đại học Công nghiệp Thành phố Hồ Chí Minh đã long trọng tổ chức Lễ trao chứng nhận 04 chương trình đào tạo đạt chuẩn AUN - QA và Gặp mặt truyền thống nhân ngày Nhà giáo Việt Nam 20/11. Tới dự buổi lễ, Nhà trường hân hạnh được đón tiếp ông Lê An Hải - Phó Chánh Văn phòng, phụ trách Văn phòng Bộ Công Thương cùng các cán bộ, chuyên viên Văn phòng Bộ Công Thương và Vụ Tổ chức cán bộ; ông Mai Văn Trinh - Cục trưởng Cục quản lý chất lượng giáo dục, Bộ Giáo dục và Đào tạo. Về phía tổ chức AUN-QA có đại diện AUN-QA - Ngài Johnson Ong cùng đại diện lãnh đạo các ban ngành, đoàn thể Trung ương và địa phương, các nhà giáo nguyên là lãnh đạo nhà trường qua các thời kỳ, các đơn vị bạn cùng toàn thể quý thầy cô giáo, cán bộ - viên chức của Nhà trường. Phát biểu tại buổi lễ, thầy Nguyễn Thiên Tuế - Hiệu trưởng nhà trường vui mừng thông báo những thành công trong công tác kiểm định và đảm bảo chất lượng của nhà trường trong thời gian qua. Trong thời gian tới, Nhà trường sẽ tiếp tục tập trung đầu tư vào việc phát triển đội ngũ cán bộ làm công tác đảm bảo chất lượng, phấn đấu đến cuối năm 2020, hầu hết các chương trình đào tạo được đánh giá bởi AUN-QA, kiểm định bởi ABET và đặc biệt là đánh giá cấp cơ sở giáo dục theo bộ tiêu chuẩn AUN-QA. Thầy Nguyễn Thiên Tuế - Hiệu trưởng nhà trường phát biểu tại buổi lễ. Tại buổi lễ, Ngài Johnson đại diện tổ chức AUN-QA trao Giấy chứng nhận 04 chương trình đạt chuẩn AUN-QA, phiên bản 3.0 bao gồm: Công nghệ kỹ thuật Ô tô, Quản trị kinh doanh, Kế toán và Ngôn ngữ Anh. Trong bài phát biểu, Ngài Johnson nhấn mạnh sự nỗ lực và quyết tâm của Đảng ủy, Ban Giám hiệu cùng toàn thể cán bộ - viên chức nhà trường. Kết quả này thể hiện sự cam kết của Nhà trường trong công tác đảm bảo chất lượng, nâng cao chất lượng đào tạo, đáp ứng nhu cầu các bên liên quan và hội nhập toàn cầu.Chiều ngày 19/11/2019, Trường Đại học Công nghiệp Thành phố Hồ Chí Minh đã long trọng tổ chức Lễ trao chứng nhận 04 chương trình đào tạo đạt chuẩn AUN - QA và Gặp mặt truyền thống nhân ngày Nhà giáo Việt Nam 20/11. Tới dự buổi lễ, Nhà trường hân hạnh được đón tiếp ông Lê An Hải - Phó Chánh Văn phòng, phụ trách Văn phòng Bộ Công Thương cùng các cán bộ, chuyên viên Văn phòng Bộ Công Thương và Vụ Tổ chức cán bộ; ông Mai Văn Trinh - Cục trưởng Cục quản lý chất lượng giáo dục, Bộ Giáo dục và Đào tạo. Về phía tổ chức AUN-QA có đại diện AUN-QA - Ngài Johnson Ong cùng đại diện lãnh đạo các ban ngành, đoàn thể Trung ương và địa phương, các nhà giáo nguyên là lãnh đạo nhà trường qua các thời kỳ, các đơn vị bạn cùng toàn thể quý thầy cô giáo, cán bộ - viên chức của Nhà trường. Phát biểu tại buổi lễ, thầy Nguyễn Thiên Tuế - Hiệu trưởng nhà trường vui mừng thông báo những thành công trong công tác kiểm định và đảm bảo chất lượng của nhà trường trong thời gian qua. Trong thời gian tới, Nhà trường sẽ tiếp tục tập trung đầu tư vào việc phát triển đội ngũ cán bộ làm công tác đảm bảo chất lượng, phấn đấu đến cuối năm 2020, hầu hết các chương trình đào tạo được đánh giá bởi AUN-QA, kiểm định bởi ABET và đặc biệt là đánh giá cấp cơ sở giáo dục theo bộ tiêu chuẩn AUN-QA. Thầy Nguyễn Thiên Tuế - Hiệu trưởng nhà trường phát biểu tại buổi lễ. Tại buổi lễ, Ngài Johnson đại diện tổ chức AUN-QA trao Giấy chứng nhận 04 chương trình đạt chuẩn AUN-QA, phiên bản 3.0 bao gồm: Công nghệ kỹ thuật Ô tô, Quản trị kinh doanh, Kế toán và Ngôn ngữ Anh. Trong bài phát biểu, Ngài Johnson nhấn mạnh sự nỗ lực và quyết tâm của Đảng ủy, Ban Giám hiệu cùng toàn thể cán bộ - viên chức nhà trường. Kết quả này thể hiện sự cam kết của Nhà trường trong công tác đảm bảo chất lượng, nâng cao chất lượng đào tạo, đáp ứng nhu cầu các bên liên quan và hội nhập toàn cầu.Chiều ngày 19/11/2019, Trường Đại học Công nghiệp Thành phố Hồ Chí Minh đã long trọng tổ chức Lễ trao chứng nhận 04 chương trình đào tạo đạt chuẩn AUN - QA và Gặp mặt truyền thống nhân ngày Nhà giáo Việt Nam 20/11. Tới dự buổi lễ, Nhà trường hân hạnh được đón tiếp ông Lê An Hải - Phó Chánh Văn phòng, phụ trách Văn phòng Bộ Công Thương cùng các cán bộ, chuyên viên Văn phòng Bộ Công Thương và Vụ Tổ chức cán bộ; ông Mai Văn Trinh - Cục trưởng Cục quản lý chất lượng giáo dục, Bộ Giáo dục và Đào tạo. Về phía tổ chức AUN-QA có đại diện AUN-QA - Ngài Johnson Ong cùng đại diện lãnh đạo các ban ngành, đoàn thể Trung ương và địa phương, các nhà giáo nguyên là lãnh đạo nhà trường qua các thời kỳ, các đơn vị bạn cùng toàn thể quý thầy cô giáo, cán bộ - viên chức của Nhà trường. Phát biểu tại buổi lễ, thầy Nguyễn Thiên Tuế - Hiệu trưởng nhà trường vui mừng thông báo những thành công trong công tác kiểm định và đảm bảo chất lượng của nhà trường trong thời gian qua. Trong thời gian tới, Nhà trường sẽ tiếp tục tập trung đầu tư vào việc phát triển đội ngũ cán bộ làm công tác đảm bảo chất lượng, phấn đấu đến cuối năm 2020, hầu hết các chương trình đào tạo được đánh giá bởi AUN-QA, kiểm định bởi ABET và đặc biệt là đánh giá cấp cơ sở giáo dục theo bộ tiêu chuẩn AUN-QA. Thầy Nguyễn Thiên Tuế - Hiệu trưởng nhà trường phát biểu tại buổi lễ. Tại buổi lễ, Ngài Johnson đại diện tổ chức AUN-QA trao Giấy chứng nhận 04 chương trình đạt chuẩn AUN-QA, phiên bản 3.0 bao gồm: Công nghệ kỹ thuật Ô tô, Quản trị kinh doanh, Kế toán và Ngôn ngữ Anh. Trong bài phát biểu, Ngài Johnson nhấn mạnh sự nỗ lực và quyết tâm của Đảng ủy, Ban Giám hiệu cùng toàn thể cán bộ - viên chức nhà trường. Kết quả này thể hiện sự cam kết của Nhà trường trong công tác đảm bảo chất lượng, nâng cao chất lượng đào tạo, đáp ứng nhu cầu các bên liên quan và hội nhập toàn cầu.Chiều ngày 19/11/2019, Trường Đại học Công nghiệp Thành phố Hồ Chí Minh đã long trọng tổ chức Lễ trao chứng nhận 04 chương trình đào tạo đạt chuẩn AUN - QA và Gặp mặt truyền thống nhân ngày Nhà giáo Việt Nam 20/11. Tới dự buổi lễ, Nhà trường hân hạnh được đón tiếp ông Lê An Hải - Phó Chánh Văn phòng, phụ trách Văn phòng Bộ Công Thương cùng các cán bộ, chuyên viên Văn phòng Bộ Công Thương và Vụ Tổ chức cán bộ; ông Mai Văn Trinh - Cục trưởng Cục quản lý chất lượng giáo dục, Bộ Giáo dục và Đào tạo. Về phía tổ chức AUN-QA có đại diện AUN-QA - Ngài Johnson Ong cùng đại diện lãnh đạo các ban ngành, đoàn thể Trung ương và địa phương, các nhà giáo nguyên là lãnh đạo nhà trường qua các thời kỳ, các đơn vị bạn cùng toàn thể quý thầy cô giáo, cán bộ - viên chức của Nhà trường. Phát biểu tại buổi lễ, thầy Nguyễn Thiên Tuế - Hiệu trưởng nhà trường vui mừng thông báo những thành công trong công tác kiểm định và đảm bảo chất lượng của nhà trường trong thời gian qua. Trong thời gian tới, Nhà trường sẽ tiếp tục tập trung đầu tư vào việc phát triển đội ngũ cán bộ làm công tác đảm bảo chất lượng, phấn đấu đến cuối năm 2020, hầu hết các chương trình đào tạo được đánh giá bởi AUN-QA, kiểm định bởi ABET và đặc biệt là đánh giá cấp cơ sở giáo dục theo bộ tiêu chuẩn AUN-QA. Thầy Nguyễn Thiên Tuế - Hiệu trưởng nhà trường phát biểu tại buổi lễ. Tại buổi lễ, Ngài Johnson đại diện tổ chức AUN-QA trao Giấy chứng nhận 04 chương trình đạt chuẩn AUN-QA, phiên bản 3.0 bao gồm: Công nghệ kỹ thuật Ô tô, Quản trị kinh doanh, Kế toán và Ngôn ngữ Anh. Trong bài phát biểu, Ngài Johnson nhấn mạnh sự nỗ lực và quyết tâm của Đảng ủy, Ban Giám hiệu cùng toàn thể cán bộ - viên chức nhà trường. Kết quả này thể hiện sự cam kết của Nhà trường trong công tác đảm bảo chất lượng, nâng cao chất lượng đào tạo, đáp ứng nhu cầu các bên liên quan và hội nhập toàn cầu.',
}
const NewsDetail = () => {
	const newsTime = moment(newsData.time).format('DD/MM/YYYY')
	return (
		<>
			<div className="pageNewsDetail">
				<div className="pageNewsDetail__params">
					<a href="#" className="paramRoot">
						Tin tức - sự kiện
					</a>
					<a href="#" className="paramCurrent breadcrumb-item">
						{newsData.title}
					</a>
					<div className="shareNews">
						<p>Chia sẽ:</p>
						<div className="shareItems">
							<FaSquareFacebook className="facebook" />
							<FaLinkedin className="linkedin" />
							<FaSquareXTwitter className="x" />
						</div>
					</div>
				</div>
				<div className="pageNewsDetail__container">
					<div className="headerNews">
						<div className="headerNews__title">
							<h1>{newsData.title}</h1>
						</div>
						<div className="headerNews__time">
							<p>{newsTime}</p>
						</div>
					</div>
					<div className="contentNews">{newsData.content}</div>
				</div>
			</div>
			<ScrollToTopButton />
		</>
	)
}

export default NewsDetail
