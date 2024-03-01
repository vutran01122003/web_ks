import { useDispatch } from 'react-redux';
import { addTable } from '../../redux/actions/tableAction';
import { AiOutlineClose } from 'react-icons/ai';
import CreateGoals from '../../pages/Goals';

function AddTableModal({ subPageName, pageId, handleHideAddTableModal }) {
    const dispatch = useDispatch();

    const handleClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            handleHideAddTableModal();
        }
    };

    const handleAddTable = ({ data }) => {
        dispatch(
            addTable({
                pageId,
                tables: [
                    {
                        tableName: data.tableName,
                        description: data.description,
                        rowTitleList: data.rowTitleList,
                        quantityDemanded: data.quantityDemanded
                    }
                ]
            })
        );
        handleHideAddTableModal();
    };

    return (
        <div className='modal_overlap' onMouseUp={handleClosePopup}>
            <div className='box_wrapper'>
                <h2 className='modal_header'>{subPageName}</h2>
                <div className='modal_close_icon_wrapper' onClick={handleHideAddTableModal}>
                    <AiOutlineClose />
                </div>
                <div className='create_goal_container'>
                    <CreateGoals handleAddTable={handleAddTable} />
                </div>
            </div>
        </div>
    );
}

export default AddTableModal;
