import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { updateTable } from '../../redux/actions/tableAction';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import GoalsCreation from '../ComponentGoal/GoalCreation';

function UpdateTableModal({ tableInfo, toggleUpdateTableModalDisplay }) {
    const dispatch = useDispatch();
    const { pageId, table } = tableInfo;

    const handleClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            toggleUpdateTableModalDisplay();
        }
    };

    const handleUpdateTable = ({ checkError, table }) => {
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
                    <GoalsCreation handleUpdateTable={handleUpdateTable} prevUpdatedTableData={table} />
                </div>
            </div>
        </div>
    );
}

export default UpdateTableModal;
