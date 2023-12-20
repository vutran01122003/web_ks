import { useEffect, useState } from 'react';
import ComponentAvatar from '../../components/ComponentAvatar/ComponentAvatar';
import { MdPendingActions } from 'react-icons/md';
import LayoutTable from '../ComponentTable/LayoutTable';
import ConfirmModal from '../ComponentModal/ConfirmModal';

// Ant design underconstruction
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
const { confirm } = Modal;


const TestPedding = ({ penddingRows, index }) => {

    const [table, setTable] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [status, setStatus] = useState(false);
    const [rowInfoData, setRowInfoData] = useState({});

    const handleOpenConfirmModal = ({ content, status }) => {
        setIsOpen(true);
        setContent(content);
        setStatus(status);
    }

    // const handleHiddenConfirmModal = () => {
    //     setIsOpen(false);
    // }

    useEffect(() => {
        const TABLE = {};
        TABLE.tableId = penddingRows.table;

        const table = penddingRows.page[0].tables.find((table) => {
            return table._id === penddingRows.table;
        })

        setRowInfoData({
            rowListId: penddingRows._id,
            contentIdList: penddingRows.content.map((content) => {
                if (content.status === "Chờ Duyệt")
                    return content._id;
            })
        });

        TABLE.title = table.tableName;
        TABLE.thead = table.rowTitleList.map((rowTitle) => {
            return {
                textHeading: rowTitle.titleValue,
                fixedValueList: rowTitle.fixedValue,
                typeInput: rowTitle.fixedValue.length > 0 ? 'select' : 'text',
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

        if (penddingRows?.content?.length > 0) {
            TABLE.tbody = penddingRows.content.map((rowValueItem) => {
                const thead = [...TABLE.thead];
                const rowValueItemArr = thead.reduce((arr, headingItem) => {
                    if (!thead.requiredHeading && rowValueItem.rowValue[headingItem.textHeading])
                        return [...arr, rowValueItem.rowValue[headingItem.textHeading]];
                    return arr
                }, []);
                return [...rowValueItemArr, {
                    proofNameLabel: 'Xem Minh Chứng',
                    proofImages: rowValueItem.proofImageList
                }, {
                    statusLabel: rowValueItem.status,
                    statusValue: rowValueItem.status === "Chờ Duyệt" ? null :
                        (rowValueItem.status === "Đã Duyệt" ? true : false)
                }];
            })
        }

        setTable(TABLE);
    }, []);

    //-----------------------------------------------------
    const showConfirm = () => {
        confirm({
            title: 'Bạn xác nhận duyệt chỉ tiêu này?',
            onOk() {
                // console.log('Xác nhận');
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    };

    const showConfirmTuChoi = () => {
        confirm({
            title: 'Bạn xác nhận từ chối chỉ tiêu này?',
            onOk() {
                // console.log('OK');
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    };

    const [open, setOpen] = useState(false);

    return (
        <>
            <Modal
                title="Thông tin chỉ tiêu"
                centered
                open={open}
                onCancel={() => setOpen(false)}
                width={1000}
                footer={false}
            >
                <LayoutTable table={table} pendingTable={true} />
                <div className='pedding_goals_btn_wrapper'>
                    <button
                        className="reject_btn"
                        // onClick={() => {
                        //     handleOpenConfirmModal(
                        //         {
                        //             content: "Bạn chắc chắn muốn từ chối duyệt chỉ tiêu này ?",
                        //             status: false
                        //         }
                        //     )
                        // }}
                        onClick={showConfirmTuChoi}
                    >
                        Từ Chối - <span className='student_info_id'>{penddingRows?.user[0].studentId}</span>
                    </button>

                    <button
                        className="confirmation_btn"
                        //     onClick={() => {
                        //         handleOpenConfirmModal(
                        //             {
                        //                 content: "Bạn chắc chắn muốn duyệt chỉ tiêu này ?",
                        //                 status: true
                        //             }
                        //         )
                        //     }}
                        onClick={showConfirm}
                    >
                        Xác Nhận
                    </button>
                </div>
            </Modal>
            {
                table &&
                <tr className='pedding_item' onClick={() => setOpen(true)}>
                    {/* <ComponentAvatar size="medium" /> */}
                    <td>{index}</td>
                    <td>{penddingRows?.user[0].fullName}</td>
                    <td>{penddingRows?.user[0].studentId} </td>
                    <td>{penddingRows?.content?.length} </td>
                    <td>null</td>
                    <td className="true__date">Đúng giờ</td>
                </tr>
            }
        </>
    )
}

export default TestPedding