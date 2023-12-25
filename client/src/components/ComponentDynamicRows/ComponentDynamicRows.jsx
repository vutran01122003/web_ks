import { useEffect, useState } from 'react';
import ComponentAvatar from '../ComponentAvatar/ComponentAvatar';
import LayoutTable from '../ComponentTable/LayoutTable';
import ConfirmModal from '../ComponentModal/ConfirmModal';
import { renderTable } from '../../helpers/renderTable';

function ComponentDynamicRows({ rowsType, dynamicRows }) {
    const [table, setTable] = useState(null);
    const [title, setTitle] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [status, setStatus] = useState(false);
    const [rowInfoData, setRowInfoData] = useState({});

    const handleOpenConfirmModal = ({ content, status, title}) => {
        setIsOpen(true);
        setContent(content);
        setStatus(status);
        setTitle(title);
    }

    const handleHiddenConfirmModal = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        setTable(renderTable({dynamicRowsInfo: dynamicRows, rowsType}));
        setRowInfoData({
            rowListId: dynamicRows._id, 
            contentIdList: dynamicRows.content.map((content) => {
                if(content.status === "Chờ Duyệt")
                    return content._id;
            })
        });
    }, []);


    return (
        <>
            {
                <div className='pedding_goals_container'>
                    <ConfirmModal
                        rowsType={rowsType}
                        isOpen={isOpen}
                        title={title}
                        content={content}
                        status={status}
                        rowInfoData={rowInfoData}
                        handleHiddenConfirmModal={handleHiddenConfirmModal}
                    />
                    <div className='pedding_goals_wrapper'>
                        <div className='student_wrapper'>
                            <ComponentAvatar size="medium" />
                            <div className='student_info_wrapper'>
                                <div className='student_info'>
                                    <span className='student_info_label'>ID:{' '}</span>
                                    <span className='student_info_id'>{dynamicRows?.user[0].studentId}</span>
                                </div>

                                <div className='student_info'>
                                    <span className='student_info_label'>Tên:{' '}</span>
                                    <span className='student_info_name'>{dynamicRows?.user[0].fullName}</span>
                                </div>

                                <div className='student_info'>
                                    <span className='student_info_label'>Khoa:{' '}</span>
                                    <span className='student_info_name'>{dynamicRows?.user[0].faculty}</span>
                                </div>

                                <div className='student_info'>
                                    <span className='student_info_label'>Ngành:{' '}</span>
                                    <span className='student_info_faculty'>{dynamicRows?.user[0].major}</span>
                                </div>
                            </div>

                            {
                                rowsType === "pendingRows" && 
                                <div className='pedding_goals_btn_wrapper'>
                                    <button
                                        className="confirmation_btn"
                                        onClick={() => {
                                            handleOpenConfirmModal(
                                                {
                                                    title: "Xác nhận duyệt chỉ tiêu",
                                                    content: "Bạn đã kiểm tra thật kỹ minh chứng và chắc chắn duyệt chỉ tiêu này ?",
                                                    status: true
                                                }
                                            )
                                        }}
                                    >
                                        Chấp Nhận Toàn Bộ
                                    </button>

                                    <button
                                        className="reject_btn"
                                        onClick={() => {
                                            handleOpenConfirmModal(
                                                {   
                                                    title: "Xác nhận từ chối chỉ tiêu",
                                                    content: "Bạn đã kiểm tra thật kỹ minh chứng và chắc chắn từ chối chỉ tiêu này ?",
                                                    status: false
                                                }
                                            )
                                        }}
                                    >
                                        Từ Chối Toàn Bộ
                                    </button>
                                </div>
                            }
                        </div>
                        <LayoutTable table={table} pendingTable={true} />
                    </div>
                </div>
            }
        </>
    );
}

export default ComponentDynamicRows;