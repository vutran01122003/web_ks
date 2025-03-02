import { Modal } from 'antd';
import docIcon from '../../assets/images/icon/doc.png';
import imgIcon from '../../assets/images/icon/img.png';
import pdfIcon from '../../assets/images/icon/pdf.png';
import errorFileIcon from '../../assets/images/icon/error.png';
import { getFileFromS3, getFileFromServer } from '../../utils/handleFile';

function PreviewFilesModal({ proofFileDataList, visiblePreviewFileModal, setVisiblePreviewFileModal }) {
    const downloadS3File = ({ awsKey, bucket, type, originalName }) => {
        getFileFromS3({ Key: awsKey, Bucket: bucket, type })
            .then((blob) => URL.createObjectURL(blob))
            .then((href) => {
                Object.assign(document.createElement('a'), {
                    href,
                    download: originalName
                }).click();
            })
            .catch((err) => {
                throw err;
            });
    };

    const downloadServerFile = ({ fileUrl, originalName }) => {
        getFileFromServer(fileUrl)
            .then((blob) => URL.createObjectURL(blob))
            .then((href) => {
                Object.assign(document.createElement('a'), {
                    href,
                    download: originalName
                }).click();
            })
            .catch((err) => {
                throw err;
            });
    };

    const downloadFileToLocal = (index) => {
        try {
            const proofFileData = proofFileDataList[index];
            const originalName = proofFileData.originalName;
            const awsKey = proofFileData.Key;
            const bucket = proofFileData.Bucket;
            const fileUrl = proofFileData.fileUrl;

            if (bucket && awsKey) downloadS3File({ awsKey, bucket, type: proofFileData.fileType, originalName });
            else if (!bucket && fileUrl) downloadServerFile({ fileUrl, originalName });
        } catch (error) {
            throw error;
        }
    };

    return (
        <Modal
            title={'Danh Sách Minh Chứng'}
            centered
            open={visiblePreviewFileModal}
            footer={null}
            onCancel={() => {
                setVisiblePreviewFileModal(false);
            }}
        >
            <div className="files_preview_wrapper">
                {proofFileDataList.map((proofFile, index) => {
                    let src = null;
                    let alt = null;

                    switch (proofFile?.fileType.toLowerCase()) {
                        case 'image/jpg':
                        case 'image/jpeg':
                        case 'image/png':
                            src = imgIcon;
                            alt = 'Image file';
                            break;
                        case 'application/msword':
                            src = docIcon;
                            alt = 'Document file';
                            break;
                        case 'application/pdf':
                            src = pdfIcon;
                            alt = 'PDF file';
                            break;
                        default:
                            src = errorFileIcon;
                            alt = 'Invaild file';
                            break;
                    }

                    return (
                        <div
                            key={proofFile?._id}
                            className="file_item_wrapper"
                            onClick={() => downloadFileToLocal(index)}
                        >
                            <img className="file_item_link_icon" src={src} alt={alt} />
                            <span className="file_item_link">{proofFile?.originalName}</span>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}

export default PreviewFilesModal;
