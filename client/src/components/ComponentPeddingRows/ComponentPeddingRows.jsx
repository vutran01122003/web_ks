import { useEffect, useState } from 'react';
import ComponentAvatar from '../../components/ComponentAvatar/ComponentAvatar';
import {MdPendingActions} from 'react-icons/md';
import LayoutTable from '../ComponentTable/LayoutTable';
import ConfirmModal from '../ComponentModal/ConfirmModal';

function ComponentPeddingRows({penddingRows}) {
    const [table, setTable] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [status, setStatus] = useState(false);
    const [rowInfoData, setRowInfoData]  = useState({});

    const handleOpenConfirmModal = ({content, status}) => {
        setIsOpen(true);
        setContent(content);
        setStatus(status);
    }

    const handleHiddenConfirmModal = () => {
        setIsOpen(false);
    }

    useEffect(() => {  
        const TABLE = {};
        TABLE.tableId = penddingRows.table;

        const table = penddingRows.page[0].tables.find((table) => {
            return table._id === penddingRows.table;
        })

        setRowInfoData({
            rowListId: penddingRows._id, 
            rowItemId: penddingRows.content[0]._id
        });

        TABLE.title = table.tableName;
        TABLE.thead = table.rowTitleList.map((rowTitle) => {
            return {
                textHeading: rowTitle,
                typeInput: 'text', 
                isShow: true,
            }
        })

        TABLE.thead = [
            ...TABLE.thead, 
            {
                textHeading: "Minh Chứng",
                typeInput: 'file',
                isShow: true,
            }, {
                textHeading: "Trạng Thái",
                typeInput: 'text',
                isShow: false,
            }
        ];

        if(penddingRows?.content?.length > 0) {
            TABLE.tbody = penddingRows.content.map((rowValueItem) => {
                return [...rowValueItem.rowValue, {
                    label: `Xem Minh Chứng`,
                    proofImages: rowValueItem.proofImageList
                }, `${rowValueItem.status}`];
            })
        } 
           
        setTable(TABLE);
    }, [])

    return ( 
        <>  
            {
                isOpen && 
                <ConfirmModal 
                    content={content} 
                    status={status}
                    rowInfoData={rowInfoData}
                    handleHiddenConfirmModal={handleHiddenConfirmModal}
                />
            }
            {
                table && <div className='pedding_goals_container'>
                <div className='title_pending_goals'>
                    <MdPendingActions />
                    Chờ Duyệt Chỉ Tiêu
                </div>

                <div className='pedding_goals_wrapper'>
                    <div className='student_wrapper'>
                        <ComponentAvatar size="medium"/>
                        <div className='student_info_wrapper'>
                            <div className='student_info'>
                                <span className='student_info_label'>ID:{' '}</span> 
                                <span className='student_info_id'>{penddingRows.user[0].studentId}</span>
                            </div>
        
                            <div className='student_info'>
                                <span className='student_info_label'>Tên:{' '}</span> 
                                <span className='student_info_name'>{penddingRows.user[0].fullName}</span>
                            </div>
        
                            <div className='student_info'>
                                <span className='student_info_label'>Ngành:{' '}</span>
                                <span className='student_info_faculty'>{penddingRows.user[0].major}</span>
                            </div>
                        </div>

                        <div className='pedding_goals_btn_wrapper'>
                            <button 
                                className="reject_btn"
                                onClick={() => {
                                    handleOpenConfirmModal(
                                        {
                                            content: "Bạn chắc chắn muốn từ chối duyệt chỉ tiêu này ?",
                                            status: false
                                        }
                                    )
                                }}
                            >
                                Từ Chối
                            </button>

                            <button 
                                className="confirmation_btn"
                                onClick={() => {
                                    handleOpenConfirmModal(
                                        {
                                            content: "Bạn chắc chắn muốn duyệt chỉ tiêu này ?",
                                            status: true
                                        }
                                    )
                                }}
                            >
                                Xác Nhận
                            </button>
                        </div>
                    </div>
                    <LayoutTable table={table} pendingTable={true}/>
                </div>
            </div> 
            }
        </>
    );
}

export default ComponentPeddingRows;