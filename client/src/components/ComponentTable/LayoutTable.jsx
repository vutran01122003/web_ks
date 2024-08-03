import { useState } from 'react';
import TableModal from '../ComponentModal/TableModal';
import PreviewFilesModal from '../ComponentModal/PreviewFilesModal';
import ApproveActivityModal from '../ComponentModal/ApproveActivityModal';
import { CheckSquareFilled, CloseSquareFilled, MinusSquareFilled } from '@ant-design/icons';
import { FaEdit } from 'react-icons/fa';
import NoteModal from '../ComponentModal/NoteModal';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../redux/selector';
import PreviewPdfModal from '../ComponentModal/PreviewPdfModal';
import { MdOutlineMoreTime } from 'react-icons/md';
import GLOBALTYPES from '../../redux/actions/globalTypes';

const [PENDING_ROWS, ACCEPTED_ROWS, REJECTED_ROWS, RESUBMITED_ROWS] = [
    'pendingRows',
    'acceptedRows',
    'rejectedRows',
    'resubmitedRows'
];

const ROW_STATUS = {
    pendingRows: 'chờ duyệt',
    acceptedRows: 'đã duyệt',
    rejectedRows: 'từ chối',
    resubmitedRows: 'phải nộp lại'
};

const MainItem = ({ auth, row, page, setRowInfo, isDetailedRow, handleOpenModal, handleOpenPreviewFilesModal }) => {
    const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
    const [visibleNoteModal, setVisibleNoteModal] = useState(false);
    const [visibleDetailedRowModal, setVisibleDetailedRowModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const handleVisibleConfirmModal = () => {
        setVisibleConfirmModal(true);
    };

    const handleHiddenConfirmModal = () => {
        setVisibleConfirmModal(false);
    };

    const handleVisibleNoteModal = () => {
        setVisibleNoteModal(true);
    };

    const handleHiddenNoteModal = (e) => {
        e.preventDefault();
        setVisibleNoteModal(false);
    };

    const handleVisibleDetailedRowModal = () => {
        setVisibleDetailedRowModal(true);
    };

    const handleHiddenDetailedRowModal = (e) => {
        e.preventDefault();
        setVisibleDetailedRowModal(false);
    };

    return (
        <tr className="table__line__item">
            {row.map((item, index) => {
                if (item?.proofNameLabel) {
                    return (
                        !isDetailedRow && (
                            <td className="proof_files_wrapper line__item" key={index}>
                                {visibleDetailedRowModal && (
                                    <PreviewPdfModal
                                        handleHiddenDetailedRowModal={handleHiddenDetailedRowModal}
                                        tableData={item?.tableValue}
                                    />
                                )}

                                {item?.proofFiles.length > 1 ? (
                                    <span
                                        className="proof_files_download"
                                        onClick={() => {
                                            handleOpenPreviewFilesModal({
                                                proofData: item?.proofFiles
                                            });
                                        }}
                                    >
                                        {item?.proofNameLabel}
                                    </span>
                                ) : (
                                    <a href={item?.proofFiles[0]?.fileUrl} className="proof_files_download">
                                        {item?.proofNameLabel}
                                    </a>
                                )}

                                <span onClick={handleVisibleDetailedRowModal} className="preview_proof_files">
                                    {item?.proofPreviewLabel}
                                </span>
                            </td>
                        )
                    );
                } else if (item?.statusLabel) {
                    let statusValue = '';

                    switch (item?.statusLabel.toLowerCase()) {
                        case 'chờ duyệt':
                            statusValue = 'wating_status';
                            break;
                        case 'đã duyệt':
                            statusValue = 'accept_status';
                            break;
                        case 'từ chối':
                            statusValue = 'deny_status';
                            break;
                        case 'phải nộp lại':
                            statusValue = 'resubmit_status';
                            break;
                        case 'hết hạn':
                            statusValue = 'expired_status';
                            break;
                        default:
                            break;
                    }
                    return !isDetailedRow ? (
                        <td className={`line__item row_status ${statusValue}`} key={index}>
                            {item?.statusLabel}
                        </td>
                    ) : null;
                } else if (item?.buttonNameLabel) {
                    return (
                        <td key={index} className="line__item">
                            {visibleConfirmModal && (
                                <ApproveActivityModal
                                    auth={auth}
                                    rowsType={item.rowsType}
                                    isOpen={visibleConfirmModal}
                                    title={modalData.title}
                                    content={modalData.content}
                                    prevStatus={modalData.prevStatus}
                                    status={modalData.status}
                                    isTimedExtension={modalData?.isTimedExtension ?? false}
                                    isResubmitedRow={modalData?.isResubmitedRow ?? false}
                                    rowInfoData={item.rowInfoData}
                                    handleHiddenConfirmModal={handleHiddenConfirmModal}
                                    userData={item?.userData}
                                />
                            )}
                            <div className="button_wrapper">
                                {[REJECTED_ROWS, PENDING_ROWS].includes(item.rowsType) && (
                                    <button
                                        className="row_button_wrapper"
                                        onClick={() => {
                                            handleVisibleConfirmModal();
                                            setModalData({
                                                title: 'Thông Báo',
                                                content: 'Bạn chắc chắn chấp nhận hoạt động này ?',
                                                prevStatus: ROW_STATUS[item.rowsType],
                                                status: ROW_STATUS.acceptedRows
                                            });
                                        }}
                                    >
                                        <CheckSquareFilled className="row_button accpect_button" />
                                    </button>
                                )}

                                {[ACCEPTED_ROWS, PENDING_ROWS].includes(item.rowsType) && (
                                    <button
                                        className="row_button_wrapper"
                                        onClick={() => {
                                            handleVisibleConfirmModal();
                                            setModalData({
                                                title: 'Thông Báo',
                                                content: 'Bạn chắc chắn từ chối hoạt động này ?',
                                                prevStatus: ROW_STATUS[item.rowsType],
                                                status: ROW_STATUS.rejectedRows
                                            });
                                        }}
                                    >
                                        <CloseSquareFilled className="row_button reject_button" />
                                    </button>
                                )}

                                {[RESUBMITED_ROWS].includes(item.rowsType) && (
                                    <button
                                        className="row_button_wrapper more_time_btn"
                                        onClick={() => {
                                            handleVisibleConfirmModal();
                                            setModalData({
                                                title: 'Thông Báo',
                                                content: 'Bạn chắc chắn muốn gia hạn thời gian cho hoạt động này ?',
                                                prevStatus: ROW_STATUS[item.rowsType],
                                                status: ROW_STATUS.resubmitedRows,
                                                isTimedExtension: true
                                            });
                                        }}
                                    >
                                        <MdOutlineMoreTime />
                                    </button>
                                )}

                                {[PENDING_ROWS, REJECTED_ROWS, ACCEPTED_ROWS].includes(item.rowsType) && (
                                    <button
                                        className="row_button_wrapper"
                                        onClick={() => {
                                            handleVisibleConfirmModal();
                                            setModalData({
                                                title: 'Thông Báo',
                                                content: 'Bạn chắc chắn muốn sinh viên nộp lại hoạt động này ?',
                                                prevStatus: ROW_STATUS[item.rowsType],
                                                status: ROW_STATUS.resubmitedRows,
                                                isResubmitedRow: true
                                            });
                                        }}
                                    >
                                        <MinusSquareFilled className="row_button pending_button" />
                                    </button>
                                )}
                            </div>
                        </td>
                    );
                } else if (item?.noteLabel) {
                    return (
                        <td className="line__item" key={index}>
                            {visibleNoteModal && (
                                <NoteModal handleHiddenNoteModal={handleHiddenNoteModal} noteList={item?.noteValue} />
                            )}
                            <span className="note_row" onClick={handleVisibleNoteModal}>
                                Ghi Chú
                            </span>
                        </td>
                    );
                } else if (item?.editLabel) {
                    return !isDetailedRow ? (
                        <td className="line__item " key={index}>
                            {
                                <abbr
                                    title={`${
                                        item.editValue
                                            ? page.pageLevelYear === auth.user.levelYear
                                                ? ''
                                                : `Hoạt động năm ${page.pageLevelYear} đã kết thúc`
                                            : 'Không được chỉnh sửa'
                                    }`}
                                >
                                    <span
                                        onClick={() => {
                                            if (item.editValue && page.pageLevelYear === auth.user.levelYear) {
                                                setRowInfo(item.rowInfo);
                                                handleOpenModal();
                                            }
                                        }}
                                        className={`edit_row ${item.editValue ? 'active' : 'inactive'} ${
                                            page.pageLevelYear === auth.user.levelYear ? 'allow' : 'deny'
                                        }`}
                                    >
                                        <FaEdit />
                                    </span>
                                </abbr>
                            }
                        </td>
                    ) : null;
                }

                return (
                    <td className="line__item" key={index}>
                        {item}
                    </td>
                );
            })}
        </tr>
    );
};

const LayoutTable = ({ index, table, page, isDynamicRows, isDetailedRow }) => {
    const dispatch = useDispatch();
    const [useStateModal, setUseStateModal] = useState(false);
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const [proofFilesData, setProofFilesData] = useState(null);
    const [rowInfo, setRowInfo] = useState(null);

    const auth = useSelector(authSelector);
    const handleOpenPreviewFilesModal = ({ proofData }) => {
        setProofFilesData(proofData);
        setOpenPreviewModal(true);
    };

    const handleOpenModal = () => {
        if (page.pageLevelYear !== auth.user.levelYear) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: `Hoạt động năm ${page.pageLevelYear} đã kết thúc`
                }
            });
            return;
        }
        setUseStateModal(true);
    };

    const handleHideModal = () => {
        setUseStateModal(false);
        setRowInfo(null);
    };

    return (
        <div className={`container__table ${isDynamicRows ? 'margin-0' : ''} ${isDetailedRow ? 'detailed_table' : ''}`}>
            {!isDynamicRows && (
                <header>
                    <h4 className={`heading ${isDetailedRow ? 'fsize_small' : ''}`}>{`CHỈ TIÊU: ${table?.title}`}</h4>
                    <div className="modal">
                        {!isDynamicRows && !isDetailedRow && (
                            <button
                                className={`modal_btn_open ${
                                    page.pageLevelYear === auth.user.levelYear ? 'active' : 'inactive'
                                }`}
                                onClick={handleOpenModal}
                            >
                                Thêm hoạt động
                            </button>
                        )}
                        <>
                            {useStateModal && (
                                <TableModal
                                    auth={auth}
                                    stateModal={useStateModal}
                                    rowInfo={rowInfo}
                                    handleHideModal={handleHideModal}
                                    handleOpenModal={handleOpenModal}
                                    title={table?.title}
                                    thead={table?.thead}
                                    tableId={table?.tableId}
                                    page={page}
                                />
                            )}
                        </>
                    </div>
                </header>
            )}

            {!isDynamicRows && !isDetailedRow && (
                <h5 className="table_description">
                    <span>Mô tả chỉ tiêu: </span>
                    {`${table.description ? table.description : 'không có mô tả cụ thể cho chỉ tiêu này'}`}
                </h5>
            )}

            <table className={`table ${isDynamicRows ? 'margin-0' : ''}`}>
                {table?.thead && (!isDynamicRows || index === 0) && (
                    <thead>
                        <tr className="table__line__header">
                            {table.thead.map((item, index) => {
                                return isDetailedRow &&
                                    ['Sửa', 'Minh Chứng', 'Trạng Thái'].includes(item?.textHeading) ? null : (
                                    <th className="header__item" key={index}>
                                        {item?.textHeading}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                )}

                {table?.tbody && (
                    <tbody className="table__items">
                        {table.tbody.map((row, index) => {
                            return (
                                <MainItem
                                    auth={auth}
                                    setRowInfo={setRowInfo}
                                    isDetailedRow={isDetailedRow}
                                    isDynamicRows={isDynamicRows}
                                    handleOpenPreviewFilesModal={handleOpenPreviewFilesModal}
                                    handleOpenModal={handleOpenModal}
                                    row={row}
                                    key={index}
                                    page={page}
                                />
                            );
                        })}
                    </tbody>
                )}
            </table>
            {openPreviewModal && (
                <PreviewFilesModal
                    proofFilesData={proofFilesData}
                    openPreviewModal={openPreviewModal}
                    setOpenPreviewModal={setOpenPreviewModal}
                />
            )}
        </div>
    );
};

export default LayoutTable;
