import React from "react";
import { MdClose } from "react-icons/md";

function PreviewFilesModal({proofFilesData, setOpenPreviewModal}) {

    const {
            VITE_APP_IMG_FILE_ICON_URL, 
            VITE_APP_DOC_FILE_ICON_URL, 
            VITE_APP_PDF_FILE_ICON_URL, 
            VITE_APP_INVAILD_FILE_ICON_URL
        } = import.meta.env;

    const handleHidePreviewFilesModal = (e) => {
        if(e.currentTarget === e.target) {
            setOpenPreviewModal(false);
        }
        return;
    }
    return ( 
        <div 
            className="modal_overlap"
            onMouseUp={handleHidePreviewFilesModal}
        >   
            <div className='files_preview_wrapper'>    
            <div className='files_preview_title'>
                <h3>Danh Sách Minh Chứng</h3>
                <button type="button" className="files_preview_close_btn" onClick={() => setOpenPreviewModal(false)}>
						<MdClose />
				</button> 
            </div>

                {
                    proofFilesData.map((proofFiles) => {
                        let src = '';
                        let alt = '';

                        switch (proofFiles?.fileType.toLowerCase()) {
                            case 'jpg':
                            case 'jpeg':
                            case 'png':
                                src = VITE_APP_IMG_FILE_ICON_URL;
                                alt = "image file";
                                break;
                            case 'doc':
                            case 'docx':
                                src = VITE_APP_DOC_FILE_ICON_URL;
                                alt = "document file";
                                break;
                            case 'pdf':
                                src = VITE_APP_PDF_FILE_ICON_URL;
                                alt = "document file";
                                break;
                            default:
                                src = VITE_APP_INVAILD_FILE_ICON_URL;
                                alt = "invaild file";
                                break;
                        }

                        return (
                            <a 
                                key={proofFiles?._id} 
                                href={proofFiles?.fileUrl} 
                                className="file_item_link_wrapper"
                                download 
                            >   
                                <img className="file_item_link_icon" src={src} alt={alt}/>
                                <span className="file_item_link">
                                    {proofFiles?.originalName}
                                </span>
                            </a>
                        )
                    })
                }
            </div>
        </div> 
    );
}

export default PreviewFilesModal;