import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { TiMediaRecord } from 'react-icons/ti';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { renderTable } from '../../helpers/renderTable';

function DetailedRowModal({ handleHiddenDetailedRowModal, tableData }) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url
    ).toString();

    const dispatch = useDispatch();
    const table = renderTable({ table: tableData });
    const linkPDFList =
        tableData.rowValueList[0].content[0].proofFilesList || [];
    const [pdfList, setPdfList] = useState([]);
    const [numPages, setNumPages] = useState(1);
    const [pdfIndex, setPdfIndex] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleChangePdfIndex = (index) => {
        setPdfIndex(index);
    };

    const client = new S3Client({
        region: 'ap-southeast-1',
        credentials: {
            accessKeyId: 'AKIAQ3LTMVZSFJ6OYNXV',
            secretAccessKey: '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'
        }
    });

    const handleMouseUpDetailedRowModal = (e) => {
        if (e.target === e.currentTarget) {
            handleHiddenDetailedRowModal(e);
        }
    };

    const handleGetPDF = async () => {
        Promise.all(
            linkPDFList.map((linkPDFItem) => {
                return client.send(
                    new GetObjectCommand({
                        Bucket: linkPDFItem.Bucket,
                        Key: linkPDFItem.Key
                    })
                );
            })
        )
            .then((resList) => {
                return Promise.all(
                    resList.map((res) => {
                        return res.Body.transformToByteArray();
                    })
                );
            })
            .then((data) => {
                setPdfList(
                    data.map(
                        (item) => new Blob([item], { type: 'application/pdf' })
                    )
                );
            })
            .catch(() => {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: 'Xem File PDF Không Thành Công'
                    }
                });
            });
    };

    useEffect(() => {
        handleGetPDF();
    }, []);

    return (
        <div
            className="modal_overlap"
            onMouseUp={handleMouseUpDetailedRowModal}
        >
            <div
                className={`preview_PDF_wrapper ${pdfList.length > 1 ? 'multi_page' : 'single_page'}`}
            >
                <div className="preview_PDF_wrapper_header">
                    <h3>Minh Chứng</h3>
                    <div
                        className="modal_close_btn"
                        onClick={handleHiddenDetailedRowModal}
                    >
                        <AiOutlineClose />
                    </div>
                </div>
                <div className="preview_PDF">
                    <Document
                        file={pdfList[pdfIndex]}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        {Array.apply(null, Array(numPages))
                            .map((_, i) => i + 1)
                            .map((page) => {
                                return (
                                    <Page
                                        key={page}
                                        pageNumber={page}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                );
                            })}
                    </Document>
                </div>
                {pdfList.length > 1 && (
                    <div className="preview_PDF_pagination">
                        {pdfList.map((_, index) => (
                            <div
                                key={index}
                                className={`pagination_pdf ${
                                    pdfIndex === index ? 'active' : ''
                                }`}
                                onClick={() => {
                                    handleChangePdfIndex(index);
                                }}
                            >
                                <TiMediaRecord />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailedRowModal;
