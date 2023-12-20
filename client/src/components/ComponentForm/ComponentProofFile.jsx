import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { RiUpload2Fill } from "react-icons/ri";
import { IoMdClose  } from "react-icons/io";
import { checkImageUpload } from '../../utils/uploadFile'
import GLOBALTYPES from '../../redux/actions/globalTypes'

function ComponentProofFile({ files, setFiles }) {
	const inputRef = useRef()
	const dispatch = useDispatch()

	const handleInsertFiles = async (e) => {
		let localFiles = [...e.target.files]
		const newFiles = []

		for (let file of localFiles) {
			const { inValid, msg } = checkImageUpload(file)
			if (inValid) {
				dispatch({
					type: GLOBALTYPES.ALERT,
					payload: {
						error: msg,
					},
				})
			} else {
				newFiles.push(file)
			}
		}
		setFiles((prev) => [...prev, ...newFiles])
	}

	const handleClearImages = () => {
		setFiles([])
		if (inputRef.current !== null) inputRef.current.value = ''
	}

	return (
		<div>
			<label className="proof_title">Minh Chứng</label>
			<div className="proof_wrapper">
				<div className="proof_upload">
					<h4>{`Tải lên minh chứng :`} </h4>
					<div className="icons_wrapper">
						<label htmlFor="insert_files" className="insert_files_icon icon-item--proof">
							<RiUpload2Fill />
						</label>
                        
                        <span className="files_type" > 
                            (doc, docx, pdf, image)
                        </span>

						<input
							id="insert_files"
							type="file"
							ref={inputRef}
							multiple
                            accept="application/pdf, image/*, application/msword"
							onChange={handleInsertFiles}
							hidden
						/>
					</div>
				</div>

				{files?.length > 0 && (
					<div className="show_files">
						<div className="files_wrapper">
							<div className="remove_files_btn">
								<IoMdClose className="remove_files_icon" onClick={handleClearImages} />
							</div>
							{files.map((file, index) => {
								return (
									<img
										src={file?.imgCamera || URL.createObjectURL(file)}
										key={index}
										alt="previewed_image"
									/>
								)
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ComponentProofFile
