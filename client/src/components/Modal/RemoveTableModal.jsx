import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTables, removeTable } from '../../redux/actions/tableAction';
import { tableSelector } from '../../redux/selector';
import { AiOutlineClose } from 'react-icons/ai';

function RemoveTableModal({ handleHideRemoveTableModal, subPageName, pageId }) {
    const dispatch = useDispatch();
    const table = useSelector(tableSelector);

    const handleClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            handleHideRemoveTableModal();
        }
    };

    const handleRemoveTable = ({ tableId }) => {
        dispatch(
            removeTable({
                pageId,
                tableId
            })
        );

        handleHideRemoveTableModal();
    };

    useEffect(() => {
        dispatch(getTables({ subPageName }));
    }, []);

    return (
        <div className="modal_overlap" onDoubleClick={handleClosePopup}>
            <div className="box_wrapper">
                <h2 className="modal_header">{subPageName}</h2>
                <div className="modal_close_icon_wrapper" onClick={handleHideRemoveTableModal}>
                    <AiOutlineClose />
                </div>
                <div className="remove_table_wrapper">
                    {table.tables.length === 0 ? (
                        <h3 className="notify_nothing_title">Không có chỉ tiêu</h3>
                    ) : (
                        <>
                            {table.tables.map((table) => (
                                <div key={table._id} className="table_item">
                                    <span>{table.tableName}</span>
                                    <div
                                        className="remove_table_btn"
                                        onClick={() => {
                                            handleRemoveTable({
                                                tableId: table._id
                                            });
                                        }}
                                    >
                                        Xóa chỉ tiêu
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RemoveTableModal;
