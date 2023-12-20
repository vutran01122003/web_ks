import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BsImageFill, BsCameraFill } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { checkImageUpload } from '../../utils/uploadFile'
import GLOBALTYPES from '../../redux/actions/globalTypes'

function ComponentProofFile({ files, setFiles }) {
	const inputRef = useRef()
	// const videoRef = useRef();
	// const canvasRef = useRef();
	const dispatch = useDispatch()
	// const [openVideo, setOpenVideo] = useState(false);

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
					<h3>{`Tải lên hoặc chụp minh chứng:`} </h3>
					<div className="icons_wrapper">
						<label htmlFor="insert_image" className="insert_image_icon icon-item--proof">
							<BsImageFill />
						</label>

						<label className="icon-item--proof camera_icon">
							<BsCameraFill />
							{/* onClick={handleOpenCamera} */}
						</label>

						<input
							id="insert_image"
							type="file"
							ref={inputRef}
							multiple
							// accept="image/*"
							onChange={handleInsertFiles}
							hidden
						/>
					</div>
				</div>

				{files?.length > 0 && (
					<div className="show_images">
						<div className="images_wrapper">
							<div className="remove_img_btn">
								<IoMdClose className="remove_img_icon" onClick={handleClearImages} />
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
