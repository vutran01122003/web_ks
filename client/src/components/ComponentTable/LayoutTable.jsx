import React, { useState } from 'react'
import ComponentModal from '../ComponentModal/TableModal'
import PreviewFilesModal from '../ComponentModal/PreviewFilesModal';

const MainItem = ({ row, handleOpenPreviewFilesModal }) => {

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
                                <ComponentModal
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
