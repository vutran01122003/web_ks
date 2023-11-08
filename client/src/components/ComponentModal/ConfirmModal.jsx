import { useDispatch } from "react-redux";
import { updatePeddingRowStatus } from "../../redux/actions/rowAction";

function ConfirmModal({content, status, rowInfoData, handleHiddenConfirmModal}) {
    const dispatch = useDispatch();

    const handleUpdateRowStatus = () => {
        dispatch(updatePeddingRowStatus({
            status,
            rowListId: rowInfoData.rowListId, 
            rowItemId: rowInfoData.rowItemId
        }));
        handleHiddenConfirmModal();
    }

    const handleHiddenPopup = (e) => {
        if(e.target === e.currentTarget) {
            handleHiddenConfirmModal();
        }
    }
    
    return (
        <div className="modal_overlap" onMouseUp={handleHiddenPopup}>
            <div className="confirm_modal">
                <div className="confirm_modal_header">
                    <h2 className="confirm_modal_title">Thông báo</h2>
                </div>
                <div className="confirm_modal_body">
                    <p className="confirm_modal_body_content">
                        {content}
                    </p>
                </div>
                <div className="confirm_modal_footer">
                    <button className="btn_close" onClick={handleHiddenConfirmModal}>Thoát</button>
                    <button className="btn_accept" onClick={handleUpdateRowStatus}>Đồng ý</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;