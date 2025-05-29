import { AiOutlineClose } from 'react-icons/ai';

const Modal = ({ children, onHiddenModal, headerTitle, className }) => {
    return (
        <div
            className={`modal_overlap ${className}`}
            onDoubleClick={(e) => {
                if (e.target === e.currentTarget) onHiddenModal();
            }}
        >
            <div className="box_wrapper">
                {headerTitle && <h2 className="modal_header">{headerTitle}</h2>}
                <div className="modal_close_icon_wrapper" onClick={onHiddenModal}>
                    <AiOutlineClose />
                </div>

                <div className="modal_body">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
