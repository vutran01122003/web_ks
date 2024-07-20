import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import CreateGoals from '../../pages/Goal';
import { updateTable } from '../../redux/actions/tableAction';

function UpdateTableModal({ tableInfo, toggleUpdateTableModalDisplay }) {
    const dispatch = useDispatch();
    const { pageId, table } = tableInfo;

    const handleClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            toggleUpdateTableModalDisplay();
        }
    };

    const handleUpdateTable = ({ checkError, table }) => {
        console.log(table);
        const { notifyValue, isError } = checkError([table]);
        if (isError) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: notifyValue
                }
            });
        } else {
            dispatch(
                updateTable({
                    pageId,
                    table
                })
            );
            toggleUpdateTableModalDisplay();
        }
    };

    return (
        <div className="modal_overlap" onMouseUp={handleClosePopup}>
            <div className="box_wrapper">
                <h2 className="modal_header">{`Cập Nhật Chỉ Tiêu ${table?.tableName}`}</h2>
                <div className="modal_close_icon_wrapper" onClick={toggleUpdateTableModalDisplay}>
                    <AiOutlineClose />
                </div>
                <div className="create_goal_container">
                    <CreateGoals handleUpdateTable={handleUpdateTable} prevUpdatedTableData={table} />
                </div>
            </div>
        </div>
    );
}

export default UpdateTableModal;
