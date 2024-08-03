import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { removePage } from '../../redux/actions/pageAction';

function RemovePageModal({ pageId, subPageName, handleHideRemovePageModal }) {
    const dispatch = useDispatch();

    const handleClickOuterClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            handleHideRemovePageModal();
        }
    };

    const handleClosePopup = (e) => {
        handleHideRemovePageModal();
    };

    const handleRemovePage = () => {
        dispatch(removePage({ pageId }));
        handleHideRemovePageModal();
    };

    return (
        <div className="modal_overlap" onMouseUp={handleClickOuterClosePopup}>
            <div className="box_wrapper">
                <h2 className="modal_header">Xóa Nhóm Chỉ Tiêu</h2>
                <div className="modal_close_icon_wrapper" onClick={handleClosePopup}>
                    <AiOutlineClose />
                </div>
                <div className="remove_page_modal">
                    <div className="remove_page_body">
                        <span>{`Bạn muốn chắn chắn muốn xóa ${subPageName} ?`}</span>
                        <span>( Tiến độ hoàn thành và điểm của sinh viên ở nhóm chỉ tiêu này sẽ mất đi )</span>
                    </div>
                    <div className="remove_page_footer">
                        <button className="remove_page_deny_btn" onClick={handleHideRemovePageModal}>
                            Thoát
                        </button>
                        <button className="remove_page_accept_btn" onClick={handleRemovePage}>
                            Đồng ý
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RemovePageModal;
