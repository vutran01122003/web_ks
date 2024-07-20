import { useDispatch } from 'react-redux';
import { addTable } from '../../redux/actions/tableAction';
import { AiOutlineClose } from 'react-icons/ai';
import CreateGoals from '../../pages/Goal';

function AddTableModal({ pageId, handleHideAddTableModal }) {
    const dispatch = useDispatch();

    const handleClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            handleHideAddTableModal();
        }
    };

    const handleAddTable = ({ table }) => {
        dispatch(
            addTable({
                pageId,
                tables: [
                    {
                        tableName: table.tableName,
                        description: table.description,
                        rowTitleList: table.rowTitleList,
                        quantityDemanded: table.quantityDemanded,
                        fixedScore: table.fixedScore
                    }
                ]
            })
        );
        handleHideAddTableModal();
    };

    return (
        <div className="modal_overlap" onMouseUp={handleClosePopup}>
            <div className="box_wrapper">
                <h2 className="modal_header">Thêm Chỉ Tiêu Mới</h2>
                <div className="modal_close_icon_wrapper" onClick={handleHideAddTableModal}>
                    <AiOutlineClose />
                </div>
                <div className="create_goal_container">
                    <CreateGoals handleAddTable={handleAddTable} />
                </div>
            </div>
        </div>
    );
}

export default AddTableModal;
