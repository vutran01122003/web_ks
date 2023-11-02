import React, { useState } from 'react'
import ComponentModal from '../ComponentModal/TableModal'
import PreviewImagesModal from '../ComponentModal/PreviewImagesModal';

const MainItem = ({ row, handleOpenPreviewImagesModal }) => {

	return (
		<tr className="table__line__item">
			{row.map((item, index) => {
                if(item.label) {
                    return (
                        <td 
                            onClick={() => {handleOpenPreviewImagesModal({proofData: item.proofImages})}}
                            className="preview_proof_images line__item" 
                            key={index}
                        >
                            {item.label}
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
    const [proofImagesData, setProofImagesData] = useState(null);

    const handleOpenPreviewImagesModal = ({proofData}) => {
        setProofImagesData(proofData);
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
                                handleOpenPreviewImagesModal={handleOpenPreviewImagesModal} 
                                row={row} 
                                key={index} 
                            />
                        ))}
				    </tbody>
                }		
			</table>
            {
                openPreviewModal && 
                <PreviewImagesModal 
                    proofImagesData={proofImagesData}
                    setOpenPreviewModal={setOpenPreviewModal}
                />}
		</div>
	)
}

export default LayoutTable
