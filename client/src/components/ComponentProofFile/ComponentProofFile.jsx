import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { RiUpload2Fill } from "react-icons/ri";
import { IoMdClose  } from "react-icons/io";
import { checkFilesUpload, encodeFileName } from '../../utils/uploadFiles'
import GLOBALTYPES from '../../redux/actions/globalTypes'

function ComponentProofFile({ files, setFiles }) {
	const inputRef = useRef()
	const dispatch = useDispatch()

	const handleInsertFiles = async (e) => {
		let localFiles = [...e.target.files]
		const newFiles = []

		for (let file of localFiles) {
			const { inValid, msg } = checkFilesUpload(file);
			if (inValid) {
				dispatch({
					type: GLOBALTYPES.ALERT,
					payload: {
						error: msg,
					},
				})
			} else {
				newFiles.push(encodeFileName(file))
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
					<h4>{`Tải lên :`} </h4>
					<div className="icons_wrapper">
						<label htmlFor="insert_files" className="insert_files_icon icon-item--proof">
							<RiUpload2Fill />
						</label>
                        
                        <span className="files_type" > 
                            (Giới hạn là 10 files; Kích thước file tối đa 10MB có định dạng là doc, docx, pdf và image)
                        </span>

						<input
							id="insert_files"
							type="file"
							ref={inputRef}
							multiple
                            accept="application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                                let src = null;
                                if (file.type.split('/').includes('image')) src = URL.createObjectURL(file) 
                                else if (file.type === 'application/pdf') src = import.meta.env.VITE_APP_PDF_FILE_ICON_URL; 
                                else if ( file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === "application/msword") src = import.meta.env.VITE_APP_DOC_FILE_ICON_URL;
                                else src = import.meta.env.VITE_APP_INVAILD_FILE_ICON_URL;
                                 
								return (
                                    <div className="previewed_file_wrapper" key={index}>
                                        <img src={src} alt="previewed_file" />
                                        <span> {decodeURI(file.name)} </span>
                                    </div>	
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
