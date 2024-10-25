import { AiOutlineClose } from 'react-icons/ai';

function ConfirmModal({ headerContent, bodyContent, noteContent, onAccept, toggleConfirmModalDisplay }) {
    return (
        <div
            className="modal_overlap"
            onMouseUp={(e) => {
                if (e.target === e.currentTarget) toggleConfirmModalDisplay();
            }}
        >
            <div className="box_wrapper">
                <h2 className="modal_header">{headerContent}</h2>
                <div className="modal_close_icon_wrapper" onClick={toggleConfirmModalDisplay}>
                    <AiOutlineClose />
                </div>
                <div className="confirm_modal">
                    <div className="confirm_modal_body">
                        <span className="confirm_modal_body_content">{bodyContent}</span>
                        <span className="confirm_modal_body_note">{`${noteContent || ''}`}</span>
                    </div>
                    <div className="confirm_modal_footer">
                        <button className="confirm_modal_deny_btn" onClick={toggleConfirmModalDisplay}>
                            Thoát
                        </button>
                        <button className="confirm_modal_accept_btn" onClick={onAccept}>
                            Đồng ý
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
