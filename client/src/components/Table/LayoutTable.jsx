import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import TableModal from '../Modal/TableModal';
import PreviewFilesModal from '../Modal/PreviewFilesModal';
import { authSelector } from '../../redux/selector';
import TableContent from './TableContent';
import { capitalizeFirstLetter } from '../../utils/handleString';

const LayoutTable = ({ index, table, page, isDynamicRows, isDetailedRow, talentEngineerType, currentDeadline }) => {
    const auth = useSelector(authSelector);
    const levelYear = auth.user.cohort.currentLevelYear;
    const [useStateModal, setUseStateModal] = useState(false);
    const [visiblePreviewFileModal, setVisiblePreviewFileModal] = useState(false);
    const [proofFileDataList, setProofFileDataList] = useState(null);
    const [rowInfo, setRowInfo] = useState(null);

    const handleOpenPreviewFilesModal = ({ proofData }) => {
        setProofFileDataList(proofData);
        setVisiblePreviewFileModal(true);
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
                                    page.pageStudentLevelYear === levelYear ? 'active' : 'inactive'
                                }`}
                                onClick={page.pageStudentLevelYear === levelYear ? handleOpenModal : null}
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
                <Fragment>
                    <h5 className="table_description">
                        <span>Mô Tả Chỉ Tiêu: </span>
                        <span>
                            {table.description
                                ? capitalizeFirstLetter(table.description)
                                : 'Không có mô tả cụ thể cho chỉ tiêu này'}
                        </span>
                    </h5>
                    <h5 className="table_description">
                        <span>Số Lượng: </span>
                        <span>{`${table.quantityDemanded}`}</span>
                    </h5>
                </Fragment>
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
                                    currentDeadline={currentDeadline}
                                />
                            );
                        })}
                    </tbody>
                )}
            </table>
            {visiblePreviewFileModal && (
                <PreviewFilesModal
                    proofFileDataList={proofFileDataList}
                    visiblePreviewFileModal={visiblePreviewFileModal}
                    setVisiblePreviewFileModal={setVisiblePreviewFileModal}
                />
            )}
        </div>
    );
};

export default LayoutTable;
