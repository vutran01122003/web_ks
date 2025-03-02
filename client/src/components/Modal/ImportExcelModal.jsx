import { Fragment, useRef, useState } from 'react';
import { MdFileUpload, MdOutlineClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import Modal from './Modal';
import { importUser } from '../../redux/actions/excelAction';
import excelIcon from '../../assets/images/icon/excel.png';

function ImportExcelModal({ headerTitle, columns, onCloseModal }) {
    const dispatch = useDispatch();
    const [file, setFile] = useState('');

    const handleFileSelected = (e) => {
        const file = Array.from(e.target.files)[0];
        setFile(file);
    };

    const resetFileInput = () => {
        setFile('');
    };

    const onHiddenExcelModalDisplay = () => {
        onCloseModal();
        resetFileInput();
    };

    const onImportUser = () => {
        if (!file) return;

        const formData = new FormData();
        formData.set('file', file);

        dispatch(importUser(formData));
        onHiddenExcelModalDisplay();
    };

    return (
        <Modal headerTitle={headerTitle} onHiddenModal={onHiddenExcelModalDisplay}>
            <div className="modal-excel-body">
                {columns && (
                    <Fragment>
                        <h4 className="columns-preview-title">ĐỊNH DẠNG CỘT EXCEL</h4>
                        <div className="columns-preview-tab">
                            {columns.map((column, index) => (
                                <div key={index} className="columns-preview-item">
                                    {column}
                                </div>
                            ))}
                        </div>
                    </Fragment>
                )}

                <div className="note-content">
                    <span>Lưu ý: Đặt đúng tên và vị trí các cột như trên để nhập dữ liệu vào hệ thống.</span>
                </div>

                <div className="upload-excel-btn">
                    {file ? (
                        <div className="excel-file-info">
                            <div className="excel-file-info-header">
                                <h4>THÔNG TIN FILE EXCEL</h4>
                                <div className="reject-file-btn" onClick={resetFileInput}>
                                    <MdOutlineClose size={24} />
                                </div>
                            </div>

                            <div className="excel-icon-wrapper">
                                <img className="excel-icon" src={excelIcon} alt="excel-file" />
                                <span>{file.name}</span>
                            </div>
                        </div>
                    ) : (
                        <Fragment>
                            <MdFileUpload />
                            <label htmlFor="excel-file">Chọn file excel cần nhập vào hệ thống</label>
                            <input
                                type="file"
                                id="excel-file"
                                name="excelfile"
                                hidden
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                onChange={handleFileSelected}
                                value={file}
                            />
                        </Fragment>
                    )}
                </div>

                <div className="btn-group">
                    <button className="cancel-btn" onClick={onCloseModal}>
                        Hủy
                    </button>
                    <button
                        className={`agree-btn ${!file ? 'not-allowed' : ''}`}
                        onClick={file ? onImportUser : () => null}
                    >
                        Đồng ý
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ImportExcelModal;
