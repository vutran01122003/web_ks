import { AiOutlineClose } from 'react-icons/ai';
import GoalsCreation from '../Goal/GoalCreation';

function TableDetailsModel({ table, toggleTableDetailsModalDisplay }) {
    const handleClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            toggleTableDetailsModalDisplay();
        }
    };

    return (
        <div className="modal_overlap" onDoubleClick={handleClosePopup}>
            <div className="box_wrapper">
                <h2 className="modal_header">{`Chỉ Tiêu ${table?.tableName}`}</h2>
                <div className="modal_close_icon_wrapper" onClick={toggleTableDetailsModalDisplay}>
                    <AiOutlineClose />
                </div>
                <div className="create_goal_container">
                    <GoalsCreation tableDetailsData={table} />
                </div>
            </div>
        </div>
    );
}

export default TableDetailsModel;
