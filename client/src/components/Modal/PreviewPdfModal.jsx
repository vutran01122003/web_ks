import { useEffect, useState } from 'react';
import { TiMediaRecord } from 'react-icons/ti';
import Modal from './Modal';
import { s3Client } from '../../config/aws.config';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getFileFromS3, getFileFromServer } from '../../utils/handleFile';

function DetailedRowModal({ handleHiddenFileContentModal, tableData }) {
    const proofFileList = tableData.rowValueList[0].content[0].proofFileList || [];
    const [proofFileIndex, setProofFileIndex] = useState(0);
    const [url, setUrl] = useState(null);

    const convertToObjectURL = () => {
        try {
            const proofFile = proofFileList[proofFileIndex];
            const fileUrl = proofFile?.fileUrl;
            const awsKey = proofFile?.Key;
            const bucket = proofFile?.Bucket;

            if (bucket && awsKey)
                getFileFromS3({ Key: awsKey, Bucket: bucket, type: proofFile.fileType })
                    .then((blob) => setUrl(URL.createObjectURL(blob)))
                    .catch((err) => {
                        throw err;
                    });
            else if (!bucket && fileUrl)
                getFileFromServer(fileUrl)
                    .then((blob) => setUrl(URL.createObjectURL(blob)))
                    .catch((err) => {
                        throw err;
                    });
            else setUrl(null);
        } catch (error) {
            setUrl(null);
            throw error;
        }
    };

    useEffect(() => {
        convertToObjectURL();
    }, [proofFileIndex]);

    return (
        <Modal onHiddenModal={handleHiddenFileContentModal} headerTitle="Thông Tin Minh Chứng">
            <div className={`preview_PDF_wrapper ${proofFileList.length > 1 ? 'multi_page' : 'single_page'}`}>
                <div className="preview_PDF">
                    <object data={url} type="application/pdf" width="100%" height="100%">
                        <p>Không thể hiển thị dữ liệu</p>
                    </object>
                </div>

                {proofFileList.length > 1 && (
                    <div className="preview_PDF_pagination">
                        {proofFileList.map((_, index) => (
                            <div
                                key={index}
                                className={`pagination_pdf ${proofFileIndex === index ? 'active' : ''}`}
                                onClick={() => setProofFileIndex(index)}
                            >
                                <TiMediaRecord />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default DetailedRowModal;
