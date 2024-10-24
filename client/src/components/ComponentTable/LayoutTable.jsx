import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableModal from '../ComponentModal/TableModal';
import PreviewFilesModal from '../ComponentModal/PreviewFilesModal';
import { authSelector } from '../../redux/selector';
import TableContent from './TableContent';

const LayoutTable = ({ index, table, page, isDynamicRows, isDetailedRow, talentEngineerType }) => {
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
                                    page.pageStudentLevelYear === auth.user.levelYear ? 'active' : 'inactive'
                                }`}
                                onClick={page.pageStudentLevelYear === auth.user.levelYear ? handleOpenModal : null}
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
                                <TableContent
                                    auth={auth}
                                    setRowInfo={setRowInfo}
                                    isDetailedRow={isDetailedRow}
                                    isDynamicRows={isDynamicRows}
                                    handleOpenPreviewFilesModal={handleOpenPreviewFilesModal}
                                    handleOpenModal={handleOpenModal}
                                    row={row}
                                    key={index}
                                    page={page}
                                    talentEngineerType={talentEngineerType}
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
