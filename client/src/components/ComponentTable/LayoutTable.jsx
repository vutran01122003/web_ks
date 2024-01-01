import React, { useState } from 'react'
import TableModal from '../ComponentModal/TableModal'
import PreviewFilesModal from '../ComponentModal/PreviewFilesModal';
import ConfirmModal from '../ComponentModal/ConfirmModal';
import { CheckSquareFilled , CloseSquareFilled } from '@ant-design/icons';

const MainItem = ({ row, handleOpenPreviewFilesModal }) => {
    const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const handleVisibleConfirmModal = () => {
        setVisibleConfirmModal(true);
    }

    const handleHiddenConfirmModal = () => {
        setVisibleConfirmModal(false);
    }

	return (
		<tr className="table__line__item">
			{row.map((item, index) => {
                if(item?.proofNameLabel) {
                    return (
                        item?.proofFiles.length > 1 ?
                        <td 
                            onClick={() => {handleOpenPreviewFilesModal({proofData: item?.proofFiles})}}
                            className="preview_proof_files line__item" 
                            key={index}
                        >
                            {item?.proofNameLabel}
                        </td> : 
                        <td 
                            key={item?.proofFiles[0]?._id} 
                            className="line__item" 
                        >
                           <a
                                href={item?.proofFiles[0]?.fileUrl} 
                                className='preview_proof_files'
                            >
                                {item?.proofNameLabel}
                            </a>
                        </td>
                    )
                } else if (item?.statusLabel) {
                    return (
                        <td 
                            className={`line__item row_status ${item?.statusValue === null ? 'wating_status' : (item?.statusValue ? 'accept_status' : 'deny_status')}`}
                            key={index}
                        >
                            {item?.statusLabel}
                        </td>
                    )
                } else if (item?.buttonNameLabel) {
                    return (
                            item?.textHeadingExists ? 
                            <td key={index} className="line__item" >
                                {
                                    visibleConfirmModal &&
                                    <ConfirmModal 
                                        rowsType={item.rowsType}
                                        isOpen={visibleConfirmModal}
                                        title={modalData.title}
                                        content={modalData.content}
                                        status={modalData.status}
                                        rowInfoData={item.rowInfoData}
                                        handleHiddenConfirmModal={handleHiddenConfirmModal}
                                    />
                                }
                                <div className='button_wrapper'>
                                    {
                                        ["rejectedRows", "pendingRows"].includes(item.rowsType) &&
                                        <button 
                                            className="row_button_wrapper" 
                                            onClick={() => {
                                                handleVisibleConfirmModal();
                                                setModalData({
                                                    title: 'Chấp Nhận Chỉ Tiêu',
                                                    content: 'Bạn đã đọc kỹ minh chứng và chắc chắn chấp nhận chỉ tiêu này',
                                                    status: true,
                                                })
                                            }}
                                        >
                                            <CheckSquareFilled className='row_button accpect_button' />
                                        </button> 
                                    }

                                    {   
                                         ["acceptedRows", "pendingRows"].includes(item.rowsType) &&
                                        <button 
                                            className='row_button_wrapper'
                                            onClick={() => {
                                                handleVisibleConfirmModal();
                                                setModalData({
                                                    title: 'Từ Chối Chỉ Tiêu',
                                                    content: 'Bạn đã đọc kỹ minh chứng và chắc chắn từ chối chỉ tiêu này',
                                                    status: false,
                                                })
                                            }}    
                                        >
                                            <CloseSquareFilled className='row_button reject_button' />
                                        </button>
                                    }
                                </div>
                            </td> : null
                    )
                }

				return <td className="line__item" key={index}>{item}</td>
        })}
		</tr>
	)
}

const LayoutTable = ({ table, page, pendingTable }) => {
	const [useStateModal, setUseStateModal] = useState(false);
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const [proofFilesData, setProofFilesData] = useState(null);

    const handleOpenPreviewFilesModal = ({proofData}) => {
        setProofFilesData(proofData);
        setOpenPreviewModal(true);
    }

    const handleOpenModal = () => {
        setUseStateModal(true)
    }

	return (
		<div className="container__table">
			<header>
				<div className="heading-4">{table?.title}</div>
				{
                    !pendingTable && 
                    <div className="modal">
                        <button className="modal_btn_open" onClick={handleOpenModal}>Thêm hoạt động</button>
                        <>
                            {
                                useStateModal && 
                                <TableModal
                                        stateModal={useStateModal}
                                        setStateModal={setUseStateModal}
                                        title={table?.title}
                                        thead={table?.thead}
                                        tableId={table?.tableId}
                                        page={page}
                                    />
                            }
                        </>
				    </div>
                }
			</header>

			<table className="table">
                {
                  table?.thead &&
                    <thead>
                        <tr className="table__line__header">
                            {table.thead.map((item, index) => (
                                <th className="header__item" key={index}>
                                    {item?.textHeading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                }
				
                {
                    table?.tbody && 
                    <tbody className="table__items">
                        {table.tbody.map((row, index) => (
                            <MainItem 
                                handleOpenPreviewFilesModal={handleOpenPreviewFilesModal} 
                                row={row} 
                                key={index} 
                            />
                        ))}
				    </tbody>
                }		
			</table>
            {
                openPreviewModal && 
                <PreviewFilesModal 
                    proofFilesData={proofFilesData}
                    openPreviewModal={openPreviewModal}
                    setOpenPreviewModal={setOpenPreviewModal}
                />}
		</div>
	)
}

export default LayoutTable
