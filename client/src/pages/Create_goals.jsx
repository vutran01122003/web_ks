import { useState, useEffect } from 'react'
import { createPage } from '../redux/actions/pageAction'
import { useDispatch, useSelector } from 'react-redux'
import { pageSelector } from '../redux/selector'

function CreatePages() {
	const dispatch = useDispatch()
	const [rowTitleList, setRowTitleList] = useState([])
	const [titleRowValue, setTitleRowValue] = useState('')
	const [tableName, setTableName] = useState('')
	const [pageName, setPageName] = useState('')
	const [description, setDescription] = useState('')
	const page = useSelector(pageSelector)
	const handleAddRowTitleList = () => {
		if (titleRowValue) {
			setRowTitleList((prev) => [...prev, titleRowValue])
			setTitleRowValue('')
		}
	}

	const handleTitleRowValue = (e) => {
		setTitleRowValue(e.target.value)
	}

	const handleCreatePage = async () => {
		dispatch(createPage({ pageName, tables: [{ tableName, description, rowTitleList }] }))
		handleCancelPage()
	}
	const handleCancelPage = () => {
		setRowTitleList([])
		setTitleRowValue('')
		setTableName('')
		setPageName('')
		setDescription('')
	}

	return (
		<div className="create_goal_container">
			<h1 className="heading-4 page_title">Tạo menu nhóm chỉ tiêu</h1>
			<div className="form_input">
				<div className="input_page_item">
					<label>Tên Page: </label>
					<input
						type="text"
						className="outline-none border-2"
						value={pageName}
						onChange={(e) => {
							setPageName(e.target.value)
						}}
					/>
				</div>

				<div className="input_page_item">
					<label>Tên Bảng: </label>
					<input
						type="text"
						className="outline-none border-2"
						value={tableName}
						onChange={(e) => {
							setTableName(e.target.value)
						}}
					/>
				</div>

				<div className="input_page_item">
					<label>Ghi chú: </label>
					<input
						type="text"
						className="outline-none border-2"
						value={description}
						onChange={(e) => {
							setDescription(e.target.value)
						}}
					/>
				</div>

				<div className="input_page_item">
					<label>Thêm cột: </label>
					<input
						type="text"
						className="outline-none border-2"
						onChange={handleTitleRowValue}
						value={titleRowValue}
					/>
					<button className="btn_add_column" onClick={handleAddRowTitleList}>
						Thêm Cột
					</button>
				</div>
				<div className="button_function">
					<button onClick={handleCancelPage} className="btn_cancle">
						Huỷ tạo page
					</button>
					<button onClick={handleCreatePage} className="btn_create_page">
						Tạo Pages
					</button>
				</div>
			</div>
			<div className="goals_preview">
				<h1 className="heading-4 page_title preview_title">Xem trước</h1>
				<div className="mt-10 page">
					{pageName || tableName || description || rowTitleList.length > 0 ? (
						<div className="page_column">
							<h1 className="page_title_preview ">{pageName || ''}</h1>
							<h2 className="table_title_preview">{tableName || ''}</h2>
							<h4 className="description_preview">
								{description ? 'Ghi chú: ' + description : ''}
							</h4>

							<table>
								<thead>
									<tr>
										{rowTitleList.map((rowTitle, index) => (
											<th key={index} className="item_column">
												{rowTitle}
											</th>
										))}
									</tr>
								</thead>
							</table>
						</div>
					) : (
						<h2 className="page_title_preview ">Vui lòng điền dữ liệu để xem trước</h2>
					)}
				</div>
			</div>
		</div>
	)
}

export default CreatePages
