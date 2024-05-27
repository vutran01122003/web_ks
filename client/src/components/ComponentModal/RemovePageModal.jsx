import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { removePage } from '../../redux/actions/pageAction';

function RemovePageModal({ handleHideRemovePageModal, pageId, subPageName }) {
    const dispatch = useDispatch();
    const handleClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            handleHideRemovePageModal();
        }
    };

    const handleRemovePage = () => {
        dispatch(removePage({ pageId }));
        handleHideRemovePageModal();
    };

    return (
        <div className="modal_overlap" onMouseUp={handleClosePopup}>
            <div className="box_wrapper">
                <h2 className="modal_header">{subPageName}</h2>
                <div
                    className="modal_close_icon_wrapper"
                    onClick={handleHideRemovePageModal}
                >
                    <AiOutlineClose />
                </div>
                <div className="remove_page_modal">
                    <div className="remove_page_body">
                        Bạn có muốn xóa trang {subPageName} ?
                    </div>
                    <div className="remove_page_footer">
                        <button
                            className="remove_page_deny_btn"
                            onClick={handleHideRemovePageModal}
                        >
                            Thoát
                        </button>
                        <button
                            className="remove_page_accept_btn"
                            onClick={handleRemovePage}
                        >
                            Đồng ý
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RemovePageModal;
