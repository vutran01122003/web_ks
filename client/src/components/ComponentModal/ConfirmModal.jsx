import { useDispatch } from "react-redux";
import { updateRowsStatus } from "../../redux/actions/rowAction";
import {AiOutlineClose} from 'react-icons/ai';
import { useState } from "react";

function ConfirmModal({ content, title, status, rowInfoData, handleHiddenConfirmModal, rowsType}) {
    const dispatch = useDispatch();
    const [noteValue, setNoteValue] = useState("");

    const handleUpdateRowsStatus = () => {
        dispatch(updateRowsStatus({
            noteValue,
            rowsType,
            status,
            rowListId: rowInfoData.rowListId, 
            contentIdList: rowInfoData.contentIdList
        }));
        handleHiddenConfirmModal();
    }

    const handleChangeNoteValue = (e) => {
        setNoteValue(e.target.value);
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
                    <h2>{title}</h2>
                    <div 
                        className="confirm_modal_close_btn"
                        onClick={handleHiddenConfirmModal}
                    >
                        <AiOutlineClose />
                    </div>
                </div>
                <div className="confirm_modal_body">
                    <p className="confirm_modal_body_content">
                        {content}
                        <span>(Kiểm tra thật kỹ minh chứng trước khi đồng ý)</span>
                    </p>
                    <div className="confirm_modal_body_note">
                        <textarea 
                            placeholder="Nhập ghi chú cho hoạt động (nếu có)"
                            onChange={handleChangeNoteValue}    
                        >    
                        </textarea>
                    </div>
                </div>
                <div className="confirm_modal_footer">
                    <button className="btn_close" onClick={handleHiddenConfirmModal}>Không đồng ý</button>
                    <button className="btn_accept" onClick={handleUpdateRowsStatus}>Đồng ý</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;