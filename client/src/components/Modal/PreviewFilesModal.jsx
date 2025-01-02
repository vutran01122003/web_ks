import { Modal } from 'antd';
import docIcon from '../../assets/images/icon/doc.png';
import imgIcon from '../../assets/images/icon/img.png';
import pdfIcon from '../../assets/images/icon/pdf.png';
import errorFileIcon from '../../assets/images/icon/error.png';

function PreviewFilesModal({ proofFilesData, openPreviewModal, setOpenPreviewModal }) {
    return (
        <Modal
            title={'Danh Sách Minh Chứng'}
            centered
            open={openPreviewModal}
            footer={null}
            onCancel={() => {
                setOpenPreviewModal(false);
            }}
        >
            <div className="files_preview_wrapper">
                {proofFilesData.map((proofFiles) => {
                    let src = null;
                    let alt = null;

                    switch (proofFiles?.fileType.toLowerCase()) {
                        case 'jpg':
                        case 'jpeg':
                        case 'png':
                            src = imgIcon;
                            alt = 'Image file';
                            break;
                        case 'doc':
                        case 'docx':
                            src = docIcon;
                            alt = 'Document file';
                            break;
                        case 'pdf':
                            src = pdfIcon;
                            alt = 'PDF file';
                            break;
                        default:
                            src = errorFileIcon;
                            alt = 'Invaild file';
                            break;
                    }

                    return (
                        <a key={proofFiles?._id} href={proofFiles?.fileUrl} className="file_item_link_wrapper" download>
                            <img className="file_item_link_icon" src={src} alt={alt} />
                            <span className="file_item_link">{proofFiles?.originalName}</span>
                        </a>
                    );
                })}
            </div>
        </Modal>
    );
}

export default PreviewFilesModal;
